// ============================================================
// script.js — Ameen.dev Portfolio
//
// Sections:
//  1.  Utility helpers
//  2.  Sidebar
//  3.  Intro animation
//  4.  Typing effect
//  5.  Nav-link active highlight
//  6.  Word + letter reveal animations
//  7.  PROJECT CARDS  — data + render
//  8.  Card scroll-reveal + 3D hover
//  9.  SERVICES CARDS — data + render       ← NEW
//  10. STATS CARDS    — data + render       ← NEW
//  11. Signature animation
//  12. Contact form
//  13. Custom cursor
//  14. Back-to-top progress ring
//  15. Skill progress bars
//  16. 3D Slider — builder
//  17. 3D Slider — drag rotate + modal
//  18. VANISH animation — redesigned
//  19. Mobile "View All" button
//  20. TESTIMONIALS — data + render + reveal + hover
// ============================================================


// ─── 1. UTILITY ──────────────────────────────────────────────

function scrollToSection(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
}


// ─── 2. SIDEBAR ──────────────────────────────────────────────

const hamburger    = document.getElementById('hamburger');
const sidebar      = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

hamburger.addEventListener('click',    () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));
sidebarLinks.forEach(l => l.addEventListener('click', () => sidebar.classList.remove('active')));


// ─── 3. INTRO ANIMATION ──────────────────────────────────────

const introEl   = document.getElementById('intro');
const introText = document.querySelector('.intro-text');
const mainEl    = document.getElementById('main-content');
const navbarEl  = document.getElementById('navbar');

if (!sessionStorage.getItem('visited')) {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    setTimeout(() => introText.classList.add('show'),              500);
    setTimeout(() => {
        introText.classList.remove('show');
        introText.classList.add('exit');
    }, 2500);
    setTimeout(() => introEl.classList.add('hide'),                3300);
    setTimeout(() => {
        mainEl.classList.add('reveal');
        navbarEl.classList.add('reveal');
        document.body.style.overflow = 'auto';
    }, 3800);

    sessionStorage.setItem('visited', 'true');
} else {
    introEl.style.display    = 'none';
    mainEl.style.opacity     = '1';
    navbarEl.style.opacity   = '1';
    document.body.style.overflow = 'auto';
}


// ─── 4. TYPING EFFECT ────────────────────────────────────────

const typingWords   = ['performance', 'speed', 'impact'];
let   wordIdx       = 0;
let   charIdx       = 0;
let   isDeleting    = false;
const typingEl      = document.getElementById('typing-word');

function typeEffect() {
    const word = typingWords[wordIdx];
    if (!isDeleting) {
        typingEl.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) setTimeout(() => (isDeleting = true), 1200);
    } else {
        typingEl.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            isDeleting = false;
            wordIdx    = (wordIdx + 1) % typingWords.length;
        }
    }
    setTimeout(typeEffect, isDeleting ? 60 : 90);
}
typeEffect();


// ─── 5. NAV-LINK ACTIVE HIGHLIGHT ────────────────────────────

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('href') === `#${id}`) l.classList.add('active');
            });
        }
    });
}, { root: null, rootMargin: '0px', threshold: 0.5 });

sections.forEach(s => navObs.observe(s));


// ─── 6. WORD + LETTER REVEAL ANIMATIONS ─────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // ── Word reveal ──────────────────────────────────────────
    // IMPORTANT: use textContent (not innerText) to avoid layout triggers.
    // Only wrap if NOT already wrapped (prevents double-wrapping on reload).
    document.querySelectorAll('.reveal-words').forEach(el => {
        // Skip if already wrapped
        if (el.querySelector('span')) return;
        const text = el.textContent.trim();
        if (!text) return;
        el.innerHTML = text
            .split(' ')
            .filter(w => w.length > 0)
            .map(w => `<span>${w}</span>`)
            .join(' ');
    });

    const wordObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('span').forEach((s, i) =>
                setTimeout(() => s.classList.add('show'), i * 100)
            );
            wordObs.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal-words').forEach(el => wordObs.observe(el));

    // ── Letter reveal ────────────────────────────────────────
    // Walks only TEXT nodes so existing child elements (span, strong) are preserved.
    document.querySelectorAll('.reveal-letters').forEach(el => {
        // Skip if already wrapped
        if (el.querySelector('span')) return;

        // Collect direct text nodes only (not deep — so we don't break child elements)
        const textNodes = [];
        el.childNodes.forEach(n => { if (n.nodeType === 3) textNodes.push(n); });

        textNodes.forEach(node => {
            const frag = document.createDocumentFragment();
            node.textContent.split('').forEach(ch => {
                if (ch === ' ') {
                    frag.appendChild(document.createTextNode(' '));
                    return;
                }
                const s = document.createElement('span');
                s.textContent = ch;
                frag.appendChild(s);
            });
            node.replaceWith(frag);
        });
    });

    const letterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('span').forEach((s, i) =>
                setTimeout(() => s.classList.add('show'), i * 50)
            );
            letterObs.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal-letters').forEach(el => letterObs.observe(el));
});


// ============================================================
// ─── 7. PROJECT CARDS — DATA + RENDER ────────────────────────
// ============================================================

/**
 * projectsData — single source of truth for all project cards.
 * To add/edit/remove a project: edit this array only. HTML stays clean.
 *
 * Fields:
 *   image  {string}  Unsplash image URL
 *   alt    {string}  Accessible alt text
 *   title  {string}  Card heading
 *   desc   {string}  Short description
 *   link   {string}  Live preview URL ("#" if not live yet)
 *   hidden {boolean} true = desktop-only card (.mobile-hidden)
 */
const projectsData = [
    {
        image:  'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&q=80',
        alt:    'E-Shop Store',
        title:  'E-Shop Store',
        desc:   'Fully responsive e-commerce layout with modern UI.',
        link:   'https://ameen-eshop.netlify.app',
        hidden: false
    },
    {
        image:  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
        alt:    'Gym Landing Page',
        title:  'Gym Landing Page',
        desc:   'High-performance fitness site with GSAP animations.',
        link:   'https://ameen-gym.netlify.app',
        hidden: false
    },
    {
        image:  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
        alt:    'Creative Agency',
        title:  'Creative Agency',
        desc:   'Minimalist portfolio for digital marketing studios.',
        link:   'https://ameen-agency.netlify.app',
        hidden: false
    },
    {
        image:  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
        alt:    'Web Application',
        title:  'Web Application',
        desc:   'Advanced dashboard with real-time analytics.',
        link:   '#',
        hidden: true
    },
    {
        image:  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80',
        alt:    'Mobile Portfolio',
        title:  'Mobile Portfolio',
        desc:   'Interactive mobile-first experience.',
        link:   '#',
        hidden: true
    },
    {
        image:  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=600&q=80',
        alt:    'UI/UX Design Kit',
        title:  'UI/UX Design Kit',
        desc:   'Modern design components and assets.',
        link:   '#',
        hidden: true
    },
    {
        image:  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
        alt:    'Code Editor Pro',
        title:  'Code Editor Pro',
        desc:   'Custom theme and plugins for developers.',
        link:   '#',
        hidden: true
    },
    {
        image:  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80',
        alt:    'SaaS Landing Page',
        title:  'SaaS Landing Page',
        desc:   'High-converting landing page for SaaS products.',
        link:   '#',
        hidden: true
    },
    {
        image:  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
        alt:    'Team Collaboration',
        title:  'Team Collaboration',
        desc:   'Real-time chat and task management tool.',
        link:   '#',
        hidden: true
    },
    {
        image:  'https://images.unsplash.com/photo-1551288049-bbbda536339a?w=600&q=80',
        alt:    'Data Analytics',
        title:  'Data Analytics',
        desc:   'Visualizing big data with interactive charts.',
        link:   '#',
        hidden: true
    }
];

/**
 * renderProjectCard(data)
 * Builds one .project-card DOM element.
 * Handles missing data gracefully with fallbacks.
 */
function renderProjectCard(data) {
    const image  = data.image  || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80';
    const alt    = data.alt    || data.title || 'Project';
    const title  = data.title  || 'Untitled Project';
    const desc   = data.desc   || 'No description available.';
    const link   = data.link   || '#';

    const card   = document.createElement('div');
    card.className = ['project-card', 'card', 'project-item', data.hidden ? 'mobile-hidden' : '']
        .filter(Boolean).join(' ');

    card.innerHTML = `
        <div class="card-img-container">
            <img src="${image}" alt="${alt}" loading="lazy">
            <div class="card-overlay">
                <a href="${link}" target="_blank" class="preview-btn">Live Preview</a>
            </div>
        </div>
        <div class="glare"></div>
        <div class="card-info">
            <h3>${title}</h3>
            <p>${desc}</p>
        </div>`;
    return card;
}

/** Render all project cards into #projectGrid via DocumentFragment */
function renderProjectCards() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    const frag = document.createDocumentFragment();
    projectsData.forEach(d => frag.appendChild(renderProjectCard(d)));
    grid.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', renderProjectCards);


// ─── 8. CARD SCROLL-REVEAL + 3D HOVER ────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // setTimeout 0 → runs after renderProjectCards() has appended cards
    setTimeout(() => {
        const cards = document.querySelectorAll('.card');
        const isMob = window.matchMedia('(max-width: 1024px)').matches;

        const cardObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('show');
                    cardObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            cardObs.observe(card);
            if (isMob) return;

            const glare = card.querySelector('.glare');
            if (!glare) return;

            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const x  = e.clientX - r.left;
                const y  = e.clientY - r.top;
                const rx = ((y - r.height / 2) / (r.height / 2)) * -10;
                const ry = ((x - r.width  / 2) / (r.width  / 2)) *  10;
                requestAnimationFrame(() => {
                    card.style.transform =
                        `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05) translateY(-10px)`;
                    glare.style.background =
                        `radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%, rgba(255,255,255,0.3), transparent 65%)`;
                    glare.style.opacity = '1';
                });
            });

            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform =
                        'perspective(1000px) rotateX(0) rotateY(0) scale(1) translateY(0)';
                    glare.style.opacity = '0';
                });
            });
        });
    }, 0);
});


// ============================================================
// ─── 9. SERVICES CARDS — DATA + RENDER ← NEW ─────────────────
// ============================================================

/**
 * servicesData — edit here to update service offerings.
 *
 * Fields:
 *   icon  {string}  Bootstrap Icons class (e.g. 'bi bi-code-slash')
 *   title {string}  Service heading
 *   desc  {string}  Short description
 */
const servicesData = [
    {
        icon:  'bi bi-code-slash',
        title: 'Frontend Development',
        desc:  'Pixel-perfect, performant interfaces built with HTML5, CSS3, and modern JavaScript (ES6+). Every component is clean, scalable, and production-ready.'
    },
    {
        icon:  'bi bi-phone',
        title: 'Responsive Design',
        desc:  'Fluid layouts that look and feel great on every screen — from ultra-wide monitors to small mobile viewports, without compromising speed or quality.'
    },
    {
        icon:  'bi bi-palette2',
        title: 'UI/UX Implementation',
        desc:  'Translating Figma or XD designs into living, breathing web experiences. Micro-interactions, smooth transitions, and thoughtful hover states included.'
    },
    {
        icon:  'bi bi-speedometer2',
        title: 'Performance Optimization',
        desc:  'Lazy loading, efficient DOM updates, GPU-composited animations, and minimal payload strategies to keep Lighthouse scores in the green.'
    },
    {
        icon:  'bi bi-brush',
        title: 'Landing Page Design',
        desc:  'High-converting landing pages with strong visual hierarchy, compelling CTAs, and immersive hero sections that capture attention immediately.'
    },
    {
        icon:  'bi bi-cart-check',
        title: 'E-Commerce Interfaces',
        desc:  'Responsive product grids, cart flows, and checkout pages with clean UX patterns that reduce friction and increase conversions for online stores.'
    }
];

/**
 * renderServiceCard(data)
 * Builds one .service-card element.
 */
function renderServiceCard(data) {
    const icon  = data.icon  || 'bi bi-star';
    const title = data.title || 'Service';
    const desc  = data.desc  || '';

    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <div class="service-icon">
            <i class="${icon}"></i>
        </div>
        <h3>${title}</h3>
        <p>${desc}</p>`;
    return card;
}

/** Render all service cards into #servicesGrid */
function renderServiceCards() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    const frag = document.createDocumentFragment();
    servicesData.forEach(d => frag.appendChild(renderServiceCard(d)));
    grid.appendChild(frag);
}

/** Scroll-reveal for service cards */
function initServicesReveal() {
    const cards = document.querySelectorAll('.service-card');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                // Stagger each card slightly
                setTimeout(() => e.target.classList.add('show'), i * 100);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(c => obs.observe(c));
}

document.addEventListener('DOMContentLoaded', () => {
    renderServiceCards();
    // Small delay so cards are in DOM before observer runs
    setTimeout(initServicesReveal, 50);
});


// ============================================================
// ─── 10. STATS CARDS — DATA + RENDER ← NEW ───────────────────
// ============================================================

/**
 * statsData — edit here to update counter values.
 *
 * Fields:
 *   value  {number}  Final counter value
 *   suffix {string}  Character after the number ('+', '%', 'x', etc.)
 *   label  {string}  Description below the number
 *   icon   {string}  Bootstrap Icons class
 */
const statsData = [
    { value: 30,  suffix: '+', label: 'Projects Completed', icon: 'bi bi-briefcase-fill' },
    { value: 15,  suffix: '+', label: 'Happy Clients',       icon: 'bi bi-people-fill' },
    { value: 2,   suffix: '+', label: 'Years Experience',    icon: 'bi bi-calendar-check-fill' },
    { value: 100, suffix: '%', label: 'Client Satisfaction', icon: 'bi bi-award-fill' }
];

/**
 * renderStatCard(data)
 * Builds one .stat-card element.
 * Counter animation is triggered by IntersectionObserver.
 */
function renderStatCard(data) {
    const value  = data.value  ?? 0;
    const suffix = data.suffix || '';
    const label  = data.label  || '';
    const icon   = data.icon   || 'bi bi-star-fill';

    const card = document.createElement('div');
    card.className = 'stat-card';
    card.dataset.target = value;   // used by counter animation

    card.innerHTML = `
        <div class="stat-number" data-count="0">0</div>
        <div class="stat-suffix">${suffix}</div>
        <div class="stat-label">${label}</div>
        <i class="${icon} stat-icon"></i>`;
    return card;
}

/** Animate a counter from 0 → target over ~1.5 s */
function animateCounter(el, target) {
    const duration     = 1500;
    let   startTime    = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

/** Render all stat cards into #statsGrid + attach reveal observer */
function renderStatCards() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    const frag = document.createDocumentFragment();
    statsData.forEach(d => frag.appendChild(renderStatCard(d)));
    grid.appendChild(frag);

    // Observe — trigger .show + counter when section enters viewport
    const cards = grid.querySelectorAll('.stat-card');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                    const countEl = entry.target.querySelector('.stat-number');
                    const target  = parseInt(entry.target.dataset.target, 10);
                    if (countEl && !isNaN(target)) animateCounter(countEl, target);
                }, i * 150);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(c => obs.observe(c));
}

document.addEventListener('DOMContentLoaded', renderStatCards);


// ─── 11. SIGNATURE ANIMATION ─────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const sigText = document.querySelector('.signature text');
    const sigH3   = document.querySelector('.signature > h3');
    if (!sigText || !sigH3) return;

    const sigObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (e.target === sigText) sigText.classList.add('text-animate');
                if (e.target === sigH3)   sigH3.classList.add('glow-animate');
                sigObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    sigObs.observe(sigText);
    sigObs.observe(sigH3);
});


// ─── 12. CONTACT FORM ────────────────────────────────────────

const submitBtn    = document.getElementById('submitBtn');
const planeIcon    = document.getElementById('plane');
const successToast = document.getElementById('toast');
const errorToast   = document.getElementById('errorToast');
const contactForm  = document.getElementById('contactForm');
const btnText      = submitBtn.querySelector('span');

submitBtn.addEventListener('click', async () => {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const errMsg  = errorToast.querySelector('span');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        errMsg.textContent = 'Please complete all fields before sending.';
        showErrToast(); return;
    }
    if (!emailRx.test(email)) {
        errMsg.textContent = 'Please enter a valid email address.';
        showErrToast(); return;
    }

    submitBtn.style.overflow    = 'visible';
    planeIcon.classList.add('fly-away');
    btnText.textContent         = 'Sending…';
    submitBtn.style.pointerEvents = 'none';

    try {
        const res = await fetch(contactForm.action, {
            method:  'POST',
            body:    new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            setTimeout(() => {
                successToast.classList.add('show');
                btnText.textContent = 'Message Sent';
            }, 800);
            setTimeout(() => {
                successToast.classList.remove('show');
                planeIcon.classList.remove('fly-away');
                submitBtn.style.pointerEvents = 'all';
                btnText.textContent = 'Send Message';
                contactForm.reset();
            }, 4500);
        } else {
            throw new Error();
        }
    } catch {
        errMsg.textContent = 'Oops! Something went wrong. Try again.';
        showErrToast();
        submitBtn.style.pointerEvents = 'all';
        btnText.textContent = 'Send Message';
        planeIcon.classList.remove('fly-away');
    }
});

function showErrToast() {
    errorToast.classList.add('show');
    setTimeout(() => errorToast.classList.remove('show'), 3500);
}


// ─── 13. CUSTOM CURSOR ───────────────────────────────────────

const dot     = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

// Guard: cursor elements must exist (hidden on mobile via CSS)
if (dot && outline) {
    let mouseX = 0, mouseY = 0;
    let oX     = 0, oY    = 0;

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    (function animCursor() {
        oX += (mouseX - oX) * 0.15;
        oY += (mouseY - oY) * 0.15;
        outline.style.transform = `translate(${oX}px, ${oY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animCursor);
    })();

    const hoverTargets = 'a,button,.social-icon,.project-card,.testimonial-card,.service-card,.process-step,.faq-question,input,textarea,.nav-link';
    document.addEventListener('mouseover',  e => { if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover-active'); });
    document.addEventListener('mouseout',   e => { if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover-active'); });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; outline.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; outline.style.opacity = '1'; });
}


// ─── 14. BACK-TO-TOP PROGRESS RING ───────────────────────────

const progressCircle = document.querySelector('.progress');
const backToTop      = document.getElementById('backToTop');
const circumference  = 2 * Math.PI * 45; // ≈ 283

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressCircle.style.strokeDashoffset = circumference - (scrolled / total) * circumference;
    backToTop.classList.toggle('active-progress', scrolled > 300);
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


// ─── 15. SKILL PROGRESS BARS ─────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const skillsGrid  = document.querySelector('.skills-grid');
    const progressBars = document.querySelectorAll('.skill-progress');
    const counters     = document.querySelectorAll('.percentage');

    function animateSkills() {
        progressBars.forEach(b => b.classList.add('animate'));
        counters.forEach(counter => {
            const target   = +counter.getAttribute('data-target');
            let   start    = null;
            const duration = 1500;
            const step = ts => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / duration, 1);
                counter.innerText = Math.floor(p * target) + '%';
                if (p < 1) requestAnimationFrame(step);
                else counter.innerText = target + '%';
            };
            requestAnimationFrame(step);
        });
    }

    const skillsObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { animateSkills(); skillsObs.unobserve(e.target); }
        });
    }, { threshold: 0.2 });

    if (skillsGrid) skillsObs.observe(skillsGrid);
});


// ─── 16. 3D SLIDER — CARD BUILDER ────────────────────────────

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('project-3d-slider');
        if (!slider) return;

        const names    = ['E-SHOP', 'GYM SITE', 'AGENCY', 'PORTFOLIO', 'WEB APP'];
        const total    = 10;
        let   html     = '';

        for (let i = 1; i <= total; i++) {
            const title = names[i - 1] || 'COMING SOON';
            html += `
            <div class="item" style="--position:${i}">
                <div class="simple-card">
                    <div class="card-content">
                        <span class="card-id">0${i}</span>
                        <h3>${title}</h3>
                        <div class="glow-line"></div>
                    </div>
                </div>
            </div>`;
        }
        slider.innerHTML = html;
    });
})();


// ─── 17. 3D SLIDER — DRAG ROTATE + MODAL ─────────────────────

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('project-3d-slider');
        if (!slider) return;

        let isDragging = false;
        let startX;
        let rotY        = 0;
        const autoSpeed = -0.15;

        function updateRot() {
            if (!isDragging) {
                rotY += autoSpeed;
                slider.style.transform =
                    `translate(-50%,-50%) perspective(2000px) rotateX(-16deg) rotateY(${rotY}deg)`;
            }
            requestAnimationFrame(updateRot);
        }
        slider.style.animation = 'none';
        requestAnimationFrame(updateRot);

        // Mouse drag
        window.addEventListener('mousedown', e => {
            if (!slider.classList.contains('active')) return;
            isDragging = true; startX = e.pageX;
        });
        window.addEventListener('mousemove', e => {
            if (!isDragging) return;
            rotY += (e.pageX - startX) * 0.2;
            startX = e.pageX;
            slider.style.transform =
                `translate(-50%,-50%) perspective(2000px) rotateX(-16deg) rotateY(${rotY}deg)`;
        });
        window.addEventListener('mouseup', () => (isDragging = false));

        // Touch drag
        window.addEventListener('touchstart', e => {
            if (!slider.classList.contains('active')) return;
            isDragging = true; startX = e.touches[0].pageX;
        });
        window.addEventListener('touchmove', e => {
            if (!isDragging) return;
            rotY += (e.touches[0].pageX - startX) * 0.2;
            startX = e.touches[0].pageX;
            slider.style.transform =
                `translate(-50%,-50%) perspective(2000px) rotateX(-16deg) rotateY(${rotY}deg)`;
        });
        window.addEventListener('touchend', () => (isDragging = false));

        // Card click → modal
        document.addEventListener('click', e => {
            const item = e.target.closest('.item');
            if (!item || !slider.classList.contains('active') || isDragging) return;

            const title  = item.querySelector('h3')?.innerText || 'Coming Soon';
            const modal  = document.createElement('div');
            modal.className = 'project-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="close-modal">&times;</button>
                    <div class="modal-body">
                        <h2>${title}</h2>
                        <p>Project details and description goes here.</p>
                        <a href="#" target="_blank" class="live-btn">Live Preview</a>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            modal.querySelector('.close-modal').onclick = () => {
                modal.remove();
                document.body.style.overflow = 'auto';
            };
        });
    });
})();


// ============================================================
// ─── 18. VANISH ANIMATION — REDESIGNED ───────────────────────
// ============================================================
/**
 * NEW vs OLD:
 *  Old: clip-path wipe — abrupt, mechanical, laggy particles.
 *  New: CSS @keyframes cardDissolve (scale + blur + fade + drift)
 *       + one-shot Web Animations API particle burst per card
 *         (GPU only: transform + opacity — zero layout thrashing)
 *       + staggered timing (120 ms/card)
 *       + 3D slider entrance: sliderFadeIn keyframe
 *       + reverse (assemble) with cardAssemble keyframe
 *
 * Class names preserved from original:
 *   #viewAllBtn, .project-item, .is-vanishing, .v-particle,
 *   #project-3d-slider, .slider-active, .dots-loader
 */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const btn     = document.getElementById('viewAllBtn');
        const section = document.querySelector('.project-section');
        const slider  = document.getElementById('project-3d-slider');
        if (!btn) return;

        /** Returns all visible .project-item elements */
        function visibleItems() {
            return Array.from(document.querySelectorAll('.project-item'))
                .filter(el => window.getComputedStyle(el).display !== 'none');
        }

        /**
         * Fires 60 GPU-composited dust particles from a card's rect.
         * upward=true → dissolve effect; false → assemble effect.
         */
        function burstParticles(rect, upward) {
            const COLORS = ['#38bdf8', '#ffffff', '#8b5cf6', '#a5f3fc'];
            for (let i = 0; i < 60; i++) {
                const p    = document.createElement('div');
                p.className = 'v-particle';
                const size  = Math.random() * 5 + 2;
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                p.style.cssText = `
                    left:${rect.left + Math.random() * rect.width}px;
                    top:${rect.top  + Math.random() * rect.height}px;
                    width:${size}px; height:${size}px;
                    background:${color};
                    box-shadow:0 0 ${size*2}px ${color};`;
                document.body.appendChild(p);

                const dx  = (Math.random() - 0.5) * 200;
                const dy  = upward
                    ? -(Math.random() * 180 + 60)
                    :  (Math.random() * 180 + 60);

                p.animate(
                    [
                        { transform: 'translate(0,0) scale(1)',               opacity: 1 },
                        { transform: `translate(${dx}px,${dy}px) scale(0)`,   opacity: 0 }
                    ],
                    {
                        duration: 600 + Math.random() * 600,
                        delay:    Math.random() * 300,
                        easing:   'ease-out',
                        fill:     'forwards'
                    }
                ).onfinish = () => p.remove();
            }
        }

        function showLoader(b) {
            b.innerHTML =
                '<div class="dots-loader"><span></span><span></span><span></span></div>';
        }

        function cleanup(b, label, addViewLess) {
            setTimeout(() => {
                document.querySelectorAll('.project-item').forEach(el => {
                    el.style.animation    = '';
                    el.style.opacity      = '';
                    el.style.transform    = '';
                    el.style.filter       = '';
                    el.style.pointerEvents = '';
                });
                b.disabled   = false;
                b.innerText  = label;
                addViewLess
                    ? b.classList.add('view-less')
                    : b.classList.remove('view-less');
                document.body.style.overflow = 'auto';
                if (section) section.style.pointerEvents = 'auto';
            }, 800);
        }

        const STAGGER     = 120;   // ms between each card animation
        const DISSOLVE_MS = 900;   // matches cardDissolve keyframe duration

        btn.addEventListener('click', function () {
            const isReverse = this.classList.contains('view-less');
            this.disabled   = true;
            document.body.style.overflow = 'hidden';
            if (section) section.style.pointerEvents = 'none';
            showLoader(this);

            const items = visibleItems();

            if (!isReverse) {
                // ── VANISH: grid → 3D slider ──────────────────
                items.forEach((item, idx) => {
                    setTimeout(() => {
                        const rect = item.getBoundingClientRect();
                        burstParticles(rect, true);
                        item.classList.add('is-vanishing');
                    }, idx * STAGGER);
                });

                const totalTime = items.length * STAGGER + DISSOLVE_MS + 200;
                setTimeout(() => {
                    if (slider) {
                        section.classList.add('slider-active');
                        slider.style.display = 'block';
                        slider.offsetHeight; // force reflow
                        slider.classList.add('active', 'slider-entering');
                        slider.classList.remove('is-reversing');
                        slider.addEventListener('animationend',
                            () => slider.classList.remove('slider-entering'),
                            { once: true }
                        );
                    }
                    cleanup(this, 'View Less', true);
                }, totalTime);

            } else {
                // ── ASSEMBLE: 3D slider → grid ────────────────
                if (slider) {
                    slider.classList.add('is-reversing');
                    slider.classList.remove('active');

                    setTimeout(() => {
                        slider.style.display = 'none';
                        section.classList.remove('slider-active');

                        const reversed = [...items].reverse();
                        reversed.forEach((item, idx) => {
                            setTimeout(() => {
                                const rect = item.getBoundingClientRect();
                                item.classList.remove('is-vanishing');
                                item.classList.add('is-assembling');
                                burstParticles(rect, false);
                                item.addEventListener('animationend',
                                    () => item.classList.remove('is-assembling'),
                                    { once: true }
                                );
                            }, idx * STAGGER);
                        });

                        cleanup(this, 'View All', false);
                    }, 800);
                }
            }
        });
    });
})();


// ─── 19. MOBILE "VIEW ALL" BUTTON ────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobileViewMore');
    if (!mobileBtn) return;

    mobileBtn.addEventListener('click', function () {
        const hiddenCards = document.querySelectorAll('.mobile-hidden');
        const isShowing   = this.classList.contains('view-less');

        if (!isShowing) {
            hiddenCards.forEach((c, i) => {
                c.style.display = 'block';
                setTimeout(() => c.classList.add('reveal'), i * 100);
            });
            this.innerText = 'View Less';
            this.classList.add('view-less');
        } else {
            Array.from(hiddenCards).reverse().forEach((c, i) => {
                setTimeout(() => {
                    c.classList.remove('reveal');
                    setTimeout(() => (c.style.display = 'none'), 500);
                }, i * 50);
            });
            this.innerText = 'View All Projects';
            this.classList.remove('view-less');
            document.querySelector('.project-grid')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ============================================================
// ─── 20. TESTIMONIALS — DATA + RENDER + REVEAL + HOVER ───────
// ============================================================

/** testimonialsData — edit here to add/update/remove reviews */
const testimonialsData = [
    {
        name:   'Sarah Mitchell',
        role:   'CEO, BrightPath Studio',
        avatar: 'https://i.pravatar.cc/100?img=47',
        review: 'Working with Ameen was an absolute pleasure. He turned our outdated site into a stunning, high-performance experience. Delivery was fast and the attention to detail was impressive.',
        stars:  5
    },
    {
        name:   'Daniel Ortega',
        role:   'Founder, LaunchLab',
        avatar: 'https://i.pravatar.cc/100?img=12',
        review: 'The landing page Ameen built converted 3× better from day one. Clean code, beautiful design, and zero revisions needed. Highly recommended for any serious project.',
        stars:  5
    },
    {
        name:   'Priya Nair',
        role:   'Product Manager, Nexora',
        avatar: 'https://i.pravatar.cc/100?img=23',
        review: 'Ameen has a rare combination of strong design taste and technical depth. He understood our brand immediately and delivered something we genuinely love showing off.',
        stars:  5
    },
    {
        name:   'James Carter',
        role:   'Marketing Director, Skyline Co.',
        avatar: 'https://i.pravatar.cc/100?img=33',
        review: 'Professional, responsive, and incredibly skilled. He built our entire SaaS landing page from scratch in record time. The animations alone generated tons of positive feedback.',
        stars:  4
    },
    {
        name:   'Aisha Bello',
        role:   'Creative Director, Inkform Agency',
        avatar: 'https://i.pravatar.cc/100?img=56',
        review: 'I have worked with many developers — Ameen stands out for caring about both the code quality and the final visual result. The site feels alive and premium.',
        stars:  5
    },
    {
        name:   'Ryan Patel',
        role:   'Startup Founder',
        avatar: 'https://i.pravatar.cc/100?img=68',
        review: 'Exceptional work on our e-commerce project. Every interaction feels smooth and polished. We have received consistent compliments from customers about the shopping experience.',
        stars:  5
    }
];

/** Build one .testimonial-card with fallback handling */
function renderTestimonialCard(data) {
    const name   = data.name   || 'Anonymous';
    const role   = data.role   || 'Client';
    const review = data.review || 'Great experience working with this developer.';
    const stars  = typeof data.stars === 'number' ? Math.min(5, Math.max(1, data.stars)) : 5;
    const avatar = data.avatar || '';

    const starsHTML = Array.from({ length: 5 }, (_, i) =>
        `<i class="${i < stars ? 'bi bi-star-fill' : 'bi bi-star'}"></i>`
    ).join('');

    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.innerHTML = `
        <span class="quote-icon" aria-hidden="true">"</span>
        <div class="stars" aria-label="${stars} out of 5 stars">${starsHTML}</div>
        <p class="review-text">${review}</p>
        <div class="author-row">
            <img class="author-avatar" src="${avatar}" alt="Photo of ${name}"
                 loading="lazy" onerror="this.style.display='none'">
            <div class="author-info">
                <span class="author-name">${name}</span>
                <span class="author-role">${role}</span>
            </div>
        </div>`;
    return card;
}

/** Render all testimonial cards into #testimonialsGrid */
function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    const frag = document.createDocumentFragment();
    testimonialsData.forEach(d => frag.appendChild(renderTestimonialCard(d)));
    grid.appendChild(frag);
}

/** Scroll-reveal: adds .show when each card enters viewport */
function initTestimonialsReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('show');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.testimonial-card').forEach(c => obs.observe(c));
}

/** 3D tilt + glare hover — desktop only */
function initTestimonialsHover() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    document.querySelectorAll('.testimonial-card').forEach(card => {
        const glare = document.createElement('div');
        glare.className = 'glare';
        card.appendChild(glare);

        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const x  = e.clientX - r.left;
            const y  = e.clientY - r.top;
            const rx = ((y - r.height / 2) / (r.height / 2)) * -8;
            const ry = ((x - r.width  / 2) / (r.width  / 2)) *  8;
            requestAnimationFrame(() => {
                card.style.transform =
                    `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03) translateY(-5px)`;
                glare.style.background =
                    `radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%, rgba(255,255,255,0.25), transparent 65%)`;
                glare.style.opacity = '1';
            });
        });

        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                card.style.transform =
                    'perspective(1000px) rotateX(0) rotateY(0) scale(1) translateY(0)';
                glare.style.opacity = '0';
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTestimonials();
    initTestimonialsReveal();
    initTestimonialsHover();
});


// ================================================================
// ─── 21. MARQUEE STRIPS — DATA + RENDER ──────────────────────
// ================================================================

const marqueeItems1 = [
    { icon: 'bi bi-filetype-html', label: 'HTML5' },
    { icon: 'bi bi-filetype-css',  label: 'CSS3' },
    { icon: 'bi bi-filetype-js',   label: 'JavaScript' },
    { icon: 'bi bi-phone',         label: 'Responsive' },
    { icon: 'bi bi-palette2',      label: 'UI Design' },
    { icon: 'bi bi-git',           label: 'Git' },
    { icon: 'bi bi-speedometer2',  label: 'Performance' },
    { icon: 'bi bi-brush',         label: 'Figma' },
    { icon: 'bi bi-bootstrap',     label: 'Bootstrap' },
    { icon: 'bi bi-stars',         label: 'Animation' },
];

const marqueeItems2 = [
    { icon: 'bi bi-trophy-fill',       label: '30+ Projects Delivered' },
    { icon: 'bi bi-people-fill',       label: '15+ Happy Clients' },
    { icon: 'bi bi-star-fill',         label: '5-Star Reviews' },
    { icon: 'bi bi-award-fill',        label: 'Clean Code' },
    { icon: 'bi bi-lightning-fill',    label: 'Fast Delivery' },
    { icon: 'bi bi-shield-check-fill', label: 'Pixel Perfect' },
    { icon: 'bi bi-phone-fill',        label: 'Mobile First' },
    { icon: 'bi bi-camera-video-fill', label: 'Smooth Animations' },
];

function buildMarqueeHTML(items) {
    // Build one set, then duplicate for seamless infinite scroll
    const oneSet = items.map((item, i) =>
        `<span class="marquee-item"><i class="${item.icon}"></i>${item.label}</span>` +
        (i < items.length - 1 ? '<span class="marquee-dot"></span>' : '')
    ).join('');
    return oneSet + '<span class="marquee-dot"></span>' + oneSet;
}

document.addEventListener('DOMContentLoaded', () => {
    const t1 = document.getElementById('marqueeTrack1');
    const t2 = document.getElementById('marqueeTrack2');
    if (t1) t1.innerHTML = buildMarqueeHTML(marqueeItems1);
    if (t2) t2.innerHTML = buildMarqueeHTML(marqueeItems2);
});


// ================================================================
// ─── 22. PROCESS STEPS — DATA + RENDER ───────────────────────
// ================================================================

const processData = [
    { num: '01', title: 'Discovery',  desc: 'Deep dive into your goals, audience, and requirements through a focused kickoff conversation.' },
    { num: '02', title: 'Design',     desc: 'Wireframes and a full visual direction — every layout and interaction planned before a single line of code.' },
    { num: '03', title: 'Build',      desc: 'Clean, semantic, well-commented code. Built in reusable components for maximum scalability.' },
    { num: '04', title: 'Launch',     desc: 'Thorough testing across browsers and devices. Smooth handoff with documentation and ongoing support.' },
];

function renderProcessSteps() {
    const grid = document.getElementById('processGrid');
    if (!grid) return;

    const frag = document.createDocumentFragment();
    processData.forEach(d => {
        const step = document.createElement('div');
        step.className = 'process-step';
        step.innerHTML = `
            <div class="process-num">${d.num}</div>
            <h3>${d.title}</h3>
            <p>${d.desc}</p>`;
        frag.appendChild(step);
    });
    grid.appendChild(frag);

    // Scroll-reveal with stagger
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (!e.isIntersecting) return;
            setTimeout(() => e.target.classList.add('show'), i * 130);
            obs.unobserve(e.target);
        });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.process-step').forEach(s => obs.observe(s));
}

document.addEventListener('DOMContentLoaded', renderProcessSteps);


// ================================================================
// ─── 23. FAQ ACCORDION — DATA + RENDER + TOGGLE ──────────────
// ================================================================

const faqData = [
    {
        q: 'What technologies do you work with?',
        a: 'I specialise in HTML5, CSS3, and vanilla JavaScript (ES6+). I also work with Bootstrap, Tailwind CSS, and GSAP for animations. I focus on delivering clean, dependency-light code that performs well in production.'
    },
    {
        q: 'How long does a typical project take?',
        a: 'A focused landing page typically takes 5–7 days. A full multi-section portfolio or business site takes 2–4 weeks. Timeline depends on scope, content readiness, and revision rounds — I\'ll give you an accurate estimate after the discovery call.'
    },
    {
        q: 'Do you offer revisions?',
        a: 'Yes — every project includes up to 3 rounds of revisions at no extra cost. I\'m thorough in the discovery phase to minimise the need for major changes later.'
    },
    {
        q: 'Can you redesign my existing website?',
        a: 'Absolutely. I\'ll audit your current site, identify what\'s working and what isn\'t, and rebuild it with better performance, design quality, and clean code.'
    },
    {
        q: 'Will my site be mobile-friendly?',
        a: 'Every site I build is fully responsive and mobile-first by default. I test across multiple real devices — phones, tablets, and desktops — before any handoff.'
    },
    {
        q: 'What\'s your pricing structure?',
        a: 'I charge per project, not per hour. Pricing is based on scope and complexity. After a brief call I\'ll send a detailed proposal with a fixed price — no hidden fees or surprise invoices.'
    },
];

function renderFAQ() {
    const grid = document.getElementById('faqGrid');
    if (!grid) return;

    const frag = document.createDocumentFragment();
    faqData.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'faq-item';
        el.innerHTML = `
            <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-${i}">
                ${item.q}
                <span class="faq-icon"><i class="bi bi-plus"></i></span>
            </button>
            <div class="faq-answer" id="faq-ans-${i}" role="region">
                <p>${item.a}</p>
            </div>`;
        frag.appendChild(el);
    });
    grid.appendChild(frag);

    // Scroll-reveal
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (!e.isIntersecting) return;
            setTimeout(() => e.target.classList.add('show'), i * 80);
            revealObs.unobserve(e.target);
        });
    }, { threshold: 0.08 });

    // Accordion toggle
    grid.querySelectorAll('.faq-item').forEach(item => {
        revealObs.observe(item);

        item.querySelector('.faq-question').addEventListener('click', function () {
            const isOpen = item.classList.contains('open');

            // Close all open items
            grid.querySelectorAll('.faq-item.open').forEach(open => {
                open.classList.remove('open');
                open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open this one if it was closed
            if (!isOpen) {
                item.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', renderFAQ);

// ================================================================
