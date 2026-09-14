import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,W,H,SKILLS} from '../dist/engine.mjs';
import {FIXTURES,fixtureMotion,fixtureDuration} from '../dist/fixtures.mjs';
const advance=(g,n)=>{for(let i=0;i<Math.ceil(n*60);i++)g.step(1/60);};
const fund=(g,n)=>{g.s.gold=n;g.s.ledger.opening=n;};
function grant(g,id){const n=SKILLS.find(n=>n.id===id);for(const k of n.req)grant(g,k);g.s.skills[id]=true;}
test('furniture-only room never produces gold, while cats voluntarily use every fixture',()=>{
 const g=new Game(91);fund(g,2000);grant(g,'balls');g.addCat(0);g.addCat(0);
 assert.ok(g.place('box',240,400));assert.ok(g.place('swing',550,400));assert.ok(g.place('bed',850,400));advance(g,100);
 assert.ok(g.s.stats.boxVisits>0);assert.ok(g.s.stats.swingRides>0);assert.ok(g.s.stats.naps>0);assert.equal(g.s.earned,0);assert.equal(g.s.stats.bonusGold,0);assert.equal(g.s.ledger.earned,0);
 assert.equal(g.s.gold,2000-g.s.ledger.toys-g.s.ledger.care);assert.equal(g.s.rooms[0].toys.length,3);
});
test('box and swing ingress, seated motion and exit resume deterministically without teleporting',()=>{
 for(const kind of ['box','swing']){const g=new Game(43),t=g.spawn(kind,550,400,0),c=g.s.cats[0];Object.assign(c,{x:550,y:438});g.beginFixture(c,t);advance(g,.8);const re=Game.load(g.save());assert.ok(re);assert.equal(fixtureMotion(t,c).phase,'hold');let old={x:c.x,y:c.y},extreme=0;
 for(let i=0;i<Math.ceil(fixtureDuration(kind)*60);i++){g.step(1/60);re.step(1/60);extreme=Math.max(extreme,Math.abs(c.x-t.x));assert.ok(Math.hypot(c.x-old.x,c.y-old.y)<6);old={x:c.x,y:c.y};}
 assert.deepEqual(g.s,re.s);assert.equal(g.s.stats[kind==='box'?'boxVisits':'swingRides'],1);assert.equal(g.s.earned,0);if(kind==='swing')assert.ok(extreme>10);
 }
});
test('fixture bonuses apply once to primary rewards, do not stack copies and retain fractions',()=>{
 const g=new Game();fund(g,5000);grant(g,'balls');for(const [kind,x,y]of [['box',200,400],['box',350,400],['swing',600,400],['bed',850,400]])assert.ok(g.place(kind,x,y));
 assert.deepEqual(g.bonus(),{flat:0,percent:.20});
 const ball={kind:'football',x:500,y:500};for(let i=0;i<10;i++)g.reward(58,ball,0,'fixture test');
 assert.equal(g.s.ledger.earned,696);assert.equal(g.s.stats.bonusGold,116);assert.ok(g.s.rooms[0].bonusCarry<1e-7);
 g.reward(8,{kind:'mouse',x:400,y:400},0,'chain');assert.equal(g.s.ledger.earned,704);assert.equal(g.s.stats.bonusGold,116);
});
test('bonuses belong to their room; bare room and idle furniture add nothing',()=>{
 const g=new Game();grant(g,'room');g.s.rooms.push({name:'Oyun odası',toys:[],autoTimer:0,bonusCarry:0});g.spawn('box',300,400,0);g.reward(3,{kind:'ball',x:500,y:400},1,'other room');assert.equal(g.s.ledger.earned,3);g.reward(3,{kind:'ball',x:500,y:400},0,'home room');assert.equal(g.s.ledger.earned,6);assert.ok(Game.load(g.save()));
});
test('moving occupied furniture cancels only the visit and creates no payment',()=>{
 const g=new Game(),t=g.spawn('swing',300,400,0),c=g.s.cats[0];g.beginFixture(c,t);advance(g,2);const earned=g.s.earned,gold=g.s.gold;assert.ok(g.moveFixture(t.id,800,440));assert.equal(c.fixture,null);assert.equal(g.s.stats.swingRides,0);assert.equal(g.s.earned,earned);assert.equal(g.s.gold,gold);assert.ok(Game.load(g.save()));
});
test('overlapping furniture fails without charging and a seat cannot have two occupants',()=>{
 const g=new Game();fund(g,1000);assert.ok(g.place('box',300,400));const gold=g.s.gold;assert.equal(g.place('bed',310,405),false);assert.equal(g.s.gold,gold);const t=g.s.rooms[0].toys[0],a=g.s.cats[0],b=g.addCat(0);assert.ok(g.beginFixture(a,t));assert.equal(g.beginFixture(b,t),false);advance(g,1);assert.equal(g.s.cats.filter(c=>c.mode==='fixture').length,1);
});
test('v3 save migrates wider-room positions exactly once and retains wealth and sleeping cat',()=>{
 const g=new Game();fund(g,987);const t=g.spawn('bed',450,350,0),c=g.s.cats[0];Object.assign(c,{x:450,y:350,tx:450,ty:300,mode:'sleep',target:t.id,timer:3});const old=JSON.parse(g.save());old.version=3;
 const loaded=Game.load(JSON.stringify(old));assert.ok(loaded);assert.equal(loaded.s.gold,987);assert.equal(loaded.s.cats[0].x,450*W/900);assert.ok(Math.abs(loaded.s.cats[0].y-350*H/600)<1e-9);assert.equal(loaded.s.cats.length,1);assert.equal(loaded.s.rooms[0].toys[0].id,t.id);
 const re=Game.load(loaded.save());assert.ok(re);assert.deepEqual(loaded.s,re.s);advance(loaded,10);assert.equal(loaded.s.earned,0);
});
