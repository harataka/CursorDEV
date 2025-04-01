# 偉人歳時記

年齢を入力すると、その年齢の時に偉人が何をしていたかを教えてくれるWebアプリケーションです。

## 機能

- 年齢を入力して検索できます
- 入力した年齢に一致する偉人のエピソードを表示します
- 一致するものがない場合は近い年齢の偉人を表示します

## セットアップ方法

### 1. 必要なソフトウェア

- Node.js (推奨バージョン: 14.x以上)
- npm (Node.jsに付属)

### 2. インストール

```bash
# リポジトリをクローン
git clone <リポジトリURL>
cd ijin-saijiki

# 依存パッケージをインストール
npm install
```

### 3. データベースの初期化

```bash
# データベースの初期化（偉人データの登録）
npm run init-db
```

### 4. アプリケーションの起動

```bash
# サーバーの起動
npm start
```

アプリケーションは http://localhost:3000 でアクセスできます。

## 技術スタック

- フロントエンド: HTML, CSS, JavaScript (ES modules)
- バックエンド: Node.js, Express
- データベース: SQLite3

## プロジェクト構成

```
ijin-saijiki/
├── public/                # 静的ファイル
│   ├── index.html         # メインHTML
│   ├── style.css          # スタイルシート
│   └── js/                # クライアントサイドJavaScript
│       ├── main.js        # メインスクリプト
│       ├── data/          # データ関連
│       └── utils/         # ユーティリティ
├── src/                   # サーバーサイドソース
│   └── database/          # データベース関連
│       ├── db.js          # DB操作
│       └── init-db.js     # DB初期化
├── database/              # SQLiteデータベースファイル
│   └── famous_people.db   # 偉人データのデータベース
├── server.js              # サーバーメイン
├── package.json           # プロジェクト設定
└── README.md              # 説明書
``` 