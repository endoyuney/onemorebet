// Import-time matte handling. Original image-generated RGB textures remain unchanged.
// Flood only exterior neutral checker pixels, keeping enclosed pale/gray fur intact.
export function importSpriteAtlas(source,rectangles,canvasFactory=()=>document.createElement('canvas')){
 const canvas=canvasFactory();canvas.width=source.naturalWidth||source.width;canvas.height=source.naturalHeight||source.height;
 const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);const im=ctx.getImageData(0,0,canvas.width,canvas.height),d=im.data,w=canvas.width;
 const neutral=i=>{const r=d[i],g=d[i+1],b=d[i+2];return Math.max(r,g,b)-Math.min(r,g,b)<18&&Math.min(r,g,b)>128;};
 for(const rect of rectangles){const x0=Math.max(0,rect[0]-4),y0=Math.max(0,rect[1]-4),x1=Math.min(w,rect[2]+4),y1=Math.min(canvas.height,rect[3]+4),rw=x1-x0,rh=y1-y0,seen=new Uint8Array(rw*rh),queue=new Int32Array(rw*rh);let head=0,tail=0;
  const offer=(x,y)=>{if(x<0||y<0||x>=rw||y>=rh)return;const n=y*rw+x,i=((y+y0)*w+x+x0)*4;if(seen[n]||!neutral(i))return;seen[n]=1;queue[tail++]=n;};
  for(let x=0;x<rw;x++){offer(x,0);offer(x,rh-1);}for(let y=0;y<rh;y++){offer(0,y);offer(rw-1,y);}
  while(head<tail){const n=queue[head++],x=n%rw,y=Math.floor(n/rw);d[((y+y0)*w+x+x0)*4+3]=0;offer(x-1,y);offer(x+1,y);offer(x,y-1);offer(x,y+1);}
 }
 ctx.putImageData(im,0,0);return canvas;
}
export const EXTRA_CROPS={cats:[[109,62,375,413],[496,62,763,413],[889,62,1158,413],[106,443,399,796],[495,443,793,796],[897,443,1195,796],[104,821,399,1193],[494,819,791,1193],[898,821,1192,1193]],props:[[76,87,593,497],[688,338,1185,497],[39,628,697,1169],[755,955,1220,1141]]};
