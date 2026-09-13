import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,SKILLS} from '../dist/engine.mjs';
import {tunnelEnds} from '../dist/economy.mjs';
const advance=(g,n)=>{for(let i=0;i<Math.round(n*60);i++)g.step(1/60);};
// Explicit fixtures isolate the rule under test. Full progression uses no injected money.
function grant(g,id){const n=SKILLS.find(n=>n.id===id);for(const req of n.req)grant(g,req);g.s.skills[id]=true;}
function fund(g,n){g.s.gold=n;g.s.ledger.opening=n;}
function tunnelFixture(){const g=new Game(42),t=g.spawn('tunnel',450,350,0),c=g.s.cats[0],entry=tunnelEnds(t)[0];Object.assign(c,{x:entry.x,y:entry.y,target:t.id,mode:'chase'});return{g,t,c};}
test('toy progression requires each ball tier before the wand, even with abundant cash',()=>{
 const g=new Game();fund(g,10000);grant(g,'balls');assert.equal(g.available('basketball'),undefined);assert.equal(g.buySkill('rod'),false);assert.equal(g.buySkill('basket'),false);
 g.s.stats.football=12;assert.ok(g.buySkill('basket'));assert.equal(g.buySkill('rod'),false);g.s.stats.basketball=12;assert.ok(g.buySkill('rod'));
 assert.deepEqual(['ball','football','basketball','rod','scratch'].map(k=>g.cost(k)),[2,5,10,25,60]);
});
test('cat adoption requires home capacity as well as increasing gold prices',()=>{
 const g=new Game();fund(g,10000);assert.equal(g.catCost(),35);assert.ok(g.adopt());assert.equal(g.catCost(),140);const gold=g.s.gold;assert.equal(g.adopt(),false);assert.equal(g.s.gold,gold);
 grant(g,'house');assert.ok(g.adopt());assert.equal(g.adopt(),false);grant(g,'floor2');assert.ok(g.adopt());assert.equal(g.catLimit(),4);assert.equal(g.adopt(),false);
});
test('buying a floor upgrades existing houses and charges their construction difference',()=>{
 const g=new Game();fund(g,1000);grant(g,'house');g.s.stats.house=2;assert.ok(g.place('house',450,350));const t=g.s.rooms[0].toys[0];assert.equal(t.level,1);assert.equal(g.skillCost('floor2'),174);
 assert.ok(g.buySkill('floor2'));assert.equal(g.s.gold,808);assert.equal(t.level,2);assert.equal(t.buildProgress,0);assert.equal(g.cost('house'),32);assert.equal(g.complete(g.s.cats[0],t),false);
 const re=Game.load(g.save());assert.ok(re);advance(g,.8);advance(re,.8);assert.deepEqual(g.s,re.s);assert.equal(t.buildProgress,1);
 g.s.stats.tunnel=20;assert.equal(g.skillCost('floor3'),438);assert.ok(g.buySkill('floor3'));assert.equal(t.level,3);assert.equal(g.cost('house'),50);
});
test('tunnel advances continuously, counts only the exit and resumes mid-transit exactly',()=>{
 const {g,t,c}=tunnelFixture();assert.equal(g.complete(c,t),false);g.step(1/60);assert.equal(c.mode,'tunnel');assert.equal(t.count,0);const start=c.x;advance(g,.5);assert.ok(c.x>start&&c.x<tunnelEnds(t)[1].x);assert.equal(t.count,0);
 const re=Game.load(g.save());assert.ok(re);let previous={x:c.x,y:c.y};for(let i=0;i<60;i++){g.step(1/60);re.step(1/60);assert.ok(Math.hypot(c.x-previous.x,c.y-previous.y)<4);previous={x:c.x,y:c.y};}
 assert.deepEqual(g.s,re.s);assert.equal(t.count,1);assert.equal(g.s.stats.tunnel,1);assert.equal(g.s.ledger.earned,0);
});
test('removed tunnel cancels an in-flight interaction without a ghost payout',()=>{
 const {g,c}=tunnelFixture();g.step(1/60);g.s.rooms[0].toys=[];advance(g,2);assert.notEqual(c.mode,'tunnel');assert.equal(g.s.stats.tunnel,0);assert.equal(g.s.ledger.earned,0);
});
test('automatic care scales with cat count and preserves four gold without debt',()=>{
 const g=new Game();fund(g,100);for(let i=1;i<6;i++)g.addCat(0);assert.equal(g.careRate(),21);advance(g,60.1);assert.equal(g.s.ledger.care,21);assert.equal(g.s.gold,79);
 g.s.gold=5;advance(g,120);assert.equal(g.s.gold,4);const paid=g.s.ledger.care;advance(g,120);assert.equal(g.s.ledger.care,paid);assert.ok(g.s.careAcc<1);
 g.s.gold=20;advance(g,.5);assert.ok(g.s.gold>=19,'past unpaid care must not become debt');
});
test('care timer and the ninth automation second survive save/load',()=>{
 const g=new Game();grant(g,'auto');g.s.auto=true;g.s.rooms[0].autoTimer=8.5;g.s.careAcc=.9;fund(g,100);const re=Game.load(g.save());assert.ok(re);advance(g,2);advance(re,2);assert.deepEqual(g.s,re.s);assert.equal(g.s.ledger.toys,10);
});
test('v2 migration preserves money, cats, old unlocks and is deterministic on the next load',()=>{
 const old=new Game().s;old.version=2;old.gold=765;old.skills={mice:true,balls:true,house:true,room:true,auto:true};old.rooms.push({name:'Oyun odası',toys:[],autoTimer:0});delete old.careAcc;delete old.ledger;
 for(const c of old.cats){delete c.transit;delete c.tunnelSide;}
 const g=Game.load(JSON.stringify(old));assert.ok(g);assert.equal(g.s.gold,765);assert.equal(g.s.cats.length,old.cats.length);assert.ok(g.available('basketball'));assert.ok(g.s.skills.room);assert.ok(g.s.skills.rod);assert.equal(g.s.ledger.opening,765);
 const re=Game.load(g.save());assert.ok(re);advance(g,3);advance(re,3);assert.deepEqual(g.s,re.s);
});
