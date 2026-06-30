document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('global-footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer>
            <div class="container px-3">

                <div class="row g-4 my-4">

                    <!-- Portfolio: 2 sub-columns of links -->
                    <div class="col-12 col-sm-6 col-lg-3">
                        <h4 data-i18n="footer_title_portfolio">portfolio</h4>
                        <div class="row">
                            <div class="col-6">
                                <a class="d-block mb-1" href="/portfolio/?DesktopMobileDevs" data-i18n="footer_link_desktop">Desktop &amp; Apps devs</a>
                                <a class="d-block mb-1" href="/portfolio/?PosterBanners" data-i18n="footer_link_posters">Posters &amp; Banners</a>
                                <a class="d-block mb-1" href="/portfolio/?BusinessMarketing" data-i18n="footer_link_marketing">Business Marketing</a>
                            </div>
                            <div class="col-6">
                                <a class="d-block mb-1" href="/portfolio/?Doodles" data-i18n="footer_link_doodles">Doodles &amp; Cartoons</a>
                                <a class="d-block mb-1" href="/portfolio/?Interactive" data-i18n="footer_link_interactive">Interactive Design</a>
                                <a class="d-block mb-1" href="/portfolio/?Web" data-i18n="footer_link_web">Web Design</a>
                            </div>
                        </div>
                    </div>

                    <!-- CV -->
                    <div class="col-6 col-sm-3 col-lg-2">
                        <h4 data-i18n="footer_title_cv">cv</h4>
                        <a class="d-block mb-1" href="/about/">CV</a>
                        <a class="d-block mb-1" href="/portfolio/" data-i18n="menu_certfications">Certs</a>
                    </div>

                    <!-- About Me -->
                    <div class="col-6 col-sm-3 col-lg-2">
                        <h4 data-i18n="footer_title_about">about me</h4>
                        <a class="d-block mb-1" href="/about/?leadership" data-i18n="footer_link_values">Values</a>
                    </div>

                    <!-- Contact -->
                    <div class="col-12 col-sm-6 col-lg-3">
                        <h4 data-i18n="footer_title_contact">contact me</h4>
                        <address style="font-style:normal; line-height:1.9;">
                            <div>Distrito Federal, <span class="text-blue">México</span></div>
                            <div>Diagonal de San Antonio</div>
                            <div>Col. Narvarte, C.P. 03023</div>
                            <div>Coyoacán, México DF.</div>
                            <div>+52 (55) 2328-8158</div>
                        </address>
                    </div>

                    <!-- Social -->
                    <div class="col-12 col-sm-6 col-lg-2">
                        <h4 data-i18n="footer_title_connect">connect with me</h4>
                        <div class="d-flex gap-2 flex-wrap">
                            <a href="https://twitter.com/gemeloportillo" target="_blank" rel="noopener noreferrer"
                               class="bgico-darkgray d-inline-flex align-items-center justify-content-center"
                               aria-label="Twitter / X">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="https://mx.linkedin.com/in/miguelportilloux" target="_blank" rel="noopener noreferrer"
                               class="bgico-darkgray d-inline-flex align-items-center justify-content-center"
                               aria-label="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://www.youtube.com/user/mikepb77" target="_blank" rel="noopener noreferrer"
                               class="bgico-darkgray d-inline-flex align-items-center justify-content-center"
                               aria-label="YouTube">
                                <i class="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>

                </div>

                <hr class="border-secondary mt-4 mb-3">
                <p class="copyright text-center mb-0">
                    © 2026 ArteyCiencia.mx. All rights reserved. Miguel Angel Portillo Bobadilla.
                </p>

            </div>
        </footer>
    `;
});
