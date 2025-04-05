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
    const ageIcon = document.getElementById('age-icon');

    // 年齢に応じたアイコンを取得する関数
    function getAgeIcon(age) {
        if (age <= 2) return '👶'; // 赤ちゃん
        if (age <= 5) return '🧒'; // 幼児
        if (age <= 12) return '👦'; // 子供
        if (age <= 19) return '👨‍🎓'; // 学生
        if (age <= 30) return '👨'; // 青年
        if (age <= 45) return '👨‍💼'; // 壮年
        if (age <= 60) return '👨‍🦱'; // 中年
        if (age <= 75) return '👴'; // 高齢者
        if (age <= 90) return '🧓'; // 老年
        return '👵'; // 超高齢者
    }

    // 年齢アイコンを更新する関数
    function updateAgeIcon(age) {
        const icon = getAgeIcon(age);
        ageIcon.textContent = icon;

        // アイコン変更時のアニメーション
        ageIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            ageIcon.style.transform = 'scale(1)';
        }, 300);
    }

    // 背景変更の関数を定義
    function updateBackgroundByAge(age) {
        const body = document.body;

        // 年代に応じた背景色とスタイル変更
        if (age < 20) {
            // 若年期: 明るく柔らかい色調（ライトゴールド系）
            document.documentElement.style.setProperty('--bg-hue', '45');
            document.documentElement.style.setProperty('--bg-saturation', '35%');
            document.documentElement.style.setProperty('--bg-lightness', '92%');
            document.documentElement.style.setProperty('--pattern-opacity', '0.15');
        } else if (age < 40) {
            // 青年期: 活動的な色調（アンバー系）
            document.documentElement.style.setProperty('--bg-hue', '36');
            document.documentElement.style.setProperty('--bg-saturation', '40%');
            document.documentElement.style.setProperty('--bg-lightness', '88%');
            document.documentElement.style.setProperty('--pattern-opacity', '0.2');
        } else if (age < 60) {
            // 壮年期: 安定した色調（アンティークゴールド系）
            document.documentElement.style.setProperty('--bg-hue', '30');
            document.documentElement.style.setProperty('--bg-saturation', '45%');
            document.documentElement.style.setProperty('--bg-lightness', '82%');
            document.documentElement.style.setProperty('--pattern-opacity', '0.25');
        } else if (age < 80) {
            // 高年期: 落ち着いた色調（ダークゴールド系）
            document.documentElement.style.setProperty('--bg-hue', '25');
            document.documentElement.style.setProperty('--bg-saturation', '50%');
            document.documentElement.style.setProperty('--bg-lightness', '75%');
            document.documentElement.style.setProperty('--pattern-opacity', '0.3');
        } else {
            // 超高年期: 歴史感のある色調（セピア系）
            document.documentElement.style.setProperty('--bg-hue', '20');
            document.documentElement.style.setProperty('--bg-saturation', '55%');
            document.documentElement.style.setProperty('--bg-lightness', '65%');
            document.documentElement.style.setProperty('--pattern-opacity', '0.35');
        }

        // 年代表示の更新（より歴史的な雰囲気を出すため、年齢に応じて古い年代を表示）
        let yearText;
        if (age < 30) {
            yearText = 1900 - age;
        } else if (age < 60) {
            yearText = 1850 - age;
        } else if (age < 90) {
            yearText = 1800 - age;
        } else {
            yearText = 1700 - age;
        }
        document.documentElement.style.setProperty('--year-text', `"${yearText}"`);
    }

    // 初期背景設定
    updateBackgroundByAge(parseInt(ageSlider.value));
    // 初期アイコン設定
    updateAgeIcon(parseInt(ageSlider.value));

    // スライダーの値が変更されたときのイベントリスナー
    ageSlider.addEventListener('input', function () {
        const currentAge = parseInt(this.value);
        ageValueDisplay.textContent = currentAge;
        updateBackgroundByAge(currentAge);
        updateAgeIcon(currentAge);
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









