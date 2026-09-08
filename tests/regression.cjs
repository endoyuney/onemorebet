const test = require('node:test');
const assert = require('node:assert/strict');
const {world} = require('./harness.cjs');
const json = value => JSON.parse(JSON.stringify(value));
function spinning(seed=17){
  const w=world(seed); w.dropTimers();
  w.S.run.slot.unlocked=true; w.S.run.cash=500;
  w.doSpin(false); return w;
}
test('seeded RNG keeps the original Mulberry32 sequence',()=>{
  const w=world(123); let a=123;
  for(let i=0;i<100;i++){
    a|=0; a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    assert.equal(w.RNG.next(),((t^t>>>14)>>>0)/4294967296);
  }
});
test('save/load resumes the next random draw, including seed zero',()=>{
  for(const seed of [0,1,20260908]){
    const w=world(seed); for(let i=0;i<19;i++)w.RNG.next();
    w.save(); const expected=Array.from({length:25},()=>w.RNG.next());
    assert.equal(w.load(),true);
    assert.deepEqual(Array.from({length:25},()=>w.RNG.next()),expected);
  }
});
test('pending slot is settled once after reload and animation cannot pay twice',()=>{
  for(const seed of [1,17,69,123,20260908]){
    const direct=spinning(seed), reload=spinning(seed);
    direct.advance(800);
    assert.equal(reload.load(),true);
    assert.equal(reload.S.run.slot.busy,false);
    assert.equal(reload.S.run.cash,direct.S.run.cash);
    assert.deepEqual(json(reload.S.run.slot.reels),json(direct.S.run.slot.reels));
    reload.advance(800); reload.load();
    assert.equal(reload.S.run.cash,direct.S.run.cash);
    assert.equal(reload.S.meta.stats.spins,1);
    assert.equal(reload.RNG.next(),direct.RNG.next());
  }
});
test('unresolved slot prevents bust and manual prestige until settlement',()=>{
  const w=spinning(); w.S.meta.firstPrestigeUnlocked=true; w.S.run.peak=10000;
  w.S.run.cash=0; w.S.run.jcoin.charges=0;
  w.checkBust(); w.bust(); w.manualSmash(); w.newRun();
  assert.equal(w.S.run.busted,false); assert.equal(w.S.meta.runCount,1);
  assert.equal(w.S.meta.chips,0);
  w.advance(800); assert.equal(w.S.run.slot.busy,false);
});
test('old slot callback cannot alter a new run, including reused coin IDs',()=>{
  const w=spinning(); w.S.run.busted=true; w.newRun();
  const before=json(w.S); w.advance(800);
  assert.deepEqual(json(w.S),before);
});
test('old slot callback cannot alter imported progress',()=>{
  const w=spinning(), other=world(23); other.S.run.cash=123;
  w.importSave(other.exportSave()); const before=json(w.S);
  w.advance(800); assert.deepEqual(json(w.S),before);
});
test('hard reset invalidates a pending slot animation',()=>{
  const w=spinning(); w.hardReset(); const before=json(w.S);
  w.advance(800); assert.deepEqual(json(w.S),before);
});
test('legacy v5 busy slot refunds the lost bet only once',()=>{
  const w=world(123); w.S.run.cash=70; w.S.run.slot.busy=true;
  w.S.run.slot.pot=607; w.S.meta.stats.spins=1; w.S.run.telemetry.spins=1;
  const legacy={version:5,meta:json(w.S.meta),run:json(w.S.run),seed:123};
  delete legacy.run.slot.pending;
  w.localStorage.setItem(w.CONFIG.saveKey,JSON.stringify(legacy));
  assert.equal(w.load(),true);
  assert.equal(w.S.run.cash,120); assert.equal(w.S.run.slot.pot,600);
  assert.equal(w.S.meta.stats.spins,0); assert.equal(w.S.run.slot.busy,false);
  w.load(); assert.equal(w.S.run.cash,120);
});
test('export/import uses the same migration and RNG continuation',()=>{
  const w=world(123); for(let i=0;i<10;i++) w.RNG.next();
  const exported=w.exportSave(), expected=w.RNG.next();
  w.importSave(exported); assert.equal(w.RNG.next(),expected);
});
test('invalid import leaves live state and RNG unchanged',()=>{
  const w=world(123), previous=w.S, state=w.RNG.state();
  for(const bad of [{version:999,meta:{},run:{}},{version:6,meta:{},run:{}},null]){
    w.importSave(Buffer.from(JSON.stringify(bad)).toString('base64'));
    assert.equal(w.S,previous); assert.equal(w.RNG.state(),state);
  }
});
test('hand skips expensive coins and rotates after the actual selected coin',()=>{
  const w=world(); w.S.run.coin.coins=['gold','copper','silver','copper'].map((d,i)=>w.makeCoinObject(i+1,d));
  w.S.run.cash=3; w.S.run.coin.handCursor=0;
  assert.deepEqual(json(w.handCandidates().map(c=>c.id)),[2]);
  w.flipHand(); assert.equal(w.S.run.coin.handCursor,2);
  w.S.run.cash=3; assert.deepEqual(json(w.handCandidates().map(c=>c.id)),[4]);
});
test('mixed hand respects capacity and the total worst-case budget',()=>{
  const w=world(); w.S.meta.nodes.hands=1;
  w.S.run.coin.coins=['gold','copper','silver','copper','gold','copper'].map((d,i)=>w.makeCoinObject(i+1,d));
  w.S.run.cash=21;
  assert.deepEqual(json(w.handCandidates().map(c=>c.id)),[2,3,4]);
  assert.equal(w.worstLoss(w.handCandidates()),21);
});
test('old coin animation cannot clear new-run coin animation',()=>{
  const w=world(); w.dropTimers(); w.setCoinsBusy(w.S.run.coin.coins);
  w.advance(200); w.S.run.busted=true; w.newRun(); w.setCoinsBusy(w.S.run.coin.coins);
  w.advance(370); assert.equal(w.S.run.coin.coins[0].busy,true);
  w.advance(200); assert.equal(w.S.run.coin.coins[0].busy,false);
});
test('Space buys a ticket when completed cards fill the table',()=>{
  const w=world(); w.S.run.scratch.unlocked=true; w.S.run.peak=500; w.S.run.cash=1000;
  w.S.run.scratch.cards=Array.from({length:w.cardCap()},()=>Object.assign(w.buildScratchCard('triple'),{done:true}));
  w.primaryAction();
  assert.equal(w.S.run.scratch.cards.length,1);
  assert.equal(w.S.run.scratch.cards[0].done,false);
  assert.equal(w.S.run.cash,975);
});
test('purchase retains unfinished cards and never clears unaffordable tickets',()=>{
  const w=world(); w.S.run.scratch.unlocked=true; w.S.run.peak=500;
  const open=w.buildScratchCard('triple'), done=w.buildScratchCard('triple'); done.done=true;
  w.S.run.scratch.cards=[open,done]; w.S.run.cash=0; w.buyScratch('triple',1);
  assert.equal(w.S.run.scratch.cards.length,2);
  w.S.run.cash=100; w.buyScratch('triple',1);
  assert.equal(w.S.run.scratch.cards.length,2); assert.equal(w.S.run.scratch.cards[0],open);
});
test('slot remains unavailable until unlocked',()=>{
  const w=world(); w.S.run.cash=500; w.doSpin(false);
  assert.equal(w.S.run.cash,500); assert.equal(w.S.meta.stats.spins,0);
});
