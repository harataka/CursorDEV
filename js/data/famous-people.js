// 偉人のエピソードデータをsupabaseから取得するためのモジュール
// この情報はフロントエンドに持たせてもセキュリティリスクはない
import { corsHeaders } from './cors.js';

const SUPABASE_URL = 'https://zmqficvjyitksibpthxd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcWZpY3ZqeWl0a3NpYnB0aHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDk1MjUsImV4cCI6MjA1OTEyNTUyNX0.f4JteG81Rfyq6jIrsCQviPmZUD_nKk4e6V_2mw_fcM8';

// デバッグ用のログ関数
function logDebug(message, data) {
    console.log(`[DEBUG] ${message}`, data);
}

// データ取得関数
async function fetchFamousPeopleData() {
    try {
        logDebug('Supabase URL:', SUPABASE_URL);
        logDebug('API Key (最初の10文字):', SUPABASE_KEY.substring(0, 10) + '...');

        const response = await fetch(`${SUPABASE_URL}/rest/v1/famous_people?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                ...corsHeaders
            },
            mode: 'cors'
        });

        logDebug('レスポンスステータス:', response.status);
        logDebug('レスポンスヘッダー:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            logDebug('エラーレスポンス:', errorText);
            throw new Error(`サーバーからのデータ取得に失敗しました: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        logDebug('取得データ数:', data.length);
        return data;
    } catch (error) {
        console.error('データ取得エラー', error);
        return [];
    }
}

// 年齢検索関数
async function searchFamousPeopleByAge(age) {
    try {
        logDebug('検索年齢:', age);

        // 完全一致検索
        const exactMatchUrl = `${SUPABASE_URL}/rest/v1/famous_people?age=eq.${age}`;
        logDebug('完全一致検索URL:', exactMatchUrl);

        const response = await fetch(exactMatchUrl, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                ...corsHeaders
            },
            mode: 'cors'
        });

        logDebug('完全一致検索レスポンスステータス:', response.status);
        logDebug('レスポンスヘッダー:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            logDebug('エラーレスポンス:', errorText);
            throw new Error(`サーバーからのデータ取得に失敗しました: ${response.status} - ${errorText}`);
        }

        const exactMatchResult = await response.json();
        logDebug('完全一致検索結果数:', exactMatchResult.length);
        logDebug('完全一致検索結果:', exactMatchResult);

        // 完全一致のデータがあればその中からランダムに1件を返す
        if (exactMatchResult.length > 0) {
            // 複数件ある場合はランダムに1件選択
            const randomIndex = Math.floor(Math.random() * exactMatchResult.length);
            return [exactMatchResult[randomIndex]];
        }

        // 入力された年齢に近いデータを取得するための処理
        // 年齢の近さで検索するため、年齢の前後で検索して近いものを1件取得する

        // まず年齢より大きいデータを1件取得
        const olderUrl = `${SUPABASE_URL}/rest/v1/famous_people?age=gt.${age}&order=age.asc&limit=1`;
        logDebug('年上検索URL:', olderUrl);

        const olderResponse = await fetch(olderUrl, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                ...corsHeaders
            },
            mode: 'cors'
        });

        // 次に年齢より小さいデータを1件取得
        const youngerUrl = `${SUPABASE_URL}/rest/v1/famous_people?age=lt.${age}&order=age.desc&limit=1`;
        logDebug('年下検索URL:', youngerUrl);

        const youngerResponse = await fetch(youngerUrl, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                ...corsHeaders
            },
            mode: 'cors'
        });

        // 両方のレスポンスを処理
        const olderResults = olderResponse.ok ? await olderResponse.json() : [];
        const youngerResults = youngerResponse.ok ? await youngerResponse.json() : [];

        logDebug('年上検索結果数:', olderResults.length);
        logDebug('年下検索結果数:', youngerResults.length);

        // より近い年齢のレコードを選択する
        if (olderResults.length > 0 && youngerResults.length > 0) {
            // 両方の結果がある場合は、年齢差が小さい方を選択
            const olderDiff = olderResults[0].age - age;
            const youngerDiff = age - youngerResults[0].age;

            if (olderDiff <= youngerDiff) {
                return [olderResults[0]];
            } else {
                return [youngerResults[0]];
            }
        } else if (olderResults.length > 0) {
            // 年上の結果だけある場合
            return [olderResults[0]];
        } else if (youngerResults.length > 0) {
            // 年下の結果だけある場合
            return [youngerResults[0]];
        }

        // どちらも見つからない場合はランダムに1つ取得
        const randomUrl = `${SUPABASE_URL}/rest/v1/famous_people?limit=1`;
        logDebug('ランダム検索URL:', randomUrl);

        const randomResponse = await fetch(randomUrl, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                ...corsHeaders
            },
            mode: 'cors'
        });

        if (!randomResponse.ok) {
            const errorText = await randomResponse.text();
            throw new Error(`サーバーからのデータ取得に失敗しました: ${randomResponse.status} - ${errorText}`);
        }

        const randomResults = await randomResponse.json();
        logDebug('ランダム検索結果数:', randomResults.length);

        return randomResults;
    } catch (error) {
        console.error('データ取得エラー:', error);
        return [];
    }
}

// モジュールとしてエクスポート
export { fetchFamousPeopleData, searchFamousPeopleByAge }; 