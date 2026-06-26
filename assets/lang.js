// 1. Estado inicial revisando localStorage primero
let currentLang = localStorage.getItem('userLang') || 'en'; 
let translations = {};

// Cargar el archivo JSON mediante Fetch (ajusta la ruta según tu estructura)
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

// 2. Función que aplica los textos al HTML (usando innerHTML para los <br>)
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
}

// 3. Actualizar el aspecto visual del botón según el idioma actual
function updateButtonVisuals(lang) {
    const btn = document.getElementById('btn-translate');
    if (!btn) return;

    if (lang === 'es') {
        btn.textContent = 'ENG';
        btn.style.color = '#00bfff'; // Azul para estado en Español (invita a cambiar a ENG)
    } else {
        btn.textContent = 'ESP';
        btn.style.color = '#00ff7f'; // Verde para estado en Inglés (invita a cambiar a ESP)
    }
}

// 4. Función Switch / Toggle que ahora SÍ guarda en localStorage
function toggleLanguage() {
    currentLang = (currentLang === 'en') ? 'es' : 'en';
    
    // Guardamos la elección del usuario de forma permanente
    localStorage.setItem('userLang', currentLang);
    
    applyTranslations(currentLang);
    updateButtonVisuals(currentLang);
}

// Event Listeners integrando la delegación de eventos por si el menú tarda en cargar
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
    
    // Delegación de eventos: escuchamos el clic en el body por si el botón se inyectó dinámicamente
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-translate') {
            e.preventDefault();
            toggleLanguage();
        }
    });
});