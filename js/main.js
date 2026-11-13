/**
 * Main Interactive Application Script
 * Mary Nisha Antony - Premium Portfolio
 * Robust, Clean, Zero-Modal Overhead, 100% Interactive
 */

(function () {
  'use strict';

  // Global Toast Notification Helper
  window.showToast = function (message, type = 'info') {
    try {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:99999;display:flex;flex-direction:column;gap:0.75rem;pointer-events:none;';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `pointer-events:auto;display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1.25rem;border-radius:0.75rem;border:1px solid;box-shadow:0 15px 35px rgba(0,0,0,0.6);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:all 0.3s ease;transform:translateY(10px);opacity:0;font-size:0.875rem;font-weight:500;${
        type === 'success'
          ? 'background:rgba(10,25,47,0.95);border-color:rgba(16,185,129,0.5);color:#6ee7b7;'
          : type === 'warning'
          ? 'background:rgba(10,25,47,0.95);border-color:rgba(245,158,11,0.5);color:#fcd34d;'
          : 'background:rgba(10,25,47,0.95);border-color:rgba(59,130,246,0.5);color:#93c5fd;'
      }`;

      let icon = `<svg style="width:1.25rem;height:1.25rem;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      if (type === 'success') {
        icon = `<svg style="width:1.25rem;height:1.25rem;flex-shrink:0;color:#34d399;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      }

      toast.innerHTML = `${icon}<span>${message}</span>`;
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      });

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    } catch (e) {
      console.error('Toast error:', e);
    }
  };

  // Safe DOM Loaded Handler
  document.addEventListener('DOMContentLoaded', () => {
    try { initNavigation(); } catch (e) { console.error('Nav error:', e); }
    try { initScrollSpy(); } catch (e) { console.error('ScrollSpy error:', e); }
    try { initAnimatedCounters(); } catch (e) { console.error('Counter error:', e); }
    try { initScrollProgress(); } catch (e) { console.error('Progress error:', e); }
    try { initResumeDownloadFeedback(); } catch (e) { console.error('Download feedback error:', e); }
    try { initCopyActions(); } catch (e) { console.error('Copy error:', e); }
    try { initContactForm(); } catch (e) { console.error('Contact error:', e); }
    try { initCardTilt(); } catch (e) { console.error('Tilt error:', e); }
    try { initCursor(); } catch (e) { console.error('Cursor error:', e); }
  });

  /* ----------------------------------------------------
   * 1. Navigation & Mobile Drawer
   * ---------------------------------------------------- */
  function initNavigation() {
    const navbar = document.getElementById('main-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    window.addEventListener('scroll', () => {
      if (!navbar) return;
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });

    function openDrawer() {
      if (!mobileDrawer) return;
      mobileDrawer.style.transform = 'translateX(0)';
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.innerHTML = `<svg style="width:24px;height:24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
      }
    }

    function closeDrawer() {
      if (!mobileDrawer) return;
      mobileDrawer.style.transform = 'translateX(100%)';
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = `<svg style="width:24px;height:24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      }
    }

    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeDrawer();
        }
      });
    });
  }

  /* ----------------------------------------------------
   * 2. ScrollSpy for Active Links
   * ---------------------------------------------------- */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function checkActiveSection() {
      const scrollPos = window.scrollY + 140;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', checkActiveSection, { passive: true });
    checkActiveSection();
  }

  /* ----------------------------------------------------
   * 3. Animated Number Counters
   * ---------------------------------------------------- */
  function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('[data-counter-target]');
    if (!counterElements.length) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counterElements.forEach(el => animateCounter(el));
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const statsSection = document.getElementById('hero-stats-row');
    if (statsSection) {
      observer.observe(statsSection);
    } else {
      counterElements.forEach(el => animateCounter(el));
    }

    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-counter-target'));
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const duration = 1500;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(ease * target);

        el.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ----------------------------------------------------
   * 4. Scroll Progress & Back to Top Button
   * ---------------------------------------------------- */
  function initScrollProgress() {
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.getElementById('scroll-progress-circle');

    if (!backToTopBtn) return;

    const circumference = 2 * Math.PI * 18;
    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference}`;
      progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

      if (progressCircle) {
        const offset = circumference - (progress * circumference);
        progressCircle.style.strokeDashoffset = `${offset}`;
      }

      if (scrollY > 350) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
        backToTopBtn.style.transform = 'translateY(0)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transform = 'translateY(16px)';
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------
   * 5. Direct Resume Download Feedback
   * ---------------------------------------------------- */
  function initResumeDownloadFeedback() {
    const downloadBtns = document.querySelectorAll('.trigger-resume-download');
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.showToast("Resume download started! (Mary-Nisha-Antony-Resume.pdf)", "success");
      });
    });
  }

  /* ----------------------------------------------------
   * 6. Copy Actions (Email & Phone)
   * ---------------------------------------------------- */
  function initCopyActions() {
    const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
    const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');

    copyEmailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          navigator.clipboard.writeText('antonynisha1999@gmail.com').then(() => {
            window.showToast("Email address copied: antonynisha1999@gmail.com", "success");
          }).catch(() => {
            fallbackCopy('antonynisha1999@gmail.com', "Email address copied: antonynisha1999@gmail.com");
          });
        } catch (_) {
          fallbackCopy('antonynisha1999@gmail.com', "Email address copied: antonynisha1999@gmail.com");
        }
      });
    });

    copyPhoneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          navigator.clipboard.writeText('+919072214747').then(() => {
            window.showToast("Phone number copied: +91 9072214747", "success");
          }).catch(() => {
            fallbackCopy('+919072214747', "Phone number copied: +91 9072214747");
          });
        } catch (_) {
          fallbackCopy('+919072214747', "Phone number copied: +91 9072214747");
        }
      });
    });

    function fallbackCopy(text, msg) {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      window.showToast(msg, "success");
    }
  }

  /* ----------------------------------------------------
   * 7. Contact Form Handling
   * ---------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const messageInput = document.getElementById('contact-message');
    const charCount = document.getElementById('message-char-count');

    if (messageInput && charCount) {
      messageInput.addEventListener('input', () => {
        charCount.textContent = `${messageInput.value.length} / 1000`;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const submitBtn = document.getElementById('contact-submit-btn');

      if (!nameInput || !emailInput || !messageInput) return;

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        window.showToast("Please complete all required fields.", "warning");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        window.showToast("Please enter a valid email address.", "warning");
        return;
      }

      const origText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending Message...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }

        window.showToast("Thank you, " + nameInput.value.trim() + "! Your message is dispatched to antonynisha1999@gmail.com.", "success");

        const mailtoUrl = `mailto:antonynisha1999@gmail.com?subject=${encodeURIComponent(
          subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'Accounts Inquiry: ' + nameInput.value.trim()
        )}&body=${encodeURIComponent(
          `From: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
        )}`;

        // Open mail app
        window.location.href = mailtoUrl;

        form.reset();
        if (charCount) charCount.textContent = '0 / 1000';
      }, 500);
    });
  }

  /* ----------------------------------------------------
   * 8. 3D Card Tilt Effect
   * ---------------------------------------------------- */
  function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  /* ----------------------------------------------------
   * 9. Precision Interactive Cursor Point & Ring Follower
   * ---------------------------------------------------- */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const point = document.getElementById('cursor-point');
    const ring = document.getElementById('cursor-ring');
    const glow = document.getElementById('cursor-glow');
    if (!point && !ring && !glow) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let glowX = -100, glowY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (point) point.style.opacity = '1';
        if (ring) ring.style.opacity = '1';
        if (glow) glow.style.opacity = '1';
      }

      if (point) {
        point.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      document.body.style.setProperty('--cursor-x', `${mouseX}px`);
      document.body.style.setProperty('--cursor-y', `${mouseY}px`);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      if (point) point.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
      if (glow) glow.style.opacity = '0';
      document.body.classList.remove('cursor-hover');
    });

    document.addEventListener('mouseenter', () => {
      if (point) point.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
      if (glow) glow.style.opacity = '1';
    });

    // Dynamic hover reaction on all interactive elements
    const interactiveSelector = 'a, button, input, select, textarea, [role="button"], .glass-card, .btn-primary, .btn-secondary, .btn-gold, .nav-link, .interactive-chip, .tab-btn, .mobile-nav-link';
    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    }, { passive: true });

    function loop() {
      // Lerp ring with fluid physics
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      // Lerp ambient glow halo
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      if (glow) {
        glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      }

      requestAnimationFrame(loop);
    }
    loop();
  }

})();
