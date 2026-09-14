// Permanent furniture: reusable interactions, never standalone gold production.
export const FIXTURES={
 box:{cost:30,hold:4.5,cooldown:22,limit:2,width:90,flat:0,percent:.05},
 swing:{cost:280,hold:6,cooldown:28,limit:1,width:138,flat:0,percent:.10},
 bed:{cost:100,hold:6,cooldown:30,limit:2,width:89,flat:0,percent:.05},
};
export const ENTER=.6,EXIT=.55;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>t*t*(3-2*t);
export function fixtureMotion(t,c){
 const tr=c?.fixture,cfg=FIXTURES[t.kind],elapsed=tr?.elapsed??0,hold=cfg.hold;
 const phase=elapsed<ENTER?'enter':elapsed<ENTER+hold?'hold':'exit';
 const holdTime=clamp(elapsed-ENTER,0,hold),envelope=Math.min(1,holdTime/.7,(hold-holdTime)/.7);
 const angle=t.kind==='swing'&&tr?Math.sin(holdTime*2.8)*.15*Math.max(0,envelope):0;
 const dx=Math.sin(angle)*100,dy=(1-Math.cos(angle))*36;
 const lift=t.kind==='swing'?16:t.kind==='box'?5:0;
 if(!tr)return{x:t.x,y:t.y,lift,angle:0,phase:'empty',dx:0,dy:0};
 let x=t.x+dx,y=t.y+dy,z=lift;
 if(phase==='enter'){const u=clamp(elapsed/ENTER,0,1),q=smooth(u);x=tr.fromX+(t.x-tr.fromX)*q;y=tr.fromY+(t.y-tr.fromY)*q;z=lift*q+Math.sin(u*Math.PI)*(t.kind==='bed'?8:24);}
 if(phase==='exit'){const u=clamp((elapsed-ENTER-hold)/EXIT,0,1),q=smooth(u);x=t.x+(tr.exitX-t.x)*q;y=t.y+(tr.exitY-t.y)*q;z=lift*(1-q)+Math.sin(u*Math.PI)*12;}
 return{x,y,lift:z,angle,phase,dx,dy};
}
export const fixtureDuration=kind=>ENTER+FIXTURES[kind].hold+EXIT;
export function roomBonus(toys){const kinds=new Set(toys.filter(t=>!t.done&&FIXTURES[t.kind]).map(t=>t.kind));let flat=0,percent=0;for(const k of kinds){flat+=FIXTURES[k].flat;percent+=FIXTURES[k].percent;}return{flat,percent:Math.min(.20,percent)};}
