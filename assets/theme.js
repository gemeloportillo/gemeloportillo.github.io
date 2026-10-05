/* ═══════════════════════════════════════════════════════════════════════
   THEME — Modo claro / oscuro
   ───────────────────────────────────────────────────────────────────────
   · Cárgalo en <head> SIN defer/async para aplicar el tema antes del
     primer pintado (evita el "flash" blanco en modo oscuro).
   · Prioridad: elección guardada (localStorage.userTheme) → preferencia
     del sistema operativo (prefers-color-scheme).
   · Usa el atributo nativo de Bootstrap 5.3: <html data-bs-theme="…">.
   · Inyecta el switch día/noche junto a #btn-translate en la navbar.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
    const STORAGE_KEY = 'userTheme';
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    function getStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function store(theme) {
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* modo privado */ }
    }

    function currentTheme() {
        return root.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
    }

    function syncUI() {
        const isDark = currentTheme() === 'dark';
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            btn.setAttribute('aria-checked', String(isDark));
        });
        // Color de la barra del navegador móvil = fondo de página
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content',
                getComputedStyle(root).getPropertyValue('--color-bg').trim() || (isDark ? '#0f172a' : '#ffffff'));
        }
    }

    function applyTheme(theme) {
        root.setAttribute('data-bs-theme', theme);
        syncUI();
    }

    // 1. Aplicar de inmediato (antes del pintado)
    applyTheme(getStored() || (media.matches ? 'dark' : 'light'));

    // 2. Seguir al sistema operativo mientras el usuario no haya elegido
    media.addEventListener('change', e => {
        if (!getStored()) applyTheme(e.matches ? 'dark' : 'light');
    });

    // 3. Inyectar el switch y enlazar eventos
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.querySelector('[data-theme-toggle]')) {
            const langItem = document.getElementById('btn-translate')?.closest('li');
            if (langItem) {
                const li = document.createElement('li');
                li.className = 'nav-item ms-lg-2 py-2 py-lg-0';
                li.innerHTML = `
                    <button type="button" class="theme-toggle" data-theme-toggle
                            role="switch" aria-checked="false"
                            aria-label="Dark mode" title="Dark mode"
                            data-i18n-aria-label="theme_toggle_label">
                        <i class="fa-solid fa-sun" aria-hidden="true"></i>
                        <i class="fa-solid fa-moon" aria-hidden="true"></i>
                    </button>`;
                langItem.after(li);
            }
        }
        syncUI();

        document.addEventListener('click', e => {
            if (!e.target.closest('[data-theme-toggle]')) return;
            const next = currentTheme() === 'dark' ? 'light' : 'dark';
            store(next);
            applyTheme(next);
        });
    });
})();
