// 1. Estado inicial revisando localStorage primero
let currentLang = localStorage.getItem('userLang') || 'en'; 
let translations = {};

// Cargar el archivo JSON mediante Fetch
async function loadTranslations() {
    try {
        // Usamos una ruta absoluta o relativa estable hacia el JSON
        const response = await fetch('/assets/lang.json'); 
        translations = await response.json();
        
        // Si no hay idioma en localStorage, detectamos el del navegador
        if (!localStorage.getItem('userLang')) {
            const browserLang = navigator.language.slice(0, 2);
            if (browserLang === 'es') {
                currentLang = 'es';
            }   
        }

        // Aplicamos el idioma inicial (sea el guardado o el detectado)
        applyTranslations(currentLang);
        updateButtonVisuals(currentLang);

    } catch (error) {
        console.error("Error cargando las traducciones:", error);
    }
}

// 2. Función que aplica los textos al HTML, placeholders y values de botones
function applyTranslations(lang) {
    if (!translations[lang]) return;

    // Idioma del documento: lectores de pantalla y contenido por idioma (p. ej. el CV)
    document.documentElement.lang = lang;

    // A. Traducir contenido de texto estándar (usando innerHTML para los <br>)
    const textElements = document.querySelectorAll('[data-i18n]');
    textElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // B. Traducir Placeholders de los inputs del formulario
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // C. Traducir Atributos Value (para inputs tipo botón antiguos)
    const valueElements = document.querySelectorAll('[data-i18n-value]');
    valueElements.forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        if (translations[lang][key]) {
            el.value = translations[lang][key];
        }
    });

    // D. Traducir aria-label (y title) de controles solo-ícono
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (translations[lang][key]) {
            el.setAttribute('aria-label', translations[lang][key]);
            el.setAttribute('title', translations[lang][key]);
        }
    });
}

// 3. Actualizar el aspecto visual del botón según el idioma actual
function updateButtonVisuals(lang) {
    const btn = document.getElementById('btn-translate');
    if (!btn) return;

    // Pill switch mode: btn-translate es un contenedor con [data-lang] children
    const opts = btn.querySelectorAll('[data-lang]');
    if (opts.length > 0) {
        opts.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });
        return;
    }

    // Modo botón legacy (texto "ESP" / "ENG")
    if (lang === 'es') {
        btn.textContent = 'ENG';
    } else {
        btn.textContent = 'ESP';
    }
}

// 4. Función Switch / Toggle que guarda en localStorage
function toggleLanguage() {
    currentLang = (currentLang === 'en') ? 'es' : 'en';
    
    // Guardamos la elección del usuario de forma permanente
    localStorage.setItem('userLang', currentLang);
    
    applyTranslations(currentLang);
    updateButtonVisuals(currentLang);
}

// Event Listeners integrando la delegación de eventos
document.addEventListener('DOMContentLoaded', () => {
    // Estilos del pill switch: viven en /assets/theme.css (tokens de color)

    // Convertir btn-translate legacy (button/a) en pill switch
    const existingBtn = document.getElementById('btn-translate');
    if (existingBtn && existingBtn.tagName !== 'DIV') {
        const pill = document.createElement('div');
        pill.id = 'btn-translate';
        pill.className = 'nav-lang-pill';
        pill.setAttribute('role', 'group');
        pill.setAttribute('aria-label', 'Language switch');
        pill.innerHTML = '<button class="nav-lang-opt" data-lang="en">EN</button><button class="nav-lang-opt" data-lang="es">ES</button>';
        existingBtn.parentNode.replaceChild(pill, existingBtn);
    }

    loadTranslations();

    // Delegación de eventos para el botón de traducción
    document.body.addEventListener('click', (e) => {
        // Pill mode: click en un [data-lang] button dentro de #btn-translate
        const pillOpt = e.target.closest('[data-lang]');
        if (pillOpt && pillOpt.closest('#btn-translate')) {
            const targetLang = pillOpt.getAttribute('data-lang');
            if (targetLang && targetLang !== currentLang) {
                currentLang = targetLang;
                localStorage.setItem('userLang', currentLang);
                applyTranslations(currentLang);
                updateButtonVisuals(currentLang);
            }
            return;
        }

        // Legacy: click directo en el elemento #btn-translate (para compatibilidad con cv mobile pill)
        if (e.target && e.target.id === 'btn-translate') {
            e.preventDefault();
            toggleLanguage();
        }
    });
});