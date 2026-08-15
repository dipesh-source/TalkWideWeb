/**
 * TalkWide — Main Interactivity & Core Scripts
 */

// Configure your Google Sheets Web App URL here (free Google Apps Script webhook)
// If left empty, submissions will automatically be backed up in browser localStorage!
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxaZYVrE8VOfO1T-A95fpy7vOgNrPjTcJHeoQuPwpPRbSG4fgMPPeM5PiEWvePhG0qP/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach((el) => {
    el.textContent = currentYear;
  });

  // 2. Theme Management (Light / Dark mode toggle)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('talkwide_theme') || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('talkwide_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }

  // 3. Navbar Scroll Effects
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 4. Interactive App Demo Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(`tab-${targetId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 5. FAQ Accordion Behavior
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 6. Early Access / Waitlist Modal Handling
  const earlyAccessModal = document.getElementById('early-access-modal');
  const closeEarlyAccessBtn = document.getElementById('close-early-access-btn');
  const earlyAccessForm = document.getElementById('early-access-form');
  const earlyAccessFormWrapper = document.getElementById('early-access-form-wrapper');
  const earlyAccessSuccess = document.getElementById('early-access-success');
  const openModalButtons = document.querySelectorAll('.open-early-access-modal, .btn-download');

  function openEarlyAccessModal(e) {
    if (e) e.preventDefault();
    if (earlyAccessModal) {
      earlyAccessModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Reset form if reopening
      if (earlyAccessFormWrapper) earlyAccessFormWrapper.style.display = 'block';
      if (earlyAccessSuccess) earlyAccessSuccess.classList.remove('active');
    }
  }

  function closeEarlyAccessModal() {
    if (earlyAccessModal) {
      earlyAccessModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', openEarlyAccessModal);
  });

  if (closeEarlyAccessBtn) {
    closeEarlyAccessBtn.addEventListener('click', closeEarlyAccessModal);
  }

  if (earlyAccessModal) {
    earlyAccessModal.addEventListener('click', (e) => {
      if (e.target === earlyAccessModal) {
        closeEarlyAccessModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && earlyAccessModal?.classList.contains('active')) {
      closeEarlyAccessModal();
    }
  });

  if (earlyAccessForm) {
    earlyAccessForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = earlyAccessForm.querySelector('button[type="submit"]');
      const nameInput = document.getElementById('waitlist-name');
      const emailInput = document.getElementById('waitlist-email');
      const purposeInput = document.getElementById('waitlist-purpose');

      const submissionData = {
        name: nameInput?.value?.trim() || '',
        email: emailInput?.value?.trim() || '',
        purpose: purposeInput?.value?.trim() || 'Want to make friends from Abroad',
        timestamp: new Date().toLocaleString(),
      };

      if (!submissionData.email) return;

      // Update button state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Reserving VIP Pass...</span>';
      }

      // 1. Save to localStorage as instant offline backup
      try {
        const existing = JSON.parse(localStorage.getItem('talkwide_waitlist_leads') || '[]');
        existing.push(submissionData);
        localStorage.setItem('talkwide_waitlist_leads', JSON.stringify(existing));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      // 2. Submit to Google Sheets Webhook if configured
      if (GOOGLE_SHEET_WEBHOOK_URL) {
        try {
          const params = new URLSearchParams();
          params.append('Name', submissionData.name);
          params.append('Email', submissionData.email);
          params.append('Purpose', submissionData.purpose);
          params.append('LearningLanguage', submissionData.purpose);
          params.append('Timestamp', submissionData.timestamp);

          await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });
        } catch (fetchErr) {
          console.error('Google Sheet submission error:', fetchErr);
        }
      }

      // 3. Show celebratory success screen
      setTimeout(() => {
        if (earlyAccessFormWrapper) earlyAccessFormWrapper.style.display = 'none';
        if (earlyAccessSuccess) earlyAccessSuccess.classList.add('active');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Get Early Free VIP Access</span>';
        }
        earlyAccessForm.reset();
      }, 600);
    });
  }

  // 7. Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileNav.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileNav.querySelectorAll('a, button').forEach((item) => {
      item.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 8. Smooth Scroll for Anchor Links (excluding modals)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || this.classList.contains('open-early-access-modal') || this.classList.contains('btn-download')) {
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        if (mobileNav?.classList.contains('open')) {
          mobileNav.classList.remove('open');
        }
      }
    });
  });
});
