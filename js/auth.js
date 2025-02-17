// Configurações do OAuth2
const CLIENT_ID = '1324207648555532319';
const REDIRECT_URI = 'https://platformdestroyer.me/pages/auth.html';
const DISCORD_API = 'https://discord.com/api/v10';
const PLATFORM_DESTROYER_SERVER_ID = '1024794781324419094';

// Verificar se já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('discord_token');
    if (!token) {
        // Se não estiver logado, redireciona para a página de login
        showLoginModal();
    } else {
        // Verifica se o token ainda é válido e se está no servidor
        validateTokenAndServer(token);
    }
});

// Função para mostrar o modal de login
function showLoginModal() {
    const modal = document.querySelector('.login-modal');
    modal.style.display = 'flex';

    document.getElementById('discord-login').addEventListener('click', () => {
        redirectToDiscordAuth();
    });
}

// Redirecionar para autenticação do Discord
function redirectToDiscordAuth() {
    const scope = 'identify guilds';
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=${scope}`;
}

// Validar token e verificar servidor
async function validateTokenAndServer(token) {
    try {
        // Verificar se o token é válido obtendo informações do usuário
        const userResponse = await fetch(`${DISCORD_API}/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Token inválido');
        }

        const userData = await userResponse.json();

        // Verificar se o usuário está no servidor
        const guildsResponse = await fetch(`${DISCORD_API}/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const guilds = await guildsResponse.json();
        const isInServer = guilds.some(guild => guild.id === PLATFORM_DESTROYER_SERVER_ID);

        if (!isInServer) {
            showServerInvite();
            return;
        }

        // Se chegou aqui, está tudo ok
        localStorage.setItem('discord_token', token);
        window.location.href = '../index.html'; // Redirect to index.html

    } catch (error) {
        console.error('Erro na validação:', error);
        localStorage.removeItem('discord_token');
        showLoginModal();
    }
}

// Mostrar convite para o servidor
function showServerInvite() {
    const modal = document.querySelector('.login-modal');
    modal.innerHTML = `
        <div class="login-content">
            <h2>Servidor Necessário</h2>
            <p>Para usar o Platform Destroyer, você precisa estar em nosso servidor do Discord</p>
            <a href="https://discord.gg/platformdestroyer" target="_blank" class="discord-btn">
                <i class="fab fa-discord"></i> Entrar no Servidor
            </a>
            <button onclick="location.reload()" class="retry-btn">Verificar Novamente</button>
        </div>
    `;
}

// Atualizar UI para usuário logado
function updateUIForLoggedUser(userData) {
    const nav = document.querySelector('.navbar');
    const userDiv = document.createElement('div');
    userDiv.className = 'user-profile';
    userDiv.innerHTML = `
        <img src="https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png" alt="Avatar">
        <span>${userData.username}</span>
        <button onclick="logout()" class="logout-btn">Sair</button>
    `;
    nav.appendChild(userDiv);
}

// Função de logout
function logout() {
    localStorage.removeItem('discord_token');
    location.reload();
}