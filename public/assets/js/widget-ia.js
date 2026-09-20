/**
 * Chat com a IA da PGC — carregado SÓ quando faz sentido.
 *
 * O widget tem ~60 KB. Baixá-lo junto com a página atrasaria a primeira pintura
 * para quem nem vai abrir o chat, e isso pesa no Google (Core Web Vitals). Por
 * isso ele entra na primeira interação da pessoa (rolar, tocar, teclar) ou
 * depois de alguns segundos parado — em economia de dados, só com interação.
 *
 * A aparência, o nome do bot, as mensagens rápidas e o formulário de lead NÃO
 * ficam aqui: vêm da configuração do workspace no painel da Automação
 * (Configurações → Integração → Chat Online). Mudou lá, muda aqui sem deploy.
 *
 * Para desligar o chat em uma página específica, basta colocar no <body>:
 *   <body data-sem-chat-ia>
 */
(function () {
  'use strict';

  var CFG = {
    workspace: 'ed65f187-0106-4fd5-a043-0cfb1849a3d2',
    apiUrl: 'https://api.osociohoteleiro.com.br/api',
    position: 'bottom-right',
  };
  var ESPERA_MS = 6000;

  if (document.body && document.body.hasAttribute('data-sem-chat-ia')) return;

  var carregado = false;

  function iniciar() {
    if (carregado) return;
    carregado = true;

    var s = document.createElement('script');
    s.src = CFG.apiUrl + '/widget/widget.min.js';
    s.async = true;
    s.onload = function () {
      try {
        if (window.OSHWidget) {
          window.OSHWidget.init({
            workspace: CFG.workspace,
            apiUrl: CFG.apiUrl,
            type: 'floating',
            position: CFG.position,
            // Pergunta por áudio, igual ao chat do site da Inovaihotel (ADR-399)
            voiceInput: true,
          });
        }
      } catch (e) {
        /* o chat nunca derruba a página */
      }
    };
    document.body.appendChild(s);
  }

  var eventos = ['scroll', 'pointerdown', 'keydown', 'touchstart'];
  eventos.forEach(function (e) {
    window.addEventListener(e, iniciar, { once: true, passive: true });
  });

  var economia = navigator.connection && navigator.connection.saveData;
  if (!economia) setTimeout(iniciar, ESPERA_MS);
})();
