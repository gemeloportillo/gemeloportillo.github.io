/* ═══════════════════════════════════════════════════════════════════════
   LAYERS — Selector "Contenido → Wireframe → Diseño final"
   ───────────────────────────────────────────────────────────────────────
   Muestra el proceso de diseño de la página en 3 capas:
     content   → solo HTML semántico (se desactivan todas las hojas de
                 estilo salvo las marcadas con data-layer-keep)
     wireframe → layout en grises con placeholders y anotaciones
                 (clase html.layer-wireframe, estilos en layers.css)
     final     → el diseño visual completo
   No se guarda en localStorage a propósito: al recargar, el visitante
   siempre ve el diseño final.
   Requiere: <link rel="stylesheet" href="…/assets/layers.css" data-layer-keep>
   ═══════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const LAYERS = ['content', 'wireframe', 'final'];
    const root = document.documentElement;

    // 1. Inyectar el control (textos traducidos por lang.js vía data-i18n)
    const panel = document.createElement('details');
    panel.className = 'layer-switch';
    panel.innerHTML = `
        <summary><span aria-hidden="true">◧</span> <span data-i18n="layers_title">Design layers</span></summary>
        <div class="layer-switch__body">
          <fieldset>
            <legend data-i18n="layers_title">Design layers</legend>
            <div class="layer-switch__options">
              <input type="radio" name="layer" id="layer-content" value="content">
              <label for="layer-content" data-i18n="layer_content">Content</label>
              <input type="radio" name="layer" id="layer-wireframe" value="wireframe">
              <label for="layer-wireframe" data-i18n="layer_wireframe">Wireframe</label>
              <input type="radio" name="layer" id="layer-final" value="final" checked>
              <label for="layer-final" data-i18n="layer_final">Final design</label>
            </div>
          </fieldset>
          <div aria-live="polite">
            <p class="layer-switch__desc" data-layer-desc="content" data-i18n="layer_content_desc" hidden>Semantic HTML only.</p>
            <p class="layer-switch__desc" data-layer-desc="wireframe" data-i18n="layer_wireframe_desc" hidden>Low-fidelity layout.</p>
            <p class="layer-switch__desc" data-layer-desc="final" data-i18n="layer_final_desc">Content precedes design.</p>
          </div>
        </div>`;
    document.body.appendChild(panel);

    // 2. Activar / desactivar hojas de estilo (incluye las inyectadas por JS)
    function setStylesheets(enabled) {
        document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => {
            if (el.hasAttribute('data-layer-keep') || !el.sheet) return;
            el.sheet.disabled = !enabled;
        });
        // Los atributos style="" inline sobreviven a las hojas: se guardan y restauran
        document.querySelectorAll(enabled ? '[data-layer-style]' : 'body [style]').forEach(el => {
            if (el.closest('.layer-switch')) return;
            if (enabled) {
                el.setAttribute('style', el.getAttribute('data-layer-style'));
                el.removeAttribute('data-layer-style');
            } else {
                el.setAttribute('data-layer-style', el.getAttribute('style'));
                el.removeAttribute('style');
            }
        });
    }

    let current = 'final';
    function applyLayer(layer) {
        if (!LAYERS.includes(layer) || layer === current) return;
        if (current === 'content') setStylesheets(true);
        if (layer === 'content') setStylesheets(false);
        root.classList.toggle('layer-wireframe', layer === 'wireframe');
        panel.querySelectorAll('[data-layer-desc]').forEach(p => {
            p.hidden = p.getAttribute('data-layer-desc') !== layer;
        });
        current = layer;
    }

    panel.addEventListener('change', e => {
        if (e.target.name === 'layer') applyLayer(e.target.value);
    });
});
