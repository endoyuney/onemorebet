import assert from 'node:assert/strict';
import {Game,SKILLS} from '../dist/engine.mjs';
const order=['mice','balls','house','floor2','room','rod','scratch','auto','surprise','floor3','crowd'];
for(const seed of [11,22,33,44,55]){
 const g=new Game(seed);let elapsed=0,firstMice=null,secondRoom=null;
 // Player strategy uses only normal purchases and free ball, no injected gold/skills.
 for(let frame=0;frame<60*1200&&!g.s.finished;frame++){
  if(frame%45===0){
   if((g.s.cats.length<2||g.s.skills.house&&g.s.cats.length<3||g.s.skills.scratch&&g.s.cats.length<6)&&g.s.gold>=g.catCost())g.adopt();
   const next=order.find(id=>!g.s.skills[id]);if(next&&g.canBuy(next))g.buySkill(next);
   for(let room=0;room<g.s.rooms.length;room++){
    g.switchRoom(room);const toys=g.s.rooms[room].toys;if(toys.length<5){
     let kind='ball';
     if(g.s.skills.house&&g.s.stats.tunnel<20&&!toys.some(t=>['house','tunnel'].includes(t.kind)))kind='house';
     if(g.s.skills.rod&&g.s.stats.feather<1&&!toys.some(t=>['rod','feather'].includes(t.kind)))kind='rod';
     if(g.s.skills.scratch&&g.s.stats.surf<3&&!toys.some(t=>['scratch','surf'].includes(t.kind)))kind='scratch';
     g.place(kind,180+(frame%550),220+(frame%200));g.starterBall(380,350);
    }
   }
  }
  g.step(1/60);g.drain();elapsed=g.s.time;if(firstMice===null&&g.s.skills.mice)firstMice=elapsed;if(secondRoom===null&&g.s.rooms.length===2)secondRoom=elapsed;
  assert.ok(Number.isFinite(g.s.gold)&&g.s.gold>=0);
 }
 assert.ok(g.s.finished,`seed ${seed} failed: ${JSON.stringify({gold:g.s.gold,skills:g.s.skills,stats:g.s.stats,cats:g.s.cats.length})}`);
 assert.ok(Game.load(g.save()));
 console.log(JSON.stringify({seed,simulatedSeconds:Math.round(elapsed),firstMice:Math.round(firstMice),secondRoom:Math.round(secondRoom),gold:g.s.gold,cats:g.s.cats.length,stats:g.s.stats}));
}
