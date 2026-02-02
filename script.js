/* ============================================
   EMRYS BYRNE - FANTASY AUTHOR WEBSITE
   JavaScript - Interactivity & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParticles();
    initFloatingLeaves();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initNewsletterForm();
    initSmoothScroll();
});

/* ============================================
   FLOATING LEAVES
   Natural falling leaves with realistic shapes
   ============================================ */
function initFloatingLeaves() {
    const container = document.getElementById('floatingLeaves');
    if (!container) return;

    // Leaf SVG template - simple birch leaf
    const leafSvg = `<svg viewBox="0 0 28 50" fill="currentColor">
        <path d="M14 2 C8 8 4 16 4 24 C4 32 8 40 14 46 C20 40 24 32 24 24 C24 16 20 8 14 2Z"/>
        <path d="M14 8 L14 50" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.5"/>
        <path d="M8 18 Q14 22 14 22" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.4"/>
        <path d="M20 18 Q14 22 14 22" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.4"/>
        <path d="M6 28 Q14 34 14 34" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.4"/>
        <path d="M22 28 Q14 34 14 34" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.4"/>
    </svg>`;

    function createLeaf() {
        const leaf = document.createElement('div');

        leaf.className = 'leaf';
        leaf.innerHTML = leafSvg;

        // Random properties for natural variation
        const size = 20 + Math.random() * 25; // 20-45px
        const startX = Math.random() * 100;
        const fallDuration = 12 + Math.random() * 18; // 12-30s
        const swayDuration = 2 + Math.random() * 3; // 2-5s
        const swayAmount = 20 + Math.random() * 60; // 20-80px
        const startRotation = Math.random() * 360;
        const endRotation = startRotation + (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720);
        const opacity = 0.4 + Math.random() * 0.4; // 0.4-0.8

        leaf.style.cssText = `
            left: ${startX}%;
            width: ${size}px;
            height: ${size * 1.25}px;
            --fall-duration: ${fallDuration}s;
            --sway-duration: ${swayDuration}s;
            --sway-amount: ${Math.random() > 0.5 ? '' : '-'}${swayAmount}px;
            --start-rotation: ${startRotation}deg;
            --end-rotation: ${endRotation}deg;
            --leaf-opacity: ${opacity};
        `;

        container.appendChild(leaf);

        // Trigger animation
        requestAnimationFrame(() => {
            leaf.classList.add('falling');
        });

        // Remove after animation completes
        setTimeout(() => {
            leaf.remove();
        }, fallDuration * 1000 + 100);
    }

    // Create initial batch of leaves at different points in their fall
    function createInitialLeaves() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createLeaf(), i * 1500);
        }
    }

    // Spawn new leaves periodically
    function startLeafSpawner() {
        createInitialLeaves();

        setInterval(() => {
            // Random chance to spawn a leaf
            if (Math.random() > 0.3) {
                createLeaf();
            }
        }, 6000);
    }

    // Only run if user hasn't requested reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        startLeafSpawner();
    }
}

/* ============================================
   AMBIENT PARTICLES
   Floating light particles like forest fireflies
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 7;
    const colors = [
        'rgba(201, 162, 39, 0.6)',  // amber
        'rgba(201, 162, 39, 0.4)',  // amber light
        'rgba(143, 168, 136, 0.3)', // lichen
        'rgba(197, 212, 192, 0.2)'  // mist
    ];

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, colors);
    }
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    container.appendChild(particle);
}

/* ============================================
   NAVIGATION
   Scroll-aware navigation styling
   ============================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScroll = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavScroll(nav, lastScroll);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleNavScroll(nav, scrollY) {
    if (scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

/* ============================================
   MOBILE MENU
   Toggle menu for smaller screens
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking links
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS
   Reveal elements as they enter viewport
   ============================================ */
function initScrollAnimations() {
    // Add reveal class to elements
    const revealSelectors = [
        '.about-image',
        '.about-content',
        '.book-card',
        '.world-card',
        '.newsletter-card',
        '.section-title',
        '.section-intro'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });

    // Intersection Observer for reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Stagger animation for grid items
    staggerReveal('.book-card', 150);
    staggerReveal('.world-card', 100);
}

function staggerReveal(selector, delay) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * delay}ms`;
    });
}

/* ============================================
   NEWSLETTER FORM
   Mailchimp integration
   ============================================ */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        const input = form.querySelector('input[name="EMAIL"]');
        const button = form.querySelector('button');
        const email = input.value.trim();

        if (!email) {
            e.preventDefault();
            return;
        }

        // Visual feedback before redirect
        button.textContent = 'Joining...';
        button.disabled = true;

        // Form submits normally to Mailchimp (opens in new tab)
    });
}

/* ============================================
   SMOOTH SCROLL
   Enhanced smooth scrolling for anchor links
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ============================================
   PARALLAX EFFECTS
   Subtle depth on scroll (optional enhancement)
   ============================================ */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax(parallaxElements);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateParallax(elements) {
    const scrollY = window.scrollY;

    elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
}

/* ============================================
   BOOK COVER TILT EFFECT
   3D tilt on hover for book covers
   ============================================ */
document.querySelectorAll('.book-cover').forEach(cover => {
    cover.addEventListener('mousemove', (e) => {
        const rect = cover.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = -((y - centerY) / centerY) * 5;

        const art = cover.querySelector('.cover-art');
        if (art) {
            art.style.transform = `rotateY(${-15 + rotateY}deg) rotateX(${rotateX}deg)`;
        }
    });

    cover.addEventListener('mouseleave', () => {
        const art = cover.querySelector('.cover-art');
        if (art) {
            art.style.transform = '';
        }
    });
});

/* ============================================
   CURSOR TRAIL (optional subtle effect)
   ============================================ */
function initCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;

        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   TYPING EFFECT FOR TAGLINES (optional)
   ============================================ */
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}
