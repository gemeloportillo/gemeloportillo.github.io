
// Global Variables

var PreloadImages = $([
        "images/services/software-development-hover.png",
        "images/services/quality-assurance-hover.png",
        "images/services/business-intelligence-hover.png",
        "images/services/ui-services-hover.png",
        "images/services/support-hover.png",
        "images/services/da_hover.png",
        "images/services/mobile-hover.png",
        "images/check.jpg"]);

var RecaptchaOptions = { theme: 'clean' };

var Menu = null;
var Video = null;
var WordsToSpace = null;
var VideoSlogans = null;

var CustomerSlides = null;
var CustomerSlidesReordered = false;

var TestimonialSlides = null;
var TestimonialPages = null;
var TestimonialMouseOver = false;

var LeadersTeam = null;
var AdvisoryBoard = null;
var LeadersTeamTop = 0;

var ProjectsGrid = null;
var ProjectsDetails = null;
var GridVerticalPosition = 0;

var ServiceCategories = null;
var ServiceContents = null;
var IsServicesPage = $("#services-page").length > 0;

var Locations = null;
var map = null;
var pos_lat_gdl = null;
var pos_lat_oreg = null;
var pos_lat_leon = null;
var pos_lat_bost = null;
var MapStyles = null;

// Google Analytics
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-8535255-1', 'unosquare.com');
ga('send', 'pageview');

// Global Functions

// General
function CenterVertically() {
    $(".center-vertically").each(function () {
        $(this).css("margin-top", "-" + parseInt($(this).height() / 2) + "px");
    });
};

// Testimonials
function GoToTestimonial(TestimonialIndex) {
    TestimonialPages.removeClass("active");
    TestimonialPages.eq(TestimonialIndex).addClass("active");
    TestimonialSlides.each(function (Index, Testimonial) {
        $(Testimonial).css({ "opacity": TestimonialIndex == Index ? 1 : 0 });
    });
};

// About
function ShowLeadersTeam() {
    window.scrollTo(0, LeadersTeamTop);
    LeadersTeam.css("left", 0);
    AdvisoryBoard.css("left", "100%");
};

function ShowAdvisoryTeam() {
    window.scrollTo(0, LeadersTeamTop);
    AdvisoryBoard.css("left", 0)
    LeadersTeam.css("left", "-100%");
};

// Projects
function ShowProjectDetail(ProjectId) {
    var ProjectDetail = ProjectsDetails.filter("#" + ProjectId);
    ProjectDetail.css({ "display": "block", "position": "absolute" });
    ProjectsGrid.css({ "opacity": 0 });
    ProjectDetail.css({ "opacity": 1 });
    GridVerticalPosition = $(document).scrollTop();
    window.scrollTo(0, 0);
}

function HideProjectDetail(ProjectId) {
    ProjectsGrid.css({ "display": "block" });
    ProjectsDetails.css({ "position": "absolute", "opacity": 0 });
    ProjectsGrid.css("opacity", 1);
    window.scrollTo(0, GridVerticalPosition);
};

// Services
function MoveToService(NextService) {
    var CurrentService = parseInt($("#services").attr("data-current-service-index"));
    if (typeof NextService != Number) {
        eval("CurrentService" + NextService);
    }
    $("#services").attr("data-current-service-index", CurrentService);
    ServiceCategories.each(function (Index, Service) {
        $(Service).css("left", (Index - (CurrentService)) * 100 + "%");
    });
    ShowServiceContent(CurrentService);
};

function ShowServiceContent(ServiceToShow) {
    ServiceCategories.removeClass("active");
    ServiceCategories.eq(ServiceToShow).addClass("active");
    ServiceContents.removeClass("active").show();
    ServiceContents.eq(ServiceToShow).css("position", "relative");
    setTimeout(function () {
        ServiceContents.each(function (Index, Service) {
            var Left = (Index - (ServiceToShow)) * 100;
            ServiceContents.eq(Index).css({ "display": "block", "left": Left + "%" });
            if (Left == 0) {
                ServiceContents.eq(ServiceToShow).addClass("active");
            }
        });
    }, 50);
};

// Contact Form
function ContactFormIsValid() {
    var founderrors = false;
    $("#ct_company_name, #ct_name, #ct_subject, #ct_message").each(function () {
        var This = $(this);
        if (This.val().length < 3) {
            This.tooltip("show");
            founderrors = true;
        }
        else {
            This.tooltip("hide");
        }
    })
    var Email = $("#ct_email");
    if (!new RegExp(Email.attr("data-regexp")).test(Email.val())) {
        Email.tooltip("show");
        founderrors = true;
    }
    else {
        Email.tooltip("hide");
    }
    if ($("#recaptcha_response_field").val().length == 0) {
        $("#recaptcha_response_field").tooltip({
            placement: "bottom",
            title: "This information is required"
        }).tooltip("show");
    }
    else {
        $("#recaptcha_response_field").tooltip("hide");
    }
    return !founderrors;
};

function SendContactForm() {
    if (!ContactFormIsValid()) {
        return;
    }
    $("#form_contact .send").attr("disabled", "disabled").val("Sending ...");
    var formData = new FormData($("#form_contact")[0]);
    $.ajax({
        url: 'api/contactsales.php',
        type: 'POST',
        error: function (a, b, c) {
            if (JSON.parse(a.responseText).Message == "reCaptcha Error: incorrect-captcha-sol") {
                $("#form_contact .captcha .captcha-error").show();
                $("#form_contact .send").removeAttr("disabled").val("Send");
                return;
            }
            var Form = $("#form_contact");
            $("#message-error", Form).css("top", 0);
            $("ul", Form).css("top", "100%");
            Form.trigger("reset");
            $("#form_contact .captcha .captcha-error").hide();
            ReloadCaptcha();
            $("#form_contact .send").removeAttr("disabled").val("Send");
        },
        success: function () {
            var Form = $("#form_contact");
            window.scrollTo(0, parseInt(Form.offset().top) - 54);
            $("#message-sent-confirmation", Form).css("top", 0);
            $("ul", Form).css("top", "100%");
            Form.trigger("reset");
            $("#form_contact .captcha .captcha-error").hide();
            ReloadCaptcha();
            $("#form_contact .send").removeAttr("disabled").val("Send");
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    }, 'json');
};

// Maps
function OnMapsInitialized() {
    pos_lat_gdl = new google.maps.LatLng(20.7025769, -103.3758192);
    pos_lat_oreg = new google.maps.LatLng(45.35143, -122.6545476);
    pos_lat_leon = new google.maps.LatLng(21.156780, -101.69030);
    pos_lat_bost = new google.maps.LatLng(42.362661, -71.084153);

    var mapOptions = { mapTypeControlOptions: { mapTypeIds: ['Styled'] }, zoom: 10, center: pos_lat_oreg, mapTypeId: 'Styled', scrollwheel: false };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var styledMapType = new google.maps.StyledMapType(MapStyles, { name: 'Styled' });

    map.mapTypes.set('Styled', styledMapType);
    var marker_gdl = new google.maps.Marker({ position: pos_lat_gdl, title: "Unosquare Guadalajara", icon: "images/icons/location-marker.png", visible: true }).setMap(map);
    var marker_oreg = new google.maps.Marker({ position: pos_lat_oreg, title: "Unosquare Portland", icon: "images/icons/location-marker.png", visible: true }).setMap(map);
    var marker_leon = new google.maps.Marker({ position: pos_lat_leon, title: "Unosquare León", icon: "images/icons/location-marker.png", visible: true }).setMap(map);
    var marker_bost = new google.maps.Marker({ position: pos_lat_bost, title: "Unosquare Boston", icon: "images/icons/location-marker.png", visible: true }).setMap(map);

    $("#map-canvas").bind("click", function () {
        map.setOptions({ scrollwheel: true });
    }).bind("mouseout", function () {
        map.setOptions({ scrollwheel: false });
    });

    Locations = $(".locations-container .location");
};

function ShowLocation(Location, Element) {
    var panoramic;
    panoramic = map.getStreetView();
    panoramic.setVisible(false);
    if (Location == "gdl") {
        map.panTo(pos_lat_gdl);
    } else if (Location == "oreg") {
        map.panTo(pos_lat_oreg);
    } else if (Location == "leon") {
        map.panTo(pos_lat_leon);
    } else if (Location == "bost") {
        map.panTo(pos_lat_bost);
    }
    if ($(document).scrollTop() > 0) {
        $('html, body').animate({
            scrollTop: 0
        }, 300);
    }
    Locations.removeClass("active");
    $(Element).addClass("active");
};

function ReloadCaptcha() {
    var Event = document.createEvent("HTMLEvents");
    Event.initEvent("click", true, true);
    document.getElementById("recaptcha_reload").dispatchEvent(Event);
};

// Video
function LayoutVideo() {
    if (Video.length <= 0) return;

    if ($(window).width() > $(window).height()) {
        $(".video-background video").css({ "width": "100%", "height": "auto" });
        if (Video.height() < $(window).height()) {
            $(".video-background video").css({ "height": "100%", "width": "auto" });
        }
    }
    else {
        $(".video-background video").css({ "width": "auto", "height": "100%" });
    }

    WordsToSpace.css("padding-left", "");

    var TotalWidth = 0;
    WordsToSpace.each(function (Index, Word) {
        TotalWidth += $(Word).width();
    });

    var MaxWidth = WordsToSpace.eq(0).parent().width();
    var Space = (MaxWidth - TotalWidth) / 5;
    if (Space < 20) {
        Space = 20;
    }

    WordsToSpace.filter(":gt(0)").each(function (Index, Word) {
        $(Word).css("padding-left", Space + "px");
    });

    CenterVertically();
};

$(document).ready(function () {
    // Initialization
    function InitGeneral() {

        Menu = $("ul.menu");
        Video = $(".video-background video");
        WordsToSpace = $(".video-background .texture .content h5");
        VideoSlogans = $(".video-slogans .slogan");

        CustomerSlides = $(".client-container .container");
        CustomerSlidesReordered = false;

        TestimonialSlides = $("#testimonials .testimonials-slider .slide");
        TestimonialPages = $("#testimonials .slider-pagination .page");
        TestimonialMouseOver = false;

        LeadersTeam = $("#leadership .leaders-team");
        AdvisoryBoard = $("#leadership .advisory-board");
        LeadersTeamTop = 0;

        ProjectsGrid = $("#projects .projects-grid");
        ProjectsDetails = $("#projects .project-detail");
        GridVerticalPosition = 0;

        ServiceCategories = $("#services .categories .col");
        ServiceContents = $("#services .contents .content");
        IsServicesPage = $("#services-page").length > 0;

        CenterVertically();

        // Resize handler
        $(window).resize(function () {
            CenterVertically();
            LayoutVideo();
        }).trigger("resize");

        $("li:first-child", Menu).click(function (e) {
            if (Menu.is(".expanded")) {
                Menu.removeClass("expanded").addClass("collapsed");
            }
            else {
                Menu.removeClass("collapsed").addClass("expanded");
            }
        });

        $("li:not(:first-child)").click(function () {
            Menu.removeClass("expanded").addClass("collapsed");
        });

        $(window).bind("click touchend scroll", function (e) {
            if (Menu.children().index($(e.target).parents("li")) >= 0) {
                return;
            }
            Menu.removeClass("expanded").addClass("collapsed");
        });

        $(document).bind("keydown", function (e) {
            if (e.keyCode === 27) {
                Menu.removeClass("expanded").addClass("collapsed");
            }
        });

        // Scrolling
        $(window).scroll(function () {
            //Menu.css("padding", ($(document).scrollTop() > 0 ? 5 : 10) + "px 0");
        });
    }

    function InitVideo() {
        if (Video.length <= 0) return;

        $('<img/>').attr('src', '/images/intro.jpg').load(function () {
            $(".video-background .texture").css("opacity", 1);
        });

        Video.on("play", function () {
            if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
                LayoutVideo();
            }
        });

        if (VideoSlogans.length <= 0) return;
        setInterval(function () {
            var Active = VideoSlogans.filter(".active").removeClass("active")
            var Next = Active.next(".slogan");
            if (Next.length == 0) {
                Next = VideoSlogans.eq(0);
            }
            Next.addClass("active")
        }, 7000);
    }

    function InitCustomers() {
        // Customers
        if (CustomerSlides.length <= 0) return;

        setInterval(function () {
            CustomerSlides.on("transitionend webkitTransitionEnd", function () {
                if (CustomerSlidesReordered) {
                    return;
                }
                CustomerSlides.eq(0).insertAfter(CustomerSlides.eq(CustomerSlides.length - 1)).css({ "left": "100%", "transition": "" });
                CustomerSlides = $(".client-container .container");
                CustomerSlidesReordered = true;
            });
            CustomerSlides.each(function (Index, CustomerSlide) {
                $(CustomerSlide).css({ "left": ((1 - Index) * -100) + "%" });
            });
            CustomerSlidesReordered = false;
        }, 10000);
    }

    function InitTestimonials() {
        // Testimonials
        if (TestimonialSlides.length <= 0) return;

        $(".testimonials-slider").hover(function () {
            TestimonialMouseOver = true;
        }, function () {
            TestimonialMouseOver = false;
        });

        window.setInterval(function () {
            if (TestimonialMouseOver) {
                return;
            }
            var Index = TestimonialPages.index(TestimonialPages.filter(".active"));
            Index = (Index + 1 < TestimonialPages.length) ? Index + 1 : 0;
            GoToTestimonial(Index);
        }, 8000);
    }

    function InitLeadership() {
        // About - leaders
        if (LeadersTeam.length <= 0) return;
        $(window).resize(function () {
            LeadersTeamTop = parseInt(LeadersTeam.offset().top) - 44;
        }).trigger("resize");

        var field = 'leadership';
        var url = window.location.href;
        if (url.indexOf('?' + field) != -1 || url.indexOf('&' + field) != -1)
            ShowLeadersTeam();
    }

    function InitProjects() {
        // Projects
        if (ProjectsGrid.length <= 0) return;

        ProjectsGrid.on("transitionend webkitTransitionEnd", function () {
            ProjectsGrid.css({ "display": ProjectsGrid.css("opacity") == 0 ? "none" : "block", "position": "" });
            ProjectsDetails.each(function (Index, Detail) {
                Detail = $(Detail);
                Detail.css({ "display": Detail.css("opacity") == 0 ? "none" : "block", "position": "" });
            });
        });

        ProjectsDetails.on("transitionend webkitTransitionEnd", function (e) {
            if (e.target.className != "project-detail") {
                return;
            }
            ProjectsGrid.css({ "display": ProjectsGrid.css("opacity") == 0 ? "none" : "block", "position": "" });
            ProjectsDetails.each(function (Index, Detail) {
                Detail = $(Detail);
                Detail.css({ "display": Detail.css("opacity") == 0 ? "none" : "block", "position": "" });
            });
        });

    }

    function InitServices() {
        // Services
        if (ServiceContents.length <= 0) return;
        // Pre load images
        $(PreloadImages).each(function (Index) {
            $("<img/>", { src: PreloadImages.eq[Index] });
        });

        ServiceContents.on("transitionend webkitTransitionEnd", function (e) {
            $(e.target).css({ "display": "", "position": "" })
        });
    }

    function InitMaps() {
        // Maps
        if ($("#map-canvas").length <= 0) return;
        MapStyles = [{ featureType: 'landscape', elementType: 'all', stylers: [{ hue: '#ebebeb' }, { saturation: -100 }, { lightness: 29 }, { visibility: 'on'}] },
                        { featureType: 'road', elementType: 'all', stylers: [{ hue: '#b0b0b0' }, { saturation: -100 }, { lightness: 14 }, { visibility: 'on'}] },
                        { featureType: 'water', elementType: 'all', stylers: [{ hue: '#989898' }, { saturation: -100 }, { lightness: -22 }, { visibility: 'on'}] },
                        { featureType: 'poi', elementType: 'all', stylers: [{ hue: '#cecece' }, { saturation: -100 }, { lightness: 13 }, { visibility: 'on'}]}];
        var script_tag = $("<script/>", {
            "type": "text/javascript",
            "src": "https://maps.google.com/maps/api/js?sensor=true&callback=OnMapsInitialized"
        }).appendTo($("head"));
    }

    function InitContactForm() {
        //Contact
        if ($("#form_contact").length <= 0) return;
        $("#ct_email").keyup(function () {
            var Regex = new RegExp(/[^a-zA-Z0-9@._]/g);
            if (this.value.match(Regex)) {
                this.value = this.value.replace(Regex, '');
            }
        });
    }

    function InitToolTips() {
        $(".tooltip[data-title]").tooltip({
            placement: "top",
            title: "data-title",
            trigger: "manual"
        });
    }

    InitGeneral();
    InitVideo();
    InitCustomers();
    InitTestimonials();
    InitLeadership();
    InitProjects();
    InitServices();
    InitMaps();
    InitContactForm();
    InitToolTips();
});

