document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('global-nav-container');
    if (!navContainer) return;

    // 1. Inyectamos la estructura base de tu menú
    const langStyle = document.createElement('style');
    langStyle.textContent = `
        .nav-lang-pill {
            display: inline-flex;
            align-items: center;
            background: #44c5db;
            border-radius: 50px;
            padding: 3px;
            vertical-align: middle;
        }
        .nav-lang-opt {
            border: none;
            background: transparent;
            color: rgba(255,255,255,.7);
            padding: .28rem 1rem;
            border-radius: 50px;
            font-family: 'Open Sans', sans-serif;
            font-size: .78rem;
            font-weight: 700;
            letter-spacing: .08em;
            cursor: pointer;
            line-height: 1;
            transition: background .2s ease, color .2s ease, box-shadow .2s ease;
        }
        .nav-lang-opt.active {
            background: #fff;
            color: #44c5db;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
        }
    `;
    document.head.appendChild(langStyle);

    navContainer.innerHTML = `
        <header role="banner">
            <div class="container" role="navigation">
                <ul class="menu clear-fix collapsed">
                    <li class="logo-left">
                        <span class="icon-menu" id="icomenu" title="Menu"></span>
                        <img alt="logo" src="/imgs/arteyciencia.png" class="logo-small">
                    </li>
                    <li></li>
                    <li><a href="/" data-i18n="menu_home" id="nav-home">home</a></li>
                    <li><a href="/about/" data-i18n="menu_about" id="nav-about">about me</a></li>
                    <li><a href="/cv/" data-i18n="menu_cv" id="nav-cv">cv</a></li>
                    <li class="logo-center">
                        <a href="/cv">
                            <img alt="arteyciencia Logo" src="/imgs/arteyciencia.png" class="logo-center">
                        </a>
                    </li>
                    <li><a href="/portfolio/" data-i18n="menu_portfolio" id="nav-portfolio">portfolio</a></li>
                    <li><a href="/certifications/" data-i18n="menu_certfications" id="nav-certs">certs</a></li>
                    <li><a href="/contact/" data-i18n="menu_contact" id="nav-contact">contact</a></li>
                    <li>
                        <div id="btn-translate" class="nav-lang-pill" role="group" aria-label="Language switch">
                            <button class="nav-lang-opt" data-lang="en" aria-label="Switch to English">EN</button>
                            <button class="nav-lang-opt" data-lang="es" aria-label="Cambiar a Español">ES</button>
                        </div>
                    </li>
                </ul>
            </div>
        </header>
    `;

    // 2. Lógica para detectar la página actual y activar el enlace correcto
    const currentPath = window.location.pathname;

    // Quitamos cualquier clase active previa para evitar duplicados
    document.querySelectorAll('.menu a').forEach(link => link.classList.remove('active'));

    // Evaluamos la ruta actual del navegador
    if (currentPath === '/' || currentPath === '/index.html') {
        document.getElementById('nav-home')?.classList.add('active');
    } else if (currentPath.includes('/about/')) {
        document.getElementById('nav-about')?.classList.add('active');
    } else if (currentPath.includes('/cv/')) {
        document.getElementById('nav-cv')?.classList.add('active');
    } else if (currentPath.includes('/portfolio/')) {
        document.getElementById('nav-portfolio')?.classList.add('active');
    } else if (currentPath.includes('/certifications/')) {
        document.getElementById('nav-certs')?.classList.add('active');
    } else if (currentPath.includes('/contact/')) {
        document.getElementById('nav-contact')?.classList.add('active');
    }
});