$(document).ready(function() {
    var mq = window.matchMedia( '(min-width: 1024px)');

  $(document).on('click', '.thumbnails .thumb__control', function (e) {
    e.preventDefault();
    $('.thumbnails .thumb__control').removeClass('active');
    $('.carousel__wrap .slide').removeClass('active');
    $(this).addClass('active');
    var imgId = $(this).data('image-id');
    $('.carousel__wrap').find('[data-image-id='+imgId+']').addClass('active');
  });

  var calculateSaveAmount = function () {
    if($('.rc_block__type__autodeliver').hasClass('rc_block__type--active')) {
      setTimeout(function () {
        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        });
        var percent = $('.rc_label__discount').data('percent-amount');
        var percentText = $('.rc_label__discount').text();
        var initialPrice = parseFloat($('.rc_price__onetime').text().substring(1));
        var savePrice = (initialPrice * percent) / 100;
        savePrice = formatter.format(savePrice);
        $('.price__wrap .save__info .s_percent').text(percentText);
        $('.price__wrap .save__info .s_amount').text(savePrice);
        $('.price__wrap .save__info').css('display', 'inline-block');
      }, 300);
            $('.product__price2').css({display:"none"});
            $('.productPriceStrike').css({textDecoration:"none"});
    } else {
      $('.product__price2').css({display:"inline-block"});
      $('.productPriceStrike').css({textDecoration:"line-through"});
      $('.price__wrap .save__info').hide();
     
    }
  };

  $(document).on('click', 'input[name=variant_togler]', function(){
    $('.variants__selector').val($(this).val()).trigger('change');

    var sizeL = $(this).data('alt-label');
    $('.sizes-info .val').text(sizeL);
    calculateSaveAmount();
  });

  $(document).on('click', '.rc_radio', function(){
    calculateSaveAmount();
  });

  function checkMQ() {
    if (mq.matches) {
      if ($('.carousel__wrap').data('owl.carousel')) {
          $('.carousel__wrap').owlCarousel('destroy').removeClass('owl-carousel');
      }
    } else {
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
    }
  }

  checkMQ();
  $(window).on('resize', function () {
      checkMQ();
  });

  $('.u2be_video').on('click', function(e) {
    e.preventDefault();
    var link = $(e.target).closest('.u2be_video').data('video');
    var $modalOverlay = $('.modal_wrap_overlay');
    var $headerSection = $('.header__section');
    var str = '';
    if (!link.match('.mp4')) {
      link += '?modestbranding=1&rel=0&controls=1&showinfo=0&html5=1&autoplay=1';
      str = '<iframe width="100%" height="550" src="' + link + '" frameborder="0" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>';
    } else {
      str = '<video autoplay width="100%" height="550" controls><source src="' + link + '" type="video/mp4"></video>';
    }
    $modalOverlay.addClass('active');
    $headerSection.addClass('modal_is_opened');
    $('#u2be_inner').append(str);
    $('.close_u2be').on('click', function(e) {
      e.preventDefault();
      $modalOverlay.removeClass('active');
      $headerSection.removeClass('modal_is_opened');
      if (!link.match('.mp4')) {
        $modalOverlay.find('iframe').remove();
      } else {
        $modalOverlay.find('video').remove();
      }
    });
  });
});
