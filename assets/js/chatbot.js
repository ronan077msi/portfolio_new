const faqData = [
  { mots: ['bonjour', 'salut', 'hello', 'bonsoir'], reponse: '👋 Bonjour ! Je suis l\'assistant de Ronan. Comment puis-je vous aider ?' },
  { mots: ['service', 'services', 'propose', 'offre'], reponse: '💼 Ronan propose : sites vitrine, e-commerce, WordPress, SEO, portfolios et flyers. Quel service vous intéresse ?' },
  { mots: ['prix', 'tarif', 'tarifs', 'cout', 'coût', 'combien'], reponse: '💰 Les tarifs démarrent à 80€ (SEO/portfolio), 150€ (site vitrine/WordPress), 200€ (e-commerce). Devis gratuit sur demande !' },
  { mots: ['contact', 'contacter', 'joindre', 'whatsapp'], reponse: '📱 Contactez Ronan via WhatsApp : +261 38 11 542 20, ou par email : ronan077msi@gmail.com' },
  { mots: ['delai', 'délai', 'temps', 'livraison', 'quand'], reponse: '⏱️ Site vitrine : 3-7 jours. WordPress : 1-2 semaines. E-commerce : 2-4 semaines.' },
  { mots: ['cv', 'curriculum', 'télécharger', 'telecharger'], reponse: '📄 Vous pouvez télécharger le CV de Ronan directement sur cette page dans la section CV !' },
  { mots: ['seo', 'référencement', 'referencement', 'google'], reponse: '🔍 Ronan propose des audits SEO et optimisations on-page à partir de 80€. Résultats mesurables garantis.' },
  { mots: ['wordpress', 'woocommerce', 'wp'], reponse: '🔧 WordPress & WooCommerce : création, refonte, maintenance. À partir de 150€.' },
  { mots: ['disponible', 'dispo', 'libre', 'remote'], reponse: '✅ Ronan est disponible immédiatement pour missions remote — France, La Réunion, Île Maurice et Madagascar.' },
  { mots: ['experience', 'expérience', 'projet', 'projets', 'réalisation'], reponse: '🚀 Parmi ses réalisations : plateforme e-learning (La Réunion), sites WordPress (Île Maurice, La Réunion), application métier (Moramanga).' },
  { mots: ['stack', 'technologie', 'tech', 'langage'], reponse: '⚙️ Stack : Node.js, Express, MariaDB, PHP, Bootstrap 5, WordPress, JS vanilla, Adobe Suite.' },
  { mots: ['merci', 'thanks', 'super', 'parfait'], reponse: '😊 Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.' },
];

function chatbotReponse(message) {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const item of faqData) {
    if (item.mots.some(mot => msg.includes(mot))) return item.reponse;
  }
  return "🤔 Je n'ai pas compris. Contactez Ronan directement sur WhatsApp : +261 38 11 542 20";
}

function initChatbot() {
  const styles = `
    <style>
      #chatbot-btn {
        position: fixed;
        bottom: 90px; right: 24px;
        width: 52px; height: 52px;
        background: #333;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: 1.3rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9000;
        transition: transform 0.2s, background 0.2s;
        border: none;
      }
      #chatbot-btn:hover { transform: scale(1.1); background: #111; }

      #chatbot-box {
        position: fixed;
        bottom: 156px; right: 24px;
        width: 310px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.15);
        z-index: 8999;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      #chatbot-box.open {
        display: flex;
        animation: cbSlideUp 0.25s ease;
      }
      @keyframes cbSlideUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      #chatbot-header {
        background: #333;
        color: white;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #chatbot-header .cb-title { font-weight: 700; font-size: 0.9rem; }
      #chatbot-header .cb-status { font-size: 0.7rem; opacity: 0.75; }
      #chatbot-close {
        background: none; border: none; color: white;
        font-size: 1rem; cursor: pointer; opacity: 0.8;
        line-height: 1;
      }
      #chatbot-messages {
        height: 260px;
        overflow-y: auto;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #f8f8f6;
        scrollbar-width: none;
      }
      .cb-msg {
        max-width: 86%;
        padding: 9px 13px;
        border-radius: 12px;
        font-size: 0.83rem;
        line-height: 1.5;
        font-family: 'Raleway', sans-serif;
      }
      .cb-msg.bot {
        background: white;
        border: 1px solid #e8e8e8;
        align-self: flex-start;
        border-radius: 4px 12px 12px 12px;
        color: #333;
      }
      .cb-msg.user {
        background: #333;
        color: white;
        align-self: flex-end;
        border-radius: 12px 12px 4px 12px;
      }
      #chatbot-input-area {
        display: flex;
        gap: 8px;
        padding: 10px 12px;
        border-top: 1px solid #eee;
        background: white;
      }
      #chatbot-input {
        flex: 1;
        border: 1.5px solid #ddd;
        border-radius: 8px;
        padding: 8px 11px;
        font-size: 0.83rem;
        outline: none;
        font-family: 'Raleway', sans-serif;
        color: #333;
      }
      #chatbot-input:focus { border-color: #333; }
      #chatbot-send {
        background: #333; color: white;
        border: none; border-radius: 8px;
        width: 34px; height: 34px;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.85rem;
        transition: background 0.15s;
        flex-shrink: 0;
      }
      #chatbot-send:hover { background: #111; }

      /* Dark mode */
      [data-theme="dark"] #chatbot-box { background: #1e1e1e; }
      [data-theme="dark"] #chatbot-header { background: #111; }
      [data-theme="dark"] #chatbot-messages { background: #161616; }
      [data-theme="dark"] .cb-msg.bot { background: #2a2a2a; border-color: #333; color: #eee; }
      [data-theme="dark"] #chatbot-input-area { background: #1e1e1e; border-color: #333; }
      [data-theme="dark"] #chatbot-input { background: #2a2a2a; border-color: #444; color: #eee; }
      [data-theme="dark"] #chatbot-btn { background: #f0eeeb; color: #333; }
    </style>
  `;

  const html = `
    <button id="chatbot-btn" onclick="toggleChatbot()" title="Assistant Ronan77" aria-label="Ouvrir le chatbot">
      <i class="bi bi-chat-dots-fill"></i>
    </button>
    <div id="chatbot-box" role="dialog" aria-label="Assistant Ronan77">
      <div id="chatbot-header">
        <div>
          <div class="cb-title">🤖 Assistant Ronan77</div>
          <div class="cb-status">● En ligne</div>
        </div>
        <button id="chatbot-close" onclick="toggleChatbot()" aria-label="Fermer">✕</button>
      </div>
      <div id="chatbot-messages">
        <div class="cb-msg bot">👋 Bonjour ! Je peux vous renseigner sur les services, tarifs et disponibilités de Ronan. Que puis-je faire pour vous ?</div>
      </div>
      <div id="chatbot-input-area">
        <input type="text" id="chatbot-input" placeholder="Posez votre question..." autocomplete="off">
        <button id="chatbot-send" aria-label="Envoyer"><i class="bi bi-send-fill"></i></button>
      </div>
    </div>
  `;

  document.head.insertAdjacentHTML('beforeend', styles);
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('chatbot-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendChatMsg();
  });
  document.getElementById('chatbot-send').addEventListener('click', sendChatMsg);
}

function toggleChatbot() {
  const box = document.getElementById('chatbot-box');
  box.classList.toggle('open');
  if (box.classList.contains('open')) {
    document.getElementById('chatbot-input').focus();
  }
}

function sendChatMsg() {
  const input = document.getElementById('chatbot-input');
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById('chatbot-messages');
  messages.innerHTML += `<div class="cb-msg user">${msg}</div>`;
  input.value = '';

  const typingId = 'typing-' + Date.now();
  messages.innerHTML += `<div class="cb-msg bot" id="${typingId}">⏳ En train d'écrire...</div>`;
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    const t = document.getElementById(typingId);
    if (t) t.textContent = chatbotReponse(msg);
    messages.scrollTop = messages.scrollHeight;
  }, 500);
}

document.addEventListener('DOMContentLoaded', initChatbot);
