// ============================================================
// CHATBOT PORTFOLIO RONAN - VERSION MINIMALISTE
// FICHIER: chatbot.js
// ============================================================

(function() {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================
  const CONFIG = {
    welcomeMessage: "Bonjour 🙋🏻‍♂️\nJe suis l'assistant de Ronan. Comment puis-je vous aider aujourd'hui ?",
    
    responses: {
      projet: "Top ! On regarde ça tout de suite. Le plus simple, c'est d'en discuter directement avec lui :",
      cv: "📄 Vous souhaitez en savoir plus sur son parcours et ses compétences ? Vous pouvez consulter et télécharger son CV officiel ici :",
      realisations: "🚀 Il a piloté plusieurs projets web et design... Vous pouvez découvrir son travail ici :",
      profil: "💻 Ronan est Développeur Full-Stack, Webmarketeur et étudiant en Management (Licence 3). Il combine compétences techniques et vision business pour piloter des projets de A à Z."
    },

    links: {
      whatsapp: "https://wa.me/261381154220",
      email: "mailto:ronan077msi@gmail.com",
      cv: "#cv",
      realisations: "#experience",
      profil: "#skills"
    },

    mainChips: [
      { id: 'projet', label: '💼 J\'ai un projet ou besoin (Devis)' },
      { id: 'cv', label: '📄 Télécharger le CV' },
      { id: 'realisations', label: '🚀 Voir ses réalisations' },
      { id: 'profil', label: 'ℹ️ En savoir plus sur son profil' }
    ]
  };

  // ============================================================
  // TIMING
  // ============================================================
  const TIMING = {
    typingSpeed: 800,
    responseDelay: 500,
    chipDelay: 400
  };

  // ============================================================
  // STATE
  // ============================================================
  let state = {
    isOpen: false,
    messageCount: 0,
    currentStep: 'welcome'
  };

  // ============================================================
  // DOM HELPERS
  // ============================================================
  function createElement(tag, className, html = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
  }

  function getElement(id) {
    return document.getElementById(id);
  }

  // ============================================================
  // CHATBOT UI
  // ============================================================
  function buildChatbotUI() {
    const styles = `
      <style>
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes msgFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        #chatbot-btn {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
          width: 54px !important;
          height: 54px !important;
          background: #333 !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #fff !important;
          font-size: 1.3rem !important;
          cursor: pointer !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25) !important;
          z-index: 999999 !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          border: none !important;
          font-family: 'Raleway', 'Segoe UI', sans-serif !important;
        }
        #chatbot-btn:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.35) !important;
          background: #222 !important;
        }
        #chatbot-btn .icon-chat {
          transition: transform 0.3s ease;
        }
        #chatbot-btn.open .icon-chat {
          transform: rotate(90deg);
        }

        #chatbot-box {
          position: fixed !important;
          bottom: 88px !important;
          right: 24px !important;
          width: 360px !important;
          max-width: calc(100vw - 48px) !important;
          max-height: 560px !important;
          background: #fff !important;
          border-radius: 18px !important;
          box-shadow: 0 12px 60px rgba(0,0,0,0.18) !important;
          z-index: 999998 !important;
          display: none !important;
          flex-direction: column !important;
          overflow: hidden !important;
          border: 1px solid rgba(0,0,0,0.06) !important;
          font-family: 'Raleway', 'Segoe UI', sans-serif !important;
        }
        #chatbot-box.open {
          display: flex !important;
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        #chatbot-header {
          background: #333 !important;
          color: #fff !important;
          padding: 12px 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          flex-shrink: 0 !important;
        }
        #chatbot-header .title {
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          letter-spacing: 0.3px !important;
        }
        #chatbot-header .status {
          font-size: 0.6rem !important;
          opacity: 0.7 !important;
          margin-top: 1px !important;
        }
        #chatbot-header .status .dot {
          display: inline-block !important;
          width: 7px !important;
          height: 7px !important;
          background: #4ade80 !important;
          border-radius: 50% !important;
          margin-right: 5px !important;
          animation: pulse-dot 1.8s ease-in-out infinite !important;
        }
        #chatbot-close {
          background: none !important;
          border: none !important;
          color: rgba(255,255,255,0.5) !important;
          font-size: 1.1rem !important;
          cursor: pointer !important;
          padding: 4px 6px !important;
          border-radius: 6px !important;
          transition: all 0.2s !important;
          line-height: 1 !important;
        }
        #chatbot-close:hover {
          background: rgba(255,255,255,0.08) !important;
          color: #fff !important;
        }

        #chatbot-messages {
          flex: 1 !important;
          overflow-y: auto !important;
          padding: 14px 14px 8px 14px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          background: #f7f7f5 !important;
          min-height: 180px !important;
          max-height: 370px !important;
          scroll-behavior: smooth !important;
        }
        #chatbot-messages::-webkit-scrollbar {
          width: 4px !important;
        }
        #chatbot-messages::-webkit-scrollbar-track {
          background: transparent !important;
        }
        #chatbot-messages::-webkit-scrollbar-thumb {
          background: #d0d0d0 !important;
          border-radius: 8px !important;
        }

        .cb-msg {
          max-width: 88% !important;
          padding: 9px 14px !important;
          border-radius: 12px !important;
          font-size: 0.8rem !important;
          line-height: 1.5 !important;
          word-wrap: break-word !important;
          animation: msgFade 0.3s ease !important;
        }
        .cb-msg.bot {
          background: #fff !important;
          border: 1px solid #e8e8e8 !important;
          align-self: flex-start !important;
          border-radius: 4px 14px 14px 14px !important;
          color: #333 !important;
        }
        .cb-msg.bot br {
          display: block !important;
          content: "" !important;
          margin: 2px 0 !important;
        }
        .cb-msg.user {
          background: #333 !important;
          color: #fff !important;
          align-self: flex-end !important;
          border-radius: 14px 14px 4px 14px !important;
        }

        .cb-msg .link {
          color: #333 !important;
          font-weight: 600 !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          transition: color 0.2s !important;
        }
        .cb-msg .link:hover {
          color: #000 !important;
        }
        .cb-msg .link-whatsapp {
          color: #25D366 !important;
        }
        .cb-msg .link-email {
          color: #EA4335 !important;
        }

        .typing-indicator {
          background: #fff !important;
          border: 1px solid #e8e8e8 !important;
          padding: 7px 14px !important;
          border-radius: 4px 14px 14px 14px !important;
          min-width: 32px !important;
        }
        .typing-dots {
          display: flex !important;
          gap: 4px !important;
          align-items: center !important;
        }
        .typing-dots span {
          width: 6px !important;
          height: 6px !important;
          background: #aaa !important;
          border-radius: 50% !important;
          display: inline-block !important;
          animation: typingBounce 1.4s ease-in-out infinite !important;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s !important; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s !important; }

        .cb-chips {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 6px !important;
          margin-top: 8px !important;
          animation: fadeInUp 0.3s ease !important;
        }
        .cb-chip {
          background: #eee !important;
          border: 1.5px solid #e0e0de !important;
          border-radius: 20px !important;
          padding: 5px 12px !important;
          font-size: 0.7rem !important;
          font-family: 'Raleway', 'Segoe UI', sans-serif !important;
          color: #333 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          font-weight: 500 !important;
          line-height: 1.3 !important;
          white-space: nowrap !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
          flex-shrink: 0 !important;
          user-select: none !important;
        }
        .cb-chip:hover {
          background: #333 !important;
          border-color: #333 !important;
          color: #fff !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 3px 12px rgba(51,51,51,0.15) !important;
        }
        .cb-chip:active {
          transform: scale(0.95) !important;
        }

        #chatbot-input-area {
          display: flex !important;
          gap: 8px !important;
          padding: 10px 14px !important;
          border-top: 1px solid #eee !important;
          background: #fff !important;
          flex-shrink: 0 !important;
        }
        #chatbot-input {
          flex: 1 !important;
          border: 1.5px solid #ddd !important;
          border-radius: 8px !important;
          padding: 7px 12px !important;
          font-size: 0.78rem !important;
          outline: none !important;
          font-family: 'Raleway', 'Segoe UI', sans-serif !important;
          color: #333 !important;
          background: #fafaf8 !important;
          transition: border-color 0.2s !important;
        }
        #chatbot-input:focus {
          border-color: #333 !important;
          background: #fff !important;
        }
        #chatbot-input::placeholder {
          color: #bbb !important;
          font-size: 0.72rem !important;
        }
        #chatbot-send {
          background: #333 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          width: 36px !important;
          height: 36px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 0.85rem !important;
          transition: all 0.2s !important;
          flex-shrink: 0 !important;
        }
        #chatbot-send:hover {
          background: #222 !important;
          transform: scale(1.04) !important;
        }
        #chatbot-send:active {
          transform: scale(0.94) !important;
        }

        .cb-separator {
          height: 3px !important;
          width: 100% !important;
          flex-shrink: 0 !important;
        }

        @media (max-width: 480px) {
          #chatbot-box {
            right: 12px !important;
            bottom: 78px !important;
            width: calc(100vw - 24px) !important;
            max-height: 500px !important;
            border-radius: 16px !important;
          }
          #chatbot-btn {
            right: 16px !important;
            bottom: 16px !important;
            width: 48px !important;
            height: 48px !important;
            font-size: 1.1rem !important;
          }
          #chatbot-messages {
            max-height: 300px !important;
            padding: 12px 12px 6px 12px !important;
            gap: 6px !important;
          }
          .cb-msg {
            font-size: 0.76rem !important;
            padding: 7px 12px !important;
            max-width: 92% !important;
          }
          .cb-chip {
            font-size: 0.66rem !important;
            padding: 4px 10px !important;
          }
          #chatbot-header {
            padding: 10px 14px !important;
          }
          #chatbot-header .title {
            font-size: 0.8rem !important;
          }
          #chatbot-input-area {
            padding: 8px 12px !important;
          }
          #chatbot-input {
            font-size: 0.76rem !important;
            padding: 6px 10px !important;
          }
          #chatbot-send {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.8rem !important;
          }
          .cb-chips {
            gap: 5px !important;
            margin-top: 6px !important;
          }
        }

        [data-theme="dark"] #chatbot-box {
          background: #1a1a1a !important;
          border-color: #2a2a2a !important;
        }
        [data-theme="dark"] #chatbot-header {
          background: #111 !important;
        }
        [data-theme="dark"] #chatbot-messages {
          background: #161616 !important;
        }
        [data-theme="dark"] .cb-msg.bot {
          background: #242424 !important;
          border-color: #333 !important;
          color: #e8e8e8 !important;
        }
        [data-theme="dark"] .cb-msg.user {
          background: #444 !important;
          color: #fff !important;
        }
        [data-theme="dark"] #chatbot-input-area {
          background: #1a1a1a !important;
          border-color: #2a2a2a !important;
        }
        [data-theme="dark"] #chatbot-input {
          background: #242424 !important;
          border-color: #444 !important;
          color: #e8e8e8 !important;
        }
        [data-theme="dark"] #chatbot-input::placeholder {
          color: #777 !important;
        }
        [data-theme="dark"] .cb-chip {
          background: #2a2a2a !important;
          border-color: #444 !important;
          color: #e8e8e8 !important;
        }
        [data-theme="dark"] .cb-chip:hover {
          background: #555 !important;
          border-color: #555 !important;
          color: #fff !important;
        }
        [data-theme="dark"] .typing-indicator {
          background: #242424 !important;
          border-color: #333 !important;
        }
        [data-theme="dark"] .typing-dots span {
          background: #777 !important;
        }
        [data-theme="dark"] #chatbot-btn {
          background: #333 !important;
          color: #eee !important;
        }
        [data-theme="dark"] #chatbot-btn:hover {
          background: #444 !important;
        }
        [data-theme="dark"] #chatbot-send {
          background: #444 !important;
        }
        [data-theme="dark"] #chatbot-send:hover {
          background: #555 !important;
        }
        [data-theme="dark"] .cb-msg .link {
          color: #e8e8e8 !important;
        }
        [data-theme="dark"] .cb-msg .link:hover {
          color: #fff !important;
        }
      </style>
    `;

    const html = `
      <button id="chatbot-btn" aria-label="Ouvrir le chatbot">
        <span class="icon-chat">💬</span>
      </button>
      <div id="chatbot-box" role="dialog" aria-label="Assistant Ronan">
        <div id="chatbot-header">
          <div>
            <div class="title">🤖 Assistant Ronan</div>
            <div class="status"><span class="dot"></span> En ligne</div>
          </div>
          <button id="chatbot-close" aria-label="Fermer">✕</button>
        </div>
        <div id="chatbot-messages"></div>
        <div id="chatbot-input-area">
          <input type="text" id="chatbot-input" placeholder="Écrivez un message..." autocomplete="off">
          <button id="chatbot-send" aria-label="Envoyer">➤</button>
        </div>
      </div>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ============================================================
  // CHATBOT LOGIC
  // ============================================================
  function addMessage(text, type = 'bot', chips = null, isHTML = false) {
    const messages = getElement('chatbot-messages');
    if (!messages) return;

    if (state.messageCount > 0 && type === 'bot') {
      const sep = createElement('div', 'cb-separator');
      messages.appendChild(sep);
    }

    const div = createElement('div', `cb-msg ${type}`);
    if (isHTML) {
      div.innerHTML = text;
    } else {
      div.textContent = text;
    }
    messages.appendChild(div);
    state.messageCount++;

    if (chips && chips.length > 0) {
      const chipsContainer = createElement('div', 'cb-chips');
      chips.forEach(chip => {
        const btn = createElement('button', 'cb-chip');
        btn.textContent = chip.label;
        btn.dataset.action = chip.action;
        chipsContainer.appendChild(btn);
      });
      setTimeout(() => {
        messages.appendChild(chipsContainer);
        messages.scrollTop = messages.scrollHeight;
      }, 400);
    }

    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight;
    }, 100);
  }

  function addTypingIndicator() {
    const messages = getElement('chatbot-messages');
    if (!messages) return null;
    const div = createElement('div', 'cb-msg bot typing-indicator');
    div.id = 'typing-' + Date.now();
    div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function removeTypingIndicator(el) {
    if (el && el.parentNode) {
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 200);
    }
  }

  function scrollToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showWelcome() {
    const messages = getElement('chatbot-messages');
    if (messages) {
      messages.innerHTML = '';
      state.messageCount = 0;
      state.currentStep = 'welcome';
    }

    const welcomeChips = CONFIG.mainChips.map(chip => ({
      label: chip.label,
      action: chip.id
    }));

    addMessage(CONFIG.welcomeMessage, 'bot', welcomeChips);
  }

  function showMenu() {
    const mainChips = CONFIG.mainChips.map(chip => ({
      label: chip.label,
      action: chip.id
    }));
    addMessage("Que puis-je faire pour vous ?", 'bot', mainChips);
    state.currentStep = 'welcome';
  }

  function handleChipAction(action) {
    const typing = addTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator(typing);

      let response = '';
      let isHTML = false;
      let shouldHideMenu = true; // Par défaut, on cache le menu

      switch(action) {
        case 'projet':
          response = CONFIG.responses.projet + 
            '<br><br>📱 <a href="' + CONFIG.links.whatsapp + '" target="_blank" class="link link-whatsapp">WhatsApp</a>' +
            ' &nbsp;|&nbsp; ' +
            '✉️ <a href="' + CONFIG.links.email + '" class="link link-email">Email</a>';
          isHTML = true;
          shouldHideMenu = false; // Seul "Devis" garde le menu
          break;

        case 'cv':
          response = CONFIG.responses.cv + 
            '<br><br>📄 <a href="' + CONFIG.links.cv + '" class="link" onclick="event.preventDefault(); document.querySelector(\'#cv\').scrollIntoView({behavior: \'smooth\'});">Télécharger le CV</a>';
          isHTML = true;
          shouldHideMenu = true;
          setTimeout(() => {
            scrollToSection('#cv');
          }, 500);
          break;

        case 'realisations':
          response = CONFIG.responses.realisations + 
            '<br><br>🚀 <a href="' + CONFIG.links.realisations + '" class="link" onclick="event.preventDefault(); document.querySelector(\'#experience\').scrollIntoView({behavior: \'smooth\'});">Voir les réalisations</a>';
          isHTML = true;
          shouldHideMenu = true;
          setTimeout(() => {
            scrollToSection('#experience');
          }, 500);
          break;

        case 'profil':
          response = CONFIG.responses.profil + 
            '<br><br>👤 <a href="' + CONFIG.links.profil + '" class="link" onclick="event.preventDefault(); document.querySelector(\'#skills\').scrollIntoView({behavior: \'smooth\'});">Voir ses compétences</a>';
          isHTML = true;
          shouldHideMenu = true;
          setTimeout(() => {
            scrollToSection('#skills');
          }, 500);
          break;

        default:
          response = "Je n'ai pas compris. Utilisez les boutons ci-dessus.";
          shouldHideMenu = false;
      }

      addMessage(response, 'bot', null, isHTML);

      if (shouldHideMenu) {
        // Menu caché - proposer de revenir
        setTimeout(() => {
          const returnChips = [
            { label: '🔙 Retour au menu', action: 'menu' }
          ];
          addMessage("Souhaitez-vous revenir au menu principal ?", 'bot', returnChips);
        }, 1000);
        state.currentStep = 'response';
      } else {
        // Menu visible (cas du Devis)
        setTimeout(() => {
          if (state.currentStep !== 'response') {
            showMenu();
          }
        }, 600);
      }

    }, TIMING.typingSpeed);
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  function setupEventListeners() {
    const btn = getElement('chatbot-btn');
    const box = getElement('chatbot-box');
    const close = getElement('chatbot-close');
    const input = getElement('chatbot-input');
    const send = getElement('chatbot-send');

    if (!btn || !box) return;

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      box.classList.toggle('open');
      btn.classList.toggle('open');
      if (box.classList.contains('open')) {
        const messages = getElement('chatbot-messages');
        if (messages && messages.children.length === 0) {
          showWelcome();
        }
        setTimeout(() => {
          if (input) input.focus();
          if (messages) messages.scrollTop = messages.scrollHeight;
        }, 350);
      }
    });

    if (close) {
      close.addEventListener('click', function(e) {
        e.stopPropagation();
        box.classList.remove('open');
        btn.classList.remove('open');
      });
    }

    // Clic sur les chips
    const messages = getElement('chatbot-messages');
    if (messages) {
      messages.addEventListener('click', function(e) {
        const chip = e.target.closest('.cb-chip');
        if (!chip) return;
        const action = chip.dataset.action;
        if (action) {
          if (action === 'menu') {
            state.currentStep = 'welcome';
            showMenu();
          } else {
            handleChipAction(action);
          }
        }
      });
    }

    // Envoi de message texte
    function sendMessage() {
      if (!input) return;
      const msg = input.value.trim();
      if (!msg) return;

      addMessage(msg, 'user');
      input.value = '';

      const typing = addTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator(typing);
        const response = "🤔 Je suis un assistant guidé par boutons. Utilisez les chips ci-dessus pour naviguer !";
        addMessage(response, 'bot');
        setTimeout(() => {
          showMenu();
        }, 500);
      }, TIMING.typingSpeed);
    }

    if (send) {
      send.addEventListener('click', sendMessage);
    }
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
      });
    }
  }

  // ============================================================
  // INITIALISATION
  // ============================================================
  function init() {
    buildChatbotUI();
    setupEventListeners();
  }

  // ============================================================
  // DÉMARRAGE - UNIQUEMENT SUR window.load
  // ============================================================
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
