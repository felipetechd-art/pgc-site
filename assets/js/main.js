/* ==========================================================================
   PGC — Interatividade
   ========================================================================== */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tracking (camada única; integrar com GTM/Pixel/GA) ---------- */
  function track(event, data) {
    data = data || {};
    if (window.dataLayer) window.dataLayer.push(Object.assign({ event: event }, data));
    if (typeof window.fbq === 'function') window.fbq('trackCustom', event, data);
    if (typeof window.gtag === 'function') window.gtag('event', event, data);
    // console.debug('[track]', event, data);
  }

  /* ---------- Ano no rodapé ---------- */
  var yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header sticky ---------- */
  var header = $('#header');
  var sticky = $('#stickyCta');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 20);
    if (sticky) sticky.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = $('#burger');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------- Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Calculadora de perdas ---------- */
  var cLeads = $('#cLeads'), cTicket = $('#cTicket'), cLoss = $('#cLoss'), cConv = $('#cConv');
  var out = $('#calcOut');
  var nf = new Intl.NumberFormat('pt-BR');
  function money(v) { return 'R$ ' + nf.format(Math.round(v)); }
  var calcTracked = false;
  function calc() {
    if (!cLeads) return;
    var leads = +cLeads.value, ticket = +cTicket.value, loss = +cLoss.value, conv = +cConv.value;
    $('#vLeads').textContent = nf.format(leads);
    $('#vTicket').textContent = nf.format(ticket);
    $('#vLoss').textContent = loss;
    $('#vConv').textContent = conv;
    // leads perdidos por mês * conversão recuperável * ticket
    var lost = leads * (loss / 100);
    var recoverable = lost * (conv / 100);
    var revenue = recoverable * ticket;
    out.innerHTML = money(revenue) + '<span style="font-size:1.2rem;font-weight:600">/mês</span>';
    if (!calcTracked) { calcTracked = true; track('calculadora_usada'); }
  }
  [cLeads, cTicket, cLoss, cConv].forEach(function (el) { if (el) el.addEventListener('input', calc); });
  calc();

  /* ---------- FAQ acordeão ---------- */
  $$('.faq__item').forEach(function (item) {
    var q = $('.faq__q', item), a = $('.faq__a', item);
    q.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  /* ---------- Modais ---------- */
  var lastFocus = null;
  function openModal(modal) {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var f = modal.querySelector('input, button, select, a');
    if (f) setTimeout(function () { f.focus(); }, 50);
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  var featuresModal = $('#featuresModal');
  var applyModal = $('#applyModal');

  var openFeaturesBtn = $('#openFeatures');
  if (openFeaturesBtn) openFeaturesBtn.addEventListener('click', function () { openModal(featuresModal); track('ver_funcionalidades'); });

  // Qualquer CTA de aplicação que deve abrir o formulário
  $$('[data-open-form]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(applyModal);
      track('form_aberto', { origem: b.getAttribute('data-cta') || 'desconhecido' });
    });
  });

  $$('[data-close-modal]').forEach(function (b) {
    b.addEventListener('click', function () { closeModal(featuresModal); closeModal(applyModal); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(featuresModal); closeModal(applyModal); }
  });

  /* ---------- Tracking genérico de CTAs ---------- */
  $$('[data-cta]').forEach(function (el) {
    if (el.hasAttribute('data-open-form')) return; // já rastreado acima
    el.addEventListener('click', function () {
      track('cta_clique', { id: el.getAttribute('data-cta') });
    });
  });

  /* ---------- Formulário multi-step ---------- */
  var form = $('#applyForm');
  if (form) {
    var steps = $$('.fstep', form);
    var bars = $$('.form-steps__bar i', form);
    var current = 0;

    function showStep(i) {
      steps.forEach(function (s, idx) { s.classList.toggle('active', idx === i); });
      bars.forEach(function (b, idx) { b.classList.toggle('on', idx <= i); });
      current = i;
    }
    function validateStep(i) {
      var ok = true;
      $$('.field', steps[i]).forEach(function (field) {
        var input = $('input, select', field);
        if (!input || !input.hasAttribute('required')) return;
        var valid = input.value.trim() !== '';
        if (input.type === 'email') valid = valid && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value);
        field.classList.toggle('field--error', !valid);
        if (!valid) ok = false;
      });
      return ok;
    }

    $$('[data-next]', form).forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!validateStep(current)) return;
        track('form_etapa', { etapa: current + 1 });
        showStep(Math.min(current + 1, steps.length - 1));
      });
    });
    $$('[data-prev]', form).forEach(function (btn) {
      btn.addEventListener('click', function () { showStep(Math.max(current - 1, 0)); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(current)) return;
      // Integração real: enviar via fetch para o endpoint/CRM, ou redirecionar para checkout.
      // var data = Object.fromEntries(new FormData(form).entries());
      track('form_enviado');
      form.style.display = 'none';
      $('#formSuccess').classList.add('show');
    });
  }
})();
