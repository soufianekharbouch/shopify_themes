$(document).ready(function() {
  var media = window.matchMedia( '(max-width: 767px)');

  $(document).on('click', '.view__products', function (e) {
    e.preventDefault();
    if ($(this).hasClass('active')) {
      $(this).parents('.expert__wrap').next('.products-wrap').slideUp();
      $(this).removeClass('active');
      $(this).parents('.expert__wrap').removeClass('active');
    } else {
      $('.view__products').removeClass('active');
      $('.expert__wrap').removeClass('active');
      $(this).addClass('active');
      $(this).parents('.expert__wrap').addClass('active');
      $('.products-wrap').slideUp();
      $(this).parents('.expert__wrap').next('.products-wrap').slideDown();
    }
  });

  //product carousels

  function destroySliders() {
    if ($('.product__carousel').data('owl.carousel')) {
      $('.product__carousel').owlCarousel('destroy').removeClass('owl-carousel');
      $('.product__carousel .product__item').addClass('col-sm-4');
      $('.product__carousel').addClass('row');
    }
  }

  function initSliders() {
    if($('.product__carousel .product__item').length >= 1) {
      $('.product__carousel .product__item').removeClass('col-sm-4');
      $('.product__carousel').removeClass('row').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        dots: false,
        nav: true,
        margin: 0,
        items: 1,
        rewind: true,
        loop: false
      });
    }
  }

  function checkMQ() {
    if (media.matches) {
      initSliders();
    } else {
      destroySliders();
    }
  }

  checkMQ();
  $(window).on('resize', function () {
    checkMQ();
  })
});
