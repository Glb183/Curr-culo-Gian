/* ============================================================
   Currículo — Gian Luca Bin Tortato
   Animações de entrada, impressão em PDF, cópia do e-mail
   e destaque da seção atual na barra superior
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Avisos flutuantes ---------- */

  var toast = document.getElementById("toast");
  var toastTimer = null;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  /* ---------- 2. Aparecer conforme a rolagem ---------- */

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------- 3. Baixar em PDF ---------- */

  function abrirImpressao() {
    window.print();
  }

  ["btn-pdf", "btn-pdf-2"].forEach(function (id) {
    var botao = document.getElementById(id);
    if (botao) botao.addEventListener("click", abrirImpressao);
  });

  /* ---------- 4. Copiar o e-mail ---------- */

  var botaoEmail = document.getElementById("btn-email");

  if (botaoEmail) {
    botaoEmail.addEventListener("click", function () {
      var endereco = botaoEmail.getAttribute("data-email") || "";

      function terminar() {
        notify("E-mail copiado: " + endereco);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(endereco).then(terminar, function () {
          copiarAntigo(endereco, terminar);
        });
      } else {
        copiarAntigo(endereco, terminar);
      }
    });
  }

  function copiarAntigo(texto, aoTerminar) {
    var campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.top = "-1000px";
    document.body.appendChild(campo);
    campo.select();

    try {
      document.execCommand("copy");
      aoTerminar();
    } catch (erro) {
      notify("Não foi possível copiar — use: " + texto);
    }

    document.body.removeChild(campo);
  }

  /* ---------- 5. Seção atual na barra superior ---------- */

  var links = Array.prototype.slice.call(
    document.querySelectorAll(".topbar__links a")
  );

  var secoes = links
    .map(function (link) {
      var alvo = document.querySelector(link.getAttribute("href"));
      return alvo ? { link: link, alvo: alvo } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && secoes.length) {
    var atual = null;

    var vigia = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          var encontrada = secoes.filter(function (s) {
            return s.alvo === entrada.target;
          })[0];
          if (!encontrada || encontrada.link === atual) return;

          secoes.forEach(function (s) {
            s.link.classList.remove("is-active");
          });
          encontrada.link.classList.add("is-active");
          atual = encontrada.link;
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    secoes.forEach(function (s) {
      vigia.observe(s.alvo);
    });
  }

  /* ---------- 6. Atalho de teclado ---------- */

  document.addEventListener("keydown", function (evento) {
    if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "p") {
      evento.preventDefault();
      abrirImpressao();
    }
  });
})();
