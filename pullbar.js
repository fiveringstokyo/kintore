// 枠（iframe）の中に埋めたページ用＝いちばん下まで送った所からさらに指を上へ120px引っぱると、外のアプリの「‹ 戻る／更新／進む ›」の帯を出す。
// アプリ（本社・翻訳・料理・新聞…）が入れる引っぱりの仕掛けは外のページにしか効かん＝枠の中の指の動きが届かんかった（社長 10/17「全てのアプリの全てのページに付けろ」）。
// 作りはアプリの Bar.java／Main.java の PULL と同じ。いちばん外のページの時は何もせん（アプリの方が拾う）。
(function(){
  if (window === top || window.__pull) return; window.__pull = 1;
  var sy = null, el = null;
  function show(){ try{ var t = top; if (t.PULLBAR) t.PULLBAR.show(); else if (t.APP && t.APP.bar) t.APP.bar(); }catch(e){} }
  function sc(t){ for(; t && t !== document.body; t = t.parentElement){ var s = getComputedStyle(t); if ((s.overflowY == 'auto' || s.overflowY == 'scroll') && t.scrollHeight > t.clientHeight + 2) return t; } return document.scrollingElement; }
  function end(e){ return e.scrollTop + e.clientHeight >= e.scrollHeight - 3; }
  document.addEventListener('touchstart', function(e){ var t = e.target; el = (t.closest && t.closest('textarea,input')) ? null : sc(t); sy = (el && end(el)) ? e.touches[0].clientY : null; }, {passive:true, capture:true});
  document.addEventListener('touchmove', function(e){ if (!el) return; var y = e.touches[0].clientY; if (!end(el)) { sy = null; return; } if (sy == null) { sy = y; return; } if (sy - y > 120) { sy = -1e9; show(); } }, {passive:true, capture:true});
})();

// いちばん上まで戻した所からさらに指を下へ引っぱる＝上に「↻」が出て、離すと画面を読み直す（社長 10/19「あらゆる画面で、下にひっぱり更新」）。
// 枠の中でも外でも効く（枠の中なら外のページごと読み直す）。Chrome そのものが引っぱり更新を持っとるページ（ページ全体が動く作り）では出さん＝二重に読み直さん。
(function(){
  if (window.__ptr) return; window.__ptr = 1;
  var GO = 110, sy = null, sx = 0, el = null, dy = 0, dot = null;
  function sc(t){ for(; t && t !== document.body && t !== document.documentElement; t = t.parentElement){ var s = getComputedStyle(t); if ((s.overflowY == 'auto' || s.overflowY == 'scroll') && t.scrollHeight > t.clientHeight + 2) return t; } return document.scrollingElement || document.documentElement; }
  function native(e){   // Chrome（アプリの外）でページ全体を引っぱる時は Chrome の方が読み直す
    if (window !== top || window.APP || window.PULLBAR || /; wv\)/.test(navigator.userAgent)) return false;
    if (e !== (document.scrollingElement || document.documentElement)) return false;
    var a = getComputedStyle(document.documentElement).overscrollBehaviorY, b = document.body ? getComputedStyle(document.body).overscrollBehaviorY : 'auto';
    return a == 'auto' && b == 'auto';
  }
  function mk(){
    if (dot) return dot;
    dot = document.createElement('div');
    dot.style.cssText = 'position:fixed;left:50%;top:0;z-index:2147483647;width:40px;height:40px;margin-left:-20px;border-radius:50%;'
      + 'background:#fff;color:#40311f;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;'
      + 'font:22px/1 sans-serif;pointer-events:none;opacity:0;transform:translateY(-48px);transition:none';
    dot.textContent = '↻';
    document.body.appendChild(dot);
    return dot;
  }
  function paint(){ var d = mk(), p = Math.min(dy / GO, 1); d.style.transition = 'none'; d.style.opacity = String(p);
    d.style.transform = 'translateY(' + (Math.min(dy, GO * 1.3) * 0.6 - 48 + 12) + 'px) rotate(' + Math.round(p * 300) + 'deg)';
    d.style.background = p >= 1 ? '#40311f' : '#fff'; d.style.color = p >= 1 ? '#fff' : '#40311f'; }
  function hide(){ if (!dot) return; dot.style.transition = 'transform .2s,opacity .2s'; dot.style.opacity = '0'; dot.style.transform = 'translateY(-48px)'; }
  function reset(){ if (dy > 0) hide(); sy = null; el = null; dy = 0; }
  document.addEventListener('touchstart', function(e){
    reset();
    if (e.touches.length != 1) return;
    var t = e.target;
    if (t.closest && t.closest('textarea,input,select,[contenteditable],[contenteditable=""],[contenteditable=true]')) return;
    var s = sc(t);
    if (s.scrollTop > 0 || native(s)) return;
    el = s; sy = e.touches[0].clientY; sx = e.touches[0].clientX;
  }, {passive:true, capture:true});
  document.addEventListener('touchmove', function(e){
    if (sy == null) return;
    if (e.touches.length != 1 || el.scrollTop > 0) { reset(); return; }
    var y = e.touches[0].clientY - sy, x = Math.abs(e.touches[0].clientX - sx);
    if (dy == 0 && x > 12 && x > y) { reset(); return; }   // 横に払っとる（タブの左右の払い）＝更新やない
    dy = Math.max(0, y);
    if (dy > 8) paint(); else if (dot) hide();
  }, {passive:true, capture:true});
  document.addEventListener('touchend', function(){
    if (sy != null && dy >= GO) {
      var d = mk(); d.style.transition = 'transform .15s'; d.style.transform = 'translateY(24px)';
      setTimeout(function(){ try { top.location.reload(); } catch (e) { location.reload(); } }, 120);
      sy = null; return;
    }
    reset();
  }, {passive:true, capture:true});
  document.addEventListener('touchcancel', reset, {passive:true, capture:true});
})();
