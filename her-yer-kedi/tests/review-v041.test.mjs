import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,SKILLS} from '../dist/engine.mjs';
import {readSession} from '../dist/persistence.mjs';
const advance=(g,n)=>{for(let i=0;i<Math.ceil(n*60);i++)g.step(1/60);};
test('box cannot distract a cat while a consumable remains, including an existing approach',()=>{
 const g=new Game(9),c=g.s.cats[0],box=g.spawn('box',300,400,0),ball=g.spawn('ball',700,400,0);
 c.plays=100;c.x=box.x;c.y=box.y+38;
 for(let i=0;i<20;i++)assert.equal(g.target(c).id,ball.id);
 c.target=box.id;c.mode='chase';g.step(1/60);assert.notEqual(c.target,box.id);assert.notEqual(c.mode,'fixture');
 g.s.rooms[0].toys=[box];c.target=null;assert.equal(g.target(c).id,box.id);
});
test('two purchases per resident cat, furniture is separate, transformations are not truncated',()=>{
 const g=new Game();g.s.gold=1000;g.s.skills.mice=true;
 assert.ok(g.place('ball',400,400));assert.ok(g.place('ball',600,400));const gold=g.s.gold;
 assert.equal(g.place('ball',800,400),false);assert.equal(g.s.gold,gold);
 assert.ok(g.place('box',200,500));assert.equal(g.playCount(),2);
 const t=g.s.rooms[0].toys.find(t=>t.kind==='ball');t.z=0;g.complete(g.s.cats[0],t);
 assert.equal(g.s.rooms[0].toys.filter(t=>t.kind==='mouse').length,2);assert.equal(g.playCount(),3);
 assert.equal(g.canPlaceToy(),false);g.addCat(0);assert.ok(g.canPlaceToy());
});
test('old crowded save loads without deleting toys or money; descendants can overflow purchase limit',()=>{
 const g=new Game();for(let i=0;i<40;i++)g.spawn('ball',400,400,0);g.s.version=4;g.s.skills.mice=true;
 const loaded=Game.load(g.save());assert.ok(loaded);assert.equal(loaded.playCount(),40);assert.equal(loaded.s.gold,g.s.gold);
 for(const t of [...loaded.s.rooms[0].toys]){t.z=0;loaded.complete(loaded.s.cats[0],t);}
 assert.equal(loaded.playCount(),80);assert.ok(Game.load(loaded.save()));
});
test('balance changes do not invalidate bounded old counters, payouts or timers',()=>{
 const g=new Game(),t=g.spawn('scratch',500,400,0);g.s.rooms[0].autoTimer=9.5;t.count=120;t.value=20;
 assert.ok(Game.load(g.save()));
 const box=g.spawn('box',300,400,0);g.beginFixture(g.s.cats[0],box);g.s.cats[0].fixture.elapsed=6;
 assert.ok(Game.load(g.save()));
 const tunnel=g.spawn('tunnel',600,400,0),c=g.s.cats[0];c.mode='tunnel';c.target=tunnel.id;
 c.transit={fromX:558,fromY:402,toX:642,toY:370,elapsed:1.5,duration:1.8};
 const re=Game.load(g.save());assert.ok(re);advance(re,.5);assert.equal(re.s.stats.tunnel,1);
});
test('malformed nested saves return null rather than throwing',()=>{
 for(const patch of [s=>s.rooms[0]=null,s=>s.cats[0]=null,s=>s.stats=null,s=>s.skills=null]){
  const s=new Game().s;patch(s);assert.equal(Game.load(JSON.stringify(s)),null);
 }
});
test('surf ride and frisbee pass move continuously and restore mid-animation',()=>{
 for(const kind of ['surf','frisbee']){const g=new Game(12),t=g.spawn(kind,450,400,0),c=g.s.cats[0];c.x=440;c.y=400;c.face=1;
 const before={x:t.x,y:t.y,cx:c.x};g.complete(c,t);assert.equal(t.x,before.x);assert.equal(c.x,before.cx);if(kind==='surf')assert.equal(g.s.stats.surf,0);
 advance(g,.3);const re=Game.load(g.save());assert.ok(re);let prev={x:t.x,y:t.y,cx:c.x,cy:c.y};
 for(let i=0;i<60;i++){g.step(1/60);re.step(1/60);assert.ok(Math.hypot(t.x-prev.x,t.y-prev.y)<7);assert.ok(Math.hypot(c.x-prev.cx,c.y-prev.cy)<7);prev={x:t.x,y:t.y,cx:c.x,cy:c.y};}
 assert.deepEqual(g.s,re.s);assert.ok(g.s.stats[kind]>=1);
 }
});
test('removed surf cannot pay a ghost reward',()=>{const g=new Game(),t=g.spawn('surf',500,400,0),c=g.s.cats[0];g.complete(c,t);g.s.rooms[0].toys=[];advance(g,2);assert.equal(g.s.stats.surf,0);assert.equal(g.s.earned,0);assert.notEqual(c.mode,'surf');});
test('rejected save is backed up before autosave can be enabled',()=>{
 const map=new Map([['game','broken']]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const s=readSession(storage,'game',()=>null);assert.equal(s.blocked,false);assert.equal(s.recovery,'broken');assert.equal(map.get('game-kurtarma'),'broken');assert.equal(map.get('game'),'broken');
});
test('failed or unverifiable backup disables overwriting the original save',()=>{
 for(const setItem of [()=>{throw Error('quota');},()=>{}]){const s=readSession({getItem:k=>k==='game'?'old':null,setItem},'game',()=>{throw Error('decoder');});
 assert.equal(s.blocked,true);assert.equal(s.recovery,'old');}
});
