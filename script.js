// ============================================================
// script.js — Ameen.dev Portfolio
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

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

hamburger.addEventListener('click', () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));
sidebarLinks.forEach(l => l.addEventListener('click', () => sidebar.classList.remove('active')));


// ─── 3. INTRO ANIMATION ──────────────────────────────────────

const introEl = document.getElementById('intro');
const introText = document.querySelector('.intro-text');
const mainEl = document.getElementById('main-content');
const navbarEl = document.getElementById('navbar');

if (!sessionStorage.getItem('visited')) {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    setTimeout(() => introText.classList.add('show'), 500);
    setTimeout(() => {
        introText.classList.remove('show');
        introText.classList.add('exit');
    }, 2500);
    setTimeout(() => introEl.classList.add('hide'), 3300);
    setTimeout(() => {
        mainEl.classList.add('reveal');
        navbarEl.classList.add('reveal');
        document.body.style.overflow = 'auto';
    }, 3800);

    sessionStorage.setItem('visited', 'true');
} else {
    introEl.style.display = 'none';
    mainEl.style.opacity = '1';
    navbarEl.style.opacity = '1';
    mainEl.classList.add('reveal'); // Ensures safe fallback execution for Hero CSS animations
    navbarEl.classList.add('reveal');
    document.body.style.overflow = 'auto';
}


// ─── 4. TYPING EFFECT ────────────────────────────────────────

const typingWords = ['performance', 'speed', 'impact'];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingEl = document.getElementById('typing-word');

function typeEffect() {
    if (!typingEl) return;
    const word = typingWords[wordIdx];

    if (!isDeleting) {
        typingEl.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) {
            setTimeout(() => (isDeleting = true), 1500);
        }
    } else {
        typingEl.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % typingWords.length;
        }
    }
    setTimeout(typeEffect, isDeleting ? 40 : 80);
}

document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
});


// ─── 5. NAV-LINK ACTIVE HIGHLIGHT ────────────────────────────

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

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
    document.querySelectorAll('.reveal-words').forEach(el => {
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

    document.querySelectorAll('.reveal-letters').forEach(el => {
        if (el.querySelector('span')) return;
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

// Add this to your script.js (Replace the old 7. PROJECT CARDS section)
const premiumProjectsData = [
    {
        id: '01',
        title: 'Lumina Dashboard',
        type: 'Web Application',
        desc: 'An advanced data visualization platform engineered for real-time analytics. Built with modular architecture to process complex datasets without dropping a single frame.',
        tags: ['React', 'D3.js', 'Tailwind'],
        image: './assets/projectCardImages/SaaS_dashboard.jpg',
        liveLink: '#',
        sourceLink: '#'
    },
    {
        id: '02',
        title: 'Aura Studio',
        type: 'Creative Agency',
        desc: 'A minimalist digital storefront combining fluid typography with WebGL micro-interactions. Designed to capture attention through pure aesthetic precision.',
        tags: ['Next.js', 'GSAP', 'WebGL'],
        image: './assets/projectCardImages/creative_agency.jpg',
        liveLink: '#',
        sourceLink: '#'
    },
    {
        id: '03',
        title: 'Nexus Commerce',
        type: 'E-Commerce System',
        desc: 'High-performance storefront architecture. Features optimistic UI updates, seamless cart transitions, and an editorial product discovery experience.',
        tags: ['TypeScript', 'Stripe', 'Framer Motion'],
        image: './assets/projectCardImages/e-commerce.jpg',
        liveLink: '#',
        sourceLink: '#'
    }
];

// ============================================================
// ─── 7. PREMIUM SELECTED WORK — RENDER ENGINE ───────────────
// ============================================================

function renderPremiumProjects() {
    const stack = document.getElementById('premiumWorkStack');
    if (!stack) return;

    const frag = document.createDocumentFragment();

    premiumProjectsData.forEach((project) => {
        const frame = document.createElement('article');
        // Apply existing reveal-blur class to tie into your scroll ecosystem
        frame.className = 'story-frame reveal-blur';

        frame.innerHTML = `
            <div class="story-card-wrapper">
                <div class="story-visual">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </div>
                
                <div class="story-panel">
                    <div class="story-meta-header">
                        <span class="story-id">${project.id}</span>
                        <span class="story-type">${project.type}</span>
                    </div>
                    
                    <h3>${project.title}</h3>
                    <p>${project.desc}</p>
                    
                    <div class="story-tags">
                        ${project.tags.map(tag => `<span class="s-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="story-actions">
                        <a href="${project.liveLink}" target="_blank" class="story-cta">
                            Live Preview <i class="bi bi-arrow-up-right"></i>
                        </a>
                        <a href="${project.sourceLink}" target="_blank" class="story-cta">
                            Source <i class="bi bi-github"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        frag.appendChild(frame);
    });

    stack.appendChild(frag);

    // Attach the newly rendered frames to your existing intersection observer
    setTimeout(initPremiumScrollReveal, 100);
}

function initPremiumScrollReveal() {
    const frames = document.querySelectorAll('.story-frame.reveal-blur');
    const scrollObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-revealed');
                scrollObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -100px 0px" });

    frames.forEach(el => scrollObs.observe(el));
}

document.addEventListener('DOMContentLoaded', renderPremiumProjects);

// ─── 8. CARD SCROLL-REVEAL + 3D HOVER ────────────────────────

document.addEventListener('DOMContentLoaded', () => {
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
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const rx = ((y - r.height / 2) / (r.height / 2)) * -10;
                const ry = ((x - r.width / 2) / (r.width / 2)) * 10;
                requestAnimationFrame(() => {
                    card.style.transform =
                        `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05) translateY(-10px)`;
                    glare.style.background =
                        `radial-gradient(circle at ${(x / r.width) * 100}% ${(y / r.height) * 100}%, rgba(255,255,255,0.3), transparent 65%)`;
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
// ─── 9. SERVICES CARDS — DATA + RENDER ───────────────────────
// ============================================================

const servicesData = [
    {
        icon: 'bi bi-code-slash',
        title: 'Frontend Development',
        desc: 'Pixel-perfect, performant interfaces built with HTML5, CSS3, and modern JavaScript (ES6+). Every component is clean, scalable, and production-ready.'
    },
    {
        icon: 'bi bi-phone',
        title: 'Responsive Design',
        desc: 'Fluid layouts that look and feel great on every screen — from ultra-wide monitors to small mobile viewports, without compromising speed or quality.'
    },
    {
        icon: 'bi bi-palette2',
        title: 'UI/UX Implementation',
        desc: 'Translating Figma or XD designs into living, breathing web experiences. Micro-interactions, smooth transitions, and thoughtful hover states included.'
    },
    {
        icon: 'bi bi-speedometer2',
        title: 'Performance Optimization',
        desc: 'Lazy loading, efficient DOM updates, GPU-composited animations, and minimal payload strategies to keep Lighthouse scores in the green.'
    },
    {
        icon: 'bi bi-brush',
        title: 'Landing Page Design',
        desc: 'High-converting landing pages with strong visual hierarchy, compelling CTAs, and immersive hero sections that capture attention immediately.'
    },
    {
        icon: 'bi bi-cart-check',
        title: 'E-Commerce Interfaces',
        desc: 'Responsive product grids, cart flows, and checkout pages with clean UX patterns that reduce friction and increase conversions for online stores.'
    }
];

function renderServiceCard(data) {
    const icon = data.icon || 'bi bi-star';
    const title = data.title || 'Service';
    const desc = data.desc || '';

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

function renderServiceCards() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    const frag = document.createDocumentFragment();
    servicesData.forEach(d => frag.appendChild(renderServiceCard(d)));
    grid.appendChild(frag);
}

function initServicesReveal() {
    const cards = document.querySelectorAll('.service-card');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('show'), i * 100);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(c => obs.observe(c));
}

document.addEventListener('DOMContentLoaded', () => {
    renderServiceCards();
    setTimeout(initServicesReveal, 50);
});


// ============================================================
// ─── 10. STATS CARDS — DATA + RENDER ─────────────────────────
// ============================================================

const statsData = [
    { value: 30, suffix: '+', label: 'Projects Completed', icon: 'bi bi-briefcase-fill' },
    { value: 15, suffix: '+', label: 'Happy Clients', icon: 'bi bi-people-fill' },
    { value: 2, suffix: '+', label: 'Years Experience', icon: 'bi bi-calendar-check-fill' },
    { value: 100, suffix: '%', label: 'Client Satisfaction', icon: 'bi bi-award-fill' }
];

function renderStatCard(data) {
    const value = data.value ?? 0;
    const suffix = data.suffix || '';
    const label = data.label || '';
    const icon = data.icon || 'bi bi-star-fill';

    const card = document.createElement('div');
    card.className = 'stat-card';
    card.dataset.target = value;

    card.innerHTML = `
        <div class="stat-number" data-count="0">0</div>
        <div class="stat-suffix">${suffix}</div>
        <div class="stat-label">${label}</div>
        <i class="${icon} stat-icon"></i>`;
    return card;
}

function animateCounter(el, target) {
    const duration = 1500;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

function renderStatCards() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    const frag = document.createDocumentFragment();
    statsData.forEach(d => frag.appendChild(renderStatCard(d)));
    grid.appendChild(frag);

    const cards = grid.querySelectorAll('.stat-card');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                    const countEl = entry.target.querySelector('.stat-number');
                    const target = parseInt(entry.target.dataset.target, 10);
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
    const sigH3 = document.querySelector('.signature > h3');
    if (!sigText || !sigH3) return;

    const sigObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (e.target === sigText) sigText.classList.add('text-animate');
                if (e.target === sigH3) sigH3.classList.add('glow-animate');
                sigObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    sigObs.observe(sigText);
    sigObs.observe(sigH3);
});


// ─── 12. EDITORIAL CONTACT FORM & TOAST SYSTEM ───────────────

document.addEventListener('DOMContentLoaded', () => {

    const submitBtn = document.getElementById('submitBtn');
    const contactForm = document.getElementById('contactForm');
    const btnText = document.getElementById('btnText');
    const submitIcon = document.getElementById('submitIcon');

    // Premium Toast Elements
    const toastSuccess = document.getElementById('eco-toast-success');
    const toastError = document.getElementById('eco-toast-error');

    let toastTimeout;

    if (!submitBtn || !contactForm) return;

    // ==========================================================
    // TOAST CONTROLLER
    // ==========================================================
    function showToast(toastEl, customMessage = null) {

        [toastSuccess, toastError].forEach(t => {
            if (t) t.classList.remove('show');
        });

        clearTimeout(toastTimeout);

        if (customMessage) {
            const msgEl = toastEl?.querySelector('.eco-toast-msg');
            if (msgEl) msgEl.textContent = customMessage;
        }

        setTimeout(() => {
            toastEl?.classList.add('show');
        }, 50);

        toastTimeout = setTimeout(() => {
            toastEl?.classList.remove('show');
        }, 4500);
    }

    // ==========================================================
    // FORM SUBMIT
    // ==========================================================
    submitBtn.addEventListener('click', async (e) => {

        e.preventDefault();

        // 1. Gather Data
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // ======================================================
        // VALIDATION
        // ======================================================
        if (!name || !email || !message) {
            showToast(
                toastError,
                'Please complete all fields to continue.'
            );
            return;
        }

        if (!emailRegex.test(email)) {
            showToast(
                toastError,
                'Please enter a valid email address.'
            );
            return;
        }

        // ======================================================
        // LOADING STATE
        // ======================================================
        submitBtn.style.pointerEvents = 'none';

        btnText.textContent = 'Sending...';

        submitIcon.className =
            'bi bi-arrow-repeat eco-icon-spin';

        try {

            // ==================================================
            // BACKEND REQUEST (NOT FORMSPREE)
            // ==================================================
            const response = await fetch(
                'https://portfolio-mail-backend-77z4.onrender.com/contact',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        message
                    })
                }
            );

            const data = await response.json();

            // ==================================================
            // SUCCESS
            // ==================================================
            if (response.ok && data.success) {

                showToast(toastSuccess);

                contactForm.reset();

            } else {
                throw new Error(
                    data.message || 'Mail send failed'
                );
            }

        } catch (error) {

            console.error(error);

            // ==================================================
            // ERROR
            // ==================================================
            showToast(
                toastError,
                'An error occurred. Please try again later.'
            );

        } finally {

            // ==================================================
            // RESET BUTTON STATE
            // ==================================================
            submitBtn.style.pointerEvents = 'auto';

            btnText.textContent = 'Send Inquiry';

            submitIcon.className = 'bi bi-arrow-right';
        }
    });
});

// ─── 13. CUSTOM CURSOR ───────────────────────────────────────

const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

if (dot && outline) {
    let mouseX = 0, mouseY = 0;
    let oX = 0, oY = 0;

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
    document.addEventListener('mouseover', e => { if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover-active'); });
    document.addEventListener('mouseout', e => { if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover-active'); });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; outline.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; outline.style.opacity = '1'; });
}


// ─── 14. BACK-TO-TOP PROGRESS RING ───────────────────────────

const progressCircle = document.querySelector('.progress');
const backToTop = document.getElementById('backToTop');
const circumference = 2 * Math.PI * 45;

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressCircle.style.strokeDashoffset = circumference - (scrolled / total) * circumference;
    backToTop.classList.toggle('active-progress', scrolled > 300);
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


// ─── 15. ABOUT PREMIUM REVEAL (BLUR & STAGGER) ───────────────
document.addEventListener('DOMContentLoaded', () => {
    const blurElements = document.querySelectorAll('.reveal-blur');
    const blurObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-revealed');
                blurObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    blurElements.forEach(el => blurObs.observe(el));

    const scrollElements = document.querySelectorAll('.reveal-blur-scroll');
    const scrollObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-revealed');
                scrollObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });
    scrollElements.forEach(el => scrollObs.observe(el));
});


// ─── 16. 3D SLIDER — CARD BUILDER ────────────────────────────

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('project-3d-slider');
        if (!slider) return;

        const names = ['E-SHOP', 'GYM SITE', 'AGENCY', 'PORTFOLIO', 'WEB APP'];
        const total = 10;
        let html = '';

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
        let rotY = 0;
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

        document.addEventListener('click', e => {
            const item = e.target.closest('.item');
            if (!item || !slider.classList.contains('active') || isDragging) return;

            const title = item.querySelector('h3')?.innerText || 'Coming Soon';
            const modal = document.createElement('div');
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

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('viewAllBtn');
        const section = document.querySelector('.project-section');
        const slider = document.getElementById('project-3d-slider');
        if (!btn) return;

        function visibleItems() {
            return Array.from(document.querySelectorAll('.project-item'))
                .filter(el => window.getComputedStyle(el).display !== 'none');
        }

        function burstParticles(rect, upward) {
            const COLORS = ['#38bdf8', '#ffffff', '#8b5cf6', '#a5f3fc'];
            for (let i = 0; i < 60; i++) {
                const p = document.createElement('div');
                p.className = 'v-particle';
                const size = Math.random() * 5 + 2;
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                p.style.cssText = `
                    left:${rect.left + Math.random() * rect.width}px;
                    top:${rect.top + Math.random() * rect.height}px;
                    width:${size}px; height:${size}px;
                    background:${color};
                    box-shadow:0 0 ${size * 2}px ${color};`;
                document.body.appendChild(p);

                const dx = (Math.random() - 0.5) * 200;
                const dy = upward
                    ? -(Math.random() * 180 + 60)
                    : (Math.random() * 180 + 60);

                p.animate(
                    [
                        { transform: 'translate(0,0) scale(1)', opacity: 1 },
                        { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }
                    ],
                    {
                        duration: 600 + Math.random() * 600,
                        delay: Math.random() * 300,
                        easing: 'ease-out',
                        fill: 'forwards'
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
                    el.style.animation = '';
                    el.style.opacity = '';
                    el.style.transform = '';
                    el.style.filter = '';
                    el.style.pointerEvents = '';
                });
                b.disabled = false;
                b.innerText = label;
                addViewLess
                    ? b.classList.add('view-less')
                    : b.classList.remove('view-less');
                document.body.style.overflow = 'auto';
                if (section) section.style.pointerEvents = 'auto';
            }, 800);
        }

        const STAGGER = 120;
        const DISSOLVE_MS = 900;

        btn.addEventListener('click', function () {
            const isReverse = this.classList.contains('view-less');
            this.disabled = true;
            document.body.style.overflow = 'hidden';
            if (section) section.style.pointerEvents = 'none';
            showLoader(this);

            const items = visibleItems();

            if (!isReverse) {
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
                        slider.offsetHeight;
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
        const isShowing = this.classList.contains('view-less');

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

const testimonialsData = [
    {
        name: 'Sarah Mitchell',
        role: 'CEO, BrightPath Studio',
        avatar: 'https://i.pravatar.cc/100?img=47',
        review: 'Working with Ameen was an absolute pleasure. He turned our outdated site into a stunning, high-performance experience. Delivery was fast and the attention to detail was impressive.',
        stars: 5
    },
    {
        name: 'Daniel Ortega',
        role: 'Founder, LaunchLab',
        avatar: 'https://i.pravatar.cc/100?img=12',
        review: 'The landing page Ameen built converted 3× better from day one. Clean code, beautiful design, and zero revisions needed. Highly recommended for any serious project.',
        stars: 5
    },
    {
        name: 'Priya Nair',
        role: 'Product Manager, Nexora',
        avatar: 'https://i.pravatar.cc/100?img=23',
        review: 'Ameen has a rare combination of strong design taste and technical depth. He understood our brand immediately and delivered something we genuinely love showing off.',
        stars: 5
    },
    {
        name: 'James Carter',
        role: 'Marketing Director, Skyline Co.',
        avatar: 'https://i.pravatar.cc/100?img=33',
        review: 'Professional, responsive, and incredibly skilled. He built our entire SaaS landing page from scratch in record time. The animations alone generated tons of positive feedback.',
        stars: 4
    },
    {
        name: 'Aisha Bello',
        role: 'Creative Director, Inkform Agency',
        avatar: 'https://i.pravatar.cc/100?img=56',
        review: 'I have worked with many developers — Ameen stands out for caring about both the code quality and the final visual result. The site feels alive and premium.',
        stars: 5
    },
    {
        name: 'Ryan Patel',
        role: 'Startup Founder',
        avatar: 'https://i.pravatar.cc/100?img=68',
        review: 'Exceptional work on our e-commerce project. Every interaction feels smooth and polished. We have received consistent compliments from customers about the shopping experience.',
        stars: 5
    }
];

function renderTestimonialCard(data) {
    const name = data.name || 'Anonymous';
    const role = data.role || 'Client';
    const review = data.review || 'Great experience working with this developer.';
    const stars = typeof data.stars === 'number' ? Math.min(5, Math.max(1, data.stars)) : 5;
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

function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    const frag = document.createDocumentFragment();
    testimonialsData.forEach(d => frag.appendChild(renderTestimonialCard(d)));
    grid.appendChild(frag);
}

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

function initTestimonialsHover() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    document.querySelectorAll('.testimonial-card').forEach(card => {
        const glare = document.createElement('div');
        glare.className = 'glare';
        card.appendChild(glare);

        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const rx = ((y - r.height / 2) / (r.height / 2)) * -8;
            const ry = ((x - r.width / 2) / (r.width / 2)) * 8;
            requestAnimationFrame(() => {
                card.style.transform =
                    `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03) translateY(-5px)`;
                glare.style.background =
                    `radial-gradient(circle at ${(x / r.width) * 100}% ${(y / r.height) * 100}%, rgba(255,255,255,0.25), transparent 65%)`;
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
    { icon: 'bi bi-filetype-css', label: 'CSS3' },
    { icon: 'bi bi-filetype-js', label: 'JavaScript' },
    { icon: 'bi bi-phone', label: 'Responsive' },
    { icon: 'bi bi-palette2', label: 'UI Design' },
    { icon: 'bi bi-git', label: 'Git' },
    { icon: 'bi bi-speedometer2', label: 'Performance' },
    { icon: 'bi bi-brush', label: 'Figma' },
    { icon: 'bi bi-bootstrap', label: 'Bootstrap' },
    { icon: 'bi bi-stars', label: 'Animation' },
];

const marqueeItems2 = [
    { icon: 'bi bi-trophy-fill', label: '30+ Projects Delivered' },
    { icon: 'bi bi-people-fill', label: '15+ Happy Clients' },
    { icon: 'bi bi-star-fill', label: '5-Star Reviews' },
    { icon: 'bi bi-award-fill', label: 'Clean Code' },
    { icon: 'bi bi-lightning-fill', label: 'Fast Delivery' },
    { icon: 'bi bi-shield-check-fill', label: 'Pixel Perfect' },
    { icon: 'bi bi-phone-fill', label: 'Mobile First' },
    { icon: 'bi bi-camera-video-fill', label: 'Smooth Animations' },
];

function buildMarqueeHTML(items) {
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
    { num: '01', title: 'Discovery', desc: 'Deep dive into your goals, audience, and requirements through a focused kickoff conversation.' },
    { num: '02', title: 'Design', desc: 'Wireframes and a full visual direction — every layout and interaction planned before a single line of code.' },
    { num: '03', title: 'Build', desc: 'Clean, semantic, well-commented code. Built in reusable components for maximum scalability.' },
    { num: '04', title: 'Launch', desc: 'Thorough testing across browsers and devices. Smooth handoff with documentation and ongoing support.' },
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

    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (!e.isIntersecting) return;
            setTimeout(() => e.target.classList.add('show'), i * 80);
            revealObs.unobserve(e.target);
        });
    }, { threshold: 0.08 });

    grid.querySelectorAll('.faq-item').forEach(item => {
        revealObs.observe(item);

        item.querySelector('.faq-question').addEventListener('click', function () {
            const isOpen = item.classList.contains('open');

            grid.querySelectorAll('.faq-item.open').forEach(open => {
                open.classList.remove('open');
                open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {


                // ============================================================
                // 25. FOOTER SIGNATURE ORCHESTRATOR (PROPER SFX UNLOCK)
                // ============================================================
                document.addEventListener('DOMContentLoaded', () => {
                    const sigBlock = document.getElementById('footer-signature-block');
                    const sigContainer = sigBlock?.querySelector('.signature');
                    const sigSVG = sigBlock?.querySelector('svg');
                    const sigText = document.getElementById('sig-text');
                    const sigSubline = document.getElementById('sig-subline');
                    const inkContainer = document.getElementById('ink-container');
                    const signatureSfx = document.getElementById('signature-sfx');

                    if (!sigBlock || !sigText || !sigSVG || !sigContainer) return;

                    // --- PROPER AUDIO UNLOCK LOGIC ---
                    let isAudioUnlocked = false;

                    // Array of all requested interactions, including scroll and wheel
                    const unlockEvents = ['scroll', 'wheel', 'mousemove', 'pointerdown', 'click', 'touchstart', 'keydown'];

                    const unlockAudio = () => {
                        if (!signatureSfx || isAudioUnlocked) return;

                        signatureSfx.muted = true; // Mute to prevent micro-stutter
                        const unlockPromise = signatureSfx.play();

                        if (unlockPromise !== undefined) {
                            unlockPromise.then(() => {
                                // If successful, reset and prime the audio
                                signatureSfx.pause();
                                signatureSfx.currentTime = 0;
                                signatureSfx.muted = false;
                                isAudioUnlocked = true;

                                // Immediately remove all listeners so it only runs once
                                unlockEvents.forEach(evt => {
                                    document.removeEventListener(evt, unlockAudio, true);
                                });
                            }).catch(() => {
                                // Silently catch if the browser rejects a passive scroll. 
                                // The listener remains active to catch the next interaction (e.g., a wheel or click).
                            });
                        }
                    };

                    if (signatureSfx) {
                        signatureSfx.volume = 0.4;

                        // Attach the unlocker to all interactions. Use capture phase to ensure it fires first.
                        unlockEvents.forEach(evt => {
                            document.addEventListener(evt, unlockAudio, { once: true, capture: true, passive: true });
                        });
                    }
                    // ---------------------------------

                    const signatureObserver = new IntersectionObserver(entries => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // 1. Trigger write animation ONCE
                                sigText.classList.add('is-writing');

                                // 2. Wait exactly 4 seconds (completion of sigWrite)
                                setTimeout(() => {
                                    // Lock the main SVG into a permanently drawn state
                                    sigText.classList.replace('is-writing', 'is-drawn');

                                    // 3. Cinematic Pause (200ms) before activation
                                    setTimeout(() => {

                                        // 4a. Trigger SFX (Now primed by previous scroll/interaction)
                                        if (
                                            signatureSfx &&
                                            isAudioUnlocked &&
                                            !hasPlayedSfx
                                        ) {
                                            hasPlayedSfx = true;

                                            signatureSfx.currentTime = 0;

                                            signatureSfx.play().catch(err => {
                                                console.warn('SFX playback failed:', err);
                                            });
                                        }

                                        // 4b. Trigger Micro Interference
                                        sigText.classList.add('is-glitching');

                                        // Create the physical distortion slice clone
                                        const sliceClone = sigSVG.cloneNode(true);
                                        sliceClone.classList.add('glitch-slice-clone');

                                        const cloneText = sliceClone.querySelector('text');
                                        if (cloneText) {
                                            cloneText.removeAttribute('id');
                                            cloneText.classList.add('is-drawn');
                                        }

                                        sigContainer.appendChild(sliceClone);

                                        // 5. Wait for the slice animation to finish (250ms)
                                        setTimeout(() => {
                                            // Erase glitch layers
                                            sliceClone.remove();
                                            sigText.classList.remove('is-glitching');

                                            // Apply Final Premium Glow
                                            sigText.classList.add('is-activated');

                                            // 6. Reveal Subline & Ink Residue Bloom
                                            sigSubline.classList.add('is-visible');
                                            inkContainer.classList.add('ink-activated');

                                        }, 250);

                                    }, 200);

                                }, 4000);

                                // Sequence runs EXACTLY ONCE.
                                signatureObserver.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.4 });

                    signatureObserver.observe(sigBlock);
                });
                item.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', renderFAQ);

// ================================================================

// ============================================================
// 24. CINEMATIC FOOTER ATMOSPHERE ENGINE (V2)
// ============================================================
(function () {
    const footer = document.getElementById('footer');
    const canvas = document.getElementById('ce-dust-canvas');
    if (!footer || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;
    let startTime = Date.now();

    // Environment targets for luxury motion loops
    const bloomMain = document.getElementById('ce-main-bloom');
    const bloomCore = document.getElementById('ce-main-core');
    const bloomAccent = document.getElementById('ce-accent-glow');
    const bloomSig = document.getElementById('ce-sig-bloom');
    const contours = document.getElementById('ce-contours');

    function resize() {
        const rect = footer.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    // Advanced Cinematic Particle Definition
    class PremiumParticle {
        constructor() {
            this.reset(true);
        }

        reset(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : height + 20;

            // Layered Depth Layout (Split sizes to generate multi-plane parallax depth)
            const depthGroup = Math.random();
            if (depthGroup > 0.85) {
                // Foreground/Crisp macro particles
                this.radius = Math.random() * 1.2 + 1.4; // 1.4px to 2.6px
                this.vy = -(Math.random() * 0.28 + 0.15);
                this.maxOpacity = Math.random() * 0.65 + 0.25;
            } else if (depthGroup > 0.4) {
                // Midground standard dust field
                this.radius = Math.random() * 0.6 + 0.8;  // 0.8px to 1.4px
                this.vy = -(Math.random() * 0.16 + 0.08);
                this.maxOpacity = Math.random() * 0.55 + 0.2;
            } else {
                // Background deep micro mist
                this.radius = Math.random() * 0.4 + 0.4;  // 0.4px to 0.8px
                this.vy = -(Math.random() * 0.08 + 0.04);
                this.maxOpacity = Math.random() * 0.4 + 0.1;
            }

            this.vx = (Math.random() - 0.5) * 0.12;

            // Cinematic palette distribution
            const randColor = Math.random();
            if (randColor > 0.75) {
                this.colorBase = 'rgba(56, 189, 248,';  // Cyan
            } else if (randColor > 0.5) {
                this.colorBase = 'rgba(168, 85, 247,';  // Violet
            } else {
                this.colorBase = 'rgba(235, 247, 255,'; // Crystal White
            }

            this.opacity = randomY ? (Math.random() * this.maxOpacity) : 0;
            this.waveSpeed = Math.random() * 0.015 + 0.005;
            this.waveOffset = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.vy;
            this.x += this.vx + Math.sin(this.waveOffset) * 0.08;
            this.waveOffset += this.waveSpeed;

            // Fluid cinematic edge fading curves
            if (this.y > height - 60 && this.opacity < this.maxOpacity) {
                this.opacity += 0.012;
            } else if (this.y < 120) {
                this.opacity -= 0.01;
            }

            if (this.y < -15 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.colorBase}${Math.max(0, Math.min(this.opacity, 1))})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // High density count ensuring a fully visible, beautiful luxury field
        const targetCount = Math.min(130, Math.floor(width / 10));
        for (let i = 0; i < targetCount; i++) {
            particles.push(new PremiumParticle());
        }
    }

    // High Performance Rendering Engine Loop
    function renderEngine() {
        const elapsed = (Date.now() - startTime) * 0.001;

        // 1. Clear Frame & Redraw Particle Space
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // 2. High-Visibility Aurora Breathing Curves
        if (bloomMain && bloomCore && bloomAccent && bloomSig) {
            const cycleMain = 1 + Math.sin(elapsed * 0.45) * 0.05; // Visible 5% breathing scale
            const cycleCore = 1 + Math.cos(elapsed * 0.6) * 0.07;
            const cycleAccent = 1 + Math.sin(elapsed * 0.35) * 0.08;
            const cycleSig = 1 + Math.cos(elapsed * 0.5 + 1.5) * 0.06;

            bloomMain.style.transform = `scale(${cycleMain}) translate(${Math.sin(elapsed * 0.2) * 10}px, 0px)`;
            bloomCore.style.transform = `scale(${cycleCore})`;
            bloomAccent.style.transform = `scale(${cycleAccent})`;
            bloomSig.style.transform = `scale(${cycleSig})`;
        }

        // 3. Topographic Contour Shimmer & Micro-Drift Loop
        if (contours) {
            const shiftX = Math.sin(elapsed * 0.25) * 20; // Noticeable 20px organic drift
            const shiftY = Math.cos(elapsed * 0.2) * 12;
            const shimmerOpacity = 0.7 + Math.sin(elapsed * 0.8) * 0.12; // Fluid micro shimmer cycle

            contours.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(1.04)`;
            contours.style.opacity = shimmerOpacity;
        }

        animationFrameId = requestAnimationFrame(renderEngine);
    }

    window.addEventListener('resize', resize);

    // Performance Management Guard (Only activates loops when footer hits the viewport)
    const engineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resize();
                startTime = Date.now();
                renderEngine();
            } else {
                cancelAnimationFrame(animationFrameId);
            }
        });
    }, { threshold: 0 });

    engineObserver.observe(footer);
})();


// Add this to your script.js file, replacing the previous version of the FOOTER SIGNATURE ORCHESTRATOR

// ============================================================
// 25. FOOTER SIGNATURE ORCHESTRATOR (CLEAN PRODUCTION VERSION)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const sigBlock = document.getElementById('footer-signature-block');
    const sigContainer = sigBlock?.querySelector('.signature');
    const sigSVG = sigBlock?.querySelector('svg');
    const sigText = document.getElementById('sig-text');
    const sigSubline = document.getElementById('sig-subline');
    const inkContainer = document.getElementById('ink-container');
    const signatureSfx = document.getElementById('signature-sfx');

    if (!sigBlock || !sigText || !sigSVG || !sigContainer) return;

    if (signatureSfx) {
        signatureSfx.volume = 0.5;
    }

    let hasInteracted = false;
    let signatureReached = false;
    let sfxPlayed = false;

    // Standard high-authority interactions allowed by browser policies
    const registerUserGesture = () => {
        if (hasInteracted) return;
        hasInteracted = true;

        // Cleanup global listeners immediately
        ['click', 'touchstart', 'keydown'].forEach(type => {
            document.removeEventListener(type, registerUserGesture, { capture: true });
        });

        // Edge case: if signature is already visible and waiting, fire the sound immediately on first interaction
        if (signatureReached && !sfxPlayed) {
            triggerPremiumSfx();
        }
    };

    ['click', 'touchstart', 'keydown'].forEach(type => {
        document.addEventListener(type, registerUserGesture, { passive: true, capture: true });
    });

    const triggerPremiumSfx = () => {
        if (!signatureSfx || sfxPlayed) return;

        signatureSfx.play()
            .then(() => {
                sfxPlayed = true;
            })
            .catch(() => {
                // Absolute silent safety matrix - intercepts 100% of browser restrictions smoothly
            });
    };

    const signatureObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Trigger write animation ONCE
                sigText.classList.add('is-writing');

                // 2. Wait exactly 4 seconds (completion of sigWrite)
                setTimeout(() => {
                    sigText.classList.replace('is-writing', 'is-drawn');

                    // 3. Cinematic Pause (200ms) before activation
                    setTimeout(() => {

                        signatureReached = true;

                        // 4a. Trigger SFX safely only if user gave authority gesture
                        if (hasInteracted) {
                            triggerPremiumSfx();
                        }

                        // 4b. Trigger Micro Interference
                        sigText.classList.add('is-glitching');

                        const sliceClone = sigSVG.cloneNode(true);
                        sliceClone.classList.add('glitch-slice-clone');

                        const cloneText = sliceClone.querySelector('text');
                        if (cloneText) {
                            cloneText.removeAttribute('id');
                            cloneText.classList.add('is-drawn');
                        }

                        sigContainer.appendChild(sliceClone);

                        // 5. Wait for the slice animation to finish (250ms)
                        setTimeout(() => {
                            sliceClone.remove();
                            sigText.classList.remove('is-glitching');
                            sigText.classList.add('is-activated');
                            sigSubline.classList.add('is-visible');
                            inkContainer.classList.add('ink-activated');
                        }, 250);

                    }, 200);

                }, 4000);

                // Sequence runs EXACTLY ONCE.
                signatureObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    signatureObserver.observe(sigBlock);
});
