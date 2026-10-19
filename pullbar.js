// いちばん下まで送った所からさらに引っぱる＝下に「‹ 戻る／更新／進む ›」の帯（4秒で消える）。
// スマホ＝指を上へ120px／パソコン＝下へのホイールをもう3目盛ほど回す（社長 10/19「筋トレや雑誌、マイン、とにかくあらゆるもの全て」）。
// アプリの中（PULLBAR・APP.bar がある）＝アプリの帯を出す（作りはアプリの Bar.java／Main.java の PULL と同じ）。枠（iframe）の中でも外のアプリの帯。
// アプリの外（パソコンの Chrome・スマホの Chrome）＝このページの一番外に同じ帯を描く。
(function(){
  if (window.__pull) return; window.__pull = 1;
  var sy = null, el = null, wa = 0, wt = 0;
  function bar(){   // アプリが無い時に一番外のページに描く帯
    var d = top.document, b = d.getElementById('__pbar'), w = top;
    if (!b) {
      b = d.createElement('div'); b.id = '__pbar';
      var bg = getComputedStyle(d.body).backgroundColor; if (!bg || /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) bg = '#f4f1ea';
      var m = bg.match(/\d+/g) || [244, 241, 234], fg = (m[0] * 3 + m[1] * 6 + m[2] * 1) / 10 < 128 ? '#fff' : '#40311f';
      b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:52px;z-index:2147483647;display:none;background:' + bg + ';box-shadow:0 -2px 8px rgba(0,0,0,.25)';
      [['‹ 戻る', function(){ w.history.back(); }], ['更新', function(){ w.location.reload(); }], ['進む ›', function(){ w.history.forward(); }]].forEach(function(x){
        var k = d.createElement('button'); k.textContent = x[0];
        k.style.cssText = 'flex:1;height:100%;border:0;background:none;font:16px sans-serif;cursor:pointer;color:' + fg;
        k.onclick = function(){ b.style.display = 'none'; x[1](); }; b.appendChild(k);
      });
      d.body.appendChild(b);
    }
    b.style.display = 'flex'; clearTimeout(b._t); b._t = setTimeout(function(){ b.style.display = 'none'; }, 4000);
  }
  function show(){ try{ var t = top; if (t.PULLBAR) t.PULLBAR.show(); else if (t.APP && t.APP.bar) t.APP.bar(); else bar(); }catch(e){ try { bar(); } catch (e2) {} } }
  function sc(t){ for(; t && t !== document.body; t = t.parentElement){ var s = getComputedStyle(t); if ((s.overflowY == 'auto' || s.overflowY == 'scroll') && t.scrollHeight > t.clientHeight + 2) return t; } return document.scrollingElement; }
  function end(e){ return e.scrollTop + e.clientHeight >= e.scrollHeight - 3; }
  function typing(t){ return t.closest && t.closest('textarea,input,select'); }
  document.addEventListener('touchstart', function(e){ var t = e.target; el = typing(t) ? null : sc(t); sy = (el && end(el)) ? e.touches[0].clientY : null; }, {passive:true, capture:true});
  document.addEventListener('touchmove', function(e){ if (!el) return; var y = e.touches[0].clientY; if (!end(el)) { sy = null; return; } if (sy == null) { sy = y; return; } if (sy - y > 120) { sy = -1e9; show(); } }, {passive:true, capture:true});
  // パソコン：回し始めた時にもう一番下＝そこから下へ300ぶん回したら帯（下へ送って来た勢いの続きでは出さん＝間が0.4秒あいたら数え直し）
  document.addEventListener('wheel', function(e){
    var now = Date.now(), t = e.target, s = typing(t) ? null : sc(t);
    if (now - wt > 400) wa = (s && end(s)) ? 0 : -1;
    wt = now;
    if (wa < 0 || !s || e.deltaY <= 0 || !end(s)) { wa = -1; return; }
    wa += e.deltaMode ? e.deltaY * 40 : e.deltaY;
    if (wa >= 300) { wa = -1; show(); }
  }, {passive:true, capture:true});
})();

// ⏎ 文を打つ欄＝Enter1回は改行・すぐもう1回で送る（社長 10/19「すべての欄で改行できるように・2回押しで送信。全社員の全ツールで共通」）。
// data-go="押すボタン" を付けた textarea だけ（近い親から順にそのボタンを探して押す）。スマホでも同じ。変換中のEnter・Shift+Enter は数えん。
// 間に何か打つ・欄を押してカーソルを動かすと数え直し（office.html の会話の欄と同じ作り）。
(function(){
  if (window.__ent2) return; window.__ent2 = 1;
  function go(t){ var s = t.getAttribute('data-go'); for (var p = t.parentElement; p; p = p.parentElement){ var b = p.querySelector(s); if (b) return b; } return null; }
  document.addEventListener('keydown', function(e){
    var t = e.target; if (!t || t.tagName !== 'TEXTAREA' || !t.hasAttribute('data-go')) return;
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key !== 'Enter' || e.shiftKey){ t._ent2 = 0; return; }
    var p = t.selectionStart;
    if (t._ent2 && p === t.selectionEnd && p > 0 && t.value[p-1] === '\n'){
      e.preventDefault(); t._ent2 = 0;
      t.value = t.value.slice(0, p-1) + t.value.slice(p); t.selectionStart = t.selectionEnd = p-1;
      t.dispatchEvent(new Event('input', {bubbles:true}));
      var b = go(t); if (b) b.click(); return;
    }
    t._ent2 = 1;
  }, true);
  document.addEventListener('pointerdown', function(e){ var t = e.target; if (t && t.tagName === 'TEXTAREA') t._ent2 = 0; }, true);
})();
