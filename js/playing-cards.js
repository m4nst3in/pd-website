document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.playing-card');
    const cardsContainer = document.querySelector('.playing-cards-container');
    const firstCard = document.querySelector('.playing-card:first-child');

    if (cardsContainer && firstCard) {
        cardsContainer.scrollLeft = firstCard.offsetLeft;
    }

    const scriptLocations = {
        'khan': 'pages/khan.html',
        'alura': 'pages/alura.html',
        'matific': 'pages/matific.html',
        'speak': 'pages/speak.html',
        'tarefasp': 'pages/tarefasp.html',
        'kahoot': 'pages/kahoot.html',
        'leiasp': 'pages/leiasp.html'
    };

    cards.forEach(card => {
        VanillaTilt.init(card, {
            max: 25,
            speed: 300,
            glare: true,
            gyroscope: true,
            "max-glare": 0.2,
            scale: 1.05,
        });

        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const scriptName = card.querySelector('.card-center h3').textContent.trim().toLowerCase();
            const scriptURL = scriptLocations[scriptName] || 'script-details.html';

            window.location.href = scriptURL;
        });
    });
});