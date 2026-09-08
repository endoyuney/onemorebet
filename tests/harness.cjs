const fs = require('node:fs');
const vm = require('node:vm');
const path = process.env.OMB_SOURCE || require('node:path').join(__dirname, '..', 'index.html');
const html = fs.readFileSync(path,'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function world(seed=1) {
  let now=1700000000000, next=1, tasks=new Map(), storage={};
  const els=new Map();
  const element=()=>({classList:{add(){},remove(){},toggle(){}},style:{},appendChild(){},remove(){},select(){},offsetWidth:1,textContent:'',innerHTML:'',disabled:false});
  const ctx={console,Math,JSON,Date:class extends Date{static now(){return now;}},
    setTimeout(fn,ms){let id=next++;tasks.set(id,{fn,at:now+ms,interval:0});return id;},
    setInterval(fn,ms){let id=next++;tasks.set(id,{fn,at:now+ms,interval:ms});return id;},
    clearInterval(id){tasks.delete(id);},clearTimeout(id){tasks.delete(id);},
    document:{body:element(),getElementById(id){if(!els.has(id))els.set(id,element());return els.get(id);},createElement:element,addEventListener(){},execCommand(){}},
    localStorage:{setItem(k,v){storage[k]=v;},getItem(k){return storage[k]||null;},removeItem(k){delete storage[k];}},
    location:{search:''},confirm:()=>true,alert(){},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape};
  vm.createContext(ctx); vm.runInContext(source,ctx);
  for(const name of ['renderAll','renderCoin','renderSlot','renderLog','renderHUD','renderPrestigeRail','renderCoinShop','renderScratch','renderScratchField','renderUpgrades','spawnMoneyFloat','toast','applyCosmetics','flashJackpot','showBust','showSmashResult','showTree'])ctx[name]=()=>{};
  ctx.log=()=>{};
  ctx.S={meta:ctx.freshMeta()};ctx.S.meta.seed=seed;ctx.RNG.seed(seed);ctx.S.run=ctx.freshRun();
  ctx.advance=ms=>{const until=now+ms;let guard=0;while(true){let pick=null;for(const [id,t]of tasks)if(t.at<=until&&(!pick||t.at<pick[1].at))pick=[id,t];if(!pick)break;if(++guard>100000)throw Error('timer overflow');let[id,t]=pick;now=t.at;if(t.interval)t.at+=t.interval;else tasks.delete(id);t.fn();}now=until;};
  ctx.dropTimers=()=>tasks.clear();ctx.rawSave=()=>JSON.parse(storage[ctx.CONFIG.saveKey]);
  return ctx;
}

module.exports={world,source};
