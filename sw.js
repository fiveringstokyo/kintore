// 圏外のジムでも開けるように、画面を手元に置いとく（新しい版があれば次に開いた時に入れ替わる）
// 画面を直したら C の版を上げる（古い置き場は activate で消す）
const C='kintore-v6';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon.png'])));self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  // コーチ班とのやりとり（別のところ宛て）は触らん＝古い中身を返すと記録が巻き戻る
  try{if(new URL(e.request.url).origin!==location.origin)return;}catch(err){return;}e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));});
