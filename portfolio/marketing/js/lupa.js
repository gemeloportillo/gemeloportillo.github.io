// Magnifying glass effect — reads naturalWidth/Height from the rendered <img>
// so it works on first hover without waiting for async image load.
$(document).ready(function(){

    function initMagnify(magnifyClass, largeClass) {
        $(magnifyClass)
            .on('mousemove', function(e) {
                var $container = $(this);
                var $img       = $container.find('img.small');
                var nw = $img[0].naturalWidth;
                var nh = $img[0].naturalHeight;
                if (!nw || !nh) return;

                var offset = $container.offset();
                var mx = e.pageX - offset.left;
                var my = e.pageY - offset.top;
                var $glass = $(largeClass);

                if (mx > 0 && mx < $container.width() && my > 0 && my < $container.height()) {
                    $glass.fadeIn(100);
                } else {
                    $glass.fadeOut(100);
                    return;
                }

                var rx = Math.round(mx / $img.width()  * nw - $glass.width()  / 2) * -1;
                var ry = Math.round(my / $img.height() * nh - $glass.height() / 2) * -1;
                $glass.css({
                    left:               mx - $glass.width()  / 2,
                    top:                my - $glass.height() / 2,
                    backgroundPosition: rx + 'px ' + ry + 'px'
                });
            })
            .on('mouseleave', function() {
                $(largeClass).fadeOut(100);
            });
    }

    initMagnify('.magnify',   '.large');
    initMagnify('.magnify2',  '.large2');
    initMagnify('.magnify3',  '.large3');
    initMagnify('.magnify4',  '.large4');
    initMagnify('.magnify5',  '.large5');
    initMagnify('.magnify6',  '.large6');
    initMagnify('.magnify7',  '.large7');
    initMagnify('.magnify8',  '.large8');
    initMagnify('.magnify9',  '.large9');
    initMagnify('.magnify10', '.large10');
    initMagnify('.magnify11', '.large11');
    initMagnify('.magnify12', '.large12');
});
