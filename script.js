// Mile High Golf - Interactive JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Staggered Reveal Animation
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const elementsToReveal = container.querySelectorAll('.reveal-hidden');

                elementsToReveal.forEach((el, index) => {
                    // Stagger delay: 100ms * index
                    el.style.transitionDelay = `${index * 100}ms`;
                    el.classList.add('reveal-visible');
                    el.classList.remove('reveal-hidden');
                });

                // Stop observing this section once revealed
                observer.unobserve(container);
            }
        });
    }, revealOptions);

    // Select sections and other major containers
    const sections = document.querySelectorAll('section, footer');

    sections.forEach(section => {
        // Elements to animate within each section
        const targets = section.querySelectorAll('.feature-card, .info-card, .pricing-card, .stat-card, h2, h3, p, .btn-accent, .btn-primary, .gallery-item');

        if (targets.length > 0) {
            targets.forEach(el => {
                el.classList.add('reveal-hidden');
            });
            revealObserver.observe(section);
        }
    });

    // Counter animation for stats
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    };

    // Observe stat numbers for counter animation
    const statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statObserver.observe(stat);
    });

    // Form validation (for contact page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${type === 'success' ? 'bg-forest-green-accent' :
            type === 'error' ? 'bg-red-600' : 'bg-charcoal-light'
            }`;
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Image lazy loading fallback
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Navbar background on scroll
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
                navbar.classList.remove('nav-transparent');
            } else {
                navbar.classList.add('nav-transparent');
                navbar.classList.remove('nav-scrolled');
            }
        });
    }
});

/* =========================================
   Simulator Pricing Toggle Logic (Day/Night)
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
    // Check if we are on the page with the toggle
    const toggleSection = document.getElementById('pricing-toggle-section');
    if (!toggleSection) return;

    // Select DOM Elements
    const bgNonPeak = document.getElementById('bg-non-peak');
    const bgPeak = document.getElementById('bg-peak');
    const contentContainer = document.getElementById('pricing-content');

    // Text Elements to Update
    const labelEl = document.getElementById('price-label');
    const headlineEl = document.getElementById('price-headline');
    const timeEl = document.getElementById('price-time');
    const amountEl = document.getElementById('price-amount');

    // Buttons
    const prevBtn = document.getElementById('arrow-prev');
    const nextBtn = document.getElementById('arrow-next');

    // State Data
    const pricingData = {
        nonPeak: {
            label: "FOCUSED PRACTICE",
            headline: "Daylight Practice",
            time: "10am - 4pm",
            price: "$35"
        },
        peak: {
            label: "EVENING LOUNGE",
            headline: "Prime Time",
            time: "4pm - 10pm",
            price: "$45"
        }
    };

    let isPeak = false; // Default state is Non-Peak

    // Main Toggle Function
    function toggleState() {
        // 1. Flip the State
        isPeak = !isPeak;
        const data = isPeak ? pricingData.peak : pricingData.nonPeak;

        // 2. Background Cross-Fade (Handled by CSS Transition on Opacity)
        if (isPeak) {
            bgNonPeak.style.opacity = '0';
            bgPeak.style.opacity = '1';
        } else {
            bgNonPeak.style.opacity = '1';
            bgPeak.style.opacity = '0';
        }

        // 3. Text Content Transition
        // Step A: Fade Out & Slide Down
        contentContainer.style.opacity = '0';
        contentContainer.style.transform = 'translateY(10px)';

        // Step B: Swap Text (Wait 300ms for fade out)
        setTimeout(() => {
            labelEl.textContent = data.label;
            headlineEl.textContent = data.headline;
            timeEl.textContent = data.time;
            amountEl.textContent = data.price;

            // Step C: Fade In & Slide Up
            contentContainer.style.opacity = '1';
            contentContainer.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add Event Listeners
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', toggleState);
        nextBtn.addEventListener('click', toggleState);
    }
});


/* =========================================
   Bento Grid Review Cycler
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
    const textEl = document.getElementById('review-text');
    const authorEl = document.getElementById('review-author');

    // Only run if the review tile exists
    if (textEl && authorEl) {
        const reviews = [
            { text: '"Best sims in NC. The data is dead-on."', author: "— JAKE R." },
            { text: '"Great selection of cold drinks and snacks while we play."', author: "— SARAH L." },
            { text: '"The team here makes you feel like a pro."', author: "— MIKE D." },
            { text: '"Cleanest cornhole lanes I’ve ever played on."', author: "— CHRIS P." },
            { text: '"Incredible atmosphere. High-end but laid back."', author: "— JENNA W." }
        ];
        let currentReview = 0;
        setInterval(() => {
            // 1. Fade Out
            textEl.style.opacity = '0';
            authorEl.style.opacity = '0';
            // 2. Wait for fade, then Swap Text
            setTimeout(() => {
                currentReview = (currentReview + 1) % reviews.length;
                textEl.textContent = reviews[currentReview].text;
                authorEl.textContent = reviews[currentReview].author;

                // 3. Fade In
                textEl.style.opacity = '1';
                authorEl.style.opacity = '1';
            }, 500);
        }, 4000);
    }
});

/* =========================================
   Bento Grid Reveal Animation
   ========================================= */
const observerOptions = {
    threshold: 0.1
};

const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.reveal-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('is-visible');
                }, index * 200); // This creates the 200ms staggered 'pop'
            });
            bentoObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Target the container of your bento grid and the Why Us grid
document.addEventListener('DOMContentLoaded', () => {
    // Bento Grid (4 columns)
    const featureGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-4');
    if (featureGrid) bentoObserver.observe(featureGrid);

    // Why Us Grid (3 columns)
    const whyUsGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-3');
    if (whyUsGrid) bentoObserver.observe(whyUsGrid);
});

/* =========================================
   VIP Lab Toggle Logic
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
    const heroSection = document.getElementById('lab-hero-section');
    if (!heroSection) return;

    const bgFitting = document.getElementById('bg-fitting-lab');
    const bgSkill = document.getElementById('bg-skill-lab');
    const labContent = document.getElementById('lab-content');
    const headline = document.getElementById('lab-headline');
    const description = document.getElementById('lab-description');
    const ctaButton = document.getElementById('lab-cta');
    const prevBtn = document.getElementById('lab-prev');
    const nextBtn = document.getElementById('lab-next');

    let isSkillLab = false;

    function toggleLab() {
        isSkillLab = !isSkillLab;

        // 1. Cross-fade Backgrounds
        bgFitting.style.opacity = isSkillLab ? '0' : '1';
        bgSkill.style.opacity = isSkillLab ? '1' : '0';

        // 2. Premium 'Slide & Fade' Logic for Content
        // Step A: Fade Out & Slide Down
        labContent.style.opacity = '0';
        labContent.style.transform = 'translateY(10px)';

        // Step B: Wait 300ms, then Swap Content
        setTimeout(() => {
            if (isSkillLab) {
                headline.innerHTML = 'The Skill <span class="text-[#6495ED]">Lab.</span>';
                description.textContent = 'Elite player development and swing mechanics. Master your craft with tour-level coaching data.';
                if (ctaButton) ctaButton.textContent = 'BOOK A LESSON';
            } else {
                headline.innerHTML = 'The Fitting <span class="text-forest-green-accent">Lab.</span>';
                description.textContent = 'Where data meets design. Experience precision equipment optimization in a tour-level environment.';
                if (ctaButton) ctaButton.textContent = 'BOOK A FITTING';
            }

            // Step C: Fade In & Slide Up
            labContent.style.opacity = '1';
            labContent.style.transform = 'translateY(0)';
        }, 300);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', toggleLab);
        nextBtn.addEventListener('click', toggleLab);
    }
});

/* =========================================
   Simulator Hero Toggle Logic
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
    const simHero = document.getElementById('sim-hero-section');
    if (!simHero) return;

    const bgBay = document.getElementById('bg-sim-bay');
    const bgLeague = document.getElementById('bg-sim-league');
    const content = document.getElementById('sim-content');
    const headline = document.getElementById('sim-headline');
    const subtext = document.getElementById('sim-subtext');
    const cta = document.getElementById('sim-cta');
    const prevBtn = document.getElementById('sim-prev');
    const nextBtn = document.getElementById('sim-next');

    let isLeagueView = false;

    function toggleSimHero() {
        isLeagueView = !isLeagueView;

        // 1. Cross-fade Backgrounds
        bgBay.style.opacity = isLeagueView ? '0' : '1';
        bgLeague.style.opacity = isLeagueView ? '1' : '0';

        // 2. Slide & Fade Content
        content.style.opacity = '0';
        content.style.transform = 'translateY(10px)';

        setTimeout(() => {
            if (isLeagueView) {
                headline.innerHTML = 'Competitive <span class="text-[#6495ED]">Leagues.</span>';
                subtext.textContent = 'High-Stakes Social Gaming. Compete for Cash Weekly.';
                cta.textContent = 'JOIN A LEAGUE';
            } else {
                headline.innerHTML = 'The Ultimate <span class="text-forest-green-accent">Indoor Arena</span>';
                subtext.textContent = 'PGA-Tour Accuracy in a Luxury Environment.';
                cta.textContent = 'BOOK A BAY';
            }

            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 300);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', toggleSimHero);
        nextBtn.addEventListener('click', toggleSimHero);
    }
});
