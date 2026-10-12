// ===== 筋肉マップ（正面・背面の平面図）＝社長 10/12「1か月トレーニングするたびに鍛えた筋肉が赤くなる」→同日「3Dがしょぼい。平面図に、正面・背面の」 =====
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
// 月（'YYYY-MM'）のセット数を筋肉ごとに数える
export function tally(D,ym,norm){const t={},by={};for(const k in MUS){t[k]=0;by[k]={};}
  for(const d in D.days){if(!d.startsWith(ym))continue;for(const x of D.days[d]){const e=D.ex.find(y=>y.id===x.ex);if(!e)continue;
    const n=x.sets.filter(s=>+s.r>0).length;if(!n)continue;const h=hits(e,norm);
    for(const k in h){t[k]+=n*h[k];by[k][e.name]=(by[k][e.name]||0)+n*h[k];}}}
  return {t,by};}

// ===== 体の絵（正面・背面）。右半分だけ描いて左は鏡に写す。体の中心＝x100 =====
const BASE='M100,50 L108,52 C110,60 114,64 124,68 L136,72 C140,90 140,110 138,124 C136,150 132,175 130,200 C136,214 140,226 140,240 C142,270 140,300 136,326 C138,350 138,380 132,408 L138,428 L112,430 L114,410 C108,380 106,350 108,330 C104,300 103,270 103,240 L100,240 Z '+
 'M136,72 C154,70 164,86 162,108 C162,130 164,150 164,164 C168,190 168,215 160,232 L162,252 C158,262 147,262 145,252 L148,232 C142,212 140,190 142,166 C141,150 141,130 140,112 Z';
const FORE='M146,168 C157,168 166,184 165,204 C163,218 158,228 154,232 L148,232 C142,214 140,188 146,168 Z';
const FRONT=[['trap','M104,56 C110,62 120,67 132,71 L110,74 C106,68 104,62 104,56 Z'],['deltS','M136,71 C152,69 163,84 161,106 L154,110 C153,94 148,80 136,71 Z'],
 ['deltF','M133,74 C146,80 153,96 152,112 C143,110 135,100 130,88 C130,82 131,77 133,74 Z'],['chest','M102,78 C114,74 128,76 134,88 C140,100 138,114 128,120 C118,124 108,122 102,118 Z'],
 ['biceps','M146,116 C156,118 161,134 159,152 C157,162 151,166 147,162 C143,148 142,130 146,116 Z'],['fore',FORE],
 ['abs','M102,124 L119,124 C121,150 121,178 117,206 C111,214 106,216 102,216 Z'],['oblique','M122,124 C132,128 135,146 133,172 C131,190 126,200 120,206 C124,180 124,150 122,124 Z'],
 ['adduct','M104,232 C110,240 113,262 112,292 C107,282 104,262 104,244 Z'],['quad','M114,228 C124,220 136,226 139,246 C141,274 137,302 131,320 C125,328 116,327 113,318 C113,296 115,262 114,228 Z'],
 ['calf','M112,342 C119,338 128,342 130,362 C131,382 126,398 122,404 L117,404 C112,390 110,366 112,342 Z']];
const BACK=[['trap','M100,54 C106,60 118,66 134,72 C124,82 110,100 100,124 Z'],['deltR','M135,72 C152,71 163,86 161,106 L153,110 C150,94 143,82 132,78 Z'],
 ['lat','M104,126 C112,110 122,98 134,92 C139,112 137,140 130,160 C120,176 110,186 104,190 Z'],['erector','M101,132 C104,140 108,150 108,160 C110,182 110,202 108,214 L101,214 Z'],
 ['triceps','M145,114 C155,116 161,132 159,152 C156,162 150,166 145,160 C142,142 141,126 145,114 Z'],['fore',FORE],
 ['glute','M101,218 C114,210 134,212 139,232 C142,250 134,264 120,266 C110,266 104,260 101,252 Z'],['ham','M106,272 C118,266 134,270 137,290 C139,304 135,316 129,324 L112,324 C108,306 104,288 106,272 Z'],
 ['calf','M110,340 C122,332 136,340 136,362 C136,380 130,392 124,396 L116,396 C110,384 108,360 110,340 Z']];
const mix=(a,b,v)=>'#'+[0,2,4].map(i=>Math.round(parseInt(a.substr(i,2),16)*(1-v)+parseInt(b.substr(i,2),16)*v).toString(16).padStart(2,'0')).join('');
export function color(n){const v=Math.min(1,(n||0)/FULL);return v?mix('f1e4da','b3000f',.3+.7*v):'#f1e4da';}
function fig(list,t,label,abs){const half=list.map(([k,d])=>`<path data-k="${k}" d="${d}" fill="${color(t[k])}"/>`).join('');
  const lines=abs?'<path d="M102,148 H119 M102,172 H120 M102,196 H118" stroke="#fff" stroke-width="1.6" fill="none"/>':'';
  const side=`<path d="${BASE}" fill="#c3c8cf"/>${half}${lines}`;
  return `<svg viewBox="0 0 200 448" style="flex:1;max-width:240px;height:auto"><g stroke="#fff" stroke-width="1.4" stroke-linejoin="round">
   <ellipse cx="100" cy="30" rx="19" ry="23" fill="#c3c8cf"/>${side}<g transform="translate(200,0) scale(-1,1)">${side}</g></g>
   <text x="100" y="445" text-anchor="middle" font-size="14" fill="#777">${label}</text></svg>`;}
export function svg(t){return `<div style="display:flex;justify-content:center;gap:4px">${fig(FRONT,t,'正面',1)}${fig(BACK,t,'背面')}</div>`;}
