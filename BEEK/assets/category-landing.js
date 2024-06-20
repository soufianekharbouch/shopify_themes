$(document).ready(function () {
  var mq = window.matchMedia('(min-width: 768px)');

  $('.carousel__wrap').addClass('owl-carousel').owlCarousel({
    autoWidth: false,
    dots: true,
    nav: true,
    margin: 0,
    dotsEach: 1,
    items: 1,
    rewind: true,
    loop: false
  });

  function viewMoreMobile() {
    if ($('.shop_category-wrap .category__list li').length > 3 && !$('.category__list .view__more').length) {
      $('.shop_category-wrap .category__list').append('<a href="#" class="view__more">view <span class="less">less</span><span class="more">more</span></a>');
    }
    if ($('.category__list .more__items-wrap li').length) {
      $('.category__list .more__items-wrap li').each(function () {
        $('.category__list .items').append($(this));
      })
    }
  }

  $(document).on('click', '.view__more', function (e) {
    e.preventDefault();
    $('.shop_category-wrap .category__list').toggleClass('show__all');
  });

  function viewMoreDesktop() {
    if ($('.shop_category-wrap .category__list li').length > 3 && !$('.category__list .view__more').length) {
      $('.shop_category-wrap .category__list')
        .append('<a href="#" class="view__more">view <span class="less">less</span><span class="more">more</span></a>')
        .append('<ul class="more__items-wrap"></ul>');
      do {
        var elementTags = $('.category__list .items li'),
          elementToggles = $('.category__list .items'),
          widthTags = 0,
          elementMore = $('.category__list .view__more');

        elementTags.each(function () {
          widthTags += $(this).outerWidth(true);
        });

        var widthToggles = elementToggles.innerWidth();

        if (widthTags > widthToggles) {
          var last = elementTags.last();
          $('.more__items-wrap').prepend(last);
          elementMore.show();
        }
      } while (widthTags > widthToggles);

      $(window).resize(function () {
        var elementTags = $('.category__list .items li'),
          elementToggles = $('.category__list .items'),
          elementMore = $('.category__list .view__more'),
          elementMoreTags = $('.more__items-wrap li'),
          widthTags = 0;
        elementTags.each(function () {
          widthTags += $(this).outerWidth(true);
        });

        var widthToggles = elementToggles.outerWidth(),
          widthMoreItem = 180;
        if ($('#artisan-collection').length && $(window).width() > 1120) {
          widthMoreItem = 70;
        } else {
          widthMoreItem = 180
        }

        if (widthTags >= widthToggles) {
          var last = elementTags.last();
          $('.more__items-wrap').prepend(last);
          elementMore.show();
        } else if (((widthToggles - widthTags) > widthMoreItem)) {
          var firstMore = elementMoreTags.first();

          elementToggles.append(firstMore);
          elementMoreTags = $('.more__items-wrap li');
          if (elementMoreTags.length === 0) {
            elementMore.hide();
          }
        }
      });
    }
  }

  //concern carousel

  function destroyConcern() {
    if ($('.concern__carousel').data('owl.carousel')) {
      $('.concern__carousel').owlCarousel('destroy').removeClass('owl-carousel');
    }
  }

  function initConcern() {
    if ($('.concern__carousel .item').length > 4) {
      $('.concern__carousel .item').removeClass('col-md-3');
      $('.concern__carousel').removeClass('row').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        dots: false,
        nav: true,
        margin: 0,
        items: 4,
        rewind: true,
        loop: false
      });
    }
  }

  function checkMQ() {
    if (mq.matches) {
      viewMoreDesktop();
      initConcern();
    } else {
      viewMoreMobile();
      destroyConcern();
    }
  }

  checkMQ();
  $(window).on('resize', function () {
    checkMQ();
  })
});