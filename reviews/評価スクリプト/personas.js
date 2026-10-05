// 今の画面に合わせたペルソナ操作（周ごとに更新）
const {open,seedV1,dAgo}=require('./common');const fs=require('fs');
const OUT=process.argv[2]||'out';const ONLY=process.argv[3];const R=[];
async function run(name,seed,fn){if(ONLY&&ONLY!==name)return;const P=await open(name,seed,OUT);const before=seed?Object.keys(seed.days).length:0;
  try{await fn(P);}catch(e){P.note('❌ 詰まった: '+e.message.split('\n')[0]);await P.shot('stuck');}
  P.note('総タップ数: '+P.taps+' ／ 画面の上1/3（親指が届きにくい）を押した回数: '+P.steps.filter(x=>/y=(\d+)/.test(x)&&+x.match(/y=(\d+)/)[1]<200&&/^タップ/.test(x)).length);P.note('44px未満: '+[...new Set(await P.small())].join(', '));if(P.errs.length)P.note('JSエラー: '+P.errs.join(' / '));
  const d=await P.data();let D={};try{D=JSON.parse(d.kintore_v1);}catch(e){}
  P.note(`保存データ: 日数 ${before}→${Object.keys(D.days||{}).length} / ver=${D.ver} / 控え=${Object.keys(d).filter(k=>k!=='kintore_v1').join(',')}`);
  const td=require('./common').ymd(new Date());P.note('今日の記録: '+JSON.stringify((D.days||{})[td]||null));
  R.push('## '+name+'\n'+P.steps.join('\n'));await P.close();}
const row=(p,re)=>p.locator('.row',{hasText:re});
module.exports={run,row,R,OUT,seedV1,dAgo,fs};
