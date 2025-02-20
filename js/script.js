document.addEventListener('DOMContentLoaded', function() {
    // Locomotive Scroll com configurações otimizadas
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        smoothMobile: false,
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

    // Função de debounce para otimizar chamadas frequentes
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

    // Botão CTA de explorar scripts
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const scriptsSection = document.querySelector('#scripts');
            if (scriptsSection) {
                scroll.scrollTo(scriptsSection);
            }
        });
    }

    // Gerenciamento dos botões de download
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

    // Observer otimizado para animações
    const observerCallback = debounce((entries, observer) => {
        let needsUpdate = false;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe visible ao elemento e seus filhos com fade-in
                entry.target.classList.add('visible');
                entry.target.querySelectorAll('.fade-in').forEach(el => {
                    el.classList.add('visible');
                });

                // Não remove a observação da seção about
                if (!entry.target.classList.contains('script-card') && 
                    !entry.target.classList.contains('about-section')) {
                    observer.unobserve(entry.target);
                    needsUpdate = true;
                }
            } else {
                // Remove visible apenas dos cards de script
                if (entry.target.classList.contains('script-card')) {
                    entry.target.classList.remove('visible');
                    needsUpdate = true;
                }
            }
        });

        if (needsUpdate) {
            requestAnimationFrame(() => scroll.update());
        }
    }, 100);

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Inicialização otimizada das animações
    const initAnimations = () => {
        // Seleciona todos os elementos que precisam de animação
        const sections = document.querySelectorAll('section[data-scroll]');
        const scriptCards = document.querySelectorAll('.script-card');
        const fadeElements = document.querySelectorAll('.fade-in');

        // Configura as seções principais
        sections.forEach((section, index) => {
            if (!section.classList.contains('fade-in')) {
                section.classList.add('fade-in');
            }
            section.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(section);
        });

        // Configura os cards de script
        scriptCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Configura elementos com fade-in que não são seções
        fadeElements.forEach((element, index) => {
            if (!element.closest('section[data-scroll]')) {
                element.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(element);
            }
        });
    };

    initAnimations();

    // Navegação suave otimizada
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scroll.scrollTo(target);
            }
        });
    });

    // Atualização otimizada da navegação ativa
    const updateActiveNav = debounce(() => {
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
    }, 100);

    scroll.on('scroll', updateActiveNav);

    // Animações otimizadas para os cards
    const scriptCards = document.querySelectorAll('.script-card');
    scriptCards.forEach(card => {
        let isAnimating = false;

        const animateCard = (translateY) => {
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(() => {
                    card.style.transform = `translateY(${translateY})`;
                    isAnimating = false;
                });
            }
        };

        card.addEventListener('mouseenter', () => animateCard('-10px'));
        card.addEventListener('mouseleave', () => animateCard('0'));
    });

    // Botão de voltar ao topo otimizado
    const createScrollTopButton = () => {
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

        const updateScrollTopButton = debounce((args) => {
            requestAnimationFrame(() => {
                button.style.opacity = args.scroll.y > 300 ? '1' : '0';
            });
        }, 100);

        scroll.on('scroll', updateScrollTopButton);

        button.addEventListener('click', () => {
            scroll.scrollTo(0, {
                duration: 1000,
                easing: [0.25, 0.1, 0.25, 1]
            });
        });
    };

    createScrollTopButton();

    // Gerenciamento otimizado de resize
    const handleResize = debounce(() => {
        requestAnimationFrame(() => {
            scroll.update();
        });
    }, 250);

    window.addEventListener('resize', handleResize);

    // Detector de dispositivo móvel para otimizações
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Desativa algumas animações em dispositivos móveis
    if (isMobile) {
        document.body.classList.add('is-mobile');
        const smoothElements = document.querySelectorAll('.scroll-smooth');
        smoothElements.forEach(el => el.classList.remove('scroll-smooth'));
    }

    // Limpa event listeners ao sair da página
    window.addEventListener('beforeunload', () => {
        scroll.destroy();
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
    });
});