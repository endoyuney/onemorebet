// Pure, serializable simulation. No DOM, timers, network or wall-clock dependence.
import {BALLS,stepBall,safeFloor,DOOR,FURNITURE,collideFurniture} from './physics.mjs';
import {ECONOMY as E,carePerMinute,houseLevel,toyPrice,tunnelEnds} from './economy.mjs';
export const W=900,H=600;
export const TOYS={ball:{name:'Tenis topu',icon:'🎾',cost:2,hint:'Başlangıç · kısa sekme · +3'},football:{name:'Futbol topu',icon:'⚽',cost:5,skill:'balls',hint:'İkinci top · uzun yuvarlanma · +7'},basketball:{name:'Basketbol',icon:'🏀',cost:10,skill:'basket',hint:'Üçüncü top · yüksek sekme · +13'},bed:{name:'Kedi yatağı',icon:'🛏️',cost:40,hint:'Kalıcı · uyku +2 · oda başına 2'},house:{name:'Kedi evi',icon:'🏠',cost:18,skill:'house',hint:'Kat ekle · devir · tünele dönüştür'},rod:{name:'Olta',icon:'🎣',cost:25,skill:'rod',hint:'Toplardan sonra · olta + tüy'},scratch:{name:'Tırmalama',icon:'🪵',cost:60,skill:'scratch',hint:'İleri oyuncak · tahta + sörf'}};
export const CATS=[['Misket','Meraklı','Toplara bayılır.',0],['Tarçın','Koşucu','Hareketli farelere yetişir.',1],['Zeytin','Pusucu','Oyuncağı izler, sonra atılır.',2],['Lokum','Oyuncu','Ev ve tünelleri keşfeder.',1],['Badem','Hızlı pati','Tırmalamayı biraz hızlı bitirir.',0],['Gece','Avcı','Kaçan tüylere meraklıdır.',2],['Boncuk','Meraklı','Her oyuncağa bir şans verir.',1],['Duman','Koşucu','Kalabalıkta bile topu bulur.',2]];
export const SKILLS=[
 {id:'mice',branch:0,name:'İçinden fare çıktı!',desc:'Her top 2 fare çıkarır. Fare ödülü tenis/futbol/basketbolda 1/2/3 altın.',cost:20,req:[],gate:s=>s.stats.ball>=10,need:'10 top yakala'},
 {id:'balls',branch:0,name:'Futbol vakti',desc:'5 altınlık futbol topu. Yakalama +7, dönüşüm fareleri +2.',cost:55,req:['mice'],gate:s=>s.stats.mouse>=10,need:'10 fare yakala'},
 {id:'basket',branch:0,name:'Yüksekten gelen',desc:'10 altınlık basketbol. Yakalama +13, dönüşüm fareleri +3.',cost:110,req:['balls'],gate:s=>s.stats.football>=12,need:'12 futbol topu yakala'},
 {id:'surprise',branch:0,name:'Sürpriz paket',desc:'Top: %50 iki fare, %25 üç paslık frizbi, %25 üç böcek. Ödül topun türüne bağlı.',cost:150,req:['basket'],gate:s=>s.stats.basketball>=8,need:'8 basketbol yakala'},
 {id:'rod',branch:0,name:'Tüyün peşinde',desc:'25 altınlık olta. 6 hamlede kırılır (+35), tüyü yakala (+8).',cost:200,req:['basket'],gate:s=>s.stats.basketball>=12,need:'12 basketbol yakala'},
 {id:'house',branch:1,name:'Karton mimarisi',desc:'18 altınlık kedi evi. Devrilme +22, 10 tünel geçişi +8. Üçüncü kediye yer açar.',cost:90,req:['balls'],gate:s=>s.cats.length>=2,need:'2 kedi edin'},
 {id:'floor2',branch:1,name:'İkinci kat',desc:'Mevcut evlere ikinci kat ekle. Yeni ev 32 altın. Dördüncü kediye yer aç.',cost:160,req:['house'],gate:s=>s.stats.house>=2,need:'2 ev devir'},
 {id:'floor3',branch:1,name:'Üçüncü kat',desc:'Mevcut evlere üçüncü kat ekle. Yeni ev 50 altın. Daha fazla eşzamanlı oyun.',cost:420,req:['floor2'],gate:s=>s.stats.tunnel>=20,need:'20 tünel geçişi'},
 {id:'scratch',branch:1,name:'Patiden sörfe',desc:'60 altınlık tahta: 25 tırmalama +78; sörfte üç tur, tur başına +6.',cost:500,req:['house','rod'],gate:s=>s.stats.feather>=5,need:'5 tüy yakala'},
 {id:'room',branch:2,name:'Yan odanın kapısı',desc:'Bitişik oda; toplam 6 kedi için yer. Kediler ve toplar açık kapıdan geçer.',cost:900,req:['floor2','rod'],gate:s=>s.stats.tunnel>=10&&s.stats.feather>=3,need:'10 tünel geçişi ve 3 tüy'},
 {id:'auto',branch:2,name:'Top yağmuru',desc:'Olta açıldıktan sonra eski topları otomatik at. Oda başına 9 sn; top ücreti ödenir.',cost:220,req:['rod'],gate:s=>s.cats.length>=3,need:'3 kedi edin'},
 {id:'crowd',branch:2,name:'Yer açın!',desc:'Oyuncak sınırı oda başına 24 → 40. Toplam 8 kediye yer aç.',cost:600,req:['room'],gate:s=>true,need:''}
];
export const ACHIEVEMENTS=[
 {id:'sleep',name:'Pati molası',desc:'Yatakta 5 uyku tamamla.',icon:'💤',test:s=>s.stats.naps>=5,progress:s=>[s.stats.naps,5]},
 {id:'first',name:'İlk pati',desc:'İlk topunu yakala.',icon:'🐾',test:s=>s.stats.ball>=1,progress:s=>[s.stats.ball,1]},
 {id:'mice',name:'Topun içindeki sır',desc:'10 oyuncak fare yakala.',icon:'🐁',test:s=>s.stats.mouse>=10,progress:s=>[s.stats.mouse,10]},
 {id:'tunnel',name:'Karton geçit',desc:'Tünellerden 30 kez geç.',icon:'📦',test:s=>s.stats.tunnel>=30,progress:s=>[s.stats.tunnel,30]},
 {id:'feather',name:'Oltadan kaçış',desc:'Kırılan oltalardan 3 tüy yakala.',icon:'🪶',test:s=>s.stats.feather>=3,progress:s=>[s.stats.feather,3]},
 {id:'surf',name:'Pati sörfü',desc:'Sörf tahtasında 3 tur tamamla.',icon:'🏄',test:s=>s.stats.surf>=3,progress:s=>[s.stats.surf,3]},
 {id:'family',name:'Ev kalabalıklaştı',desc:'6 kediyle tanış.',icon:'🐈',test:s=>s.cats.length>=6,progress:s=>[s.cats.length,6]},
 {id:'all',name:'Oyuncak ustası',desc:'Bütün keşifleri aç.',icon:'✦',test:s=>SKILLS.every(n=>s.skills[n.id]),progress:s=>[Object.keys(s.skills).length,SKILLS.length]},
 {id:'thousand',name:'Top diye bir şey kalmadı',desc:'1000 top yakala. Final sonrası hedef.',icon:'⚽',test:s=>s.stats.ball>=1000,progress:s=>[s.stats.ball,1000]}
];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class Game{
 constructor(seed=817263){this.events=[];this.s={version:3,rng:seed>>>0,nextId:1,time:0,gold:E.startGold,earned:0,careAcc:0,ledger:{opening:E.startGold,earned:0,toys:0,skills:0,cats:0,care:0},active:0,skills:{},cats:[],rooms:[{name:'Salon',toys:[],autoTimer:0}],stats:{ball:0,football:0,basketball:0,naps:0,bounces:0,doorPass:0,mouse:0,house:0,tunnel:0,rod:0,feather:0,scratch:0,surf:0,frisbee:0,bug:0},achievements:[],auto:false,freeAt:0,finished:false};this.addCat(0);}
 rand(){let t=this.s.rng+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);this.s.rng>>>=0;return((t^t>>>14)>>>0)/4294967296;}
 emit(e){this.events.push(e);if(this.events.length>150)this.events.shift();}
 drain(){return this.events.splice(0);}
 addCat(room){const index=this.s.cats.length;if(index>=CATS.length)return false;const cat={id:this.s.nextId++,index,room,x:180+this.rand()*540,y:210+this.rand()*220,tx:450,ty:300,target:null,mode:'idle',timer:.5+this.rand(),work:0,face:1,phase:this.rand()*6,plays:0,lastNap:-20,transit:null,tunnelSide:null};this.s.cats.push(cat);this.emit({type:'cat',text:CATS[index][0]+' eve geldi!',room});return cat;}
 catCost(){return E.catPrices[this.s.cats.length]??Infinity;}
 catLimit(){return this.s.skills.crowd?8:this.s.skills.room?6:this.s.skills.floor2?4:this.s.skills.house?3:2;}
 canAdopt(){return this.s.cats.length<this.catLimit()&&this.s.gold>=this.catCost();}
 spend(amount,bucket){if(amount>this.s.gold)return false;this.s.gold-=amount;this.s.ledger[bucket]+=amount;return true;}
 cost(kind){return toyPrice(kind,this.s.skills);}
 careRate(){return carePerMinute(this.s.cats.length);}
 adopt(){if(!this.canAdopt())return false;this.spend(this.catCost(),'cats');this.addCat(this.s.active);this.check();return true;}
 capacity(){return this.s.skills.crowd?40:24;}
 skillCost(id){const n=SKILLS.find(x=>x.id===id);if(!n)return Infinity;const level=id==='floor2'?2:id==='floor3'?3:0;return n.cost+(level?this.s.rooms.flatMap(r=>r.toys).filter(t=>t.kind==='house'&&t.level<level).reduce((sum,t)=>sum+E.houseCost[level]-E.houseCost[t.level],0):0);}
 canBuy(id){const n=SKILLS.find(x=>x.id===id);return !!n&&!this.s.skills[id]&&n.req.every(k=>this.s.skills[k])&&n.gate(this.s)&&this.s.gold>=this.skillCost(id);}
 buySkill(id){if(!this.canBuy(id))return false;const n=SKILLS.find(x=>x.id===id);this.spend(this.skillCost(id),'skills');this.s.skills[id]=true;
 if(id==='room')this.s.rooms.push({name:'Oyun odası',toys:[],autoTimer:0});
 if(id==='floor2'||id==='floor3'){const level=houseLevel(this.s.skills);for(let ri=0;ri<this.s.rooms.length;ri++)for(const t of this.s.rooms[ri].toys)if(t.kind==='house'&&t.level<level){t.buildFrom=t.level;t.buildProgress=0;t.level=level;this.emit({type:'build',room:ri,x:t.x,y:t.y,text:level+'. kat kuruluyor'});}}
 if(id==='auto')this.s.auto=true;this.emit({type:'skill',text:n.name+' açıldı!'});this.check();return true;}
 switchRoom(i){if(!this.s.rooms[i])return false;this.s.active=i;return true;}
 available(kind){return !!TOYS[kind]&&(!TOYS[kind].skill||this.s.skills[TOYS[kind].skill]);}
 place(kind,x,y,room=this.s.active,free=false){const r=this.s.rooms[room],cost=this.cost(kind);if(!r||!this.available(kind)||r.toys.length>=this.capacity()||(!free&&this.s.gold<cost))return false;if(kind==='bed'&&r.toys.filter(t=>t.kind==='bed').length>=2)return false;if(!free)this.spend(cost,'toys');this.spawn(kind,x,y,room);return true;}
 kickBall(id,dx=0,dy=0){const found=this.findToy(id);if(!found||!BALLS[found.toy.kind])return false;const t=found.toy;if(t.age<.25)return false;let d=Math.hypot(dx,dy);if(d<4){const a=this.rand()*Math.PI*2;dx=Math.cos(a)*260;dy=Math.sin(a)*260;d=260;}const speed=Math.min(440,Math.max(180,d));t.vx=dx/d*speed;t.vy=dy/d*speed;t.vz=BALLS[t.kind].launch;t.z=Math.max(8,t.z);t.age=0;for(const c of this.s.cats)if(c.target===id){c.mode='chase';c.work=0;}return true;}
 starterBall(x=450,y=300){if(this.s.time<this.s.freeAt)return false;if(!this.place('ball',x,y,this.s.active,true))return false;this.s.freeAt=this.s.time+E.freeBallSeconds;return true;}
 spawn(kind,x,y,room,extra={}){const r=this.s.rooms[room];if(r.toys.length>=this.capacity())return null;const angle=this.rand()*Math.PI*2,pos=safeFloor(['house','tunnel'].includes(kind)?clamp(x,105,795):x,['house','tunnel'].includes(kind)?clamp(y,180,500):y),level=kind==='house'?houseLevel(this.s.skills):1;
 const t={id:this.s.nextId++,kind,x:pos.x,y:pos.y,z:BALLS[kind]?22:0,vz:BALLS[kind]?.launch||0,vx:Math.cos(angle)*85,vy:Math.sin(angle)*85,age:0,count:0,level,buildFrom:level,buildProgress:1,value:1,done:false,phase:this.rand()*6,...extra};r.toys.push(t);return t;}
 reward(n,t,room,label){this.s.gold+=n;this.s.earned+=n;this.s.ledger.earned+=n;this.emit({type:'reward',amount:n,x:t.x,y:t.y,room,text:label});}
 complete(cat,t){const s=this.s,room=cat.room;if(t.kind==='tunnel'&&(cat.mode!=='tunnel'||!cat.transit||cat.transit.elapsed<cat.transit.duration))return false;if(t.kind==='house'&&t.buildProgress<1)return false;if(t.done||!s.rooms[room].toys.includes(t)||(BALLS[t.kind]&&t.z>18))return false;
 const retire=()=>{t.done=true;s.rooms[room].toys=s.rooms[room].toys.filter(x=>x.id!==t.id);};
 const transform=(kind,extra={})=>{const next=this.spawn(kind,t.x,t.y,room,{...extra,chain:(t.chain||0)+1});return next;};
 const pop=(n,label)=>this.reward(n,t,room,label);
 if(t.kind==='bed'){cat.mode='sleep';cat.timer=6;cat.work=0;cat.x=t.x;cat.y=t.y;return true;}
 if(BALLS[t.kind]){
  retire();s.stats.ball++;if(t.kind!=='ball')s.stats[t.kind]++;pop(E.ballPayout[t.kind],TOYS[t.kind].name+' yakalandı');
  if(s.skills.mice){let outcome=s.skills.surprise?this.rand():0;if(outcome<.5){transform('mouse',{vx:-110,value:E.chainValue[t.kind]});transform('mouse',{vx:110,value:E.chainValue[t.kind]});this.emit({type:'transform',text:'Top → iki fare!',room,x:t.x,y:t.y});}else if(outcome<.75){transform('frisbee',{value:E.chainValue[t.kind]});this.emit({type:'transform',text:'Top → frizbi!',room,x:t.x,y:t.y});}else{for(let i=0;i<3;i++)transform('bug',{value:E.chainValue[t.kind]});this.emit({type:'transform',text:'Top → üç zıpzıp!',room,x:t.x,y:t.y});}}
 }else if(['mouse','bug','feather'].includes(t.kind)){
  retire();s.stats[t.kind]++;pop(t.kind==='feather'?E.featherPayout:t.value,t.kind==='feather'?'Tüy yakalandı':t.kind==='mouse'?'Fare yakalandı':'Zıpzıp yakalandı');
 }else if(t.kind==='house'){
  t.count++;this.emit({type:'hit',room,x:t.x,y:t.y});if(t.count>=3+t.level){retire();s.stats.house++;pop(E.housePayout[t.level],'Kedi evi devrildi');transform('tunnel',{level:t.level,vx:0,vy:0});this.emit({type:'transform',text:'Kedi evi → tünel!',room,x:t.x,y:t.y});}
 }else if(t.kind==='tunnel'){
  t.count++;s.stats.tunnel++;cat.transit=null;cat.tunnelSide=null;this.emit({type:'pass',room,x:t.x,y:t.y,text:t.count+'/10 geçiş'});if(t.count>=10){retire();pop(E.tunnelPayout[t.level],'Tünel turu tamamlandı');}
 }else if(t.kind==='rod'){
  t.count++;if(t.count>=6){retire();s.stats.rod++;pop(E.rodPayout,'Olta kırıldı');transform('feather');this.emit({type:'transform',text:'Olta → kaçan tüy!',room,x:t.x,y:t.y});}
 }else if(t.kind==='scratch'){
  t.count+=cat.index===4?2:1;s.stats.scratch++;if(t.count>=25){retire();pop(E.scratchPayout,'Tahta parçalandı');transform('surf');this.emit({type:'transform',text:'Tahta → sörf!',room,x:t.x,y:t.y});}
 }else if(t.kind==='surf'){
  t.count++;s.stats.surf++;pop(E.surfPayout,'Bir tur pati sörfü');cat.x=clamp(cat.x+cat.face*130,55,W-55);if(t.count>=3)retire();else{t.x=cat.x;t.y=cat.y;}
 }else if(t.kind==='frisbee'){
  t.count++;s.stats.frisbee++;pop(t.value,'Frizbi pası');if(t.count>=3)retire();else{t.x=clamp(t.x+cat.face*180,65,W-65);t.y=clamp(t.y+(this.rand()-.5)*150,125,H-75);t.age=0;}
 }
 cat.plays++;cat.target=null;cat.mode='rest';cat.timer=.22+this.rand()*.5;cat.work=0;this.check();return true;}
 check(){const s=this.s;for(const a of ACHIEVEMENTS)if(!s.achievements.includes(a.id)&&a.test(s)){s.achievements.push(a.id);this.emit({type:'achievement',text:a.name});}
 if(!s.finished&&s.rooms.length===2&&s.cats.length>=6&&s.stats.tunnel>=20&&s.stats.feather>=1&&s.stats.surf>=3){s.finished=true;this.emit({type:'finish',text:'Her yer kedi!'});}}
 findToy(id){for(let room=0;room<this.s.rooms.length;room++){const toy=this.s.rooms[room].toys.find(t=>t.id===id);if(toy)return{toy,room};}return null;}
 target(cat){let best=null,score=Infinity;const localToys=this.s.rooms[cat.room].toys.filter(t=>t.kind!=='bed').length;
  for(let ri=0;ri<this.s.rooms.length;ri++)for(const t of this.s.rooms[ri].toys){
   if(t.kind==='house'&&t.buildProgress<1)continue;
   if(t.kind==='bed'&&(ri!==cat.room||this.s.time-cat.lastNap<18||cat.plays<6&&localToys>0))continue;
   const claims=this.s.cats.filter(c=>c.target===t.id).length,max=t.kind==='house'?t.level+1:['rod','scratch'].includes(t.kind)?2:1;if(claims>=max)continue;
   let d=Math.hypot(cat.x+cat.room*W-(t.x+ri*W),cat.y-t.y)+this.rand()*85;if(ri!==cat.room)d+=300;
   if(t.kind==='bed')d-=cat.plays>=6?1500:50;
   if(cat.index%3===1&&['mouse','bug','feather'].includes(t.kind))d*=.65;if(cat.index===3&&['house','tunnel'].includes(t.kind))d*=.65;
   if(d<score){best=t;score=d;}
  }return best;
 }
 moveCat(c,x,y,speed,dt){const d=Math.hypot(x-c.x,y-c.y);if(d>1){const move=Math.min(d,speed*dt);c.x+=(x-c.x)/d*move;c.y+=(y-c.y)/d*move;if(Math.abs(x-c.x)>2)c.face=x>c.x?1:-1;}}
 step(dt){if(!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.1);const s=this.s;s.time+=dt;s.careAcc+=this.careRate()*dt/60;if(s.careAcc>=1){const due=Math.floor(s.careAcc);s.careAcc-=due;const fee=Math.min(due,Math.max(0,Math.floor(s.gold-E.reserve)));if(fee){this.spend(fee,'care');this.emit({type:'care',amount:fee,text:'Mama + su',room:0});}}
 for(let ri=0;ri<s.rooms.length;ri++){const r=s.rooms[ri];if(s.skills.auto&&s.auto){r.autoTimer+=dt;if(r.autoTimer>=E.autoSeconds){r.autoTimer=0;const kind=['basketball','football','ball'].find(k=>this.available(k)&&s.gold>=this.cost(k)+E.reserve);if(kind&&r.toys.length<Math.min(12,this.capacity()))this.place(kind,100+this.rand()*700,210+this.rand()*290,ri);}}}
 const snapshot=s.rooms.flatMap((r,ri)=>r.toys.map(t=>({t,ri})));
 for(const {t,ri} of snapshot){t.age+=dt;t.buildProgress=Math.min(1,t.buildProgress+dt/0.75);t.phase+=dt*4;const held=s.cats.some(c=>c.room===ri&&c.target===t.id&&c.mode==='play');
  if(BALLS[t.kind]&&!held){const neighbor=t.vx>0?ri+1:ri-1,allow=!s.rooms[neighbor]||s.rooms[neighbor].toys.length<this.capacity();const out=stepBall(t,dt,ri,s.rooms.length,allow);
   if(out.bounced){s.stats.bounces++;this.emit({type:'bounce',room:out.room,x:t.x,y:t.y,kind:t.kind});}
   if(out.room!==ri){s.rooms[ri].toys=s.rooms[ri].toys.filter(x=>x.id!==t.id);s.rooms[out.room].toys.push(t);s.stats.doorPass++;this.emit({type:'door',room:out.room,text:'Top diğer odaya geçti!'});}
  }else if(['mouse','bug','feather','frisbee'].includes(t.kind)&&!held){
   if(t.age<9&&this.rand()<dt*.8){t.vx=(this.rand()-.5)*160;t.vy=(this.rand()-.5)*130;}else if(t.age>=9){t.vx*=Math.exp(-dt*2);t.vy*=Math.exp(-dt*2);}
   t.x+=t.vx*dt;t.y+=t.vy*dt;if(t.x<55||t.x>W-55)t.vx*=-1;if(t.y<190||t.y>H-65)t.vy*=-1;t.x=clamp(t.x,55,W-55);t.y=clamp(t.y,190,H-65);
  }
 }
 for(const c of s.cats){c.phase+=dt*9;const r=s.rooms[c.room];if(c.mode==='tunnel'){const found=this.findToy(c.target),tr=c.transit;if(!found||found.toy.kind!=='tunnel'||!tr){c.mode='idle';c.target=null;c.transit=null;continue;}tr.elapsed=Math.min(tr.duration,tr.elapsed+dt);const u=tr.elapsed/tr.duration;c.x=tr.fromX+(tr.toX-tr.fromX)*u;c.y=tr.fromY+(tr.toY-tr.fromY)*u;if(u>=1)this.complete(c,found.toy);continue;}if(c.mode==='sleep'){c.timer-=dt;if(c.timer<=0){const bed=this.findToy(c.target);if(bed?.toy.kind==='bed'){this.reward(E.napPayout,bed.toy,c.room,'Güzel bir pati uykusu');s.stats.naps++;}c.lastNap=s.time;c.plays=0;c.target=null;c.mode='rest';c.timer=.6;this.check();}continue;}if(c.mode==='rest'){c.timer-=dt;if(c.timer<=0)c.mode='idle';continue;}
  let found=this.findToy(c.target),t=found?.toy;
  if(!t){c.target=null;c.work=0;c.tunnelSide=null;c.timer-=dt;if(c.timer<=0){t=this.target(c);if(t){c.target=t.id;c.mode='notice';c.timer=(c.index%3===2?.45:.16)+this.rand()*.2;}else{c.mode='wander';c.tx=80+this.rand()*740;c.ty=135+this.rand()*370;c.timer=2+this.rand()*3;}}}
  if(t){const roomOf=this.findToy(t.id).room;if(roomOf!==c.room){c.mode='chase';c.work=0;const right=roomOf>c.room,wx=right?W-48:48;this.moveCat(c,wx,DOOR.y,155,dt);if(Math.abs(c.x-wx)<20&&Math.abs(c.y-DOOR.y)<20){c.room+=right?1:-1;c.x=right?55:W-55;c.y=DOOR.y;s.stats.doorPass++;}continue;}if(c.mode==='notice'){c.timer-=dt;if(c.timer<=0)c.mode='chase';continue;}
   if(t.kind==='house'&&t.buildProgress<1){c.mode='watch';continue;}
   if(t.kind==='tunnel'){const ends=tunnelEnds(t);if(c.tunnelSide===null)c.tunnelSide=distance(c,ends[0])<=distance(c,ends[1])?0:1;const start=ends[c.tunnelSide],end=ends[1-c.tunnelSide];c.mode='chase';this.moveCat(c,start.x,start.y,155,dt);if(distance(c,start)<2){c.mode='tunnel';c.face=end.x>start.x?1:-1;c.transit={fromX:c.x,fromY:c.y,toX:end.x,toY:end.y,elapsed:0,duration:1.4};}continue;}
   const d=distance(c,t),radius=['house','tunnel','rod','scratch','surf'].includes(t.kind)?37:t.kind==='bed'?12:23;
   if(d>radius+5){c.mode='chase';const speed=c.index%3===1?190:155;const move=Math.min(d-radius,speed*dt);c.x+=(t.x-c.x)/d*move;c.y+=(t.y-c.y)/d*move;if(Math.abs(t.x-c.x)>2)c.face=t.x>c.x?1:-1;c.work=0;}
   else if(BALLS[t.kind]&&t.z>18){c.mode='watch';c.work=0;}else{c.mode='play';c.work+=dt;const duration=t.kind==='scratch'?.18:t.kind==='tunnel'?.48:t.kind==='house'?.6:t.kind==='rod'?.48:.22;if(c.work>=duration)this.complete(c,t);}
  }else if(c.mode==='wander'){const d=Math.hypot(c.tx-c.x,c.ty-c.y);if(d>5){const move=Math.min(d,30*dt);c.x+=(c.tx-c.x)/d*move;c.y+=(c.ty-c.y)/d*move;c.face=c.tx>c.x?1:-1;}else c.mode='idle';}
 }
 // Mild separation for readability; no physics solver or cross-room interaction.
 for(let i=0;i<s.cats.length;i++)for(let j=i+1;j<s.cats.length;j++){const a=s.cats[i],b=s.cats[j];if(a.room!==b.room||['sleep','tunnel'].includes(a.mode)||['sleep','tunnel'].includes(b.mode))continue;const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d>0&&d<29){const f=(29-d)*dt*1.6;a.x+=dx/d*f;b.x-=dx/d*f;a.y+=dy/d*f;b.y-=dy/d*f;}}
 for(const c of s.cats){if(['sleep','tunnel'].includes(c.mode))continue;const p={x:c.x,y:c.y,z:0,vx:0,vy:0};for(const rect of FURNITURE)collideFurniture(p,rect,24);c.x=clamp(p.x,48,W-48);c.y=clamp(p.y,110,H-65);}
 }
 save(){return JSON.stringify(this.s);}
 static load(text){let s;try{s=JSON.parse(text);}catch{return null;}if(!s||![1,2,3].includes(s.version)||!Array.isArray(s.rooms)||s.rooms.length<1||s.rooms.length>2||!Array.isArray(s.cats)||s.cats.length<1||s.cats.length>8)return null;
 // Migrate the existing save in place; no currency reset or retroactive airborne toys.
 if(s.version===1){if(!s.stats||!s.rooms.every(r=>r&&Array.isArray(r.toys)&&r.toys.every(t=>t&&typeof t==='object'))||!s.cats.every(c=>c&&typeof c==='object'))return null;s.version=2;Object.assign(s.stats,{football:0,basketball:0,naps:0,bounces:0,doorPass:0});for(const c of s.cats){c.plays=0;c.lastNap=s.time-20;}for(const r of s.rooms)for(const t of r.toys){t.z=0;t.vz=0;}s.rooms[0].name='Salon';if(s.rooms[1])s.rooms[1].name='Oyun odası';}
 if(s.version===2){if(!s.rooms.every(r=>r&&Array.isArray(r.toys)&&r.toys.every(t=>t&&typeof t==='object'))||!s.cats.every(c=>c&&typeof c==='object')||!s.skills||typeof s.skills!=='object')return null;s.version=3;s.careAcc=0;s.ledger={opening:s.gold,earned:0,toys:0,skills:0,cats:0,care:0};if(s.skills.balls)s.skills.basket=true;
 // Preserve previously earned unlocks under the new dependency graph.
 let changed=true;while(changed){changed=false;for(const n of SKILLS)if(s.skills[n.id])for(const req of n.req)if(!s.skills[req]){s.skills[req]=true;changed=true;}}
 for(const c of s.cats){c.transit=null;c.tunnelSide=null;}
 for(const r of s.rooms)for(const t of r.toys){t.buildFrom=t.level;t.buildProgress=1;t.value=1;}
 }
 const finite=(v,a,b)=>Number.isFinite(v)&&v>=a&&v<=b;
 if(!finite(s.careAcc,0,1)||!s.ledger||['opening','earned','toys','skills','cats','care'].some(k=>!finite(s.ledger[k],0,1e12)))return null;
 if(!finite(s.gold,0,1e12)||!finite(s.time,0,1e10)||!finite(s.earned,0,1e12)||!Number.isInteger(s.rng)||!finite(s.nextId,1,1e12)||!Number.isInteger(s.active)||!s.rooms[s.active])return null;
 if(!s.skills||typeof s.skills!=='object'||Object.keys(s.skills).some(k=>!SKILLS.some(n=>n.id===k)||s.skills[k]!==true))return null;
 if(SKILLS.some(n=>s.skills[n.id]&&!n.req.every(k=>s.skills[k]))||(s.rooms.length===2)!==!!s.skills.room)return null;
 if(!s.stats||Object.keys(new Game(1).s.stats).some(k=>!finite(s.stats[k],0,1e12))||!Array.isArray(s.achievements)||s.achievements.some(k=>!ACHIEVEMENTS.some(a=>a.id===k))||!finite(s.freeAt,0,1e10))return null;
 const ids=new Set(),validId=id=>Number.isInteger(id)&&id>0&&id<s.nextId&&!ids.has(id)&&(ids.add(id),true);
 const kinds=['football','basketball','bed','ball','mouse','bug','feather','frisbee','house','tunnel','rod','scratch','surf'];
 for(const r of s.rooms){if(!r||!Array.isArray(r.toys)||r.toys.length>40||!finite(r.autoTimer,0,E.autoSeconds))return null;for(const t of r.toys)if(!t||!validId(t.id)||!kinds.includes(t.kind)||!finite(t.x,0,W)||!finite(t.y,0,H)||!finite(t.vx,-1000,1000)||!finite(t.vy,-1000,1000)||!finite(t.z,0,1000)||!finite(t.vz,-1000,1000)||!finite(t.age,0,1e10)||!finite(t.count,0,100)||!finite(t.level,1,3)||!finite(t.phase,0,1e12)||!finite(t.value,1,3)||!finite(t.buildFrom,1,3)||!finite(t.buildProgress,0,1)||t.done)return null;}
 for(let i=0;i<s.cats.length;i++){const c=s.cats[i];if(!c||!validId(c.id)||c.index!==i||!s.rooms[c.room]||!finite(c.x,0,W)||!finite(c.y,0,H)||!finite(c.timer,-1e10,1e10)||!finite(c.plays,0,1e12)||!finite(c.lastNap,-1e10,1e10)||!finite(c.work,0,10)||!finite(c.tx,0,W)||!finite(c.ty,0,H)||!finite(c.phase,0,1e12)||![1,-1].includes(c.face)||!['idle','wander','notice','chase','play','rest','watch','sleep','tunnel'].includes(c.mode)||![null,0,1].includes(c.tunnelSide))return null;if(c.mode==='tunnel'){const tr=c.transit;if(!tr||!finite(tr.elapsed,0,1.4)||tr.duration!==1.4||!finite(tr.fromX,0,W)||!finite(tr.toX,0,W)||!finite(tr.fromY,0,H)||!finite(tr.toY,0,H)||!s.rooms[c.room].toys.some(t=>t.id===c.target&&t.kind==='tunnel'))return null;}}
 const g=new Game(1);g.s=s;g.events=[];return g;}
}
