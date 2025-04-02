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

        // 完全一致のデータがあればそれを返す
        if (exactMatchResult.length > 0) {
            return exactMatchResult;
        }

        // 完全一致のデータがない場合、近い年齢のデータを取得
        const rangeLow = age - 5;
        const rangeHigh = age + 5;
        const rangeUrl = `${SUPABASE_URL}/rest/v1/famous_people?age=gte.${rangeLow}&age=lte.${rangeHigh}`;
        logDebug('範囲検索URL:', rangeUrl);

        const rangeResponse = await fetch(rangeUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        logDebug('範囲検索レスポンスステータス:', rangeResponse.status);

        if (!rangeResponse.ok) {
            throw new Error(`サーバーからのデータ取得に失敗しました: ${rangeResponse.status}`);
        }

        const rangeResults = await rangeResponse.json();
        logDebug('範囲検索結果数:', rangeResults.length);

        if (rangeResults.length > 0) {
            return rangeResults.slice(0, 3); // 最大3つまで
        }

        // どちらも見つからない場合はランダムに3つ取得
        const randomUrl = `${SUPABASE_URL}/rest/v1/famous_people?limit=3`;
        logDebug('ランダム検索URL:', randomUrl);

        const randomResponse = await fetch(randomUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        logDebug('ランダム検索レスポンスステータス:', randomResponse.status);

        if (!randomResponse.ok) {
            throw new Error(`サーバーからのデータ取得に失敗しました: ${randomResponse.status}`);
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