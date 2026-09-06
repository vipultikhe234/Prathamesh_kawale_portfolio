/**
 * Prathamesh Kawale — Portfolio Logic & UI Interactions
 */

(function () {
  'use strict';

  // =========================================================================
  // 2. TYPEWRITER EFFECT
  // =========================================================================
  function initTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;

    const titles = [
      'New Product Design Engineer',
      'SolidWorks, CATIA V5 & Creo Specialist',
      'SPM & Industrial Automation Designer',
      'Vacuum Forming & Sheet Metal Expert',
      'DFM / DFA & GD&T Practitioner'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        el.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        el.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2200; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  // =========================================================================
  // 3. PRECISION CROSSHAIR CURSOR
  // =========================================================================
  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effect on interactive elements
    const interactables = document.querySelectorAll('a, button, input, textarea, select, .project-card, .model-tab');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
      });
    });
  }

  // =========================================================================
  // 3. STATS COUNTER ON SCROLL
  // =========================================================================
  function initStatsCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.counter);
          const decimals = parseInt(el.dataset.decimal || '0', 10);
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString() + (el.dataset.counter === '100' ? '%' : el.dataset.counter === '4800' ? '+' : '');
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));
  }

  // =========================================================================
  // 4. PROJECT DETAILS MODAL HANDLER
  // =========================================================================
  function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeProjectModalBtn');
    const closeActionBtn = document.getElementById('modalCloseActionBtn');
    const openLabModalBtn = document.getElementById('openFullProjectModalBtn');

    if (!modal) return;

    function openModal(projectId) {
      const data = window.PROJECT_DATA[projectId];
      if (!data) return;

      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalSubtitle').textContent = `${data.code} • ${data.category}`;
      document.getElementById('modalProblemText').textContent = data.problem;
      document.getElementById('modalSolutionText').textContent = data.solution;
      document.getElementById('modalImg').src = data.image;

      // Highlights List
      const listEl = document.getElementById('modalHighlightsList');
      listEl.innerHTML = '';
      data.highlights.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2 text-slate-300';
        li.innerHTML = `<span class="text-cyan-400 font-bold mt-0.5">▶</span> <span>${item}</span>`;
        listEl.appendChild(li);
      });

      // Table Body
      const tableBody = document.getElementById('modalTableBody');
      tableBody.innerHTML = '';
      data.tableSpecs.forEach((spec) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="p-3 font-semibold text-white">${spec.param}</td>
          <td class="p-3 text-cyan-300">${spec.spec}</td>
          <td class="p-3 text-slate-400">${spec.method}</td>
        `;
        tableBody.appendChild(tr);
      });

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }

    // Attach click to all project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      const btn = card.querySelector('.project-details-btn');
      const pId = card.dataset.projectId;
      if (btn) {
        btn.addEventListener('click', () => openModal(pId));
      }
    });

    if (openLabModalBtn) {
      openLabModalBtn.addEventListener('click', () => {
        const activeKey = document.querySelector('.model-tab.active')?.dataset.model || 'rfid_storage';
        openModal(activeKey);
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeActionBtn) closeActionBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  // =========================================================================
  // 5. RESUME MODAL & PRINT HANDLER
  // =========================================================================
  function initResumeModal() {
    const modal = document.getElementById('resumeModal');
    const openBtn = document.getElementById('viewResumeBtn');
    const heroBtn = document.getElementById('heroResumeBtn');
    const contactResumeBtn = document.getElementById('contactResumeBtn');
    const mobileHeaderBtn = document.getElementById('mobileHeaderResumeBtn');
    const mobileBtn = document.getElementById('mobileResumeBtn');
    const closeBtn = document.getElementById('closeResumeModalBtn');
    const printBtn = document.getElementById('printResumeBtn');

    if (!modal) return;

    function openResume() {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeResume() {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }

    if (openBtn) openBtn.addEventListener('click', openResume);
    if (heroBtn) heroBtn.addEventListener('click', openResume);
    if (contactResumeBtn) contactResumeBtn.addEventListener('click', openResume);
    if (mobileHeaderBtn) mobileHeaderBtn.addEventListener('click', openResume);
    if (mobileBtn) mobileBtn.addEventListener('click', openResume);
    if (closeBtn) closeBtn.addEventListener('click', closeResume);

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeResume();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeResume();
      }
    });
  }

  // =========================================================================
  // 6. TOAST NOTIFICATION & CLIPBOARD SYSTEM
  // =========================================================================
  function showToast(message, icon = 'check-circle') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast flex items-center gap-2.5';
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 text-cyan-400"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    if (window.lucide) {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.dataset.copy;
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`Copied to clipboard: ${textToCopy}`);
          }).catch(() => {
            showToast(`Selected: ${textToCopy}`);
          });
        }
      });
    });
  }

  // =========================================================================
  // 7. NAVBAR MANAGEMENT, SCROLLSPY, MOBILE MENU & CAD TOGGLE
  // =========================================================================
  function initNavbarAndToggles() {
    const mainHeader = document.getElementById('mainHeader');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const desktopLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // 1. Scroll effect for Navbar Header
    function handleHeaderScroll() {
      if (window.scrollY > 20) {
        mainHeader.classList.add('header-scrolled');
      } else {
        mainHeader.classList.remove('header-scrolled');
      }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // 2. Active Section ScrollSpy
    const sections = document.querySelectorAll('section[id]');
    function updateScrollSpy() {
      const scrollY = window.scrollY + 140;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          desktopLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          mobileLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }
    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();

    // 3. Mobile Menu Toggle
    let isMenuOpen = false;
    function toggleMobileMenu(openState) {
      isMenuOpen = typeof openState === 'boolean' ? openState : !isMenuOpen;
      
      if (isMenuOpen) {
        mobileBtn.classList.add('is-active');
        mobileNav.classList.add('menu-open');
      } else {
        mobileBtn.classList.remove('is-active');
        mobileNav.classList.remove('menu-open');
      }
    }

    if (mobileBtn && mobileNav) {
      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });

      // Close menu when clicking any mobile nav link
      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          toggleMobileMenu(false);
        });
      });

      // Close menu on click outside
      document.addEventListener('click', (e) => {
        if (isMenuOpen && !mainHeader.contains(e.target)) {
          toggleMobileMenu(false);
        }
      });
    }

    // 4. CAD Wireframe Overlay Toggle (Desktop + Mobile)
    const cadToggle = document.getElementById('cadModeToggle');
    const mobileCadToggle = document.getElementById('mobileCadToggle');

    function toggleCadWireframe() {
      document.body.classList.toggle('cad-wireframe-active');
      const isActive = document.body.classList.contains('cad-wireframe-active');

      if (cadToggle) cadToggle.classList.toggle('text-amber-400', isActive);
      if (mobileCadToggle) mobileCadToggle.classList.toggle('text-amber-400', isActive);

      showToast(isActive ? 'Global CAD Grid & Blueprint Mode ON' : 'Standard Shaded Render Restored', 'box');
    }

    if (cadToggle) cadToggle.addEventListener('click', toggleCadWireframe);
    if (mobileCadToggle) {
      mobileCadToggle.addEventListener('click', () => {
        toggleCadWireframe();
        toggleMobileMenu(false);
      });
    }

    // 5. Scroll to Top Button
    const topBtn = document.getElementById('scrollToTopBtn');
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // =========================================================================
  // 8. GSAP SCROLL ENTRANCE REVEALS
  // =========================================================================
  function initGsapAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Stagger in Project Cards
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 85%'
      },
      y: 35,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out'
    });

    // Stagger in Competency Columns
    gsap.from('#skills .lg\\:col-span-4', {
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 85%'
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }

  // DOM Content Loaded Execution
  window.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    initTypewriter();
    initCustomCursor();
    initStatsCounters();
    initProjectModal();
    initResumeModal();
    initCopyButtons();
    initNavbarAndToggles();
    initGsapAnimations();
  });

})();
