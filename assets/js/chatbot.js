(function () {
  'use strict';

  const CONFIG = {
    welcome: 'Bonjour ! Je suis l’assistant de Ronan. Qu’est-ce que je peux faire pour vous ?',
    destinations: {
      whatsapp: 'https://wa.me/261381154220',
      email: 'mailto:ronan077msi@gmail.com',
      cv: 'CV_Ronan_Andriamahenitsoa.pdf',
      realisations: '#testimonials',
      profil: '#skills'
    }
  };

  const CSS = `
    <style>
      @keyframes chatbot-enter {
        0% { opacity: 0; transform: translateY(24px) scale(.88); }
        68% { opacity: 1; transform: translateY(-4px) scale(1.015); }
        86% { transform: translateY(1px) scale(.995); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes chatbot-word-in {
        from { opacity:0; filter:blur(3px); transform:translateY(5px); }
        to { opacity:1; filter:blur(0); transform:translateY(0); }
      }
      @keyframes chatbot-choice-in {
        from { opacity:0; transform:translateY(7px) scale(.97); }
        to { opacity:1; transform:translateY(0) scale(1); }
      }
      #chatbot-btn, #chatbot-box { font-family: 'Raleway', 'Segoe UI', sans-serif !important; }
      #chatbot-btn {
        position: fixed !important; right: 24px !important; bottom: 24px !important;
        z-index: 999999 !important; width: 56px !important; height: 56px !important;
        display: grid !important; place-items: center !important; border: 0 !important;
        border-radius: 50% !important; background: #242424 !important; color: #fff !important;
        font-size: 1.35rem !important; cursor: pointer !important;
        box-shadow: 0 8px 24px rgba(0,0,0,.2) !important;
        transition: transform .2s ease, box-shadow .2s ease, background .2s ease !important;
      }
      #chatbot-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 12px 28px rgba(0,0,0,.25) !important; }
      #chatbot-btn:focus-visible, #chatbot-box button:focus-visible, #chatbot-input:focus-visible, #chatbot-box a:focus-visible {
        outline: 3px solid #7c9cff !important; outline-offset: 3px !important;
      }
      #chatbot-btn span { display:inline-block !important; transition:transform .28s cubic-bezier(.2,.8,.2,1) !important; }
      #chatbot-btn.open span { transform:rotate(-12deg) scale(1.12) !important; }
      #chatbot-box {
        position: fixed !important; right: 24px !important; bottom: 92px !important;
        z-index: 999998 !important; width: 370px !important; max-width: calc(100vw - 32px) !important;
        max-height: min(620px, calc(100dvh - 120px)) !important; display: none !important;
        flex-direction: column !important; overflow: hidden !important; border-radius: 20px !important;
        border: 1px solid rgba(0,0,0,.1) !important; background: #fff !important; color: #242424 !important;
        box-shadow: 0 20px 64px rgba(0,0,0,.2), 0 2px 8px rgba(0,0,0,.06) !important;
      }
      #chatbot-box.open { display: flex !important; transform-origin:bottom right !important; animation:chatbot-enter .42s cubic-bezier(.16,1,.3,1) both !important; }
      #chatbot-header { display:flex !important; align-items:center !important; justify-content:space-between !important; gap:12px !important; padding:16px 18px !important; background:#242424 !important; color:#fff !important; }
      #chatbot-header .title { font-size:.95rem !important; font-weight:700 !important; letter-spacing:.01em !important; }
      #chatbot-header .status { margin-top:4px !important; color:rgba(255,255,255,.72) !important; font-size:.72rem !important; }
      #chatbot-header .status .dot { display:inline-block !important; width:7px !important; height:7px !important; margin-right:6px !important; border-radius:50% !important; background:#70d69a !important; }
      #chatbot-close { display:grid !important; place-items:center !important; width:36px !important; height:36px !important; border:0 !important; border-radius:10px !important; background:rgba(255,255,255,.1) !important; color:#fff !important; font-size:1.1rem !important; cursor:pointer !important; }
      #chatbot-close:hover { background:rgba(255,255,255,.18) !important; }
      #chatbot-messages { display:flex !important; flex:1 1 auto !important; flex-direction:column !important; gap:10px !important; min-height:180px !important; max-height:390px !important; overflow-y:auto !important; padding:18px !important; background:#f7f7f5 !important; scroll-behavior:smooth !important; }
      .cb-msg { max-width:92% !important; padding:11px 13px !important; border-radius:14px !important; font-size:.86rem !important; line-height:1.55 !important; white-space:pre-line !important; overflow-wrap:anywhere !important; animation:chatbot-enter .18s ease-out !important; }
      .cb-msg.bot { align-self:flex-start !important; border:1px solid #e8e8e5 !important; border-top-left-radius:5px !important; background:#fff !important; color:#303030 !important; }
      .cb-msg.user { align-self:flex-end !important; border-top-right-radius:5px !important; background:#303030 !important; color:#fff !important; }
      .cb-copy { white-space:pre-wrap !important; }
      .cb-word { display:inline-block !important; animation:chatbot-word-in .24s ease-out both !important; }
      .cb-sr-only { position:absolute !important; width:1px !important; height:1px !important; padding:0 !important; margin:-1px !important; overflow:hidden !important; clip:rect(0,0,0,0) !important; white-space:nowrap !important; border:0 !important; }
      .cb-msg a { color:#2458a6 !important; font-weight:700 !important; text-decoration:underline !important; text-underline-offset:2px !important; }
      .cb-chips { display:flex !important; flex-wrap:wrap !important; gap:8px !important; margin-top:1px !important; }
      .cb-chip { display:inline-flex !important; align-items:center !important; min-height:38px !important; padding:8px 12px !important; border:1px solid #dededb !important; border-radius:999px !important; background:#fff !important; color:#303030 !important; font-family:inherit !important; font-size:.76rem !important; font-weight:600 !important; line-height:1.3 !important; text-align:left !important; text-decoration:none !important; cursor:pointer !important; transition:background .16s ease, border-color .16s ease, color .16s ease !important; }
      .cb-chips .cb-chip { animation:chatbot-choice-in .24s ease-out both !important; }
      .cb-chip:hover { border-color:#303030 !important; background:#303030 !important; color:#fff !important; }
      .cb-chip:disabled { opacity:.55 !important; cursor:wait !important; }
      .cb-separator { width:100% !important; height:1px !important; flex:none !important; background:#e9e9e6 !important; }
      .typing-indicator { min-width:54px !important; }
      .typing-dots { display:flex !important; gap:4px !important; align-items:center !important; }
      .typing-dots span { width:6px !important; height:6px !important; border-radius:50% !important; background:#929292 !important; animation:chatbot-dot 1s infinite ease-in-out !important; }
      .typing-dots span:nth-child(2) { animation-delay:.15s !important; } .typing-dots span:nth-child(3) { animation-delay:.3s !important; }
      @keyframes chatbot-dot { 0%,60%,100% { opacity:.4; transform:translateY(0); } 30% { opacity:1; transform:translateY(-3px); } }
      #chatbot-input-area { display:flex !important; gap:9px !important; padding:12px 14px 14px !important; border-top:1px solid #e9e9e6 !important; background:#fff !important; }
      #chatbot-input { flex:1 !important; min-width:0 !important; min-height:42px !important; padding:9px 12px !important; border:1px solid #d9d9d6 !important; border-radius:12px !important; background:#fafaf9 !important; color:#242424 !important; font:inherit !important; font-size:.83rem !important; }
      #chatbot-input::placeholder { color:#777 !important; }
      #chatbot-send { flex:none !important; width:42px !important; min-height:42px !important; border:0 !important; border-radius:12px !important; background:#242424 !important; color:#fff !important; font-size:1rem !important; cursor:pointer !important; }
      #chatbot-send:hover { background:#444 !important; }
      [data-theme="dark"] #chatbot-box { border-color:rgba(255,255,255,.12) !important; background:#1d1d1d !important; color:#f3f3f3 !important; }
      [data-theme="dark"] #chatbot-header, [data-theme="dark"] #chatbot-btn, [data-theme="dark"] #chatbot-send { background:#333 !important; }
      [data-theme="dark"] #chatbot-messages { background:#151515 !important; }
      [data-theme="dark"] .cb-msg.bot { border-color:#353535 !important; background:#242424 !important; color:#f0f0f0 !important; }
      [data-theme="dark"] .cb-msg.user { background:#454545 !important; }
      [data-theme="dark"] .cb-msg a { color:#a9c8ff !important; }
      [data-theme="dark"] .cb-chip { border-color:#454545 !important; background:#292929 !important; color:#f0f0f0 !important; }
      [data-theme="dark"] .cb-chip:hover { border-color:#aaa !important; background:#454545 !important; }
      [data-theme="dark"] #chatbot-input-area { border-color:#353535 !important; background:#1d1d1d !important; }
      [data-theme="dark"] #chatbot-input { border-color:#454545 !important; background:#292929 !important; color:#f0f0f0 !important; }
      @media (max-width:600px) {
        #chatbot-btn { right:16px !important; bottom:82px !important; width:50px !important; height:50px !important; }
        #chatbot-box { right:12px !important; bottom:142px !important; width:calc(100vw - 24px) !important; max-height:calc(100dvh - 170px) !important; }
        #chatbot-messages { max-height:none !important; min-height:130px !important; padding:14px !important; }
      }
      @media (prefers-reduced-motion: reduce) { #chatbot-box, .cb-msg, .cb-word, .cb-chip, #chatbot-btn, .typing-dots span { animation:none !important; transition:none !important; filter:none !important; transform:none !important; opacity:1 !important; } }
    </style>`;

  const state = { messageCount: 0, busy: false };
  const byId = (id) => document.getElementById(id);

  function buildUI() {
    if (byId('chatbot-btn')) return;
    document.head.insertAdjacentHTML('beforeend', CSS);
    document.body.insertAdjacentHTML('beforeend', `
      <button id="chatbot-btn" type="button" aria-label="Ouvrir l’assistant de Ronan" aria-expanded="false" aria-controls="chatbot-box">
        <span aria-hidden="true">💬</span>
      </button>
      <section id="chatbot-box" role="dialog" aria-labelledby="chatbot-title" aria-describedby="chatbot-status">
        <header id="chatbot-header">
          <div><div class="title" id="chatbot-title">Assistant Ronan</div><div class="status" id="chatbot-status"><span class="dot" aria-hidden="true"></span>Réponses instantanées</div></div>
          <button id="chatbot-close" type="button" aria-label="Fermer l’assistant">×</button>
        </header>
        <div id="chatbot-messages" role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversation avec l’assistant"></div>
        <form id="chatbot-input-area">
          <input type="text" id="chatbot-input" placeholder="Écrivez votre question…" aria-label="Écrivez votre question" autocomplete="off">
          <button id="chatbot-send" type="submit" aria-label="Envoyer">➤</button>
        </form>
      </section>`);
  }

  function addMessage(text, type, chips) {
    const messages = byId('chatbot-messages');
    if (type === 'bot' && state.messageCount > 0) {
      const separator = document.createElement('div');
      separator.className = 'cb-separator';
      separator.setAttribute('aria-hidden', 'true');
      messages.appendChild(separator);
    }
    const bubble = document.createElement('div');
    bubble.className = `cb-msg ${type}`;
    if (type === 'bot') {
      const spokenText = document.createElement('span');
      spokenText.className = 'cb-sr-only';
      spokenText.textContent = text;
      spokenText.setAttribute('aria-hidden', 'false');
      const visualText = document.createElement('span');
      visualText.className = 'cb-copy';
      visualText.setAttribute('aria-hidden', 'true');
      let wordIndex = 0;
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) visualText.appendChild(document.createTextNode(part));
        else {
          const word = document.createElement('span');
          word.className = 'cb-word';
          word.style.animationDelay = `${Math.min(wordIndex * 34, 480)}ms`;
          word.textContent = part;
          visualText.appendChild(word);
          wordIndex++;
        }
      });
      bubble.append(spokenText, visualText);
    } else bubble.textContent = text;
    messages.appendChild(bubble);
    state.messageCount++;

    if (chips && chips.length) {
      const group = document.createElement('div');
      group.className = 'cb-chips';
      chips.forEach((chip) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cb-chip';
        button.textContent = chip.label;
        button.dataset.action = chip.id;
        button.style.animationDelay = `${Math.min(group.children.length * 65, 260)}ms`;
        group.appendChild(button);
      });
      messages.appendChild(group);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function addTyping() {
    const bubble = document.createElement('div');
    bubble.className = 'cb-msg bot typing-indicator';
    bubble.setAttribute('aria-label', 'L’assistant prépare sa réponse');
    bubble.innerHTML = '<span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>';
    byId('chatbot-messages').appendChild(bubble);
    byId('chatbot-messages').scrollTop = byId('chatbot-messages').scrollHeight;
    return bubble;
  }

  function scrollTo(selector) {
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  function normalize(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim();
  }

  function answerFor(question) {
    const q = normalize(question);
    const answer = (text, links = []) => ({ text, links });
    if (/^(bonjour|bonsoir|salut|coucou|hello|hi|hey|yo)( assistant)?( comment ca va| comment vas tu| comment allez vous)?$/.test(q))
      return answer('Bonjour ! Je suis l’assistant de Ronan. Qu’est-ce que je peux faire pour vous ?');
    if (/^(merci|thanks|thank you|super merci|merci beaucoup)$/.test(q))
      return answer('Avec plaisir ! Vous avez une autre question sur les services ou le parcours de Ronan ?');
    if (/^(au revoir|a bientot|bonne journee|bonne soiree|bye)$/.test(q))
      return answer('Au revoir, et bonne journée !');
    if (/\b(qui es tu|es tu une ia|es tu un robot|tu es une ia)\b/.test(q))
      return answer('Je suis l’assistant virtuel du portfolio de Ronan. Je réponds aux questions à partir des informations présentes sur le site.');
    if (/\b(cv|curriculum|resume|telecharger.*cv)\b/.test(q))
      return answer('Bien sûr. Voici le CV de Ronan au format PDF.', [{ label: 'Télécharger le CV PDF', href: CONFIG.destinations.cv, download: true }]);
    if (/\b(realisation|realisations|portfolio|projets realises|exemples de projets)\b/.test(q))
      return answer('Ronan a travaillé sur des sites WordPress, des plateformes web et des créations graphiques. Voici quelques réalisations et retours clients.', [{ label: 'Voir les réalisations', href: CONFIG.destinations.realisations }]);
    if (/\b(qui est ronan|parle moi de ronan|a propos de ronan|profil|parcours|experience|etudes|formation)\b/.test(q))
      return answer("Ronan est un jeune professionnel polyvalent. Il associe ses compétences en management et en marketing à une expertise en développement web, marketing digital et automatisation par l’IA. Il accompagne notamment les cabinets RH et d’avocats, les particuliers, les établissements de l’hôtellerie-restauration (HCR) ainsi que les commerces de distribution. Il crée des sites performants et automatise les tâches répétitives pour faire gagner du temps et améliorer la visibilité de ses clients.");
    if (/\b(competence|competences|technologie|technologies|langage|langages|outil|outils|stack)\b/.test(q))
      return answer('Il travaille notamment avec JavaScript, PHP, Node.js, MySQL, Bootstrap et WordPress. Il utilise aussi des outils de webmarketing, de SEO et de création graphique.', [{ label: 'Voir les compétences', href: CONFIG.destinations.profil }]);
    if (/\b(commander|commencer|demarrer|lancer.*projet|mon projet|un projet|travailler ensemble)\b/.test(q))
      return answer('Pour lancer un projet, décrivez le résultat attendu, les fonctionnalités importantes et votre échéance. Ronan pourra ensuite vous proposer un devis clair et sans engagement sous 24 h.', [{ label: 'Parler du projet sur WhatsApp', href: CONFIG.destinations.whatsapp, external: true }]);
    if (/\b(disponible|disponibilite|mission|freelance|remote|distance)\b/.test(q))
      return answer('Ronan indique être disponible pour des missions à distance. Il travaille avec des clients à Madagascar et à l’international.');
    if (/\b(delai|duree|combien de temps|quand.*livr|livraison)\b/.test(q)) {
      if (/\b(e commerce|ecommerce|boutique|woocommerce|shopify)\b/.test(q)) return answer('Pour une boutique e-commerce WooCommerce standard, le délai indicatif est de 2 à 4 semaines. Il dépend du nombre de produits, des fonctionnalités et des retours clients.');
      if (/\b(wordpress|refonte|personnalis)\b/.test(q)) return answer('Un site WordPress avec personnalisation avancée prend généralement 1 à 2 semaines, selon le cahier des charges.');
      return answer('Un site vitrine simple prend généralement 3 à 7 jours. Le délai exact dépend du contenu et des fonctionnalités souhaitées.');
    }
    if (/\b(maintenance|support|apres livraison|mise a jour|sauvegarde)\b/.test(q))
      return answer('Oui. Ronan propose un suivi après livraison : corrections, mises à jour, sauvegardes et conseils pour garder le site performant et sécurisé.');
    if (/\b(seo|referencement|google)\b/.test(q))
      return answer('Une optimisation SEO de base est incluse dans chaque projet. Un audit et un accompagnement SEO plus poussé peuvent aussi être proposés.');
    if (/\b(prix|tarif|tarifs|coute|cout|budget|devis|combien.*site)\b/.test(q))
      return answer('Les tarifs dépendent du type de site et des fonctionnalités. Le portfolio n’affiche pas de grille de prix; Ronan peut vous préparer un devis clair et sans engagement sous 24 h.', [{ label: 'Demander un devis sur WhatsApp', href: CONFIG.destinations.whatsapp, external: true }]);
    if (/\b(site web|site internet|site vitrine|e commerce|ecommerce|boutique en ligne|wordpress|woocommerce|shopify|flyer|logo|visuel|creation graphique|maintenance)\b/.test(q))
      return answer('Ronan propose la création de sites vitrines et e-commerce, des projets WordPress, du SEO ainsi que des flyers et visuels. Dites-moi quel service vous intéresse et je vous donnerai les détails.', [{ label: 'Voir les services', href: '#services' }]);
    if (/\b(contact|joindre|appeler|telephone|email|mail|whatsapp|ecrire)\b/.test(q))
      return answer('Vous pouvez joindre Ronan par WhatsApp, téléphone ou e-mail. Quel moyen préférez-vous ?', [
        { label: 'WhatsApp', href: CONFIG.destinations.whatsapp, external: true },
        { label: 'E-mail', href: CONFIG.destinations.email },
        { label: 'Téléphone', href: 'tel:+261381154220' }
      ]);
    if (/\b(langue|langues|parle|francais|anglais|malagasy)\b/.test(q))
      return answer('Ronan parle malagasy, français et anglais.');
    if (/\b(ou habite|ou se trouve|ou est base|localisation|adresse|quelle ville|moramanga)\b/.test(q))
      return answer('Ronan est basé à Moramanga, Madagascar, et peut travailler à distance avec des clients dans d’autres pays.');
    if (/\b(services|service|propose|offre|faites vous|tu fais quoi|type de site|types de site)\b/.test(q))
      return answer('Ronan propose des sites vitrines et e-commerce, des projets WordPress, du référencement SEO, ainsi que des flyers et visuels. Quel service vous intéresse ?', [{ label: 'Voir les services', href: '#services' }]);
    return answer('Je n’ai pas trouvé la réponse exacte dans les informations de Ronan. Vous pouvez préciser votre question sur ses services, les délais, le CV, ses projets ou ses compétences.');
  }

  function addAnswerLinks(items) {
    if (!items.length) return;
    const group = document.createElement('div');
    group.className = 'cb-chips';
    items.forEach((item, index) => {
      const link = document.createElement('a');
      link.className = 'cb-chip';
      link.href = item.href;
      link.textContent = item.label;
      link.style.animationDelay = `${index * 70}ms`;
      if (item.download) link.download = '';
      if (item.external) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      if (item.href.startsWith('#')) link.addEventListener('click', () => window.setTimeout(() => closePanel(false), 100));
      group.appendChild(link);
    });
    byId('chatbot-messages').appendChild(group);
    byId('chatbot-messages').scrollTop = byId('chatbot-messages').scrollHeight;
  }

  function handleQuestion(question) {
    if (state.busy) return;
    state.busy = true;
    const input = byId('chatbot-input');
    const send = byId('chatbot-send');
    input.disabled = true;
    send.disabled = true;
    const typing = addTyping();
    const response = answerFor(question);
    const responsePause = Math.min(440 + response.text.split(/\s+/).length * 22, 820);
    window.setTimeout(() => {
      typing.remove();
      addMessage(response.text, 'bot');
      addAnswerLinks(response.links);
      state.busy = false;
      input.disabled = false;
      send.disabled = false;
      input.focus();
    }, responsePause);
  }

  function closePanel(returnFocus = true) {
    byId('chatbot-box').classList.remove('open');
    const launcher = byId('chatbot-btn');
    launcher.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
    if (returnFocus) launcher.focus();
  }

  function init() {
    buildUI();
    const launcher = byId('chatbot-btn');
    const panel = byId('chatbot-box');
    const input = byId('chatbot-input');

    launcher.addEventListener('click', () => {
      const opening = !panel.classList.contains('open');
      panel.classList.toggle('open', opening);
      launcher.classList.toggle('open', opening);
      launcher.setAttribute('aria-expanded', String(opening));
      if (opening) {
        if (!byId('chatbot-messages').children.length) addMessage(CONFIG.welcome, 'bot');
        window.setTimeout(() => input.focus(), 50);
      }
    });
    byId('chatbot-close').addEventListener('click', () => closePanel());
    panel.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePanel(); });
    byId('chatbot-input-area').addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text || state.busy) return;
      addMessage(text, 'user');
      input.value = '';
      handleQuestion(text);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
