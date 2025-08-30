#!/usr/bin/env node

const { placeFlow } = require('/Users/yoshiokatakanori/git/place-flow/packages/core/dist/index.js');

const nameBasedExamples = {
  'name-based-directional': `screen "Name-based Connection" size(400, 150) {
  database "DB" at(50, 40) size(80, 70) as db
  box "API" at(200, 40) size(80, 70) as api
  circle "UI" at(320, 50) radius(30) as ui
  db -> api
  api -> ui
}`,

  'name-based-bidirectional': `screen "Bidirectional Connection" size(400, 150) {
  circle "サーバーA" at(80, 75) radius(40) as serverA
  circle "サーバーB" at(320, 75) radius(40) as serverB
  serverA <-> serverB
}`,

  'mixed-connections': `screen "Mixed Connection Types" size(500, 200) {
  box "Frontend" at(50, 80) size(80, 40) as frontend
  box "Backend" at(200, 80) size(80, 40) as backend
  database "Database" at(350, 80) size(80, 40) as database
  
  frontend -> backend
  backend <-> database
}`
};

console.log('Generating name-based connection examples...\n');

for (const [name, dsl] of Object.entries(nameBasedExamples)) {
  try {
    console.log(`Processing: ${name}`);
    const parsed = placeFlow.parse(dsl);
    
    if (parsed.success && parsed.ast) {
      const result = placeFlow.generate(parsed.ast);
      if (result.success) {
        console.log(`✅ ${name}: Generated successfully`);
        console.log(`   Size: ${result.metadata.width}x${result.metadata.height}`);
        console.log(`   Elements: ${result.metadata.elementCount}`);
        console.log(`   Connections: ${result.metadata.connectionCount || 0}\n`);
        
        console.log(`// ${name}`);
        console.log(`const ${name.replace(/-/g, '_')}_svg = \`${result.svg}\`;\n`);
      } else {
        console.log(`❌ ${name}: Generation failed`);
        if (result.errors) {
          result.errors.forEach(error => console.log(`   Error: ${error}`));
        }
      }
    } else {
      console.log(`❌ ${name}: Parse failed`);
      if (parsed.errors) {
        parsed.errors.forEach(error => console.log(`   Error: ${error}`));
      }
    }
  } catch (error) {
    console.log(`❌ ${name}: Exception - ${error.message}`);
  }
}
