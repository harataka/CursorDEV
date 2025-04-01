// モジュールをインポート
import { searchFamousPeopleByAge } from "./data/famous-people.js";
import { createResultElements } from "./utils/search-utils.js";


// DOMが読み込まれた後に実装
document.addEventListener('DOMContentLoaded', function () {

    console.log('アプリが読み込まれました。');

    // フォームの要素を取得
    const ageForm = document.getElementById('age-form');

    // 結果エリアの要素を取得
    const resultsDiv = document.getElementById('results');

    // フォームの送信イベントを処理
    ageForm.addEventListener('submit', async function (event) {

        // デフォルトの送信動作をキャンセル
        event.preventDefault();


        // 入力された年齢を取得
        const ageInput = document.getElementById('age');
        const age = parseInt(ageInput.value);


        // 入力が有効かチェック
        if (isNaN(age) || age < 1 || age > 120) {
            resultsDiv.innerHTML = '<p class="error-message">年齢は1~120の整数を入力してください。</p>';
            return;
        }

        // 結果表示エリアに読み込み中のメッセージを表示
        resultsDiv.innerHTML = '<p class="loading">データを取得中...</p>';

        try {
            // APIから年齢に対応するエピソードを検索
            const matchingEpisodes = await searchFamousPeopleByAge(age);

            // 結果表示エリアをクリア
            resultsDiv.innerHTML = '';

            // 結果が無い場合
            if (matchingEpisodes.length === 0) {
                resultsDiv.innerHTML = '<p>この年齢に関連するエピソードが見つかりませんでした。</p>';
                return;
            }

            // 結果を表示
            const resultElements = createResultElements(matchingEpisodes, age);
            resultsDiv.appendChild(resultElements);
        } catch (error) {
            console.error('エラー:', error);
            resultsDiv.innerHTML = '<p class="error-message">データ取得中にエラーが発生しました。もう一度お試しください。</p>';
        }
    });


});









