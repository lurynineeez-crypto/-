declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import type { LoadingManager } from 'three';

  export type GLTF = any;

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (error: unknown) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (error: unknown) => void
    ): void;
  }
}
