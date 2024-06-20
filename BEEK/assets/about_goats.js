$(document).ready(() => {
    $('.goats_carousel_wrap').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        nav: true,
        navText: [$('.customPrevBtn'), $('.customNextBtn')],
        margin: 0,
        dotsEach: 1,
        items: 1,
        responsiveClass:true,
        responsive:{
            0: {
                loop: true,
                dots: true,
            },
            992: {
                loop: false,
                dots: false,
            }
        }
    });
});
