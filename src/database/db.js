const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 環境変数からDBパスを取得するか、デフォルトパスを使用
const dbPath = process.env.DB_PATH
    ? process.env.DB_PATH
    : path.join(__dirname, '../../database/famous_people.db');

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('データベース接続エラー', err.message);
    } else {
        console.log('データベースに接続しました: ' + dbPath);
    }
});

// すべての偉人データを取得
function getAllFamousPeople(callback) {
    const sql = 'SELECT * FROM famous_people';
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

// 特定の年度の個人データを取得
function getFamousPeopleByAge(age, callback) {
    const exactMatchSql = 'SELECT * FROM famous_people WHERE age = ?';
    db.all(exactMatchSql, [age], (err, exactMatches) => {
        if (err) {
            return callback(err);
        }

        // 完全一致があれば返す
        if (exactMatches.length > 0) {
            return callback(null, exactMatches);
        }

        // 近い年齢（±5年）のデータを取得
        const closeMatchSql = `
        SELECT *, ABS(age-?) as age_diff
        FROM famous_people
        WHERE ABS(age-?) <= 5
        ORDER BY age_diff
        LIMIT 3
        `;

        db.all(closeMatchSql, [age, age], (err, closeMatches) => {
            if (err) {
                return callback(err);
            }

            // 近い年齢のデータを返す
            if (closeMatches.length > 0) {
                return callback(null, closeMatches);
            }

            // どちらも無ければ、ランダムに３つ選ぶ
            const randomSql = 'SELECT * FROM famous_people ORDER BY RANDOM() LIMIT 3';
            db.all(randomSql, [], (err, randomMatches) => {
                callback(err, randomMatches);
            });
        });
    });
}

module.exports = {
    getAllFamousPeople,
    getFamousPeopleByAge
};