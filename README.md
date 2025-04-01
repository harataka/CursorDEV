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

## Renderにデプロイする方法

### 1. Renderアカウントの作成

[Render](https://render.com/)にアクセスし、アカウントを作成してください。

### 2. Web Serviceの作成

1. ダッシュボードから「New +」をクリックし、「Web Service」を選択します
2. GitHubリポジトリに接続するか、公開リポジトリのURLを入力します
3. 以下の設定を行います：
   - Name: 任意の名前（例: ijin-saijiki）
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm run setup`（初回のみ）または `npm start`（2回目以降）

### 3. ディスク永続化の設定

1. Renderダッシュボードの「Disks」タブをクリックします
2. 「Create Disk」をクリックし、以下の設定を行います：
   - Name: ijin-data（任意）
   - Size: 1GB（最小、または必要に応じて設定）
   - Mount Path: /var/data
3. ディスクを作成したら、「Environment」タブに移動し、以下の環境変数を追加します：
   - `DB_PATH`: `/var/data/famous_people.db`

#### 環境変数の詳細設定手順

1. Renderのダッシュボードにログインします
2. 該当するWebサービス（偉人歳時記アプリケーション）をクリックして詳細画面に移動します
3. 左側のサイドメニューから「Environment」をクリックします
4. 画面中央に表示される「Environment Variables」セクションで直接変数を追加します：
   - 「Key」欄に `DB_PATH` と入力
   - 「Value」欄に `/var/data/famous_people.db` と入力
5. 「Add Environment Variable」または「Save Changes」ボタンをクリックして保存します
6. 注意：「Create environment group」は複数のサービスで共有する環境変数グループを作成する機能なので、単一サービスの設定では必要ありません

### 4. 初回デプロイ

1. 最初のデプロイでは、「Start Command」に `npm run setup` を設定し、「Save Changes」をクリックします
2. デプロイが完了し、データベースが初期化されたら、「Start Command」を `npm start` に変更します

これにより、Renderの再起動時にもデータベースは初期化されず、永続的にデータが保存されます。

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

## package.jsonの詳細説明

`package.json`ファイルはNode.jsプロジェクトの中心的な設定ファイルで、プロジェクトの情報や依存関係、実行スクリプトなどを管理します。

```json
{
    "name": "ijin-saijiki",
    "version": "1.0.0",
    "description": "偉人歳時記アプリケーション",
    "main": "server.js",
    "scripts": {
        "start": "node server.js",
        "init-db": "node src/database/init-db.js",
        "setup": "node src/database/init-db.js && node server.js"
    },
    "dependencies": {
        "express": "^4.21.2",
        "sqlite3": "^5.1.7"
    }
}
```

### 各項目の役割

#### `main`
- **説明**: アプリケーションのエントリーポイント（メインファイル）を指定します
- **実行タイミング**: 他のプロジェクトからこのパッケージを`require()`した時に読み込まれるファイルです
- **このプロジェクトでは**: `server.js`がメインファイルとして設定されています。ただし、通常のWebアプリケーションでは直接`require()`されることはなく、`npm start`でサーバーを起動します

#### `scripts`
- **説明**: npmコマンドで実行できるスクリプトを定義します
- **実行タイミング**: ユーザーが明示的に`npm run [スクリプト名]`を実行したときのみ動作します
- **このプロジェクトで定義されているスクリプト**:
  - **`start`**: `npm start`で実行されるスクリプトです。このプロジェクトでは、Webサーバー(`server.js`)のみを起動します。
  - **`init-db`**: `npm run init-db`で実行されるスクリプトです。データベースの初期化のみを行います。新しい環境でのセットアップや、データベースをリセットしたい場合に使用します。
  - **`setup`**: `npm run setup`で実行されるスクリプトです。データベース初期化とサーバー起動を連続して行います。初回セットアップ用に使用します。

#### `dependencies`
- **説明**: プロジェクトが依存するnpmパッケージを定義します
- **適用タイミング**: `npm install`コマンドを実行したとき、これらのパッケージが自動的にインストールされます
- **このプロジェクトの依存パッケージ**:
  - **`express`** (^4.21.2): Node.js用の高速でミニマルなWebフレームワークです。HTTPサーバーの構築、ルーティング、ミドルウェアなどの機能を提供します。バージョン4.21.2以上、5.0.0未満が使用されます。
  - **`sqlite3`** (^5.1.7): Node.jsからSQLiteデータベースにアクセスするためのライブラリです。偉人データの保存と検索に使用されます。バージョン5.1.7以上、6.0.0未満が使用されます。

### バージョン表記について
- `^` (キャレット): 指定したバージョン以上、次のメジャーバージョン未満を許容します（例: ^4.21.2 は 4.21.2以上5.0.0未満）
- `~` (チルダ): 指定したバージョン以上、次のマイナーバージョン未満を許容します（例: ~4.21.2 は 4.21.2以上4.22.0未満）
- 固定バージョン: バージョン番号のみを指定すると、そのバージョンのみがインストールされます（例: 4.21.2）

### package.jsonの管理方法
- 新しいパッケージをインストールする場合: `npm install パッケージ名 --save`
- 開発用パッケージをインストールする場合: `npm install パッケージ名 --save-dev`
- パッケージをアップデートする場合: `npm update`
- 特定のパッケージをアップデートする場合: `npm update パッケージ名` 