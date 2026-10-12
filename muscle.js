import {FRONT,BACK,OUT_F,OUT_B} from "./body_svg.js";
// ===== 筋肉マップ（正面・背面の平面図・拾ってきた筋肉図）＝社長 10/12「1か月トレーニングするたびに鍛えた筋肉が赤くなる」→同日「3Dがしょぼい。平面図に、正面・背面の」 =====
// その月にやったセット数を筋肉ごとに数えて、多いほど赤を濃くする。主に効く筋肉は1セット＝1、補助で効く筋肉は0.3〜0.8で数える
// 40セット（週10セット前後＝筋肥大の研究でよく使われる目安）で真っ赤になる
export const FULL=40;
export const MUS={chest:'大胸筋',deltF:'肩の前（三角筋前部）',deltS:'肩の横（三角筋中部）',deltR:'肩の後ろ（三角筋後部）',trap:'僧帽筋（首〜背中の上）',lat:'広背筋（背中の横）',
  erector:'脊柱起立筋（背骨の両わき）',biceps:'力こぶ（上腕二頭筋）',triceps:'二の腕の裏（上腕三頭筋）',fore:'前腕',abs:'腹筋（腹直筋）',oblique:'わき腹（腹斜筋）',
  glute:'お尻（大臀筋）',quad:'太ももの前（大腿四頭筋）',ham:'太ももの裏（ハムストリング）',adduct:'内もも（内転筋）',calf:'ふくらはぎ'};
// 種目ごとの効く筋肉（名前の一部が合えば使う＝上から順に見る）
const MAP=[
 ['リバースダンベルフライ',{deltR:1,trap:.7}],['リバースフライ',{deltR:1,trap:.7}],
 ['ダンベルフライ',{chest:1,deltF:.3}],['リアレイズ',{deltR:1,trap:.6}],
 ['インクライン',{chest:1,deltF:.6,triceps:.4}],
 ['ディップス',{chest:1,triceps:1,deltF:.5}],
 ['ベンチプレス',{chest:1,deltF:.5,triceps:.5}],['チェストプレス',{chest:1,deltF:.5,triceps:.5}],['腕立て',{chest:1,deltF:.5,triceps:.5,abs:.2}],['プッシュアップ',{chest:1,deltF:.5,triceps:.5}],
 ['リバースグリップチンニング',{lat:1,biceps:.8,trap:.3,fore:.3}],
 ['チンニング',{lat:1,biceps:.5,trap:.4,deltR:.3,fore:.3}],['懸垂',{lat:1,biceps:.5,trap:.4,deltR:.3,fore:.3}],['ラットプル',{lat:1,biceps:.5,trap:.3,deltR:.3}],['ロウ',{lat:1,trap:.6,deltR:.4,biceps:.4}],
 ['ルーマニアン',{ham:1,glute:1,erector:.7,fore:.3}],['デッドリフト',{ham:.8,glute:1,erector:1,trap:.4,fore:.4,quad:.3}],
 ['サイドレイズ',{deltS:1,trap:.3}],['フロントレイズ',{deltF:1}],
 ['ショルダープレス',{deltF:1,deltS:.6,triceps:.5,trap:.2}],
 ['カール',{biceps:1,fore:.5}],
 ['エクステンション',{triceps:1}],['キックバック',{triceps:1}],['フレンチプレス',{triceps:1}],
 ['クランチ',{abs:1,oblique:.3}],['プランク',{abs:1,oblique:.5}],['レッグレイズ',{abs:1}],['ツイスト',{oblique:1,abs:.4}],
 ['ブルガリアン',{quad:1,glute:.8,ham:.3,adduct:.3}],['ランジ',{quad:1,glute:.8,ham:.3,adduct:.3}],
 ['スクワット',{quad:1,glute:.7,adduct:.4,erector:.3,ham:.2}],['レッグプレス',{quad:1,glute:.6,adduct:.3}],['レッグエクステンション',{quad:1}],
 ['レッグカール',{ham:1}],['ヒップスラスト',{glute:1,ham:.4}],['カーフ',{calf:1}],['シュラッグ',{trap:1,fore:.3}]];
// 名前で見つからん新しい種目は、アプリの「部位」で決める
const PART={'胸':{chest:1,deltF:.3,triceps:.3},'背中':{lat:1,biceps:.3,trap:.3},'肩':{deltS:1,deltF:.5},'腕':{biceps:.7,triceps:.7},'腹':{abs:1,oblique:.4},'脚':{quad:1,ham:.6,glute:.4},'尻':{glute:1,ham:.3}};
export function hits(e,norm){const n=norm(e.name);for(const [k,v] of MAP)if(n.includes(norm(k)))return v;return PART[e.part]||{};}
// リセットしてから今までのセット数を筋肉ごとに数える（社長 10/12「リセットボタンを押すまで蓄積」）
// R＝D.musR＝{d:リセットした日,base:{種目id:その日リセット時点で入っとったセット数}}・無ければ記録の最初から全部
export function tally(D,R,norm){const t={},by={};for(const k in MUS){t[k]=0;by[k]={};}
  for(const d in D.days){if(R&&d<R.d)continue;for(const x of D.days[d]){const e=D.ex.find(y=>y.id===x.ex);if(!e)continue;
    let n=x.sets.filter(s=>+s.r>0).length;if(R&&d===R.d)n-=((R.base||{})[x.ex]||0);if(n<=0)continue;const h=hits(e,norm);
    for(const k in h){t[k]+=n*h[k];by[k][e.name]=(by[k][e.name]||0)+n*h[k];}}}
  return {t,by};}

// ===== 体の絵（正面・背面）＝body_svg.js（拾ってきた筋肉図）。絵の部位→この表の筋肉。肩は正面＝前＋横、背面＝後ろ =====
const SLUG={f:{chest:['chest'],obliques:['oblique'],abs:['abs'],biceps:['biceps'],triceps:['triceps'],trapezius:['trap'],deltoids:['deltF','deltS'],
  adductors:['adduct'],quadriceps:['quad'],calves:['calf'],forearm:['fore']},
 b:{trapezius:['trap'],deltoids:['deltR','deltS'],'upper-back':['lat'],triceps:['triceps'],'lower-back':['erector'],forearm:['fore'],gluteal:['glute'],
  adductors:['adduct'],hamstring:['ham'],calves:['calf']}};
const mix=(a,b,v)=>'#'+[0,2,4].map(i=>Math.round(parseInt(a.substr(i,2),16)*(1-v)+parseInt(b.substr(i,2),16)*v).toString(16).padStart(2,'0')).join('');
// 温度の色＝社長 10/12「鍛えるほど温度が上がる。低い所は青、負荷をかけるほど赤」＝0は青→水色→黄→橙→40セットで赤
export const HEAT=['2f5bd8','36b3e8','f2d544','f28a24','c8001a'];
// 最初の数セットで色が動くように平方根で曲げる（10セット＝水色と黄の間・20セット＝黄〜橙・40セット＝赤）
export function color(n){const v=Math.sqrt(Math.min(1,(n||0)/FULL))*(HEAT.length-1),i=Math.min(HEAT.length-2,Math.floor(v));return mix(HEAT[i],HEAT[i+1],v-i);}
// 押した所の名前とセット数（data-k＝'f:deltoids' の形）
export function part(t,key){const [s,g]=key.split(':'),ks=(SLUG[s]||{})[g]||[];return {name:ks.map(k=>MUS[k]).join('＋'),n:ks.reduce((a,k)=>a+(t[k]||0),0)};}
function fig(side,list,out,vb,t,label,sm){const map=SLUG[side];
  const ps=list.map(([g,d])=>{const ks=map[g];if(!ks)return `<path d="${d}" fill="#c9cdd3"/>`;const n=ks.reduce((a,k)=>a+(t[k]||0),0);
    return `<path data-k="${side}:${g}" d="${d}" fill="${color(n)}" stroke="#fff" stroke-width="2"/>`;}).join('');
  return `<div style="flex:1;max-width:${sm?120:230}px;text-align:center"><svg viewBox="${vb}" style="width:100%;height:auto"><path d="${out}" fill="none" stroke="#9aa0a8" stroke-width="2"/>${ps}</svg>
   <div style="font-size:${sm?11:13}px;color:#777">${label}</div></div>`;}
export function svg(t,sm){return `<div style="display:flex;justify-content:center;gap:4px">${fig('f',FRONT,OUT_F,'0 0 724 1448',t,'正面',sm)}${fig('b',BACK,OUT_B,'724 0 724 1448',t,'背面',sm)}</div>`;}
