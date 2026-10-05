// 記録を壊さんかの確認
const {chromium,devices}=require('/opt/node-tools/node_modules/playwright');const {seedV1}=require('./common');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const out=[];const ok=(c,m)=>out.push((c?'OK  ':'NG  ')+m);
  const ctx=await b.newContext({...devices['iPhone 14']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  const D=seedV1('analyst');D.ex.push({id:'e19',part:'胸',name:'腕立て 伏せ'});D.seq=20;D.days['2026-01-01']=[{ex:'e19',sets:[{w:'',r:'',done:false}],_x:1}];
  D.days['2026-01-02']=[{ex:'e0',sets:[{w:40,r:10,done:false}],_new:true}];
  const raw=JSON.stringify(D);
  await p.goto('http://127.0.0.1:8123/');await p.evaluate(r=>{localStorage.clear();localStorage.setItem('kintore_v1',r);},raw);
  await p.reload();await p.waitForTimeout(300);
  let s=await p.evaluate(()=>({a:localStorage.getItem('kintore_v1'),b:localStorage.getItem('kintore_v1_before_v2')}));let N=JSON.parse(s.a);
  ok(s.b===raw,'移す前の中身がそのまま控えに残る');
  ok(Object.keys(N.days).length===Object.keys(D.days).length,'日数が同じ '+Object.keys(N.days).length);
  ok(JSON.stringify(Object.values(N.days).map(L=>L.map(x=>x.sets)))===JSON.stringify(Object.values(D.days).map(L=>L.map(x=>x.sets))),'全セットの重さ・回数が同じ');
  ok(JSON.stringify(N.body)===JSON.stringify(D.body),'体重の記録が同じ');
  ok(!N.ex.some(e=>e.name==='腕立て伏せ'),'同じ名前（腕立て 伏せ）があれば「腕立て伏せ」を足さん');
  ok(N.ex.filter(e=>e.name==='ラットプルダウン').length===1,'ラットプルダウンを1つ足す');
  ok(new Set(N.ex.map(e=>e.id)).size===N.ex.length,'種目のIDがかぶらん');
  ok(N.days['2026-01-02'][0]._new===undefined&&N.days['2026-01-02'][0].sets.length===1,'途中の印は外し、記録は残す');
  await p.evaluate(()=>localStorage.setItem('kintore_v1_before_v2','X'));await p.reload();await p.waitForTimeout(200);
  s=await p.evaluate(()=>localStorage.getItem('kintore_v1_before_v2'));ok(s==='X','2回目以降は控えを上書きせん');
  // lbs 表示
  await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('kintore_v1'));d.unit='lbs';localStorage.setItem('kintore_v1',JSON.stringify(d));});await p.reload();
  await p.locator('nav button',{hasText:'ふり返り'}).tap();await p.locator('.seg button',{hasText:'グラフ'}).tap();
  const txt=await p.locator('.gbox[data-ex="e0"] .chg').innerText();ok(/lbs/.test(txt),'lbs で出る: '+txt);
  // 古い控えファイルの読み込み
  await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('kintore_v1'));d.unit='kg';localStorage.setItem('kintore_v1',JSON.stringify(d));});await p.reload();
  await p.locator('nav button',{hasText:'設定'}).tap();p.on('dialog',d=>d.accept());
  const old=seedV1('bench');await p.locator('#fi').setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});await p.waitForTimeout(400);
  s=await p.evaluate(()=>({a:JSON.parse(localStorage.getItem('kintore_v1')),b:!!localStorage.getItem('kintore_v1_before_import')}));
  ok(Object.keys(s.a.days).length===Object.keys(old.days).length&&s.a.ver===2&&s.b,'古い控えを読み込める・読み込む前の記録も残る');
  ok(!errs.length,'JSエラー無し '+errs.join(','));
  console.log(out.join('\n'));await b.close();})();
