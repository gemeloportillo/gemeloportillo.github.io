document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('global-footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer>
            <div class="container">
                <ul class="info clear-fix">
                    <li class="services">
                        <h4 data-i18n="footer_title_portfolio">portfolio</h4>
                        <ul class="clear-fix">
                            <li>
                                <a href="/portfolio/?DesktopMobileDevs" data-i18n="footer_link_desktop">Desktop & Apps devs</a><br>
                                <a href="/portfolio/?PosterBanners" data-i18n="footer_link_posters">Posters & Banners</a><br>
                                <a href="/portfolio/?BusinessMarketing" data-i18n="footer_link_marketing">Business Marketing</a>
                            </li>
                            <li>
                                <a href="/portfolio/?Doodles" data-i18n="footer_link_doodles">Doodles & Cartoons</a><br>
                                <a href="/portfolio/?Interactive" data-i18n="footer_link_interactive">Interactive Design</a><br>
                                <a href="/portfolio/?Web" data-i18n="footer_link_web">Web Design</a>
                            </li>
                        </ul>
                    </li>
                    <li class="work">
                        <h4 data-i18n="footer_title_cv">cv</h4>
                        <a href="/about/">CV</a><br>
                        <a href="/portfolio/" data-i18n="menu_certfications">Certs</a><br>
                        <div class="contsocial">
                            <h4 class="text-left" data-i18n="footer_title_connect">connect with me</h4>
                            <a href="https://twitter.com/gemeloportillo" target="_blank">
                                <div class="bgico-darkgray circle-twitter"></div>
                            </a>
                            <a href="https://mx.linkedin.com/in/miguelportilloux" target="_blank">
                                <div class="bgico-darkgray circle-linkedin"></div>
                            </a>
                            <a href="https://www.youtube.com/user/mikepb77" target="_blank">
                                <div class="bgico-darkgray circle-youtube"></div>
                            </a>
                        </div>
                    </li>
                    <li class="about-us">
                        <h4 data-i18n="footer_title_about">about me</h4>
                        <a href="/about/?leadership" data-i18n="footer_link_values">Values</a><br>
                    </li>
                    <li class="divider">
                        <div class="linesep-vert"></div>
                    </li>
                    <li class="contact-us">
                        <h4 data-i18n="footer_title_contact">contact me</h4>
                        <ul class="clear-fix">
                            <li>
                                <h6>Distrito Federal, <span class="text-blue">México</span></h6>
                                <div>Diagonal de San Antonio</div>
                                <div>Col. Narvarte, C.P. 03023</div>
                                <div>Coyoacán, México DF.</div>
                                <div>+52 (55) 2328-8158</div>
                            </li>
                        </ul>
                    </li>
                    <li class="contsocial-left">
                        <div>
                            <h4 data-i18n="footer_title_connect">connect with me</h4>
                            <a href="https://twitter.com/gemeloportillo" target="_blank">
                                <div class="bgico-darkgray circle-twitter"></div>
                            </a>
                            <a href="https://mx.linkedin.com/in/miguelportilloux" target="_blank">
                                <div class="bgico-darkgray circle-linkedin"></div>
                            </a>
                            <a href="https://www.youtube.com/user/mikepb77" target="_blank">
                                <div class="bgico-darkgray circle-youtube"></div>
                            </a>
                        </div>
                    </li>
                </ul>
                <div class="copyright">© 2013 ArteyCiencia.mx. All rights reserved. Miguel Angel Portillo Bobadilla.</div>
            </div>
        </footer>
    `;
});