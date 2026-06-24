$(document).ready(function() {
    var eventsHeight = $("#eventsSection").height();
    var moreEventsHeight = $(".more-events").parent().height();
    var moreEventsNewH = (eventsHeight - moreEventsHeight) - 10;
    var moreItemsHit = 0;
    var moreEventsHit = 0;
    var moreNewsHit = 0;
    var moreTechsHit = 0;
    var totalItems = $("#all").data('total');
    var totalEvents = $("#events").data('total');
    var totalNews = $("#news").data('total');
    var totalTechs = $("#technology").data('total');
    var paginationNumber = 4;
    var currentTab = "all";
    $("#tabs a").on('shown.bs.tab', function(e) {
        var tab = $(e.target).attr('href');
        currentTab = tab.substring(1);
        $(".right-categories-options a").each(function(){
            $(this).removeClass('active');
            if($(this).data('target') === currentTab){
                $(this).addClass('active')
            }
        })
        $(window).scrollTop($("#tabs"))
    })
  
    var windowW = $(window).width();
    MenuSocial = $("ul.drop-navigation");
    $("li:first-child", MenuSocial).click(function(e) {
        if (MenuSocial.is(".expanded")) {
            MenuSocial.removeClass("expanded").addClass("collapsed");
        } else {
            MenuSocial.removeClass("collapsed").addClass("expanded");
        }
    });

    $("li:not(:first-child)").click(function() {
        MenuSocial.removeClass("expanded").addClass("collapsed");
    });

   /* $(window).bind("click touchend scroll", function(e) {
        if (MenuSocial.children().index($(e.target).parents("li")) >= 0) {
            return;
        }
        MenuSocial.removeClass("expanded").addClass("collapsed");
    });*/

   /* $(document).bind("keydown", function(e) {
        if (e.keyCode === 27) {
            MenuSocial.removeClass("expanded").addClass("collapsed");
        }
    });*/

    if (windowW <= 800) {
        $(".social-tabs-container").css('width', '100%');
    }
    var detailId = $(".post-detail-container").data('post');
    if(!isNaN(detailId)){
        $("#trending_"+detailId).addClass('active')
    }
    if ($("#backButton").length > 0) {
        $(".right-categories-options a").on('click', function(e) {
            e.preventDefault();
            location.href = "social.php#" + $(this).data('target');
            $(window).scrollTop($("tabs"));
        });
    } else {
        var url = location.href;
        var splitted = url.split("#");
        var section = splitted[1];
        if (section) {
            $('#tabs a[href="#' + section + '"]').tab('show');
            $(window).scrollTop($("tabs"));
        }
    }
    $(".back-button").on('click', function() {
        location.href = 'social.php';
    })


    if (totalEvents <= paginationNumber) {
        $("#moreEventsBtn").hide();
    }
    $(".more-events").css({
        'top': moreEventsNewH
    }).on('click', function() {
        $('#tabs a[href="#events"]').tab('show');
    });
    $("#tabs a").on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $(".right-categories-options a").on('click', function(e) {
        e.preventDefault();
        $('#tabs a[href="#' + $(this).data('target') + '"]').tab('show');

    });
    $("#tabs a").on('shown.bs.tab', function(e) {
        var ev = e;
        $(window).scrollTop($("tabs"));
        var sectionName = $(e.target).attr('href').substring(1);
        $(".right-categories-options a").each(function() {
            $(this).removeClass('active');
            if ($(this).data('target') === sectionName) {
                $(this).addClass('active')
            }
        });
        $(".drop-navigation li a").each(function() {
            var sectionName = $(ev.target).attr('href');
            $(window).scrollTop($("tabs"));
            $(this).removeClass('active');
            if ($(this).attr('href') === sectionName) {
                console.log($(this))
                $(this).addClass('active')
            }
        })
    });
    $(".drop-navigation li a").on('click', function(e) {
        $(".drop-navigation li a").each(function() {
            $(this).removeClass('active');
        })

        $(this).addClass('active');
    });
    $("#moreItemsBtn").on('click', getMorePosts);
    $("#moreEventsBtn").on('click', getMoreEvents);
    $("#moreNewsBtn").on('click', getMorePosts);
    $("#moreTechBtn").on('click', getMorePosts);

    function getMoreEvents() {
        moreEventsHit++;
        var limitStart = (moreEventsHit * paginationNumber) + 1;
        var data = {
            limit: {
                from: limitStart,
                to: paginationNumber
            }
        };
        $.post('api/events.php', data, onGetEvents);
    }

    function getMorePosts(e) {
        var limitStart = 0;
        var category = $(e.currentTarget).data('category');

        switch (category) {
            case 'technology':
                moreTechsHit++;
                limitStart = (moreTechsHit * paginationNumber);
                break;
            case 'news':
                moreNewsHit++;
                limitStart = (moreNewsHit * paginationNumber);
                break;
            default:
                moreItemsHit++;
                limitStart = (moreItemsHit * paginationNumber);
                break;
        }

        //        if (category == 'technology') {
        //            moreTechsHit++;
        //            limitStart = (moreTechsHit * paginationNumber);
        //        } else {
        //            moreNewsHit++;
        //            limitStart = (moreNewsHit * paginationNumber);
        //        }

        var data = {
            limit: {
                from: limitStart,
                to: paginationNumber
            },
            category: category
        }
        $.post('api/posts.php', data, onGetPosts);
    }

    function onGetEvents(data) {
        var events = data.Events;
        for (var i = 0; i < events.length; i++) {
            var date = parseDate(events[i].date);
            var eventDate = new Date(date);
            var imageExists = checkImage(events[i].image);
            var description = events[i].description.split(' ', 60).join(' ') + '...';
            var image = imageExists ? 'images/social/' + events[i].image : 'images/social/post.jpg';
            //Add Event
            var eventDiv = $("#eventsContainer > div:first-child").clone();
            var dateDiv = eventDiv.children(':first-child').children('p');
            eventDiv.find('.img-article').children('img').attr('src', image)
                .parent().children('h4').text(events[i].name)
                .parent().children('p.text-justify').text(description);
            eventDiv.find('.event-label-category').children('p').text(events[i].category);
            dateDiv.text(date);
            $("#eventsContainer").append(eventDiv);
            if ($("#eventsContainer>div").length >= totalEvents) {
                $("#moreEventsBtn").hide();
            }
        }
    }

    function onGetPosts(data) {
        var container = $("#" + currentTab + 'Container');
        var posts = data.Posts;
        console.log(posts);
        for (var i = 0; i < posts.length; i++) {
            var date = parseDate(posts[i].date);
            var eventDate = new Date(date);
            var imageExists = checkImage(posts[i].image);
            var description = posts[i].content.split(' ', 60).join(' ') + '...';
            var image = imageExists ? 'images/social/' + posts[i].image : 'images/social/post.jpg';
            var postDiv = $("#" + currentTab + 'Container > div:first-child').clone();
            var dateDiv = postDiv.children(':first-child').children('p');
            postDiv.find('.img-article').children('img').attr('src', image)
                .parent().children('h4').text(posts[i].title)
                .parent().children('p.text-justify').text(description)
            postDiv.find('.event-label-category').children('p').text(posts[i].category);
            dateDiv.text(date);
            container.append(postDiv);
            var totalShown = container.children('div').length;

            switch (currentTab) {
                case 'technology':
                    if (totalShown >= totalTechs) {
                        $("#moreTechBtn").hide();
                    }
                    break;
                case 'news':
                    if (totalShown >= totalNews) {
                        $("#moreNewsBtn").hide();
                    }
                    break;
                default:
                    if (totalShown >= totalItems) {
                        $("#moreItemsBtn").hide();
                    }
                    break;
            }

            //            if (currentTab === 'technology') {
            //                if (totalShown >= totalTechs) {
            //                    $("#moreTechBtn").hide();
            //                }
            //            } else if (currentTab === 'news') {
            //                if (totalShown >= totalNews) {
            //                    $("#moreNewsBtn").hide();
            //                }
            //            }
        }
    }
    if($("#detailPost").length > 0){
       var section = $("#detailPost").data('section').toLowerCase();
       $(".right-categories-options a").each(function(){
            $(this).removeClass('active');
            if(section === $(this).data('target')){
                $(this).addClass('active')
            }else if($(this).data('target') === 'events' && section === ''){
                    $(this).addClass('active')
                
            }
       })
    }
    $(window).scrollTop($("#tabs"))
    function parseDate(date) {
        var newDate = date.split('-');
        var year = newDate[0].substr(2);
        var month = parseInt(newDate[1]);
        var day = parseInt(newDate[2]);
        return month + '/' + day + '/' + year;
    }

    function checkImage(url) {
        if (url !== '') {
            $.get('images/social/' + url).done(function() {
                return true;
            }).fail(function() {
                return false;
            });
        } else {
            return false;
        }
    }
});