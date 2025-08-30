#!/usr/bin/env node

const { placeFlow } = require('/Users/yoshiokatakanori/git/place-flow/packages/core/dist/index.js');

const connectionExamples = {
  'simple-connection': `screen "Simple Connection" size(400, 200) {
  box "ボックスA" at(50, 80) size(100, 40) as a
  box "ボックスB" at(250, 80) size(100, 40) as b
  line from(150, 100) to(250, 100)
}`,

  'directional-connection': `screen "Directional Connection" size(400, 200) {
  database "DB" at(50, 80) size(80, 40) as db
  box "API" at(200, 80) size(80, 40) as api
  box "UI" at(320, 80) size(60, 40) as ui
  arrow from(130, 100) to(200, 100)
  arrow from(280, 100) to(320, 100)
}`,

  'bidirectional-connection': `screen "Bidirectional Connection" size(400, 150) {
  circle "サーバーA" at(80, 75) radius(40) as serverA
  circle "サーバーB" at(320, 75) radius(40) as serverB
  arrow from(120, 75) to(280, 75)
  arrow from(280, 75) to(120, 75) style(stroke: "#28a745")
}`
};

console.log('Generating connection examples...\n');

for (const [name, dsl] of Object.entries(connectionExamples)) {
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
