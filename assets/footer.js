document.addEventListener('DOMContentLoaded', () => {
    // Center active subnav pill in the horizontal scroll area
    const subnavScroll = document.querySelector('.portfolio-subnav__scroll');
    const activeLink  = subnavScroll?.querySelector('.portfolio-subnav__link.active');
    if (subnavScroll && activeLink) {
        requestAnimationFrame(() => {
            const scrollLeft = activeLink.offsetLeft
                             - subnavScroll.clientWidth / 2
                             + activeLink.offsetWidth   / 2;
            subnavScroll.scrollLeft = Math.max(0, scrollLeft);
        });
    }

    const footerContainer = document.getElementById('global-footer-container');
    if (!footerContainer) return;

    // Override styles.css's "footer ul li { float: left }" that collapses list items
    const style = document.createElement('style');
    style.textContent = 'footer .list-unstyled li { float: none; margin: 0; }';
    document.head.appendChild(style);

    footerContainer.innerHTML = `
        <footer class="site-footer pt-5 pb-4" aria-label="Pie de página">
          <div class="container">
            <div class="row gy-4">

              <div class="col-6 col-md-3">
                <h6 class="text-uppercase fw-semibold mb-3 small footer-muted" data-i18n="footer_title_portfolio">Portfolio</h6>
                <ul class="list-unstyled small lh-lg">
                  <li><a href="/portfolio/webdesign/" data-i18n="footer_link_web">Web Design</a></li>
                  <li><a href="/portfolio/interactivedesign/" data-i18n="footer_link_interactive">Interactive Design</a></li>
                  <li><a href="/portfolio/movil/mobile.html" data-i18n="footer_link_desktop">Apps Móviles</a></li>
                  <li><a href="/portfolio/marketing/" data-i18n="footer_link_marketing">Branding &amp; Marketing</a></li>
                  <li><a href="/portfolio/doodles/doodles.html" data-i18n="footer_link_doodles">Ilustración Digital</a></li>
                </ul>
              </div>

              <div class="col-6 col-md-3">
                <h6 class="text-uppercase fw-semibold mb-3 small footer-muted" data-i18n="footer_title_about">About</h6>
                <ul class="list-unstyled small lh-lg">
                  <li><a href="/about/" data-i18n="menu_about">About me</a></li>
                  <li><a href="/cv/" data-i18n="footer_title_cv">CV</a></li>
                  <li><a href="/certifications/" data-i18n="menu_certfications">Certifications</a></li>
                </ul>
              </div>

              <div class="col-6 col-md-3">
                <h6 class="text-uppercase fw-semibold mb-3 small footer-muted" data-i18n="footer_title_contact">Contact</h6>
                <a href="/contact/" class="small" data-i18n="menu_contact">Contacto</a>
              </div>

              <div class="col-6 col-md-3">
                <h6 class="text-uppercase fw-semibold mb-3 small footer-muted" data-i18n="footer_title_connect">Connect</h6>
                <div class="d-flex gap-3 fs-4 footer-muted">
                  <a href="https://twitter.com/gemeloportillo" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                  <a href="https://mx.linkedin.com/in/miguelportilloux" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                  <a href="https://www.youtube.com/user/mikepb77" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
              </div>

            </div>
            <hr class="mt-4 mb-3">
            <p class="footer-muted small text-center mb-0">&copy; 2026 Miguel Angel Portillo Bobadilla &mdash; Arte y Ciencia</p>
          </div>
        </footer>
    `;
});
