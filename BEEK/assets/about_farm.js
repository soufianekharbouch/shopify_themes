$(document).ready(() => {
    $('.farm_carousel_wrap').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        nav: true,
        navText: [$('.customPrevBtn'), $('.customNextBtn')],
        margin: 0,
        dotsEach: 1,
        items: 1,
        dots: false,
        loop: false,
        onInitialized  : counter, // When the plugin has initialized.
        onTranslated : counter, // When the translation of the stage has finished.            
    });
    function counter(event) {
        var items     = event.item.count;
        var item      = event.item.index + 1;
       
       // it loop is true then reset counter from 1
       if(item > items) {
         item = item - items
       }
       $('#counter').html("("+item+" / "+items+")")
    }
});

$(document).ready(() => {
    $('.farm_carousel_wrap2').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        nav: true,
        navText: [$('.customPrevBtn2'), $('.customNextBtn2')],
        margin: 0,
        dotsEach: 1,
        items: 1,
        dots: false,
        loop: false,
    });
});
