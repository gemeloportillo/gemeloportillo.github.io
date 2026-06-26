document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('global-nav-container');
    if (!navContainer) return;

    // 1. Inyectamos la estructura base de tu menú
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
                        <a class="lang-switch" href="javascript:void(0)" id="btn-translate" style="color: #00ff7f; font-weight: bold;">ESP</a>
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