'use strict';
/*-------------------------------------------------------------------
-                      データの読み込み
---------------------------------------------------------------------*/
const fs       = require('fs'); // module呼び出し file system
const readline = require('readline');
const rs       = fs.createReadStream('./popu-pref.csv'); // csv読み込み
const rl       = readline.createInterface({input: rs});  // inputとして設定
const prefectureDataMap = new Map();
/*-------------------------------------------------------------------
-                      データの抜き出し
---------------------------------------------------------------------*/
rl.on('line', lineString =>
{
    const columns    = lineString.split((','));
    const year       = parseInt(columns[0]); // 年
    const prefecture = columns[1];           // 県
    const popu       = parseInt(columns[3]);

    if(year === 2010 || year === 2015)
    {
        let value = null;
        if(prefectureDataMap.has(prefecture))
        {
            value = prefectureDataMap.get(prefecture);
        }
        else
        {
            value = {popu10: 0, popu15: 0, change: null}; // 初期値のオブジェクト
        }

        if(year === 2010){value.popu10 = popu;}
        if(year === 2015){value.popu15 = popu;}

        prefectureDataMap.set(prefecture, value);
    }
});

rl.on('close', () =>
{
    for(const [key, value] of prefectureDataMap)
    {
        value.change = value.popu15 / value.popu10;
    }
    
    // pair[0]: 都道府県 pair[1].集計データ
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) =>
    {
        return pair2[1].change - pair1[1].change; //
    });
    
    // 整形
    const rankingStrings = rankingArray.map(([key, value]) =>
    {
        return `${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`;
    });
    console.log(rankingStrings);
}
);