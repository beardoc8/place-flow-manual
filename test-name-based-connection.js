#!/usr/bin/env node

const { placeFlow } = require('/Users/yoshiokatakanori/git/place-flow/packages/core/dist/index.js');

const testDsl = `screen "Person Examples" size(400, 200) {
  person "ユーザー" at(50, 60) size(80, 100)
  person "管理者" at(200, 60) size(80, 100) style(fill: "#28a745")
}`;

console.log('Testing name-based connection syntax...\n');

try {
  console.log('DSL Code:');
  console.log(testDsl);
  console.log('\nParsing...');
  
  const parsed = placeFlow.parse(testDsl);
  
  if (parsed.success && parsed.ast) {
    console.log('✅ Parse successful');
    console.log('AST structure:', JSON.stringify(parsed.ast, null, 2));
    
    console.log('\nGenerating SVG...');
    const result = placeFlow.generate(parsed.ast);
    
    if (result.success) {
      console.log('✅ Generation successful');
      console.log(`Size: ${result.metadata.width}x${result.metadata.height}`);
      console.log(`Elements: ${result.metadata.elementCount}`);
      console.log(`Connections: ${result.metadata.connectionCount || 0}`);
      console.log('\nGenerated SVG:');
      console.log(result.svg);
    } else {
      console.log('❌ Generation failed');
      if (result.errors) {
        result.errors.forEach(error => console.log(`Error: ${error}`));
      }
    }
  } else {
    console.log('❌ Parse failed');
    if (parsed.errors) {
      parsed.errors.forEach(error => console.log(`Error: ${error}`));
    }
  }
} catch (error) {
  console.log(`❌ Exception: ${error.message}`);
  console.log(error.stack);
}
