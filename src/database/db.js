const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// PostgreSQLクライアントモジュールをインポート
const { Pool } = require('pg');

// Supabase接続情報（環境変数から取得）
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// 接続成功をログ出力
pool.on('connect', () => {
    console.log('データベースに接続しました: Supabase PostgreSQL');
});

// エラーをログ出力
pool.on('error', (err) => {
    console.error('データベース接続エラー:', err.message);
});

// すべての偉人データを取得
async function getAllFamousPeople(callback) {
    try {
        const result = await pool.query('SELECT * FROM famous_people');
        callback(null, result.rows);
    } catch (err) {
        callback(err);
    }
}

// 特定の年度の個人データを取得
async function getFamousPeopleByAge(age, callback) {
    try {
        // 完全一致を確認
        const exactMatchResult = await pool.query('SELECT * FROM famous_people WHERE age = $1', [age]);

        // 完全一致があれば返す
        if (exactMatchResult.rows.length > 0) {
            return callback(null, exactMatchResult.rows);
        }

        // 近い年齢（±5年）のデータを取得
        const closeMatchSql = `
        SELECT *, ABS(age-$1) as age_diff
        FROM famous_people
        WHERE ABS(age-$1) <= 5
        ORDER BY age_diff
        LIMIT 3
        `;

        const closeMatchResult = await pool.query(closeMatchSql, [age]);

        // 近い年齢のデータを返す
        if (closeMatchResult.rows.length > 0) {
            return callback(null, closeMatchResult.rows);
        }

        // どちらも無ければ、ランダムに３つ選ぶ
        const randomResult = await pool.query('SELECT * FROM famous_people ORDER BY RANDOM() LIMIT 3');
        callback(null, randomResult.rows);

    } catch (err) {
        callback(err);
    }
}

module.exports = {
    getAllFamousPeople,
    getFamousPeopleByAge
};