// Видео в блоке героя: буферизуем, стартуем с задержкой, ставим на паузу вне экрана.
(function () {
  var v = document.getElementById('heroVideo');
  if (!v) return;

  var START_DELAY_MS = 3000;   // пауза после того, как видео готово играть без остановок
  var VISIBLE_RATIO = 0.25;    // какая доля блока должна быть на экране, чтобы играть

  var ready = false;
  var visible = true;

  function play() {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function start() {
    if (ready) return;
    ready = true;
    setTimeout(function () { if (visible) play(); }, START_DELAY_MS);
  }

  v.muted = true;
  v.addEventListener('canplaythrough', start, { once: true });
  // страховка, если браузер не присылает canplaythrough
  setTimeout(function () { if (v.readyState >= 3) start(); }, 6000);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      visible = e.isIntersecting && e.intersectionRatio > VISIBLE_RATIO;
      if (!ready) return;
      if (visible) play(); else v.pause();
    }, { threshold: [0, VISIBLE_RATIO, 0.5] }).observe(v);
  }

  // при уходе на другую вкладку тоже ставим паузу
  document.addEventListener('visibilitychange', function () {
    if (!ready) return;
    if (document.hidden) v.pause(); else if (visible) play();
  });
})();
