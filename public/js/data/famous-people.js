// 偉人のエピソードデータをAPIから取得するためのモジュール

// データ取得関数
async function fetchFamousPeopleData() {
    try {
        const response = await fetch('/api/famous-people');
        if (!response.ok) {
            throw new Error('サーバからのデータ取得に失敗しました');

        }
        return await response.json();
    } catch (error) {
        console.error('データ取得エラー', error);
        return [];
    }

}

// 年齢検索関数
async function searchFamousPeopleByAge(age) {
    try {
        const response = await fetch(`/api/famous-people/by-age/${age}`);
        if (!response.ok) {
            throw new Error(`サーバーからのデータ取得に失敗しました: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('データ取得エラー:', error);
        return [];
    }
}

// モジュールとしてエクスポート
export { fetchFamousPeopleData, searchFamousPeopleByAge }; 