// ペルソナ評価の共通部品
const {chromium,devices}=require('/opt/node-tools/node_modules/playwright');
const fs=require('fs'),path=require('path');
const URL_=process.env.APPURL||'http://127.0.0.1:8123/';
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const dAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return ymd(d);};
// v1 形式（今スマホに入っとる形）の記録を作る
function seedV1(kind){
  const DEF_EX=[['胸','ベンチプレス'],['胸','ダンベルベンチプレス'],['胸','ダンベルフライ'],['胸','インクラインダンベルプレス'],['胸','ディップス'],
 ['背中','パラレルチンニング'],['背中','リバースダンベルフライ'],['背中','リバースグリップチンニング'],['背中','ルーマニアンデッドリフト'],
 ['肩','ダンベルショルダープレス'],['肩','サイドレイズ'],['肩','ショルダープレス'],['腕','ダンベルカール'],['腕','アームカール'],['腕','OHエクステンション'],
 ['腹','クランチ'],['脚','スクワット'],['脚','ブルガリアンスクワット'],['尻','ヒップスラスト']];
  const D={ex:DEF_EX.map((x,i)=>({id:'e'+i,part:x[0],name:x[1]})),days:{},body:[],unit:'kg',rest:90,seq:DEF_EX.length};
  const S=(w,r,n)=>Array.from({length:n},()=>({w,r,done:true}));
  if(kind==='bench'){ // 中級者：8週ぶん週2回ベンチ、スクワット
    for(let i=0;i<16;i++){const k=dAgo(56-i*3.5|0);const bw=80+i*0.625;D.days[k]=[{ex:'e0',sets:[{w:60,r:10,done:true},...S(Math.round(bw*4)/4,5,3)]},{ex:'e16',sets:S(90+i,5,3)}];}
    D.days[dAgo(4)]=[{ex:'e0',sets:[{w:60,r:10,done:true},...S(90,5,3)]}];
  }
  if(kind==='analyst'){ // 分析好き：4か月、週3
    for(let i=0;i<50;i++){const k=dAgo(120-i*2.4|0);const L=[];
      if(i%3===0)L.push({ex:'e0',sets:S(40+i*0.3|0,8,3)},{ex:'e10',sets:S(6,12,3)});
      if(i%3===1)L.push({ex:'e16',sets:S(50+i*0.5|0,8,3)},{ex:'e8',sets:S(40+i*0.4|0,10,3)});
      if(i%3===2)L.push({ex:'e5',sets:S(0,6+(i/10|0),3)},{ex:'e12',sets:S(8+(i/12|0),10,3)});
      D.days[k]=L;}
    for(let i=0;i<40;i++)D.body.push({d:dAgo(120-i*3),w:Math.round((68-i*0.08)*10)/10,f:Math.round((26-i*0.06)*10)/10});
  }
  if(kind==='commuter'){ for(let i=0;i<6;i++){D.days[dAgo(14-i*2)]=[{ex:'e0',sets:S(50,10,3)},{ex:'e9',sets:S(12,10,3)}];} }
  if(kind==='beginner'){ D.days[dAgo(3)]=[{ex:'e0',sets:S(30,10,3)}]; }
  return D;
}
async function open(persona,seed,outDir){
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await browser.newContext({...devices['iPhone 14'],locale:'ja-JP',timezoneId:'Asia/Tokyo'});
  if(seed!==null&&seed!==undefined) await ctx.addInitScript(([s])=>{if(!sessionStorage.getItem('_seeded')){localStorage.clear();if(s)localStorage.setItem('kintore_v1',s);sessionStorage.setItem('_seeded','1');}},[seed?JSON.stringify(seed):'']);
  const page=await ctx.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(String(e)));
  page.on('dialog',async d=>{const ans=page._ans&&page._ans.length?page._ans.shift():null;steps.push('  [ダイアログ] '+d.message()+(ans!=null?' → '+ans:''));ans===false?await d.dismiss():await d.accept(ans===null||ans===true?undefined:String(ans));});
  const steps=[];let taps=0,n=0;
  fs.mkdirSync(outDir,{recursive:true});
  await page.goto(URL_);await page.waitForTimeout(300);
  const P={page,ctx,browser,errs,steps,
    get taps(){return taps},
    note:s=>steps.push(s),
    async tap(loc,label){const l=typeof loc==='string'?page.locator(loc).first():loc.first();
      await l.scrollIntoViewIfNeeded();const bb=await l.boundingBox();
      await l.tap();taps++;steps.push(`タップ${taps}: ${label||loc} ${bb?`(${Math.round(bb.width)}×${Math.round(bb.height)}px y=${Math.round(bb.y)})`:''}`);await page.waitForTimeout(150);},
    async type(loc,val,label){const l=typeof loc==='string'?page.locator(loc).first():loc.first();await l.tap();taps++;await l.fill('');await l.type(String(val));await l.evaluate(e=>e.dispatchEvent(new Event('change',{bubbles:true})));steps.push(`タップ${taps}+入力: ${label||loc} ← ${val}`);await page.waitForTimeout(100);},
    async shot(name){n++;const f=path.join(outDir,`${persona}_${pad(n)}_${name}.png`);await page.screenshot({path:f});steps.push('  📷 '+path.basename(f));return f;},
    async small(){ // 44px 未満の押せる物
      return page.evaluate(()=>[...document.querySelectorAll('button,input,select,td[data-d],.row[data-id],[onclick],a')].filter(e=>{const r=e.getBoundingClientRect();const st=getComputedStyle(e);return r.width>0&&r.height>0&&st.display!=='none'&&st.visibility!=='hidden'&&(r.width<44||r.height<44);}).map(e=>{const r=e.getBoundingClientRect();return `${(e.textContent||e.placeholder||e.tagName).trim().slice(0,12)}(${Math.round(r.width)}×${Math.round(r.height)})`;}));},
    async data(){return page.evaluate(()=>Object.keys(localStorage).reduce((a,k)=>(a[k]=localStorage.getItem(k),a),{}));},
    async close(){await browser.close();}};
  return P;
}
module.exports={open,seedV1,dAgo,ymd};
