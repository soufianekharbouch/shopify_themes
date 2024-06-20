$(document).ready(() => {
    $('.article_carousel_wrap').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        nav: true,
        navText: [$('.customPrevBtn'), $('.customNextBtn')],
        margin: 0,
        dotsEach: 1,
        dots: false,
        loop: true,
        responsiveClass:true,
        responsive:{
            0: {
                items: 2,
            },
            768: {
                items: 3,
            }
        }
    });
});
