// Preserve rejected saves before any automatic write, including storage-full failures.
export function readSession(storage,key,decode){
 let raw=null;try{raw=storage.getItem(key);if(!raw)return {game:null,error:false,blocked:false,recovery:null};
  const game=decode(raw);if(game)return {game,error:false,blocked:false,recovery:null};
 }catch{if(raw===null)return {game:null,error:true,blocked:true,recovery:null};}
 try{const backup=key+'-kurtarma';storage.setItem(backup,raw);
  if(storage.getItem(backup)===raw)return {game:null,error:true,blocked:false,recovery:raw};
 }catch{}
 return {game:null,error:true,blocked:true,recovery:raw};
}
