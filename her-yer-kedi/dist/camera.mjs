// Camera coordinates use CSS pixels. Device-pixel ratio affects drawing only.
export class Camera {
 constructor(){this.x=450;this.y=300;this.zoom=1;}
 view(width,height){const scale=Math.min(width/900,height/600)*this.zoom;return{scale,ox:width/2-this.x*scale,oy:height/2-this.y*scale};}
 world(px,py,width,height){const v=this.view(width,height);return{x:(px-v.ox)/v.scale,y:(py-v.oy)/v.scale};}
 zoomAt(factor,px,py,width,height,rooms){const before=this.world(px,py,width,height);this.zoom=Math.max(.38,Math.min(2.5,this.zoom*factor));const after=this.world(px,py,width,height);this.x+=before.x-after.x;this.y+=before.y-after.y;this.clamp(rooms);}
 pan(dx,dy,width,height,rooms){const v=this.view(width,height);this.x-=dx/v.scale;this.y-=dy/v.scale;this.clamp(rooms);}
 clamp(rooms){this.x=Math.max(120,Math.min(rooms*900-120,this.x));this.y=Math.max(120,Math.min(480,this.y));}
 focus(room){this.x=room*900+450;this.y=300;this.zoom=1;}
 fit(rooms,width,height){this.x=rooms*450;this.y=300;this.zoom=Math.min(width/(rooms*900+50),height/650)/Math.min(width/900,height/600);}
}
