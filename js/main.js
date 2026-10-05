/* ============================================
   Pavithra Bhat – Portfolio JavaScript
   Handles: navigation, scroll animations,
   form interaction, and micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Element References ----------
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const allNavLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');
  const revealElements = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contactForm');

  // ---------- Mobile Navigation Toggle ----------
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---------- Navbar Scroll Effect ----------
  let lastScrollY = 0;
  const handleNavbarScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  };

  // ---------- Active Nav Link on Scroll ----------
  const updateActiveLink = () => {
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  // ---------- Scroll Reveal Animation ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after revealing for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Smooth Scroll (fallback for older browsers) ----------
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ---------- Contact Form Handling ----------
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalContent = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // Capture form data
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value || 'Portfolio Contact';
      const message = document.getElementById('form-message').value;

      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoLink = `mailto:pavithrabhat39@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Brief delay to show "Sending..." animation
      setTimeout(() => {
        window.location.href = mailtoLink;
        
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Mail Client Opened!
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #a638ff, #ff6675)';

        // Reset after 3 seconds
        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 600);
    });
  }

  // ---------- Skill Tag Hover Glow ----------
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.boxShadow = '0 0 15px rgba(166, 56, 255, 0.25)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.boxShadow = '';
    });
  });

  // ---------- Typing Effect for Hero Title ----------
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--accent-3)';
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < text.length) {
        heroTitle.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 35);
      } else {
        // Remove cursor after typing is done
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1500);
      }
    };

    // Start typing after a short delay
    setTimeout(typeChar, 800);
  }

  // ---------- Parallax Effect on Hero Orbs ----------
  const orbs = document.querySelectorAll('.hero-orb');
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 8;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  };

  // ---------- Scroll Event Listener (throttled) ----------
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Initial calls
  handleNavbarScroll();
  updateActiveLink();

  // ---------- Add spin keyframe dynamically ----------
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ---------- Console Easter Egg ----------
  console.log(
    '%c👋 Hi there! Thanks for checking out my portfolio code.',
    'color: #22d3ee; font-size: 14px; font-weight: bold;'
  );
  console.log(
    '%cBuilt by Pavithra Bhat • pavithrabhat39@gmail.com',
    'color: #94a3b8; font-size: 12px;'
  );

});
