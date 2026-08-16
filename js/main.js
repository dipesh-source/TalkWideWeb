/**
 * TalkWide Landing Page Scripts
 * Modern, clean, and lightweight interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking any link inside it
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Interactive App Tour Tabs
  const tabButtons = document.querySelectorAll('.tour-tab-btn');
  const tabPanels = document.querySelectorAll('.tour-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility
      tabPanels.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active');
        
        // Close all other FAQs
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));

        // Toggle current
        if (!isCurrentlyActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. Early Access / Waitlist Modal Handling
  const modal = document.getElementById('early-access-modal');
  const closeBtn = document.getElementById('close-early-access-btn');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const openButtons = document.querySelectorAll('.open-early-access-modal');
  const formWrapper = document.getElementById('early-access-form-wrapper');
  const successWrapper = document.getElementById('early-access-success');
  const waitlistForm = document.getElementById('early-access-form');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling

    // If already submitted previously in this session
    if (localStorage.getItem('talkwide_waitlist_joined')) {
      if (formWrapper) formWrapper.style.display = 'none';
      if (successWrapper) successWrapper.classList.add('active');
    } else {
      if (formWrapper) formWrapper.style.display = 'block';
      if (successWrapper) successWrapper.classList.remove('active');
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  // Close modal when clicking directly on backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Submission
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('waitlist-name')?.value || '';
      const email = document.getElementById('waitlist-email')?.value || '';
      const language = document.getElementById('waitlist-purpose')?.value || '';

      // Store in localStorage for session state
      localStorage.setItem('talkwide_waitlist_joined', 'true');
      localStorage.setItem('talkwide_waitlist_email', email);

      // Show success screen inside modal
      if (formWrapper) formWrapper.style.display = 'none';
      if (successWrapper) successWrapper.classList.add('active');
    });
  }

  // 5. Update Current Year in Footer
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
