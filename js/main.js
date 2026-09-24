/* ==========================================================
   Configuração: cole aqui o link do seu checkout.
   Todos os botões com data-checkout passam a usar este link.
   ========================================================== */
var CHECKOUT_URL = "#";

(function () {
  // Link de checkout
  if (CHECKOUT_URL && CHECKOUT_URL !== "#") {
    document.querySelectorAll("[data-checkout]").forEach(function (a) { a.href = CHECKOUT_URL; });
  }

  // Imagens: enquanto o arquivo não existir, mostra o espaço reservado
  document.querySelectorAll(".ph img").forEach(function (img) {
    var box = img.closest(".ph");
    function check() {
      if (img.complete && img.naturalWidth === 0) box.setAttribute("data-empty", "");
      else if (img.complete) box.removeAttribute("data-empty");
    }
    img.addEventListener("error", function () { box.setAttribute("data-empty", ""); });
    img.addEventListener("load", function () { box.removeAttribute("data-empty"); });
    img.loading = "eager"; // garante que o espaço reservado apareça já no primeiro carregamento
    check();
  });

  // Contadores
  function pad(n) { return String(n).padStart(2, "0"); }
  function fmt(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60);
  }
  var sessionEnd = Date.now() + 12 * 3600 * 1000;
  try {
    var saved = Number(localStorage.getItem("offerEnd"));
    if (saved > Date.now()) sessionEnd = saved; else localStorage.setItem("offerEnd", sessionEnd);
  } catch (e) {}
  function tick() {
    var now = new Date();
    var midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
    document.querySelectorAll("[data-countdown]").forEach(function (el) {
      el.textContent = fmt(el.dataset.countdown === "midnight" ? midnight - now : sessionEnd - now);
    });
  }
  tick(); setInterval(tick, 1000);

  // Carrosséis (galeria com rolagem, depoimentos com deslize)
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-track]");
    var slides = Array.prototype.slice.call(track.children);
    var dots = buildDots(root, slides.length, function (i) {
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft - (track.clientWidth - slides[i].clientWidth) / 2, behavior: "smooth" });
    });
    function current() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, dist = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - track.offsetLeft + s.clientWidth / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    }
    track.addEventListener("scroll", function () { dots.set(current()); }, { passive: true });
    root.querySelector("[data-prev]").addEventListener("click", function () { dots.go(Math.max(0, current() - 1)); });
    root.querySelector("[data-next]").addEventListener("click", function () { dots.go(Math.min(slides.length - 1, current() + 1)); });
    dots.set(0);
  });

  document.querySelectorAll("[data-testi]").forEach(function (root) {
    var track = root.querySelector("[data-track]");
    var n = track.children.length, i = 0;
    var dots = buildDots(root, n, show);
    function show(k) { i = (k + n) % n; track.style.transform = "translateX(" + (-100 * i) + "%)"; dots.set(i); }
    root.querySelector("[data-prev]").addEventListener("click", function () { show(i - 1); });
    root.querySelector("[data-next]").addEventListener("click", function () { show(i + 1); });
    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    show(0);
  });

  function buildDots(root, n, go) {
    var wrap = root.querySelector("[data-dots]");
    var btns = [];
    for (var k = 0; k < n; k++) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Ir para o item " + (k + 1));
      b.addEventListener("click", go.bind(null, k));
      wrap.appendChild(b); btns.push(b);
    }
    return {
      go: go,
      set: function (idx) { btns.forEach(function (b, j) { b.setAttribute("aria-current", j === idx ? "true" : "false"); }); }
    };
  }

  // FAQ: abre uma pergunta por vez
  var items = document.querySelectorAll(".faq details");
  items.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
