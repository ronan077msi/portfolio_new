// ============================================
// 1. TYPED ANIMATION
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  const typedSpan = document.querySelector(".typed");
  if (!typedSpan) return;

  const items = typedSpan.getAttribute("data-typed-items").split(",").map(i => i.trim());
  let index = 0,
    charIndex = 0,
    isDeleting = false;

  function type() {
    const fullText = items[index];

    if (isDeleting) {
      typedSpan.textContent = fullText.substring(0, charIndex--);
    } else {
      typedSpan.textContent = fullText.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex === fullText.length) {
      isDeleting = true;
      setTimeout(type, 800);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      index = (index + 1) % items.length;
      setTimeout(type, 300);
      return;
    }

    setTimeout(type, isDeleting ? 30 : 60);
  }

  type();
});

// ============================================
// 2. PRELOADER
// ============================================
function hidePreloader() {
  var preloader = document.getElementById('preloader');
  var navbar = document.getElementById('mainNavbar');
  var welcome = document.getElementById('welcome');

  function revealHero() {
    if (welcome && !welcome.classList.contains('hero-ready')) {
      window.requestAnimationFrame(function() {
        welcome.classList.add('hero-ready');
      });
    }
  }

  if (preloader) {
    preloader.classList.add('loaded');
    setTimeout(function() {
      if (preloader.parentNode) preloader.remove();
      revealHero();
    }, 800);
  } else {
    revealHero();
  }

  if (navbar) navbar.classList.add('nav-visible');
}
if (document.readyState === 'complete') {
  setTimeout(hidePreloader, 800);
} else {
  window.addEventListener('load', function() {
    setTimeout(hidePreloader, 800);
  });
}
setTimeout(hidePreloader, 5000);

// ============================================
// 3. AOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-aos-delay]').forEach(function(el) {
    el.removeAttribute('data-aos-delay');
  });

  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      easing: 'ease-out-cubic',
      duration: 500,
      offset: 18,
      delay: 0,
      anchorPlacement: 'top-bottom',
      throttleDelay: 0,
      debounceDelay: 0,
    });
  }
});

window.addEventListener('load', function() {
  if (typeof AOS !== 'undefined') {
    setTimeout(function() {
      AOS.refreshHard();
    }, 150);
  }
});

window.addEventListener('resize', function() {
  if (typeof AOS !== 'undefined') {
    setTimeout(function() {
      AOS.refreshHard();
    }, 100);
  }
});

// ============================================
// 4. PROGRESS BARS (CORRIGÉ)
// ============================================
function animateProgressBars() {
  document.querySelectorAll('.progress-bar').forEach(function(bar) {
    var rect = bar.getBoundingClientRect();
    var isVisible = rect.top < window.innerHeight - 50;

    if (isVisible && !bar.classList.contains('animated')) {
      var value = bar.getAttribute('aria-valuenow');
      bar.style.width = value + '%';
      bar.classList.add('animated');
    }
  });
}

// Au chargement
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(animateProgressBars, 500);
});


// ============================================
// 5. ACTIVE NAV LINK (CORRIGÉ)
// ============================================
function updateActiveNav() {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.navbar .nav-link');
  var current = '';
  var scrollPos = window.scrollY + 100;

  sections.forEach(function(s) {
    var top = s.offsetTop;
    var height = s.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      current = s.getAttribute('id');
    }
  });

  links.forEach(function(l) {
    l.classList.remove('active-section');
    if (l.getAttribute('href') === '#' + current) {
      l.classList.add('active-section');
    }
  });
}

window.addEventListener('scroll', function() {
  updateActiveNav();
});

// ============================================
// 6. NAVBAR SCROLL EFFECT (CORRIGÉ)
// ============================================
function updateNavbarScroll() {
  var navbar = document.querySelector('#mainNavbar');
  if (!navbar) return;
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Un seul cycle par image, au lieu de trois écouteurs concurrents.
var scrollTicking = false;
function handleViewportChange() {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(function() {
    animateProgressBars();
    updateActiveNav();
    updateNavbarScroll();
    scrollTicking = false;
  });
}

window.addEventListener('scroll', handleViewportChange, { passive: true });
window.addEventListener('resize', handleViewportChange, { passive: true });
document.addEventListener('DOMContentLoaded', handleViewportChange);

// ============================================
// 7. SMOOTH SCROLL (CORRIGÉ)
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// ============================================
// 8. LAZY IMAGES
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('img.lazy').forEach(function(img) {
    var src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.onload = function() {
        img.classList.add('loaded');
      };
    }
  });
});

// ============================================
// 9. DARK MODE (CORRIGÉ)
// ============================================
function applyTheme(theme, persist) {
  var html = document.documentElement;
  var isDark = theme === 'dark';

  if (isDark) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }

  if (persist) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  syncThemeButtons(isDark);
}

function syncThemeButtons(isDark) {
  document.querySelectorAll('[data-theme-toggle]').forEach(function(button) {
    button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    button.setAttribute('title', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');

    var icon = button.querySelector('i');
    if (icon) {
      icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
  });
}

function toggleDark() {
  var html = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark', true);
}

function initTheme() {
  var savedTheme = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(theme, false);
}

function bindThemeToggle() {
  document.querySelectorAll('[data-theme-toggle]').forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      toggleDark();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  bindThemeToggle();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light', false);
  }
});

// ============================================
// 10. YEAR
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// ============================================
// 11. BONUS : Fermeture du menu mobile au clic
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  var navLinks = document.querySelectorAll('.navbar .nav-link');
  var navbarCollapse = document.getElementById('navbarMain');

  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (navbarCollapse && window.innerWidth < 992) {
        var bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false
        });
        bsCollapse.hide();
      }
    });
  });
});
