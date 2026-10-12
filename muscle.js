// ===== 筋肉マップ（3D）＝社長 10/12「1か月トレーニングするたびに鍛えた筋肉が赤くなる・回して見られる」 =====
// その月にやったセット数を筋肉ごとに数えて、多いほど赤を濃くする。主に効く筋肉は1セット＝1、補助で効く筋肉は0.3〜0.8で数える
// 40セット（週10セット前後＝筋肥大の研究でよく使われる目安）で真っ赤になる
import * as THREE from 'https://esm.sh/three@0.160.0';
import {OrbitControls} from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

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

// ===== 体の形（左右は x の符号を変えて2つ作る）。単位はだいたいメートル・顔は +z 向き =====
const SKIN=0x9fa6ae,PALE=new THREE.Color(0xf1e4da),RED=new THREE.Color(0xb3000f);
const BODY=[// 色の付かん所＝[形,位置,大きさ]
 ['s',[0,1.63,0],[.1,.12,.11]],['c',[0,1.5,-.01],[.055,.09]],['s',[0,1.2,-.005],[.17,.29,.115]],['s',[0,.93,0],[.165,.12,.11]],
 ['c',[.27,1.17,0],[.045,.22],1],['c',[.285,.87,.01],[.035,.2],1],['s',[.29,.71,.01],[.035,.06,.025],1],
 ['c',[.1,.64,0],[.07,.36],1],['c',[.1,.27,0],[.045,.36],1],['s',[.1,.04,.05],[.05,.035,.11],1]];
const PARTS3=[// 筋肉＝[名前,位置,大きさ,左右あり]
 ['chest',[.085,1.3,.075],[.092,.068,.045],1],['abs',[0,1.07,.085],[.07,.15,.04]],['oblique',[.135,1.08,.055],[.045,.12,.055],1],
 ['deltF',[.22,1.355,.045],[.05,.07,.045],1],['deltS',[.255,1.36,0],[.05,.072,.052],1],['deltR',[.22,1.355,-.045],[.05,.07,.045],1],
 ['trap',[0,1.39,-.075],[.14,.1,.04]],['trap',[0,1.47,-.035],[.08,.05,.045]],['lat',[.115,1.2,-.075],[.085,.15,.045],1],['erector',[.04,1.02,-.1],[.033,.13,.03],1],
 ['biceps',[.27,1.17,.035],[.042,.1,.035],1],['triceps',[.27,1.18,-.033],[.046,.115,.04],1],['fore',[.285,.9,.01],[.04,.11,.04],1],
 ['glute',[.08,.9,-.085],[.09,.09,.06],1],['quad',[.1,.65,.04],[.07,.17,.055],1],['ham',[.1,.65,-.04],[.065,.17,.05],1],['adduct',[.05,.69,0],[.035,.13,.045],1],
 ['calf',[.1,.3,-.03],[.05,.12,.05],1]];

let R=null;
export function stop(){if(!R)return;cancelAnimationFrame(R.raf);R.ro&&R.ro.disconnect();R.ctl.dispose();R.ren.dispose();R.ren.forceContextLoss&&R.ren.forceContextLoss();R=null;}
// el に3Dを描く。t＝筋肉ごとのセット数。tap(名前キー)＝筋肉を押した時
export function show(el,t,tap){stop();const W=()=>el.clientWidth||320,H=()=>el.clientHeight||420;
  const ren=new THREE.WebGLRenderer({antialias:true,alpha:true});ren.setPixelRatio(Math.min(2,devicePixelRatio||1));ren.setSize(W(),H());el.appendChild(ren.domElement);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,W()/H(),.1,20);cam.position.set(0,1.0,3.6);
  sc.add(new THREE.HemisphereLight(0xffffff,0x887766,1.6));const dl=new THREE.DirectionalLight(0xffffff,1.6);dl.position.set(1.5,2.5,2.5);sc.add(dl);
  const dl2=new THREE.DirectionalLight(0xffffff,.8);dl2.position.set(-1.5,1.5,-2.5);sc.add(dl2);
  const sph=new THREE.SphereGeometry(1,32,24),grp=new THREE.Group();sc.add(grp);const base=new THREE.MeshStandardMaterial({color:SKIN,roughness:.85});
  const both=(p,f)=>{f(p);if(p[0])f([-p[0],p[1],p[2]]);};
  BODY.forEach(([k,p,s,lr])=>{const mk=q=>{let m;if(k==='s'){m=new THREE.Mesh(sph,base);m.scale.set(...s);}else{m=new THREE.Mesh(new THREE.CapsuleGeometry(s[0],s[1],8,16),base);}
    m.position.set(...q);grp.add(m);};lr?both(p,mk):mk(p);});
  const pick=[];
  PARTS3.forEach(([k,p,s,lr])=>{const v=Math.min(1,(t[k]||0)/FULL);const col=PALE.clone().lerp(RED,v===0?0:.35+.65*v);
    const mat=new THREE.MeshStandardMaterial({color:col,roughness:.55,metalness:0});
    const mk=q=>{const m=new THREE.Mesh(sph,mat);m.scale.set(...s);m.position.set(...q);m.userData.k=k;grp.add(m);pick.push(m);};lr?both(p,mk):mk(p);});
  grp.position.y=-.05;
  const ctl=new OrbitControls(cam,ren.domElement);ctl.target.set(0,.9,0);ctl.enablePan=false;ctl.minDistance=1.6;ctl.maxDistance=5;ctl.autoRotate=true;ctl.autoRotateSpeed=1.6;ctl.enableDamping=true;ctl.update();
  ctl.addEventListener('start',()=>{ctl.autoRotate=false;});
  // 押した筋肉の名前を出す（回すためのドラッグとは分ける＝ほぼ動かさず離した時だけ）
  const rc=new THREE.Raycaster();let dn=null;ren.domElement.addEventListener('pointerdown',e=>{dn=[e.clientX,e.clientY];});
  ren.domElement.addEventListener('pointerup',e=>{if(!dn||Math.hypot(e.clientX-dn[0],e.clientY-dn[1])>6)return;const b=ren.domElement.getBoundingClientRect();
    rc.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1),cam);const h=rc.intersectObjects(pick)[0];tap&&tap(h?h.object.userData.k:null);});
  R={ren,ctl,raf:0};const loop=()=>{R.raf=requestAnimationFrame(loop);ctl.update();ren.render(sc,cam);};loop();
  if(window.ResizeObserver){R.ro=new ResizeObserver(()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix();});R.ro.observe(el);}
  return {spin:on=>{ctl.autoRotate=on;}};}
