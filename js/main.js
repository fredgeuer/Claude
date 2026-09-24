/* ==========================================================
   CONFIGURAÇÃO DA OFERTA — preencha aqui.
   Campo vazio ("") aparece destacado em amarelo na página,
   para você não esquecer de preencher antes de publicar.
   ========================================================== */
var CONFIG = {
  atividades: "",       // número real de atividades, ex.: "120"
  metodo: "",           // nome próprio do método, ex.: "Método Sessão Pronta"
  oferta: "",           // nome da oferta, ex.: "Fala em Foco" (vira "Kit Fala em Foco")
  valorKit: "",         // valor separado do kit principal, só números, ex.: "97,00"
  precoCompleto: "27,90",
  precoBasico: "19,90",
  checkoutCompleto: "#", // link do checkout do plano completo
  checkoutBasico: "#"    // link do checkout do plano básico
};

(function () {
  function toNum(v) { return Number(String(v).replace(/\./g, "").replace(",", ".")); }
  function money(n) { return n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

  // Textos da configuração
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var v = CONFIG[el.dataset.cfg];
    if (v) el.textContent = v; else el.classList.add("todo");
  });
  if (CONFIG.oferta) document.title = "Kit " + CONFIG.oferta + " — atividades para fonoaudiologia infantil";

  // Soma da tabela de valor ("Você pagaria" e "De R$")
  var total = null;
  if (CONFIG.valorKit) {
    total = toNum(CONFIG.valorKit);
    document.querySelectorAll("[data-valor]").forEach(function (el) { total += Number(el.dataset.valor); });
  }
  document.querySelectorAll("[data-total]").forEach(function (el) {
    if (total !== null) el.textContent = money(total); else el.classList.add("todo");
  });

  // Diferença do upsell ("por só R$8 a mais")
  var diff = toNum(CONFIG.precoCompleto) - toNum(CONFIG.precoBasico);
  document.querySelectorAll("[data-diff]").forEach(function (el) {
    el.textContent = Number.isInteger(diff) ? String(diff) : money(diff);
  });

  // Links de checkout
  document.querySelectorAll("[data-checkout]").forEach(function (a) {
    var url = a.dataset.checkout === "basico" ? CONFIG.checkoutBasico : CONFIG.checkoutCompleto;
    if (url && url !== "#") a.href = url;
  });

  // Upsell: abre ao escolher o plano básico
  var modal = document.querySelector("[data-upsell]");
  if (modal) {
    var closeModal = function () { modal.hidden = true; document.body.style.overflow = ""; };
    document.querySelectorAll("[data-open-upsell]").forEach(function (b) {
      b.addEventListener("click", function () { modal.hidden = false; document.body.style.overflow = "hidden"; });
    });
    modal.querySelector("[data-close-upsell]").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });
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
