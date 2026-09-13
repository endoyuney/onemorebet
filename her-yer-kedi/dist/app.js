import {Game,TOYS,CATS,SKILLS,ACHIEVEMENTS,W,H} from './engine.mjs';
import {BALLS,DOOR} from './physics.mjs';
import {ECONOMY as E} from './economy.mjs';
import {Camera} from './camera.mjs';
import {CROPS} from './atlas.mjs';
const $=id=>document.getElementById(id),KEY='her-yer-kedi-v1';
let game=new Game(),loadError=false;try{const raw=localStorage.getItem(KEY);if(raw){const saved=Game.load(raw);if(saved)game=saved;else loadError=true;}}catch{loadError=true;}
let selected='ball',paused=false,muted=true,modalKind='',effects=[],last=performance.now(),acc=0,uiTimer=0,audio=null,frame=0,lastSound=0,roomKey='';
const canvas=$('game'),ctx=canvas.getContext('2d'),atlas=new Image(),props=new Image(),roomArt=new Image(),camera=new Camera();
atlas.src='assets/cats.png';props.src='assets/props.png';roomArt.src='assets/room.png';camera.focus(game.s.active);
const icon={...Object.fromEntries(Object.entries(TOYS).map(([k,v])=>[k,v.icon])),mouse:'🐁',bug:'🪲',feather:'🪶',frisbee:'🥏',tunnel:'📦',surf:'🏄'};
const propIndex={ball:0,football:1,basketball:2,bed:3,house:4,rod:5,scratch:6,tunnel:7};
const fmt=n=>Math.floor(n).toLocaleString('tr-TR');
function toast(message,gold=false){const d=document.createElement('div');d.className='toast'+(gold?' gold':'');d.textContent=message;$('toasts').append(d);setTimeout(()=>d.remove(),4200);}
function save(){try{localStorage.setItem(KEY,game.save());$('saveStatus').textContent='İlerleme bu tarayıcıda kaydedilir.';}catch{$('saveStatus').textContent='Kayıt kullanılamıyor; bu oturum geçici.';}}
function sound(type){if(muted)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();if(audio.currentTime-lastSound<.07)return;lastSound=audio.currentTime;const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);osc.type='sine';const t=audio.currentTime,freq=type==='bounce'?120:type==='transform'?440:type==='place'?240:700;osc.frequency.setValueAtTime(freq,t);osc.frequency.exponentialRampToValueAtTime(type==='bounce'?70:type==='transform'?900:type==='place'?150:1050,t+.1);gain.gain.setValueAtTime(type==='bounce'?.018:.035,t);gain.gain.exponentialRampToValueAtTime(.001,t+.15);osc.start();osc.stop(t+.16);}catch{muted=true;}}
function fitHouse(){const r=canvas.getBoundingClientRect();camera.fit(game.s.rooms.length,r.width,r.height);}
let knownRooms=game.s.rooms.length;
function consume(){for(const e of game.drain()){
 if(['reward','transform','pass','hit','bounce','build'].includes(e.type)){effects.push({...e,life:e.type==='transform'?2:1.3,total:e.type==='transform'?2:1.3});if(e.type==='reward'){sound('reward');$('events').textContent=e.text+' · +'+e.amount+' altın';}if(e.type==='transform'){sound('transform');$('events').textContent=e.text;}if(e.type==='bounce')sound('bounce');}
 if(e.type==='achievement')toast('🏅 Başarım: '+e.text,true);
 if(e.type==='cat'||e.type==='skill')toast(e.text);
 if(e.type==='care')$('careTotal').textContent='Toplam bakım: −'+fmt(game.s.ledger.care)+' altın';
 if(e.type==='door')$('events').textContent=e.text;
 if(e.type==='finish'){save();openModal('finish');}
 }if(effects.length>90)effects=effects.slice(-90);if(game.s.rooms.length>knownRooms){knownRooms=game.s.rooms.length;fitHouse();}}
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);}
new ResizeObserver(resize).observe($('stage'));
function pointer(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function world(p){const r=canvas.getBoundingClientRect();return camera.world(p.x,p.y,r.width,r.height);}
function ballAt(p){const ri=Math.floor(p.x/W),r=game.s.rooms[ri];return r?.toys.filter(t=>BALLS[t.kind]).findLast(t=>Math.hypot(t.x+ri*W-p.x,t.y-t.z*.45-p.y)<24);}
function place(x,y,room=game.s.active){if(paused||$('modal').open)return;if(!game.s.rooms[room]||x<35||x>W-35||y<110||y>H-65){toast('Oyuncağı odanın zeminine bırak.');return;}game.switchRoom(room);if(!game.place(selected,x,y)){const toys=game.s.rooms[room].toys;toast(selected==='bed'&&toys.filter(t=>t.kind==='bed').length>=2?'Bu odada iki yatak var. Diğer oyuncaklara da yer kalsın.':toys.length>=game.capacity()?'Oda dolu. Kediler birkaç oyuncağı bitirsin.':'Altın yetmiyor. Ücretsiz topu kullanabilirsin.');return;}effects.push({type:'place',x,y,room,life:.45,total:.45});sound('place');updateUI();save();}
const pointers=new Map();let gesture=null,pinch=null;
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);const p=pointer(e);pointers.set(e.pointerId,p);if(pointers.size===1){const w=world(p);gesture={start:p,last:p,world:w,ball:ballAt(w)?.id,drag:false,cancel:false};}else{if(gesture)gesture.cancel=true;const [a,b]=[...pointers.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),mid:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}};}});
canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const p=pointer(e);pointers.set(e.pointerId,p);const r=canvas.getBoundingClientRect();if(pointers.size>1){const [a,b]=[...pointers.values()],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinch&&pinch.distance>0){camera.pan(mid.x-pinch.mid.x,mid.y-pinch.mid.y,r.width,r.height,game.s.rooms.length);camera.zoomAt(distance/pinch.distance,mid.x,mid.y,r.width,r.height,game.s.rooms.length);}pinch={distance,mid};return;}if(!gesture||gesture.cancel)return;if(Math.hypot(p.x-gesture.start.x,p.y-gesture.start.y)>6)gesture.drag=true;if(gesture.drag&&!gesture.ball)camera.pan(p.x-gesture.last.x,p.y-gesture.last.y,r.width,r.height,game.s.rooms.length);gesture.last=p;});
canvas.addEventListener('pointerup',e=>{const p=pointer(e),g=gesture;pointers.delete(e.pointerId);if(!pointers.size){gesture=null;pinch=null;}if(!g||g.cancel||paused||$('modal').open)return;const w=world(p);if(g.ball){if(game.kickBall(g.ball,(w.x-g.world.x)*5,(w.y-g.world.y)*5)){sound('place');save();}return;}if(!g.drag){const room=Math.floor(w.x/W);place(w.x-room*W,w.y,room);}});
canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);gesture=null;pinch=null;});
canvas.addEventListener('wheel',e=>{e.preventDefault();const r=canvas.getBoundingClientRect(),p=pointer(e);camera.zoomAt(Math.exp(-e.deltaY*.0015),p.x,p.y,r.width,r.height,game.s.rooms.length);},{passive:false});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('keydown',e=>{if($('modal').open||/INPUT|BUTTON|TEXTAREA/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();place(130+Math.random()*640,180+Math.random()*310);}const keys={Digit1:'ball',Digit2:'football',Digit3:'basketball',Digit4:'bed',Digit5:'house',Digit6:'rod',Digit7:'scratch'};if(keys[e.code]&&game.available(keys[e.code])){selected=keys[e.code];updateUI();}if(e.code==='KeyH')fitHouse();});
function rounded(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
function text(t,x,y,size=15,color='#274a5a',align='center'){ctx.font=`600 ${size}px "Segoe UI",system-ui,sans-serif`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(t,x,y);}
function cropDraw(context,img,crop,width,bottom=5){const [x,y,r,b]=crop,h=width*(b-y)/(r-x);context.drawImage(img,x,y,r-x,b-y,-width/2,bottom-h,width,h);}
function drawCat(c,context=ctx,size=66){const cc=context,transit=c.mode==='tunnel'?c.transit:null,sleep=c.mode==='sleep',moving=['chase','wander','tunnel'].includes(c.mode),play=c.mode==='play';
 cc.save();if(transit){const u=transit.elapsed/transit.duration;cc.globalAlpha=u<.23?1-u/.23:u>.74?(u-.74)/.26:0;if(cc.globalAlpha<=0){cc.restore();return;}}cc.imageSmoothingEnabled=false;cc.translate(c.x,c.y);cc.fillStyle='#30261322';cc.beginPath();cc.ellipse(0,7,size*.34,7,0,0,Math.PI*2);cc.fill();cc.translate(0,sleep?0:moving?-Math.abs(Math.sin(c.phase))*2:play?Math.sin(c.phase)*1.5:0);cc.scale(c.face,transit?.78:1);
 if(sleep)cc.scale(1,1+Math.sin(c.phase*.2)*.016);else if(play)cc.rotate(Math.sin(c.phase)*.035);
 if(atlas.complete&&atlas.naturalWidth){const row=sleep?2:moving&&Math.sin(c.phase)>0?1:0;cropDraw(cc,atlas,CROPS.cats[row*3+CATS[c.index][3]].rect,size,sleep?2:7);}else{cc.font='35px serif';cc.textAlign='center';cc.fillText('🐈',0,0);}cc.restore();
 if(context===ctx){if(c.mode==='notice')text('!',c.x+22,c.y-47,17,'#bd8b23');if(sleep)text('z',c.x+25,c.y-31-Math.sin(c.phase*.3)*3,13,'#4f6d73');}}
function drawHouse(t){
 // Reuse the original textured cardboard module at a fixed width, stacking real floors.
 const width=65,unitRise=39,p=t.buildProgress??1,from=t.buildFrom??t.level;
 for(let i=0;i<t.level;i++){const fresh=i>=from&&p<1;ctx.save();if(fresh)ctx.globalAlpha=p;const y=10-i*unitRise-(fresh?(1-p)*22:0);cropDraw(ctx,props,[102,672,308,895],width,y);ctx.restore();}
 const visibleLevel=from+(t.level-from)*p,top=10-(visibleLevel-1)*unitRise-65;cropDraw(ctx,props,[127,552,305,627],58,top+6);
}
function drawCareStation(){const count=game.s.cats.length,scale=.78+count*.065;ctx.save();ctx.translate(782,124);ctx.scale(scale,scale);
 ctx.fillStyle='#382e2322';ctx.beginPath();ctx.ellipse(0,7,64,15,0,0,Math.PI*2);ctx.fill();
 for(const [x,color,food]of [[-32,'#b88558',true],[32,'#739dad',false]]){ctx.fillStyle='#554d43';ctx.fillRect(x-16,-56,32,43);ctx.fillStyle=food?'#cbb597':'#b2c8c8';ctx.fillRect(x-13,-52,26,36);ctx.fillStyle=color;ctx.fillRect(x-10,-29-count*2,20,25+count*2);ctx.fillStyle='#6c6559';ctx.fillRect(x-20,-17,40,19);ctx.fillStyle='#b2ada0';ctx.beginPath();ctx.ellipse(x,0,27,13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,-2,22,9,0,0,Math.PI*2);ctx.fill();if(food){ctx.fillStyle='#745135';for(let i=0;i<12;i++)ctx.fillRect(x-15+(i*11%30),-7+(i*7%12),3,3);}else{ctx.strokeStyle='#d8eeee';ctx.beginPath();ctx.ellipse(x,-3,15,4,0,0,Math.PI*2);ctx.stroke();}}
 ctx.restore();text('Otomatik mama + su',782,155,11,'#514a3c');}
function drawToy(t){ctx.save();ctx.translate(t.x,t.y);const ball=BALLS[t.kind],lift=ball?t.z*.45:t.kind==='bug'?Math.abs(Math.sin(t.phase*2))*7:t.kind==='feather'?Math.sin(t.phase)*4:0;
 const sz=t.kind==='bed'?89:t.kind==='house'?65:t.kind==='rod'?49:t.kind==='tunnel'?94:['scratch','surf'].includes(t.kind)?70:t.kind==='ball'?22:ball?30:25;
 ctx.fillStyle='#30261322';ctx.beginPath();ctx.ellipse(0,7,sz*.43/(1+lift/150),Math.max(3,6-lift/50),0,0,Math.PI*2);ctx.fill();ctx.translate(0,-lift);
 if(ball)ctx.rotate((t.vx>=0?1:-1)*t.phase*.35);ctx.imageSmoothingEnabled=false;
 if(t.kind==='house'&&props.complete&&props.naturalWidth)drawHouse(t);
 else if(propIndex[t.kind]!==undefined&&props.complete&&props.naturalWidth)cropDraw(ctx,props,CROPS.props[propIndex[t.kind]].rect,sz,t.kind==='bed'?19:ball?sz/2:10);
 else{ctx.font=sz+'px "Apple Color Emoji","Segoe UI Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(icon[t.kind],0,-5);}ctx.restore();
 const sleeper=t.kind==='bed'?game.s.cats.find(c=>c.target===t.id&&c.mode==='sleep'):null;
 if(sleeper){rounded(t.x-26,t.y+26,52,4,2,'#6b777744');rounded(t.x-26,t.y+26,52*(1-sleeper.timer/6),4,2,'#75958c');}
 const max={house:3+t.level,tunnel:10,rod:6,scratch:25,surf:3,frisbee:3}[t.kind];if(max){rounded(t.x-27,t.y+23,54,4,2,'#685b4144');rounded(t.x-27,t.y+23,54*Math.min(1,t.count/max),4,2,'#477c65');text(t.kind==='house'?`${t.level} kat · ${t.count}/${max}`:`${t.count}/${max}`,t.x,t.y+40,11,'#4e493b');}}
function drawRoom(ri){ctx.save();ctx.translate(ri*W,0);if(roomArt.complete&&roomArt.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(roomArt,0,0,W,H);}else{ctx.fillStyle='#d6bc91';ctx.fillRect(0,0,W,H);rounded(170,130,560,310,8,'#b6b58d');rounded(280,15,330,95,8,'#717657');}
 // Close exterior passages; only the shared doorway connects the two rooms.
 for(const side of [0,1])if(side===0?ri===0:ri===game.s.rooms.length-1){const x=side?W-28:0;ctx.fillStyle='#967351';ctx.fillRect(x,185,28,150);ctx.strokeStyle='#574639';ctx.lineWidth=3;ctx.strokeRect(x+3,185,22,150);if(side&&game.s.rooms.length===1){rounded(W-153,225,115,42,6,'#fff4dbe6');text('Yan oda · kilitli',W-96,250,12,'#65573f');}}
 text(game.s.rooms[ri].name.toLocaleUpperCase('tr-TR'),W/2,565,13,'#594b37');
 if(ri===0)drawCareStation();
 const cats=game.s.cats.filter(c=>c.room===ri),toys=game.s.rooms[ri].toys;
 const items=[...toys.map(t=>({y:t.y,draw:()=>drawToy(t)})),...cats.map(c=>({y:c.y+9,draw:()=>drawCat(c)}))].sort((a,b)=>a.y-b.y);for(const item of items)item.draw();
 for(const e of effects){if(e.room!==ri)continue;const q=1-e.life/e.total;ctx.globalAlpha=Math.min(1,e.life*2);if(['place','hit','bounce'].includes(e.type)){ctx.beginPath();ctx.ellipse(e.x,e.y,9+q*28,4+q*10,0,0,Math.PI*2);ctx.strokeStyle=e.type==='hit'?'#eab447':'#7d9b79';ctx.lineWidth=1.5;ctx.stroke();}else if(e.type==='reward'){text('+'+e.amount+' ●',e.x,e.y-35-q*40,21,'#755114');}else if(['transform','build'].includes(e.type)){rounded(e.x-82,e.y-80-q*25,164,27,6,'#fff8e8dd');text(e.text,e.x,e.y-61-q*25,14,'#376451');}else if(e.type==='pass'){text(e.text,e.x,e.y-45-q*20,12,'#476369');}ctx.globalAlpha=1;}
 ctx.restore();}
function render(){const r=canvas.getBoundingClientRect(),v=camera.view(r.width,r.height),dpr=canvas.width/r.width;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#302d29';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.setTransform(dpr*v.scale,0,0,dpr*v.scale,dpr*v.ox,dpr*v.oy);for(let i=0;i<game.s.rooms.length;i++)drawRoom(i);
 if(gesture?.ball&&gesture.drag&&!gesture.cancel){const f=game.findToy(gesture.ball);if(f){const a=gesture.world,b=world(gesture.last);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='#fff2b5';ctx.lineWidth=3;ctx.stroke();}}}
function goal(){const s=game.s,unlock=id=>[SKILLS.find(n=>n.id===id).name+' becerisini aç',s.gold,game.skillCost(id)];
 if(s.stats.ball<10)return['Başlangıç: 10 tenis topu yakala',s.stats.ball,10];if(!s.skills.mice)return unlock('mice');
 if(!s.skills.balls){if(s.stats.mouse<10)return['Futbol için 10 fare yakala',s.stats.mouse,10];return unlock('balls');}
 if(s.cats.length<2)return['İkinci kediyi davet et',s.gold,game.catCost()];if(!s.skills.house)return unlock('house');
 if(!s.skills.basket){if(s.stats.football<12)return['Basketbol için 12 futbol topu yakala',s.stats.football,12];return unlock('basket');}
 if(!s.skills.rod){if(s.stats.basketball<12)return['Olta aşaması: 12 basketbol yakala',s.stats.basketball,12];return unlock('rod');}
 if(!s.skills.floor2){if(s.stats.house<2)return['İkinci kat için 2 ev devir',s.stats.house,2];return unlock('floor2');}
 if(s.cats.length<3)return['Üçüncü kedi için hazırlan',s.gold,game.catCost()];if(!s.skills.auto)return unlock('auto');
 if(!s.skills.scratch){if(s.stats.feather<5)return['Tahta aşaması: 5 olta tüyü yakala',s.stats.feather,5];return unlock('scratch');}
 if(!s.skills.room){if(s.stats.tunnel<10)return['Yan oda için 10 tünel geçişi',s.stats.tunnel,10];return unlock('room');}
 if(s.stats.surf<3)return['Sörf tahtasında 3 tur tamamla',s.stats.surf,3];if(s.cats.length<6)return['Küçük final: 6 kediye yer aç',s.cats.length,6];if(s.stats.tunnel<20)return['Küçük final: 20 tünel geçişi',s.stats.tunnel,20];return['Küçük final tamam · Koleksiyon ve keşifler sürüyor',1,1];}
function updateUI(){const s=game.s;$('gold').textContent=fmt(s.gold);$('careRate').textContent='−'+game.careRate()+' altın / dk';$('careTotal').textContent='Toplam bakım: −'+fmt(s.ledger.care)+' altın';$('toyCount').textContent=s.rooms[s.active].toys.length+' / '+game.capacity();$('catCount').textContent=s.cats.length;$('skillCount').textContent=Object.keys(s.skills).length+' / '+SKILLS.length+' keşif';$('achievementCount').textContent=s.achievements.length+' / '+ACHIEVEMENTS.length;
 for(const [kind,t]of Object.entries(TOYS)){const b=$('toy-'+kind);if(!b)continue;const unlocked=game.available(kind);b.className='toy-button'+(selected===kind?' selected':'');b.setAttribute('aria-pressed',selected===kind);b.querySelector('small').textContent=unlocked?t.hint:'Keşif ağacından aç';b.querySelector('.cost').textContent=game.cost(kind)+' ●'+(unlocked?'':' 🔒');}
 const cost=game.catCost();$('adopt').innerHTML=s.cats.length>=8?'Bütün kediler burada 🐾':s.cats.length>=game.catLimit()?`🐾 ${s.cats.length} / ${game.catLimit()} kedi · Evini geliştir`:`🐈 Kedi davet et <strong>${cost} ●</strong>`;$('adopt').disabled=!game.canAdopt();
 const free=Math.ceil(Math.max(0,s.freeAt-s.time));$('freeball').textContent=free?`Ücretsiz top · ${free} sn`:'＋ Ücretsiz top';$('freeball').disabled=free>0||s.rooms[s.active].toys.length>=game.capacity();$('autoLine').hidden=!s.skills.auto;$('auto').checked=s.auto;
 const [title,value,max]=goal();$('goalTitle').textContent=title;$('goalProgress').textContent=fmt(Math.min(value,max))+' / '+fmt(max);$('goalBar').max=max;$('goalBar').value=Math.min(value,max);
 $('stageInstruction').textContent=TOYS[selected].name+' seçili · '+game.cost(selected)+' altın · Dokun: bırak · Sürükle: kamerayı gezdir';$('paused').hidden=!paused;$('pause').textContent=paused?'▶':'Ⅱ';$('pause').setAttribute('aria-label',paused?'Oyuna devam et':'Oyunu duraklat');
 $('roomNote').textContent=s.rooms[s.active].toys.length?`${catsInRoom(s.active)} kedi · ${s.rooms[s.active].toys.length} oyuncak · Kendileri keşfediyorlar`:'Bir oyuncak bırak. Kediler oyuna katılsın.';
 const newRoomKey=s.rooms.length+'-'+s.active;if(roomKey!==newRoomKey){roomKey=newRoomKey;$('rooms').innerHTML=s.rooms.map((r,i)=>`<button class="room-tab ${i===s.active?'active':''}" data-room="${i}" aria-pressed="${i===s.active}">${i?'▦':'▤'} ${r.name}</button>`).join('')+(s.rooms.length<2?'<button class="room-tab" data-room="locked">🔒 Yan oda</button>':'');}
 if(modalKind==='tree'&&$('modal').open){for(const n of SKILLS){const b=$('node-'+n.id);if(!b)continue;const owned=s.skills[n.id],req=n.req.every(k=>s.skills[k])&&n.gate(s);b.disabled=owned||!game.canBuy(n.id);b.className='node '+(owned?'owned':!req?'locked':'');b.querySelector('.condition').textContent=owned?'✓ Açıldı':!n.req.every(k=>s.skills[k])?'Önce: '+n.req.map(id=>SKILLS.find(v=>v.id===id).name).join(', '):!n.gate(s)?n.need:game.skillCost(n.id)+' altın'+(game.skillCost(n.id)>n.cost?' · mevcut evlerin katları dahil':'');}}
}
function catsInRoom(i){return game.s.cats.filter(c=>c.room===i).length;}
function initButtons(){for(const [kind,t]of Object.entries(TOYS)){const b=document.createElement('button');b.id='toy-'+kind;b.className='toy-button';b.innerHTML=`<span class="toy-icon">${t.icon}</span><span><strong>${t.name}</strong><small>${t.hint}</small></span><span class="cost">${t.cost} ●</span>`;b.addEventListener('click',()=>{if(!game.available(kind)){openModal('tree');return;}selected=kind;updateUI();});$('toyButtons').append(b);}}
function openModal(kind){modalKind=kind;const body=$('modalBody'),s=game.s;body.innerHTML='';const titles={tree:'Keşif ağacı',achievements:'Küçük zaferler',collection:'Ev arkadaşların',help:'Bir top, bir kedi…',reset:'Yeni bir ev?',finish:'Her yer kedi!'};$('modalTitle').textContent=titles[kind];
 if(kind==='tree'){
  const treeNode=n=>{const children=SKILLS.filter(x=>x.branch===n.branch&&x.req.includes(n.id));return `<div class="node-wrap"><button id="node-${n.id}" class="node" data-skill="${n.id}"><strong>${n.name}</strong><span class="desc">${n.desc}</span><span class="condition"></span></button>${children.length?'<div class="children">'+children.map(treeNode).join('')+'</div>':''}</div>`;};
  body.innerHTML='<p class="modal-intro">Altınla yeni etkileşimler aç. Dallar önceki beceriyi gerektirir; diğer daldaki önkoşullar kartta yazılır. Ağaç açıkken oyun duraklar.</p><div class="branches">'+['Oyuncak dönüşümleri','Karton & yapılar','Kalabalık bir ev'].map((name,branch)=>`<section class="branch"><h3>${name}</h3>${SKILLS.filter(n=>n.branch===branch&&!n.req.some(id=>SKILLS.find(x=>x.id===id)?.branch===branch)).map(treeNode).join('')}</section>`).join('')+'</div>';
 }else if(kind==='achievements'){
  body.innerHTML='<p class="modal-intro">Bu prototipin yerel başarımları. Steam bağlantısı yok. Dönüşümleri dene; uzun hedefler finalden sonra da kalır.</p><div class="badge-grid">'+ACHIEVEMENTS.map(a=>{const [v,m]=a.progress(s);return`<div class="badge ${s.achievements.includes(a.id)?'unlocked':'locked'}"><span class="badge-icon">${a.icon}</span><div><strong>${a.name}</strong><p>${a.desc}</p><small>${fmt(Math.min(v,m))} / ${fmt(m)}</small></div></div>`;}).join('')+'</div>';
 }else if(kind==='collection'){
  body.innerHTML='<p class="modal-intro">Kediler oyuncakların peşinden açık kapıdan geçebilir. Davet ettiğin yeni kedi seçili odaya gelir. Yatakta dinlenmek kendi seçimleridir.</p><div class="cat-grid">'+s.cats.map(c=>`<div class="cat-card"><canvas width="240" height="170" data-cat="${c.index}"></canvas><strong>${CATS[c.index][0]}</strong><p>${CATS[c.index][1]} · ${s.rooms[c.room].name}<br>${CATS[c.index][2]}</p></div>`).join('')+'</div>';
  for(const c of s.cats){const el=body.querySelector(`[data-cat="${c.index}"]`);drawCat({...c,x:120,y:105,mode:'idle',phase:0,face:1},el.getContext('2d'),150);}
 }else if(kind==='help'){
  body.innerHTML='<div class="help-copy"><ol><li><b>Oyuncağı seç, zemine dokun.</b> Tenis 2, futbol 5, basketbol 10 altın. Toplar sırayla açılır; ardından 25 altınlık oltaya geçersin. Topa tekrar dokunarak zıplat, topu sürükleyip bırakarak yön ver.</li><li><b>Kediler kendileri keşfeder.</b> Keşif ağacı topları fareye, evi tünele, oltayı tüye, tahtayı sörfe dönüştürür.</li><li><b>Mama ve su otomatik.</b> Kedi sayısına göre gider artar. Son 4 altın korunur; biriken borç yoktur. Sekme kapalıyken gider işlemez.</li><li><b>Bir yatak bırak.</b> Kediler oyun aralarında veya oda sakinken 6 saniye uyur. Her tamamlanan uyku +2 altın; yatak kalır.</li><li><b>Evi büyüt.</b> Yan oda açıldığında kapıdan toplar ve kediler geçebilir. İki oda da aynı anda çalışır.</li><li><b>Küçük final:</b> yan odayı aç, 6 kedi edin, 20 tünel geçişi, 1 tüy ve 3 sörf turu tamamla.</li></ol><p>Tekerlek veya iki parmak: yakınlaştır / uzaklaştır.<br>Zemini sürükle: kamerayı kaydır. Oda düğmesi: odaya odaklan. Ev düğmesi veya H: bütün evi göster.<br>Boşluk: seçili oyuncağı bırak. 1–7: oyuncak seç.</p><p>Ücretsiz top 30 saniyede bir. Menüler açıkken veya sekme gizliyken oyun duraklar. Kayıt bu cihaz ve tarayıcıya aittir; eski kayıtlar korunur.</p><button id="helpReset">Yeni oyun başlat</button></div>';
 }else if(kind==='reset'){
  body.innerHTML='<div class="help-copy"><p>Bu tarayıcıdaki kediler, altın ve keşifler sıfırlanacak. Yeni oyun bir kedi ve 8 altınla başlar.</p><button id="confirmReset">Evet, yeni oyun</button><button id="cancelReset">Vazgeç</button></div>';
 }else if(kind==='finish'){
  body.innerHTML=`<div class="final-card"><div class="big">🐈 🐈‍⬛ 🐈</div><h3>İki oda. ${s.cats.length} kedi. Bir sürü yaramazlık.</h3><p>Bu küçük prototipin hedefini tamamladın.<br>${fmt(s.stats.ball)} top yakalandı · ${fmt(s.stats.tunnel)} tünel geçişi<br>Toplam ${fmt(s.earned)} altın kazanıldı.<br>Mama + su: ${fmt(s.ledger.care)} altın.</p><p>Keşifleri ve başarımları tamamlamaya devam edebilirsin.</p><button id="continueGame">Oynamaya devam et</button></div>`;
 }
 if(!$('modal').open)$('modal').showModal();updateUI();}
function closeModal(){$('modal').close();modalKind='';last=performance.now();acc=0;}
$('modalBody').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.skill){if(game.buySkill(b.dataset.skill)){sound('transform');consume();updateUI();save();}}if(b.id==='continueGame'||b.id==='cancelReset')closeModal();if(b.id==='helpReset')openModal('reset');if(b.id==='confirmReset'){game=new Game();knownRooms=1;camera.focus(0);effects=[];selected='ball';paused=false;closeModal();consume();updateUI();save();}});
$('modal').addEventListener('close',()=>{modalKind='';last=performance.now();acc=0;});$('closeModal').onclick=closeModal;
$('tree').onclick=$('quickSkill').onclick=()=>openModal('tree');$('achievements').onclick=()=>openModal('achievements');$('collection').onclick=()=>openModal('collection');$('help').onclick=()=>openModal('help');$('reset').onclick=()=>openModal('reset');
$('pause').onclick=()=>{paused=!paused;last=performance.now();acc=0;updateUI();};$('sound').onclick=()=>{muted=!muted;$('sound').style.opacity=muted?.6:1;$('sound').setAttribute('aria-label',muted?'Sesi aç':'Sesi kapat');$('sound').title=muted?'Sesi aç':'Sesi kapat';if(!muted)sound('place');};$('sound').style.opacity=.6;
$('adopt').onclick=()=>{if(game.adopt()){consume();updateUI();save();}};$('freeball').onclick=()=>{if(game.starterBall(140+Math.random()*620,175+Math.random()*290)){sound('place');updateUI();save();}};$('auto').onchange=()=>{game.s.auto=$('auto').checked;save();};
$('rooms').addEventListener('click',e=>{const b=e.target.closest('[data-room]');if(!b)return;if(b.dataset.room==='locked'){openModal('tree');return;}game.switchRoom(Number(b.dataset.room));camera.focus(game.s.active);updateUI();save();});
$('fitHouse').onclick=fitHouse;for(const [id,factor]of [['zoomIn',1.25],['zoomOut',.8]])$(id).onclick=()=>{const r=canvas.getBoundingClientRect();camera.zoomAt(factor,r.width/2,r.height/2,r.width,r.height,game.s.rooms.length);};
function tick(now){const elapsed=Math.min((now-last)/1000,.1);last=now;if(!paused&&!document.hidden&&!$('modal').open){acc+=elapsed;while(acc>=1/60){game.step(1/60);acc-=1/60;}for(const e of effects)e.life-=elapsed;effects=effects.filter(e=>e.life>0);consume();}else acc=0;render();uiTimer+=elapsed;if(uiTimer>.2){updateUI();uiTimer=0;}if(++frame%300===0)save();requestAnimationFrame(tick);}
document.addEventListener('visibilitychange',()=>{save();last=performance.now();acc=0;});window.addEventListener('pagehide',save);
atlas.onerror=()=>toast('Kedi görselleri yüklenemedi. Sayfayı yenilemeyi dene.');
initButtons();consume();updateUI();resize();requestAnimationFrame(tick);if(loadError)toast('Önceki kayıt okunamadı. Yeni bir oturum açıldı.');
