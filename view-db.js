const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'database/famous_people.db');

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('データベース接続エラー:', err.message);
        return;
    }
    console.log('データベースに接続しました:', dbPath);

    // famous_peopleテーブルのすべてのデータを取得
    db.all('SELECT * FROM famous_people', [], (err, rows) => {
        if (err) {
            console.error('クエリエラー:', err.message);
            return;
        }

        // テーブルヘッダーを表示
        console.log('\n===== famous_people テーブルのデータ =====\n');
        console.log('ID\t年齢\t名前\t\tエピソード');
        console.log('------------------------------------------------');

        // 各行を表示
        rows.forEach(row => {
            console.log(`${row.id}\t${row.age}\t${row.name.padEnd(10)}\t${row.episode.substring(0, 30)}...`);
        });

        console.log(`\n合計 ${rows.length} 件のデータが見つかりました。`);

        // データベース接続を閉じる
        db.close((err) => {
            if (err) {
                console.error('データベースを閉じる際にエラーが発生しました:', err.message);
            } else {
                console.log('データベース接続を閉じました');
            }
        });
    });
}); 