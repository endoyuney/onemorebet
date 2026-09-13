// Gold values and progression prices share a single source with the shop.
export const ECONOMY={
 startGold:8,reserve:4,freeBallSeconds:30,autoSeconds:9,
 toys:{ball:2,football:5,basketball:10,bed:40,house:18,rod:25,scratch:60},
 ballPayout:{ball:3,football:7,basketball:13},
 chainValue:{ball:1,football:2,basketball:3},
 houseCost:[0,18,32,50],housePayout:[0,22,38,58],tunnelPayout:[0,8,14,22],
 rodPayout:35,featherPayout:8,scratchPayout:78,surfPayout:6,napPayout:2,
 catPrices:[0,35,140,350,700,1200,2000,3200],
};
export const carePerMinute=n=>n*(n+1)/2;
export const houseLevel=skills=>skills.floor3?3:skills.floor2?2:1;
export const toyPrice=(kind,skills)=>kind==='house'?ECONOMY.houseCost[houseLevel(skills)]:ECONOMY.toys[kind];
export const tunnelEnds=t=>[{x:t.x-42,y:t.y+2},{x:t.x+42,y:t.y-30}];
