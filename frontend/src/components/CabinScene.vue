<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { SensorPoint, SensorStatus } from '../types';

const props = defineProps<{
  sensors: SensorPoint[];
  selectedId?: string;
  viewMode?: 'points' | 'heatmap' | 'patrol';
}>();

const emit = defineEmits<{
  select: [sensor: SensorPoint];
}>();

const selectedSensor = computed(() => props.sensors.find((sensor) => sensor.id === props.selectedId));

const container = ref<HTMLDivElement | null>(null);
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let raycaster: THREE.Raycaster;
let pointer: THREE.Vector2;
let animationFrame = 0;
let sensorGroup: THREE.Group;
let cabinGroup: THREE.Group;
let resizeObserver: ResizeObserver | null = null;
const meshSensorMap = new Map<string, SensorPoint>();

const statusColor: Record<SensorStatus, number> = {
  normal: 0x10b981,
  warning: 0xf59e0b,
  alarm: 0xef4444,
  offline: 0x94a3b8
};

function createRenderer() {
  scene = new THREE.Scene();
  scene.background = null;
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(6.5, 5, 7.5);
  camera.lookAt(0, 1.4, 0);
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  sensorGroup = new THREE.Group();
  cabinGroup = new THREE.Group();

  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  const directional = new THREE.DirectionalLight(0xffffff, 1.6);
  directional.position.set(5, 8, 5);
  scene.add(ambient, directional, cabinGroup, sensorGroup);
}

function addBox(name: string, size: THREE.Vector3, position: THREE.Vector3, color: number, opacity = 1) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    roughness: 0.72,
    metalness: 0.05
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.copy(position);
  cabinGroup.add(mesh);
  return mesh;
}

function buildFallbackCabin() {
  cabinGroup.clear();
  addBox('透明舱体', new THREE.Vector3(5.8, 2.9, 3.8), new THREE.Vector3(0, 1.45, 0), 0xdbeafe, 0.18);
  addBox('地面', new THREE.Vector3(6, 0.08, 4), new THREE.Vector3(0, 0, 0), 0x334155, 0.88);
  addBox('控制柜', new THREE.Vector3(0.7, 1.5, 0.45), new THREE.Vector3(-2.5, 0.8, -1.55), 0x475569, 0.95);
  addBox('空调', new THREE.Vector3(1, 0.4, 0.45), new THREE.Vector3(1.9, 2.45, -1.75), 0xf8fafc, 0.95);
  addBox('加湿器', new THREE.Vector3(0.55, 0.65, 0.55), new THREE.Vector3(-2.25, 0.35, 1.45), 0x99f6e4, 0.9);

  for (let rack = 0; rack < 2; rack += 1) {
    const x = rack === 0 ? -0.9 : 1.15;
    addBox('种植架立柱', new THREE.Vector3(0.08, 2.2, 0.08), new THREE.Vector3(x - 0.65, 1.1, -0.9), 0x64748b, 1);
    addBox('种植架立柱', new THREE.Vector3(0.08, 2.2, 0.08), new THREE.Vector3(x + 0.65, 1.1, -0.9), 0x64748b, 1);
    addBox('种植架立柱', new THREE.Vector3(0.08, 2.2, 0.08), new THREE.Vector3(x - 0.65, 1.1, 0.9), 0x64748b, 1);
    addBox('种植架立柱', new THREE.Vector3(0.08, 2.2, 0.08), new THREE.Vector3(x + 0.65, 1.1, 0.9), 0x64748b, 1);
    for (let layer = 0; layer < 3; layer += 1) {
      addBox('层架', new THREE.Vector3(1.55, 0.08, 1.95), new THREE.Vector3(x, 0.55 + layer * 0.72, 0), 0x94a3b8, 0.88);
      addBox('菌包', new THREE.Vector3(1.25, 0.16, 1.55), new THREE.Vector3(x, 0.68 + layer * 0.72, 0), 0xddd6fe, 0.75);
    }
  }
}

function loadGltfOrFallback() {
  const loader = new GLTFLoader();
  loader.load(
    '/models/cabin.gltf',
    (gltf: GLTF) => {
      cabinGroup.clear();
      const model = gltf.scene;
      model.scale.setScalar(1);
      cabinGroup.add(model);
    },
    undefined,
    () => buildFallbackCabin()
  );
}

function renderSensors() {
  sensorGroup.clear();
  meshSensorMap.clear();
  props.sensors.forEach((sensor) => {
    const isSelected = sensor.id === props.selectedId;
    const heatmap = props.viewMode === 'heatmap';
    const patrol = props.viewMode === 'patrol';
    const geometry = new THREE.SphereGeometry(isSelected ? 0.1 : heatmap ? 0.06 : 0.075, 24, 24);
    const material = new THREE.MeshStandardMaterial({
      color: statusColor[sensor.reading.status],
      emissive: statusColor[sensor.reading.status],
      emissiveIntensity: isSelected || patrol ? 0.65 : 0.28,
      roughness: 0.35
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(sensor.position.x, sensor.position.y, sensor.position.z);
    mesh.userData.sensorId = sensor.id;
    sensorGroup.add(mesh);
    meshSensorMap.set(sensor.id, sensor);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(isSelected ? 0.18 : heatmap ? 0.28 : 0.12, heatmap ? 0.018 : 0.01, 8, 32),
      new THREE.MeshBasicMaterial({
        color: statusColor[sensor.reading.status],
        transparent: true,
        opacity: heatmap ? 0.34 : 0.7
      })
    );
    ring.position.copy(mesh.position);
    ring.rotation.x = Math.PI / 2;
    sensorGroup.add(ring);

    if (heatmap) {
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(0.34, 36),
        new THREE.MeshBasicMaterial({
          color: statusColor[sensor.reading.status],
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide
        })
      );
      disc.position.copy(mesh.position);
      disc.rotation.x = -Math.PI / 2;
      sensorGroup.add(disc);
    }
  });
}

function onPointerDown(event: PointerEvent) {
  if (!container.value || !camera) return;
  const rect = container.value.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(sensorGroup.children, false);
  const hit = hits.find((item) => item.object.userData.sensorId);
  if (hit) {
    const sensor = meshSensorMap.get(hit.object.userData.sensorId);
    if (sensor) emit('select', sensor);
  }
}

function resize() {
  if (!container.value || !renderer) return;
  const { width, height } = container.value.getBoundingClientRect();
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate() {
  animationFrame = requestAnimationFrame(animate);
  cabinGroup.rotation.y += 0.0015;
  sensorGroup.rotation.y = cabinGroup.rotation.y;
  if (selectedSensor.value) {
    camera.lookAt(0, 1.25, 0);
  }
  renderer?.render(scene, camera);
}

onMounted(() => {
  if (!container.value) return;
  createRenderer();
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);
  loadGltfOrFallback();
  renderSensors();
  resize();
  container.value.addEventListener('pointerdown', onPointerDown);
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container.value);
  animate();
});

watch(() => props.sensors, renderSensors, { deep: true });
watch(() => props.selectedId, renderSensors);
watch(() => props.viewMode, renderSensors);

onBeforeUnmount(() => {
  if (container.value) container.value.removeEventListener('pointerdown', onPointerDown);
  resizeObserver?.disconnect();
  cancelAnimationFrame(animationFrame);
  renderer?.dispose();
});
</script>

<template>
  <div ref="container" class="cabin-scene">
    <div class="scene-label" v-if="selectedSensor">
      <strong>{{ selectedSensor.name }}</strong>
      <span>{{ selectedSensor.reading.value.toFixed(1) }}{{ selectedSensor.reading.unit }}</span>
    </div>
  </div>
</template>
