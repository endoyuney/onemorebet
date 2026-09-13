// A floor plane plus height: no 3D engine or frame-rate-dependent gravity.
export const ROOM_W=900,ROOM_H=600;
export const BALLS={ball:{launch:190,bounce:.54,drag:1.4,reward:3},football:{launch:145,bounce:.32,drag:.65,reward:7},basketball:{launch:260,bounce:.72,drag:.95,reward:13}};
export const DOOR={y:260,half:65};
export const FURNITURE=[{x:280,y:15,w:330,h:95,height:65},{x:178,y:18,w:76,h:75,height:65},{x:710,y:35,w:145,h:80,height:60}];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function collideFurniture(t,rect,radius=13){
 if((t.z||0)>rect.height)return false;
 const qx=clamp(t.x,rect.x,rect.x+rect.w),qy=clamp(t.y,rect.y,rect.y+rect.h),dx=t.x-qx,dy=t.y-qy,d=Math.hypot(dx,dy);
 if(d>=radius)return false;
 let nx,ny,depth;if(d>.001){nx=dx/d;ny=dy/d;depth=radius-d;}else{const edges=[{v:t.x-rect.x,nx:-1,ny:0},{v:rect.x+rect.w-t.x,nx:1,ny:0},{v:t.y-rect.y,nx:0,ny:-1},{v:rect.y+rect.h-t.y,nx:0,ny:1}].sort((a,b)=>a.v-b.v);nx=edges[0].nx;ny=edges[0].ny;depth=edges[0].v+radius;}
 t.x+=nx*depth;t.y+=ny*depth;const dot=t.vx*nx+t.vy*ny;if(dot<0){t.vx-=1.7*dot*nx;t.vy-=1.7*dot*ny;}return true;
}
export function stepBall(t,dt,roomIndex,roomCount,allowTransfer=true){
 const cfg=BALLS[t.kind];if(!cfg)return{room:roomIndex,bounced:false};
 let bounced=false;t.z+=t.vz*dt;t.vz-=460*dt;
 if(t.z<=0){t.z=0;if(t.vz<-32){t.vz=-t.vz*cfg.bounce;bounced=true;}else t.vz=0;}
 const drag=t.z>1?.07:cfg.drag;t.vx*=Math.exp(-drag*dt);t.vy*=Math.exp(-drag*dt);t.x+=t.vx*dt;t.y+=t.vy*dt;
 if(t.y<110){t.y=110;t.vy=Math.abs(t.vy)*.8;}if(t.y>535){t.y=535;t.vy=-Math.abs(t.vy)*.8;}
 const inDoor=Math.abs(t.y-DOOR.y)<DOOR.half-14;
 let next=roomIndex;
 if(inDoor&&allowTransfer&&t.x>ROOM_W-15&&roomIndex+1<roomCount){t.x-=ROOM_W-30;next++;}
 else if(inDoor&&allowTransfer&&t.x<15&&roomIndex>0){t.x+=ROOM_W-30;next--;}
 else {const right=inDoor&&allowTransfer&&roomIndex+1<roomCount?ROOM_W-15:855,left=inDoor&&allowTransfer&&roomIndex>0?15:45;if(t.x>right){t.x=right;t.vx=-Math.abs(t.vx)*.86;}if(t.x<left){t.x=left;t.vx=Math.abs(t.vx)*.86;}}
 for(const rect of FURNITURE)if(collideFurniture(t,rect))bounced=true;
 return{room:next,bounced};
}
export function safeFloor(x,y){let p={x:clamp(x,55,845),y:clamp(y,110,530),z:0,vx:0,vy:0};for(const r of FURNITURE)collideFurniture(p,r,38);p.x=clamp(p.x,55,845);p.y=clamp(p.y,110,530);return{x:p.x,y:p.y};}
