#!/usr/bin/env node

const { placeFlow } = require('/Users/yoshiokatakanori/git/place-flow/packages/core/dist/index.js');

const samples = {
  'login-form': `screen "ログインフォーム" size(400, 300) {
  box "フォーム" at(50, 50) size(300, 200) {
    input "ユーザー名" at(20, 30) size(260, 40) as username
    input "パスワード" at(20, 90) size(260, 40) type="password" as password
    button "ログイン" at(20, 150) size(100, 40) as loginBtn
  }
}`,

  'simple-box': `screen "Box Example" size(300, 200) {
  box "Hello Box" at(50, 50) size(120, 60)
  box "Styled Box" at(50, 120) size(120, 60) style(background: "#e3f2fd", border: "2px solid #1976d2")
}`,

  'button': `screen "Button Examples" size(300, 150) {
  button "Click Me" at(50, 50) size(100, 40)
  button "Styled Button" at(50, 100) size(120, 40) style(background: "#4CAF50", color: "white")
}`,

  'input': `screen "Input Examples" size(300, 120) {
  input "Enter your name" at(50, 30) size(200, 30)
  input "Email address" at(50, 70) size(200, 30) style(border: "2px solid #2196F3")
}`,

  'circle': `screen "Circle Examples" size(300, 150) {
  circle "1" at(80, 75) radius(30)
  circle "API" at(220, 75) radius(35) style(fill: "#2196F3", color: "white")
}`,

  'system-architecture': `screen "3層アーキテクチャ" size(600, 400) {
  box "プレゼンテーション層" at(50, 50) size(500, 80) style(background: "#e3f2fd", border: "2px solid #2196f3") {
    node "Web Browser" at(50, 15) size(100, 50) as browser
    node "Mobile App" at(200, 15) size(100, 50) as mobile
    node "Desktop App" at(350, 15) size(100, 50) as desktop
  }
  
  box "アプリケーション層" at(50, 170) size(500, 80) style(background: "#e8f5e8", border: "2px solid #4caf50") {
    loadbalancer "Load Balancer" at(50, 15) size(120, 50) as lb
    node "Web Server 1" at(200, 15) size(100, 50) as web1
    node "Web Server 2" at(330, 15) size(100, 50) as web2
  }
  
  box "データ層" at(50, 290) size(500, 80) style(background: "#fff3e0", border: "2px solid #ff9800") {
    database "PostgreSQL" at(100, 15) size(120, 50) as maindb
    database "Redis Cache" at(280, 15) size(120, 50) as cache
  }
}`,

  'user-flow': `screen "ユーザー登録フロー" size(600, 500) {
  circle "開始" at(300, 50) radius(30) style(background: "#28a745", color: "white") as start
  
  rect at(250, 130) size(100, 50) style(background: "#e3f2fd", border: "2px solid #2196f3") as form
  text "フォーム入力" at(300, 155) style(textAlign: "center")
  
  circle at(300, 230) radius(40) style(background: "#fff3cd", border: "2px solid #ffc107") as validation
  text "バリデーション" at(300, 225) style(textAlign: "center", fontSize: 12)
  text "OK？" at(300, 240) style(textAlign: "center", fontSize: 12)
  
  rect at(100, 230) size(80, 40) style(background: "#f8d7da", border: "2px solid #dc3545") as error
  text "エラー表示" at(140, 250) style(textAlign: "center", fontSize: 12)
  
  rect at(250, 330) size(100, 50) style(background: "#e8f5e8", border: "2px solid #28a745") as email
  text "確認メール送信" at(300, 355) style(textAlign: "center", fontSize: 12)
  
  circle "完了" at(300, 430) radius(30) style(background: "#dc3545", color: "white") as end
  
  arrow from(300, 80) to(300, 130)
  arrow from(300, 180) to(300, 190)
  arrow from(260, 230) to(180, 230) style(stroke: "#dc3545")
  arrow from(300, 270) to(300, 330) style(stroke: "#28a745")
  arrow from(300, 380) to(300, 400)
}`
};

console.log('Generating SVGs for PlaceFlow Manual...\n');

for (const [name, dsl] of Object.entries(samples)) {
  try {
    console.log(`Processing: ${name}`);
    const parsed = placeFlow.parse(dsl);
    
    if (parsed.success && parsed.ast) {
      const result = placeFlow.generate(parsed.ast);
      if (result.success) {
        console.log(`✅ ${name}: Generated successfully`);
        console.log(`   Size: ${result.metadata.width}x${result.metadata.height}`);
        console.log(`   Elements: ${result.metadata.elementCount}\n`);
        
        // SVGを変数として出力（HTMLで使用するため）
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