$(document).ready(() => {
  $('.nl__carousel__wrap').addClass('owl-carousel').owlCarousel({
    autoWidth: false,
    dots: false,
    nav: true,
    navText: [$('.customPrevBtn'), $('.customNextBtn')],
    margin: 0,
    dotsEach: 1,
    items: 1,
    loop: true,
    lazyLoad:true
  });
});
