$(document).ready(function () {
  (function ($) {

    var largeMQ = window.matchMedia('(min-width: 1024px)'),
      mediumMQ = window.matchMedia('(min-width: 576px)');

    $(document).on('click', '.scent__notes .note', function(e) {
      showSlider($(e.currentTarget), 'note');
    });
    $(document).on('click', '.action__wrap .shop__by', handleHeroButtons);
    $(document).on('click', '.item .strength__name', slideToStrength);

    function strengthSliderInit() {
      var strengthItemsAmount = $('.scent__strength .item').length,
        strengthSlider = document.getElementById('strengthSlider');
      if (strengthItemsAmount) {
        var pipsValues = [],
          pipWidth = 100 / strengthItemsAmount;

        for (var i = 1; i <= strengthItemsAmount; i++) {
          pipsValues.push(i * pipWidth);
        }

        window.noUiSlider.create(strengthSlider, {
          connect: [true, false],
          range: {
            min: 0,
            max: 100,
          },
          pips: {
            mode: 'positions',
            values: pipsValues,
            density: 4,
          },
          start: [pipWidth / 2],
        });

        strengthSlider.noUiSlider.on('change', function(values) {
          handleStrengthChange(values, pipsValues);
        });
        strengthSlider.noUiSlider.on('set', function(values) {
          showStrengthSlider(values, pipsValues);
        });
      }
    }

    function showStrengthSlider(values, arr) {
      var strengthIndex = arr.findIndex(function(el) {
        return el.toFixed(2) === values[0];
      });
      var scent = $('.scent__strength .item[data-index="'+strengthIndex+'"]');
      var desc = scent.find('.strength__desc').text();
      showSlider(scent, 'strength', desc);
    }

    function handleStrengthChange(values, arr) {
      var strengthSlider = document.getElementById('strengthSlider');
      strengthSlider.noUiSlider.set(closest(values[0], arr));
    }

    function closest(num, arr) {
      var curr = arr[0];
      var diff = Math.abs (num - curr);
      for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
          diff = newdiff;
          curr = arr[val];
        }
      }
      return curr;
    }

    function slideToStrength(e) {
      var strengthItemsAmount = $('.scent__strength .item').length,
        strengthSlider = document.getElementById('strengthSlider'),
        availableVals = [],
        currentIndex = $(e.currentTarget).parent().data('index'),
        strengthWidth = 100 / strengthItemsAmount;

        for (var i = 1; i <= strengthItemsAmount; i++) {
          availableVals.push(i * strengthWidth);
        }

      strengthSlider.noUiSlider.set(availableVals[currentIndex]);
    }

    function handleHeroButtons(e) {
      if ($(e.currentTarget).attr('href') === '#') {
        e.preventDefault();

        setTimeout(function () {
          $('html, body').stop();
        }, 800)
        $('html, body').animate({
          scrollTop: $('.'+$(e.currentTarget).data('scroll-to')).offset().top - 100
        }, 800, 'linear');
      }
    }

    function showSlider(scent, type, desc = '') {
      var sliderToShow = $('.fragrances__by__'+type+'.'+scent.data('scent')),
        spinner = scent.parents('.fr__scent__wrap').find('.spinner__wrap');
      $('.scent__notes .note').removeClass('active');
      scent.addClass('active');
      spinner.show();

      setTimeout(function() {
        $('.fragrances__by__'+type).removeClass('active');
        sliderToShow.addClass('active');
        if (type === 'strength') {
          $('.mob__description').text(desc);
        }
        spinner.hide();
      }, 1000);
    }

    function getMinSlidesAmount() {
      var minSlides;

      if (mediumMQ.matches && !largeMQ.matches) {
        minSlides = 2;
      } else if (largeMQ.matches) {
        minSlides = 3;
      } else {
        minSlides = 1;
      }

      return minSlides;
    }

    function initFragranceSliders() {
      var minAmount = getMinSlidesAmount();
      $('.slider__wrap').each(function(i, el) {
        if ($(el).find('.frag__item').length > minAmount) {
          $(el).addClass('owl-carousel').owlCarousel({
            center: false,
            dots: true,
            nav: true,
            dotsEach: 1,
            loop: false,
            items: 1,
            margin: 0,
            responsive: {
              576: {
                items: 2,
              },
              1024: {
                items: 3,
              },
            },
          });
        } else {
          if ($(el).data('owl.carousel')) {
            $(el).owlCarousel('destroy').removeClass('owl-carousel');
          }
        }
      });
    }

    initFragranceSliders();
    strengthSliderInit();
    $(window).on('resize', function () {
      initFragranceSliders();
    });
  })(jQuery);
});
