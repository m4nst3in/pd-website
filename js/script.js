document.addEventListener('DOMContentLoaded', function() {
    // Explorar Scripts Button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const scriptsSection = document.querySelector('#scripts');
            if (scriptsSection) {
                scriptsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

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
                    
                    // Abre o link do GitHub em uma nova aba
                    window.open(scriptUrl, '_blank');
                }, 1000);
            }, 1500);
        });
    });

    // Função para observar elementos e adicionar animações
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Only unobserve if it's not a repeating animation
                if (!entry.target.classList.contains('script-card')) {
                    observer.unobserve(entry.target);
                }
            } else {
                // Remove visible class when element is not in view (for cards only)
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

    // Seleciona todos os elementos que devem ser animados
const animatedElements = document.querySelectorAll(
    '.script-card, .installation, .usage, .hero, .features, ' +
    '.warning, h1, h2, .shortcuts, .video-container, ' +
    '.about-section, .about-content, .about-text, .features-list'
);

// Initialize animations with staggered delays
animatedElements.forEach((element, index) => {
    element.classList.add('fade-in');
    element.classList.add(`fade-delay-${(index % 4) + 1}`);
    observer.observe(element);
});

// Smooth Scrolling Enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

    // Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Script Cards Animation
    const scriptCards = document.querySelectorAll('.script-card');
    scriptCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add scroll to top button
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

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
            } else {
                button.style.opacity = '0';
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    addScrollToTop();
});