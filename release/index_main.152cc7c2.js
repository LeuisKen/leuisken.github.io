(function($){
    $(function(){
        $('.other-sites img').hover(function(){
            var src = $(this).attr('src');
            src = src.substr(0, src.length-4) + '_hover.png';
            $(this).attr('src', src);
        }, function() {
            var src = $(this).attr('src');
            src = src.substr(0, src.length-10) + '.png';
            $(this).attr('src', src);

        });
    });
})(jQuery);