// Prices and payouts form explicit toy tiers. Furniture bonuses apply once to the primary toy reward.
export const ECONOMY={
 startGold:8,reserve:4,freeBallSeconds:30,autoSeconds:9,
 toys:{ball:2,football:50,basketball:150,box:30,swing:280,bed:100,house:80,rod:400,scratch:1000},
 ballPayout:{ball:3,football:58,basketball:175},
 chainValue:{ball:1,football:8,basketball:15},
 houseCost:[0,80,180,420],housePayout:[0,100,220,490],tunnelPayout:[0,30,65,150],
 rodPayout:470,featherPayout:90,scratchPayout:1120,surfPayout:70,
 catPrices:[0,45,450,1600,4800,10000,18000,30000],
};
export const carePerMinute=n=>n*(n+1)/2;
export const houseLevel=skills=>skills.floor3?3:skills.floor2?2:1;
export const toyPrice=(kind,skills)=>kind==='house'?ECONOMY.houseCost[houseLevel(skills)]:ECONOMY.toys[kind];
export const tunnelEnds=t=>[{x:t.x-42,y:t.y+2},{x:t.x+42,y:t.y-30}];
