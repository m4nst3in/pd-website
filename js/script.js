document.addEventListener('DOMContentLoaded', function() {
    // Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        smoothMobile: true,
        lerp: 0.075,
        multiplier: 0.9,
        getSpeed: true,
        getDirection: true,
        reloadOnContextChange: true,
        smartphone: {
            smooth: true,
            multiplier: 2.5, // Aumentar velocidade pro mobile não ficar lento
            lerp: 0.15 
        },
        tablet: {
            smooth: true,
            multiplier: 2, // mesma coisa pro tablet
            lerp: 0.15 
        }
    });

    // Botão de explorar script
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const scriptsSection = document.querySelector('#scripts');
            if (scriptsSection) {
                scroll.scrollTo(scriptsSection);
            }
        });
    }

    // Botão pros download
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const scriptUrl = this.getAttribute('data-github');
            const originalText = this.textContent;
            
            this.textContent = 'Carregando...';
            this.style.opacity = '0.7';

            setTimeout(() => {
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.opacity = '1';
                    this.style.backgroundColor = '';
                    window.open(scriptUrl, '_blank');
                }, 1000);
            }, 1500);
        });
    });

    // Observer das animacoes
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (!entry.target.classList.contains('script-card')) {
                    observer.unobserve(entry.target);
                }
                scroll.update(); // Update locomotive scroll after animations
            } else {
                if (entry.target.classList.contains('script-card')) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    };

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Animacoes
    const animatedElements = document.querySelectorAll(
        '.script-card, .installation, .usage, .hero, .features, ' +
        '.warning, h1, h2, .shortcuts, .video-container, ' +
        '.about-section, .about-content, .about-text, .features-list'
    );

    // Iniciar animacoes com delays
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.classList.add(`fade-delay-${(index % 4) + 1}`);
        observer.observe(element);
    });

    // Scroll smooth
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scroll.scrollTo(target);
            }
        });
    });

    // Link de navigation
    scroll.on('scroll', (args) => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                const current = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').slice(1) === current) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Animacao nos cards dos script
    const scriptCards = document.querySelectorAll('.script-card');
    scriptCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Botao pra dar scroll pra cima
    const addScrollToTop = () => {
        const button = document.createElement('button');
        button.className = 'scroll-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
        `;

        document.body.appendChild(button);

        scroll.on('scroll', (args) => {
            if (args.scroll.y > 300) {
                button.style.opacity = '1';
            } else {
                button.style.opacity = '0';
            }
        });

        button.addEventListener('click', () => {
            scroll.scrollTo(0);
        });
    };

    addScrollToTop();

    // Window resize
    window.addEventListener('resize', () => {
        setTimeout(() => {
            scroll.update();
        }, 100);
    });
});