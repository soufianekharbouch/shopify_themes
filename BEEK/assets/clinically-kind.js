$(document).ready(function () {
  (function ($) {
    var mq = window.matchMedia('(min-width: 1024px)');

    function destroyFactorsSlider() {
      if ($('.factors__wrap').data('owl.carousel')) {
        $('.factors__wrap').owlCarousel('destroy').removeClass('owl-carousel');
      }
    }

    function initFactorsSlider() {
      $('.factors__wrap').addClass('owl-carousel').owlCarousel({
        center: false,
        dots: true,
        nav: false,
        dotsEach: 1,
        loop: false,
        stagePadding: 47,
        items: 1,
        margin: 23,
        responsive: {
          576: {
            items: 2,
          },
          1024: {
            items: 3,
          },
        },
      });
    }

    function checkMQ() {
      if (mq.matches) {
        destroyFactorsSlider();
      } else {
        initFactorsSlider();
      }
    }

    checkMQ();
    $(window).on('resize', function () {
      checkMQ();
    });
  })(jQuery);
});
