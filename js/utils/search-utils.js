// 年齢に対応するエピソードを検索
function findEpisodesByAge(famousPeopleEpisodes, targetAge) {

    // 年齢に一致するエピソードを探す
    const exactMatches = famousPeopleEpisodes.filter(item => item.age === targetAge);

    // 完全に一致するものがあれば、それを返す
    if (exactMatches.length > 0) {
        return exactMatches;
    }

    // 完全一致がない場合は、近いものを探す
    const ageDifference = (episode) => Math.abs(episode.age - targetAge);

    // 年齢の差が５以内のエピソードを探す
    const closeMatches = famousPeopleEpisodes.filter(item => ageDifference(item) <= 5);

    // 近い年齢のものがあれば、それを返す
    if (closeMatches.length > 0) {
        // 年齢の差が小さい順にソート
        return closeMatches.sort((a, b) => ageDifference(a) - ageDifference(b)).slice(0, 3);
    }

    // 完全一致も近いものもない場合は、ランダムに３つ選ぶ
    // 配列を展開
    const randomEpisodes = [...famousPeopleEpisodes];

    // Fisher-Yatesアルゴリズムを使用して配列をシャッフル
    for (let i = randomEpisodes.length - 1; i > 0; i--) {
        // 0からiまでのランダムなインデックスを生成
        const j = Math.floor(Math.random() * (i + 1));
        // 配列の要素を入れ替え
        [randomEpisodes[i], randomEpisodes[j]] = [randomEpisodes[j], randomEpisodes[i]];
    }
    // シャッフルした配列から最初の3つの要素を返す
    return randomEpisodes.slice(0, 3);
}

// 検索結果からHTML要素を作成
function createResultElements(episodes, searchedAge) {
    // 結果を表示するためのフラグメントを作成
    const fragment = document.createDocumentFragment();

    // 各エピソードに対して処理
    episodes.forEach(episode => {
        // 結果アイテムのコンテナを作成
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        // 名前と年齢を表示するヘッダーを作成
        const header = document.createElement('h3');
        header.textContent = `${episode.name}（${episode.age}歳）`;

        // エピソード内容を表示する段落を作成
        const content = document.createElement('p');
        content.textContent = episode.episode;

        // 検索した年齢と一致しない場合、違いを表示
        if (episode.age !== searchedAge) {
            const ageDiff = Math.abs(episode.age - searchedAge);
            const ageDiffText = document.createElement('p');
            ageDiffText.className = 'age-diff';
            ageDiffText.textContent = `（検索された${searchedAge}歳との差: ${ageDiff}歳）`;
            resultItem.appendChild(header);
            resultItem.appendChild(content);
            resultItem.appendChild(ageDiffText);
        } else {
            resultItem.appendChild(header);
            resultItem.appendChild(content);
        }

        // 結果アイテムをフラグメントに追加
        fragment.appendChild(resultItem);
    });

    return fragment;
}

// モジュールとしてエクスポート
export { findEpisodesByAge, createResultElements };