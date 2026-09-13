import assert from 'node:assert/strict';
import {Game} from '../dist/engine.mjs';
const order=['mice','balls','house','basket','rod','floor2','auto','scratch','room','floor3','surprise','crowd'];
const rows=[];
for(const seed of [11,22,33,44,55]){
 const g=new Game(seed),milestones={};let dry=0,maxGold=0;
 for(let frame=0;frame<60*3600&&!g.s.finished;frame++){
  if(frame%72===0){
   const desired=g.s.skills.room?6:g.s.skills.floor2?4:g.s.skills.house?3:2;
   if(g.s.cats.length<desired&&g.canAdopt())g.adopt();
   const next=order.find(id=>!g.s.skills[id]);if(next&&g.canBuy(next))g.buySkill(next);
   for(let room=0;room<g.s.rooms.length;room++){
    g.switchRoom(room);const toys=g.s.rooms[room].toys;
    if(toys.length<Math.min(7,g.s.cats.length+2)){
     let kind=g.available('rod')?'rod':g.available('basketball')?'basketball':g.available('football')?'football':'ball';
     if(g.s.skills.house&&(g.s.stats.house<2||g.s.stats.tunnel<20)&&!toys.some(t=>['house','tunnel'].includes(t.kind)))kind='house';
     if(g.s.skills.rod&&g.s.stats.feather<5&&!toys.some(t=>['rod','feather'].includes(t.kind)))kind='rod';
     if(g.s.skills.scratch&&g.s.stats.surf<3&&!toys.some(t=>['scratch','surf'].includes(t.kind)))kind='scratch';
     if(!g.place(kind,200+(frame%500),240+(frame%160)))g.place('ball',420,350);
     if(g.s.gold<4)g.starterBall(380,350);
    }
   }
  }
  g.step(1/60);g.drain();for(const id of order)if(g.s.skills[id]&&milestones[id]===undefined)milestones[id]=Math.round(g.s.time);
  if(g.s.rooms.every(r=>r.toys.length===0))dry+=1/60;maxGold=Math.max(maxGold,g.s.gold);
  assert.ok(Number.isFinite(g.s.gold)&&g.s.gold>=0);
  const l=g.s.ledger;assert.equal(g.s.gold,l.opening+l.earned-l.toys-l.skills-l.cats-l.care);
 }
 assert.ok(g.s.finished,`seed ${seed} stalled: ${JSON.stringify({gold:g.s.gold,skills:g.s.skills,stats:g.s.stats,cats:g.s.cats.length,toys:g.s.rooms.map(r=>r.toys.map(t=>[t.kind,t.count,t.x,t.y])),modes:g.s.cats.map(c=>[c.mode,c.target,c.x,c.y])})}`);
 assert.ok(Game.load(g.save()));
 const row={seed,seconds:Math.round(g.s.time),milestones,gold:g.s.gold,maxGold,cats:g.s.cats.length,drySeconds:Math.round(dry),ledger:g.s.ledger};rows.push(row);console.log(JSON.stringify(row));
}
