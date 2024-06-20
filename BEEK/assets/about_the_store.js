$(document).ready(() => {
    $('.store_carousel_wrap').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        nav: true,
        navText: [$('.customPrevBtn'), $('.customNextBtn')],
        margin: 0,
        dotsEach: 1,
        items: 1,
        loop: false,
        dots: false,
           
    });
});
