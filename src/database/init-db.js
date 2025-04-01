const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 環境変数からDBパスを取得するか、デフォルトパスを使用
const dbPath = process.env.DB_PATH
    ? process.env.DB_PATH
    : path.join(__dirname, '../../database/famous_people.db');

// データベースディレクトリの作成確認
if (!process.env.DB_PATH) {
    const dbDir = path.join(__dirname, '../../database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
}

// データベースが既に存在するか確認
const dbExists = fs.existsSync(dbPath);

// 新しいDB接続を作成
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('データベース作成エラー', err.message);
        return;
    }

    if (dbExists) {
        console.log('既存のデータベースに接続しました: ' + dbPath);

        // テーブルが存在するかチェック
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='famous_people'", (err, row) => {
            if (err) {
                console.error('テーブル確認エラー', err.message);
                db.close();
                return;
            }

            if (row) {
                console.log('famous_peopleテーブルは既に存在します。初期化をスキップします。');
                db.close();
                return;
            } else {
                // テーブルが存在しない場合は作成
                createTableAndInsertData();
            }
        });
    } else {
        console.log('新しいデータベースを作成しました: ' + dbPath);
        createTableAndInsertData();
    }

    // テーブル作成と初期データ挿入関数
    function createTableAndInsertData() {
        db.run(`
        CREATE TABLE IF NOT EXISTS famous_people(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            episode TEXT NOT NULL
        )
        `, (err) => {
            if (err) {
                console.error('テーブル作成エラー', err.message);
                db.close();
                return;
            }
            console.log('famous_peopleテーブルを作成しました');

            // データが既に入っているか確認
            db.get('SELECT COUNT(*) as count FROM famous_people', (err, row) => {
                if (err) {
                    console.error('データ確認エラー', err.message);
                    db.close();
                    return;
                }

                // データが既に存在する場合はスキップ
                if (row && row.count > 0) {
                    console.log(`既に ${row.count} 件のデータが存在します。初期データ挿入をスキップします。`);
                    db.close();
                    return;
                }

                // 初期データ挿入
                const initialData = [
                    { age: 7, name: "モーツァルト", episode: "7歳でヨーロッパ演奏旅行を行い、各国の王侯貴族を驚かせた" },
                    { age: 8, name: "ピカソ", episode: "8歳で最初の油絵「ピカドール」を完成させた" },
                    { age: 10, name: "アインシュタイン", episode: "10歳のとき数学と科学の独学を始めた" },
                    { age: 12, name: "坂本龍馬", episode: "12歳で武市半平太の剣術道場に入門した" },
                    { age: 15, name: "エジソン", episode: "15歳で新聞を発行し、列車内で販売する事業を始めた" },
                    { age: 16, name: "野口英世", episode: "16歳の時、医学への道を志し、英語や数学の勉強を始めた" },
                    { age: 17, name: "キュリー夫人", episode: "17歳で家庭教師として働きながら姉の大学進学資金を援助した" },
                    { age: 19, name: "ナポレオン", episode: "19歳で少尉に昇進し、フランス革命軍の士官となった" },
                    { age: 21, name: "スティーブ・ジョブズ", episode: "21歳でアップルコンピュータを創業した" },
                    { age: 23, name: "ビル・ゲイツ", episode: "23歳でマイクロソフト社をワシントン州に法人登記した" },
                    { age: 26, name: "福沢諭吉", episode: "26歳で蘭学塾を開いた" },
                    { age: 30, name: "徳川家康", episode: "30歳で三河一国を与えられ、国主となった" },
                    { age: 33, name: "イエス・キリスト", episode: "33歳で十字架に架けられたとされる" },
                    { age: 35, name: "夏目漱石", episode: "35歳で処女作「吾輩は猫である」を発表した" },
                    { age: 37, name: "ゴッホ", episode: "37歳で名画「ひまわり」を描いた" },
                    { age: 40, name: "織田信長", episode: "40歳で明智光秀に謀反され、本能寺で自害した" },
                    { age: 43, name: "コロンブス", episode: "43歳でアメリカ大陸を「発見」した" },
                    { age: 45, name: "葛飾北斎", episode: "45歳で浮世絵師として独立し「北斎」と名乗った" },
                    { age: 50, name: "伊能忠敬", episode: "50歳で天文学と測量術を学び始めた" },
                    { age: 56, name: "孫正義", episode: "56歳でARM社を32億ポンド（約4.3兆円）で買収した" },
                    { age: 62, name: "ガンジー", episode: "62歳でインド独立運動の象徴「塩の行進」を行った" },
                    { age: 70, name: "グランマ・モーゼス", episode: "70歳を超えてから本格的に絵を描き始め、画家として成功した" },
                    { age: 75, name: "ミケランジェロ", episode: "75歳で世界最大のドーム「サン・ピエトロ大聖堂」の設計を引き受けた" },
                    { age: 80, name: "松下幸之助", episode: "80歳で「人間什么」を提唱し、人間の本質について探求し続けた" },
                    { age: 90, name: "黒澤明", episode: "90歳の時、「まだまだ映画を作りたい」と語り、創作意欲を持ち続けた" }
                ];

                // データ挿入
                const insertStmt = db.prepare(`
                INSERT INTO famous_people(age, name, episode)    
                VALUES(?, ?, ?)
                `);

                initialData.forEach(person => {
                    insertStmt.run(person.age, person.name, person.episode);
                });

                insertStmt.finalize();
                console.log('初期データを挿入しました');

                // データベース接続を閉じる
                db.close((err) => {
                    if (err) {
                        console.error('データベース接続閉じるエラー', err.message);
                    } else {
                        console.log('データベース接続を閉じました');
                    }
                });
            });
        });
    }
});
