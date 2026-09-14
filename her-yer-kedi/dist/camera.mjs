import {ROOM_W as W,ROOM_H as H} from './physics.mjs';
// Camera coordinates use CSS pixels. Device-pixel ratio affects drawing only.
export class Camera {
 constructor(){this.x=W/2;this.y=H/2;this.zoom=1;}
 view(width,height){const scale=Math.min(width/W,height/H)*this.zoom;return{scale,ox:width/2-this.x*scale,oy:height/2-this.y*scale};}
 world(px,py,width,height){const v=this.view(width,height);return{x:(px-v.ox)/v.scale,y:(py-v.oy)/v.scale};}
 zoomAt(factor,px,py,width,height,rooms){const before=this.world(px,py,width,height);this.zoom=Math.max(.38,Math.min(2.5,this.zoom*factor));const after=this.world(px,py,width,height);this.x+=before.x-after.x;this.y+=before.y-after.y;this.clamp(rooms);}
 pan(dx,dy,width,height,rooms){const v=this.view(width,height);this.x-=dx/v.scale;this.y-=dy/v.scale;this.clamp(rooms);}
 clamp(rooms){this.x=Math.max(120,Math.min(rooms*W-120,this.x));this.y=Math.max(120,Math.min(H-120,this.y));}
 focus(room){this.x=room*W+W/2;this.y=H/2;this.zoom=1;}
 fit(rooms,width,height){this.x=rooms*W/2;this.y=H/2;this.zoom=Math.min(width/(rooms*W+50),height/(H+50))/Math.min(width/W,height/H);}
}
