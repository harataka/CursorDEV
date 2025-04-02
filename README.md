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

### 3. データベース設定

#### Supabaseを使用する場合（推奨）

1. [Supabase](https://supabase.com/)にアカウントを作成し、新しいプロジェクトを作成
2. 「Table Editor」からテーブルを作成:
   ```sql
   CREATE TABLE famous_people (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     age INT NOT NULL,
     episode TEXT NOT NULL
   );
   ```
3. 初期データを挿入するためのSQLを実行（詳細はSupabaseセクションを参照）
4. `.env`ファイルを作成し、接続情報を設定：
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklm.supabase.co:5432/postgres
   ```

#### ローカルSQLiteを使用する場合（オプション）

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

## Renderにデプロイする方法（Supabase使用）

### 1. Supabaseの設定

1. Supabaseでプロジェクトを作成し、テーブル設定を行います
2. データベース接続情報を取得します（Project Settings → Database → Connection string → URI）

### 2. Renderでデプロイ

1. Renderダッシュボードから「New +」→「Web Service」を選択
2. GitHubリポジトリに接続
3. 以下の設定を行います：
   - Name: 任意の名前（例: ijin-saijiki）
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. 「Environment」タブで以下の環境変数を追加：
   - `DATABASE_URL`: Supabaseの接続URL（例: postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres）
5. 「Create Web Service」をクリックしてデプロイ

## Supabaseデータベース設定

### 1. テーブル作成

Supabaseダッシュボードの「Table Editor」から新しいテーブルを作成します：

- テーブル名: `famous_people`
- カラム:
  - `id`: `int8`, Primary Key, Identity
  - `name`: `text`, NOT NULL
  - `age`: `int4`, NOT NULL
  - `episode`: `text`, NOT NULL

### 2. 初期データの挿入

SQLエディタから以下のSQLコードを実行してデータを挿入します：

```sql
INSERT INTO famous_people(age, name, episode) VALUES
(7, 'モーツァルト', '7歳でヨーロッパ演奏旅行を行い、各国の王侯貴族を驚かせた'),
(8, 'ピカソ', '8歳で最初の油絵「ピカドール」を完成させた'),
(10, 'アインシュタイン', '10歳のとき数学と科学の独学を始めた'),
(12, '坂本龍馬', '12歳で武市半平太の剣術道場に入門した'),
(15, 'エジソン', '15歳で新聞を発行し、列車内で販売する事業を始めた'),
(16, '野口英世', '16歳の時、医学への道を志し、英語や数学の勉強を始めた'),
(17, 'キュリー夫人', '17歳で家庭教師として働きながら姉の大学進学資金を援助した'),
(19, 'ナポレオン', '19歳で少尉に昇進し、フランス革命軍の士官となった'),
(21, 'スティーブ・ジョブズ', '21歳でアップルコンピュータを創業した'),
(23, 'ビル・ゲイツ', '23歳でマイクロソフト社をワシントン州に法人登記した'),
(26, '福沢諭吉', '26歳で蘭学塾を開いた'),
(30, '徳川家康', '30歳で三河一国を与えられ、国主となった'),
(33, 'イエス・キリスト', '33歳で十字架に架けられたとされる'),
(35, '夏目漱石', '35歳で処女作「吾輩は猫である」を発表した'),
(37, 'ゴッホ', '37歳で名画「ひまわり」を描いた'),
(40, '織田信長', '40歳で明智光秀に謀反され、本能寺で自害した'),
(43, 'コロンブス', '43歳でアメリカ大陸を「発見」した'),
(45, '葛飾北斎', '45歳で浮世絵師として独立し「北斎」と名乗った'),
(50, '伊能忠敬', '50歳で天文学と測量術を学び始めた'),
(56, '孫正義', '56歳でARM社を32億ポンド（約4.3兆円）で買収した'),
(62, 'ガンジー', '62歳でインド独立運動の象徴「塩の行進」を行った'),
(70, 'グランマ・モーゼス', '70歳を超えてから本格的に絵を描き始め、画家として成功した'),
(75, 'ミケランジェロ', '75歳で世界最大のドーム「サン・ピエトロ大聖堂」の設計を引き受けた'),
(80, '松下幸之助', '80歳で「人間什么」を提唱し、人間の本質について探求し続けた'),
(90, '黒澤明', '90歳の時、「まだまだ映画を作りたい」と語り、創作意欲を持ち続けた');
```

### 3. セキュリティ設定

Row Level Securityを有効にしている場合は、適切なポリシーを設定します。
今回のアプリケーションはパブリックな読み取りアクセスが必要なため、以下のポリシーを設定してください：

```sql
CREATE POLICY "Enable read access for all users" ON "public"."famous_people"
AS PERMISSIVE FOR SELECT
TO public
USING (true);
```

## 技術スタック

- フロントエンド: HTML, CSS, JavaScript (ES modules)
- バックエンド: Node.js, Express
- データベース: PostgreSQL (Supabase)

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
│       └── db.js          # DB操作
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
        "dev": "node server.js"
    },
    "dependencies": {
        "express": "^4.21.2",
        "pg": "^8.11.3"
    }
}
```

### 各項目の役割

#### `main`
- **説明**: アプリケーションのエントリーポイント（メインファイル）を指定します
- **実行タイミング**: 他のプロジェクトからこのパッケージを`require()`した時に読み込まれるファイルです
- **このプロジェクトでは**: `server.js`がメインファイルとして設定されています

#### `scripts`
- **説明**: npmコマンドで実行できるスクリプトを定義します
- **実行タイミング**: ユーザーが明示的に`npm run [スクリプト名]`を実行したときのみ動作します
- **このプロジェクトで定義されているスクリプト**:
  - **`start`**: `npm start`で実行されるスクリプトです。Webサーバーを起動します。
  - **`dev`**: `npm run dev`で実行されるスクリプトです。開発環境での使用に適しています（startと同じ内容）。

#### `dependencies`
- **説明**: プロジェクトが依存するnpmパッケージを定義します
- **適用タイミング**: `npm install`コマンドを実行したとき、これらのパッケージが自動的にインストールされます
- **このプロジェクトの依存パッケージ**:
  - **`express`** (^4.21.2): Node.js用のWebフレームワークです。
  - **`pg`** (^8.11.3): PostgreSQLデータベースに接続するためのNode.jsクライアントです。 