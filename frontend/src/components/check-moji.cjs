const fs = require('fs');

const files = [
  'ProfessionalBatchPanels.vue',
  'CultivationAdvancedPanels.vue',
  'EngineeringDeliveryPanels.vue',
  'AdminSupportPanels.vue',
  'OverviewWorkspace.vue'
];

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  const suspect = [];
  for (let i = 0; i < lines.length; i++) {
    const garbled = lines[i].match(/[\u9400-\u9fff\u8700-\u87ff\u8600-\u86ff]/g);
    if (garbled && garbled.length >= 2) {
      suspect.push((i + 1) + ': ' + lines[i].trim().substring(0, 150));
    }
  }
  if (suspect.length > 0) {
    console.log('=== ' + f + ' (' + suspect.length + ' suspect lines) ===');
    suspect.forEach(s => console.log(s));
  } else {
    console.log(f + ': clean');
  }
}
