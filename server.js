require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

// APIエンドポイント（個人データの取得）
app.get('/api/famous-people', (req, res) => {

    const db = require('./src/database/db.js');

    db.getAllFamousPeople((err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });

});

// 年齢検索API
app.get('/api/famous-people/by-age/:age', (req, res) => {
    const age = parseInt(req.params.age);

    if (isNaN(age) || age < 1 || age > 120) {
        return res.status(400).json({ error: '年齢は1~120の整数を入力してください。' });
    }

    const db = require('./src/database/db.js');

    db.getFamousPeopleByAge(age, (err, rows) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);

    });


});


// サーバ起動
app.listen(PORT, () => {
    console.log(`サーバが起動しました: http://localhost:${PORT}`);

});



