// 偉人のエピソードデータをsupabaseから取得するためのモジュール

const SUPABASE_URL = 'https://zmqficvjyitksibpthxd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcWZpY3ZqeWl0a3NpYnB0aHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDk1MjUsImV4cCI6MjA1OTEyNTUyNX0.f4JteG81Rfyq6jIrsCQviPmZUD_nKk4e6V_2mw_fcM8';


// データ取得関数
async function fetchFamousPeopleData() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/famous_people?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

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
        // 完全一致検索
        const exactMatchUrl = `${SUPABASE_URL}/rest/v1/famous_people?age=eq.${age}`;

        const response = await fetch(exactMatchUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });


        if (!response.ok) {
            throw new Error(`サーバーからのデータ取得に失敗しました: ${response.status}`);
        }


        const exactMatchResult = await response.json();

        // 完全一致のデータがあればそれを返す
        if (exactMatchResult.length > 0) {
            return exactMatchResult;
        }

        // 完全一致のデータがない場合、近い年齢のデータを取得
        const rangeLow = age - 5;
        const rangeHigh = age + 5;
        const rangeUrl = `${SUPABASE_URL}/rest/v1/famous_people?age=gte.${rangeLow}&age=lte.${rangeHigh}`;

        const rangeResponse = await fetch(rangeUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!rangeResponse.ok) {
            throw new Error(`サーバーからのデータ取得に失敗しました: ${rangeResponse.status}`);
        }

        const rangeResults = await rangeResponse.json();

        if (rangeResults.length > 0) {
            return rangeResults.slice(0, 3); // 最大3つまで
        }

        // どちらも見つからない場合はランダムに3つ取得
        const randomUrl = `${SUPABASE_URL}/rest/v1/famous_people?limit=3`;

        const randomResponse = await fetch(randomUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!randomResponse.ok) {
            throw new Error(`サーバーからのデータ取得に失敗しました: ${randomResponse.status}`);
        }

        return await randomResponse.json();
    } catch (error) {
        console.error('データ取得エラー:', error);
        return [];
    }
}

// モジュールとしてエクスポート
export { fetchFamousPeopleData, searchFamousPeopleByAge }; 