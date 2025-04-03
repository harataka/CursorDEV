// モジュールをインポート
import { searchFamousPeopleByAge } from "./data/famous-people.js";
import { createResultElements } from "./utils/search-utils.js";


// DOMが読み込まれた後に実装
document.addEventListener('DOMContentLoaded', function () {

    console.log('アプリが読み込まれました。');

    // フォームの要素を取得
    const ageForm = document.getElementById('age-form');

    // スライダーと表示値の要素を取得
    const ageSlider = document.getElementById('age');
    const ageValueDisplay = document.getElementById('age-display');

    // スライダーの値が変更されたときのイベントリスナー
    ageSlider.addEventListener('input', function () {
        ageValueDisplay.textContent = this.value;
    });

    // 結果エリアの要素を取得
    const resultsDiv = document.getElementById('results');

    // フォームの送信イベントを処理
    ageForm.addEventListener('submit', async function (event) {

        // デフォルトの送信動作をキャンセル
        event.preventDefault();


        // スライダーから年齢を取得
        const age = parseInt(ageSlider.value);


        // 入力が有効かチェック
        if (isNaN(age) || age < 1 || age > 120) {
            resultsDiv.innerHTML = '<p class="error-message">年齢は1~120の整数を入力してください。</p>';
            return;
        }

        // 結果表示エリアに読み込み中のメッセージを表示
        resultsDiv.innerHTML = '<p class="loading">データ取得中</p>';

        try {
            // APIからデータを取得
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









