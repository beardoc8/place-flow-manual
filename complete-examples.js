#!/usr/bin/env node

const { placeFlow } = require('/Users/yoshiokatakanori/git/place-flow/packages/core/dist/index.js');

const elementExamples = {
  'rect': `screen "Rectangle Examples" size(300, 150) {
  rect at(50, 40) size(80, 50)
  rect at(160, 40) size(80, 50) radius(10) style(fill: "#ffeb3b")
}`,

  'label': `screen "Label Examples" size(300, 150) {
  label "ユーザー名:" at(50, 40)
  label "重要:" at(50, 80) style(color: "#dc3545", fontWeight: "bold")
  label "説明文" at(50, 120) style(fontSize: "12", color: "#6c757d")
}`,

  'text': `screen "Text Examples" size(400, 200) {
  text "タイトル" at(50, 40) style(fontSize: "24", fontWeight: "bold")
  text "サブタイトル" at(50, 80) style(fontSize: "16", color: "#666")
  text "本文テキスト" at(50, 120) style(fontSize: "14")
  text "中央寄せ" at(200, 160) style(textAlign: "center", fontSize: "14")
}`,

  'database': `screen "Database Examples" size(400, 200) {
  database "MySQL" at(50, 60) size(100, 80)
  database "Redis" at(200, 60) size(100, 80) style(fill: "#dc3545")
}`,

  'person': `screen "Person Examples" size(400, 200) {
  person "ユーザー" at(50, 60) size(80, 100)
  person "管理者" at(200, 60) size(80, 100) style(fill: "#28a745")
}`,

  'line': `screen "Line Examples" size(300, 200) {
  box "A" at(50, 50) size(60, 40)
  box "B" at(190, 120) size(60, 40)
  line from(110, 70) to(190, 140)
  line from(50, 120) to(250, 50) style(stroke: "#dc3545", strokeWidth: "3")
}`,

  'arrow': `screen "Arrow Examples" size(400, 150) {
  box "開始" at(50, 50) size(80, 50)
  box "終了" at(270, 50) size(80, 50)
  arrow from(130, 75) to(270, 75)
  arrow from(200, 120) to(130, 100) style(stroke: "#28a745")
}`
};

console.log('Generating SVGs for all elements...\\n');

for (const [name, dsl] of Object.entries(elementExamples)) {
  try {
    console.log(`Processing: ${name}`);
    const parsed = placeFlow.parse(dsl);
    
    if (parsed.success && parsed.ast) {
      const result = placeFlow.generate(parsed.ast);
      if (result.success) {
        console.log(`✅ ${name}: Generated successfully`);
        console.log(`   Size: ${result.metadata.width}x${result.metadata.height}`);
        console.log(`   Elements: ${result.metadata.elementCount}\\n`);
        
        // SVGを変数として出力（HTMLで使用するため）
        console.log(`// ${name}`);
        console.log(`const ${name}_svg = \`${result.svg}\`;\\n`);
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
