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

