import {Game,SKILLS} from '../dist/engine.mjs';
function sweep(Game,SKILLS){
 const rows=[];
 for(const seed of [11,22,33])for(const box of [false,true]){
 const g=new Game(seed);g.s.gold=100000;g.s.ledger.opening=100000;g.addCat(0);for(const id of ['mice','balls','basket','rod'])g.s.skills[id]=true;
 if(box)g.place('box',220,500);let opening=null;
 for(let frame=0;frame<60*360;frame++){if(frame%72===0&&g.s.rooms[0].toys.filter(t=>!['box','bed','swing'].includes(t.kind)).length<3)g.place('rod',300+(frame%500),240+(frame%160));
 g.step(1/60);g.drain();if(frame===60*60-1)opening={gold:g.s.gold,visits:g.s.stats.boxVisits};}
 rows.push({seed,box,netPerMinute:(g.s.gold-opening.gold)/5,visits:g.s.stats.boxVisits-opening.visits});}
 return rows;
}
console.log(JSON.stringify(sweep(Game,SKILLS),null,2));
