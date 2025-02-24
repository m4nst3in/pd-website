document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


    let scrollInstance;

    function initializeScroll() {
        const scrollContainer = document.querySelector('[data-scroll-container]');

        if (isMobile) {
            document.documentElement.classList.remove('has-scroll-smooth');
            document.documentElement.classList.add('has-scroll-normal');
            scrollContainer.style.overflow = 'visible';

            if (scrollInstance) {
                scrollInstance.destroy();
            }

            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';

            const sections = document.querySelectorAll('[data-scroll-section]');
            sections.forEach(section => {
                section.style.transform = '';
                section.style.opacity = '1';
            });
        } else {
            scrollInstance = new LocomotiveScroll({
                el: scrollContainer,
                smooth: true,
                lerp: 0.1,
                multiplier: 1,
                getSpeed: false,
                getDirection: false,
                reloadOnContextChange: true,
                smartphone: {
                    smooth: false
                },
                tablet: {
                    smooth: false
                }
            });
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const scriptsSection = document.querySelector('#scripts');
            if (scriptsSection) {
                if (isMobile) {
                    scriptsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    scrollInstance.scrollTo(scriptsSection);
                }
            }
        });
    }

    function animateUserCount() {
        const userCountElement = document.getElementById('user-count');
        const targetCount = 265700;
        const duration = 2200; // duração da animação em milissegundos
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentCount = Math.floor(progress * targetCount);
            userCountElement.textContent = `${(currentCount / 1000).toFixed(1)}k`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        }

        requestAnimationFrame(updateCount);
    }

    animateUserCount();

    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const scriptUrl = this.getAttribute('data-github');
            const originalText = this.textContent;

            this.textContent = 'Carregando...';
            this.style.opacity = '0.7';

            setTimeout(() => {
                window.open(scriptUrl, '_blank');
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.opacity = '1';
                }, 500);
            }, 800);
        });
    });

    const observerCallback = debounce((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.querySelectorAll('.fade-in').forEach(el => {
                    el.classList.add('visible');
                });
            }
        });
    }, 100);

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    function initAnimations() {
        const elements = document.querySelectorAll('[data-scroll-section], .script-card, .fade-in');

        elements.forEach((element, index) => {
            if (element.tagName.toLowerCase() === 'footer') return;

            if (isMobile) {
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'none';
            } else {
                if (!element.classList.contains('fade-in')) {
                    element.classList.add('fade-in');
                }
                element.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(element);
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (isMobile) {
                    target.scrollIntoView({ behavior: 'smooth' });
                } else {
                    scrollInstance.scrollTo(target);
                }
            }
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                const current = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
                });
            }
        });
    }

    function createScrollTopButton() {
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
            transform: translateZ(0);
            backface-visibility: hidden;
        `;

        document.body.appendChild(button);

        window.addEventListener('scroll', debounce(() => {
            const scrollY = window.scrollY || window.pageYOffset;
            button.style.opacity = scrollY > 300 ? '1' : '0';
        }, 100));

        button.addEventListener('click', () => {
            if (isMobile) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                scrollInstance.scrollTo(0, {
                    duration: 1000,
                    easing: [0.25, 0.1, 0.25, 1]
                });
            }
        });
    }

    if (isMobile) {
        document.body.classList.add('is-mobile');
        document.documentElement.classList.remove('has-scroll-smooth');
        document.documentElement.classList.add('has-scroll-normal');
    }

    initializeScroll();
    initAnimations();
    createScrollTopButton();

    const handleResize = debounce(() => {
        if (!isMobile && scrollInstance) {
            scrollInstance.update();
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    window.addEventListener('beforeunload', () => {
        if (scrollInstance) {
            scrollInstance.destroy();
        }
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
    });

    const discordButton = document.getElementById('discord-button');
    if (discordButton) {
        discordButton.addEventListener('click', function() {
            window.location.href = 'https://discord.gg/platformdestroyer';
        });
    }

    VanillaTilt.init(document.querySelectorAll(".script-card, .hero-stats"), {
        max: 15,
        speed: 100,
        glare: false,
        "max-glare": 0.5,
        gyroscope: true
    });

    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > scrollThreshold) {
            if (scrollTop < lastScrollTop) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
        } else {
            navbar.classList.remove('visible');
        }

        lastScrollTop = scrollTop;
    });
});