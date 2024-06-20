/*
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/
$.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};

/*============================================================================
  Header
==============================================================================*/
var header = {
  init: function(){
    /* Announcement Bar */
    if ($('.js__bar').length) {
      var announcement_bar = $.cookie('announcement_bar');

      if (announcement_bar != 'hidden') {

        $('body').addClass('announcement_bar-visible');
        $('.announcement__bar').on('click', '.bar__close', function(e){
          e.preventDefault();
          $('body').removeClass('announcement_bar-visible');
          $('.announcement__bar').remove();
          $.cookie('announcement_bar', 'hidden', { expires: 7 });
          header.updateHeaderHeight();
        });
      }
    }

    /* Header toggles */
    $(document).on('click', '.toggle-btn', function (e) {
      if ($(e.currentTarget).hasClass('active') && $(e.currentTarget).attr('data-toggle-for') === 'cartOverlay') {
        return;
      }
      e.preventDefault();
      $(e.currentTarget).toggleClass('current');
      window._fwn.player.close()
      
      if ($(e.currentTarget).attr('data-toggle-for') === 'cartOverlay') {
        $('iframe#launcher').fadeOut();
      }

      if ($(e.currentTarget).attr('data-toggle-for') === 'verticalMobileNav') {
        $('.menu-icon').toggleClass('left-slide-close-icon');
        $('#overlay').toggleClass('overlay-shown');
      }
      $('.header').removeClass('search__active');

      if ($('.toggle-btn.active').length && !$('.toggle-btn.active').hasClass('current')) {
        var prev = $('.toggle-btn.active').attr('data-toggle-for');
        $('body').removeClass('lock-scroll');
        $('html').removeClass('lock-scroll');
        $('.toggle-btn.active').toggleClass('active');
        $('#'+prev).toggleClass('is-visible');
      }

      $(e.currentTarget).toggleClass('active');
      $(e.currentTarget).toggleClass('current');
      var target = $(e.currentTarget).attr('data-toggle-for');
      $('#'+target).toggleClass('is-visible');

      $('body').toggleClass('lock-scroll');
      $('html').toggleClass('lock-scroll');

      /* open first menu items list when menu block opens first time */
      var mainMenuItems = $('.globomenu-main > .globomenu-item');
      if (!mainMenuItems.hasClass('globomenu-active') && $(window).width() < 768 && target === 'megaMenu') {
        mainMenuItems.eq(0).addClass('globomenu-active');
      }
      if($(e.currentTarget).attr('data-toggle-for') === 'search-popup' && $(e.currentTarget).hasClass('active')) {
        $('#search-popup input[type="search"]').focus();
        $('.header').addClass('search__active');
      }
    });

    $(document).on('click', '.close-btn-cart', function(e) {
      e.preventDefault();
      $('#cartOverlay').toggleClass('is-visible');
      $('#cartOverlay-button').toggleClass('active');
      $('body').toggleClass('lock-scroll');
      $('html').toggleClass('lock-scroll');
      $('iframe#launcher').fadeIn();
    });
     /* close mobile menu if you touch overlay */
     $(document).on('click', '#overlay', function(e) {
      e.preventDefault();
      const menuIcon = $('.menu-icon');
      $('.mobile-menu').toggleClass('is-visible');
      $('#overlay').toggleClass('overlay-shown');
      menuIcon.toggleClass('left-slide-close-icon');
      menuIcon.toggleClass('active');
      $('body').removeClass('lock-scroll');
      $('html').removeClass('lock-scroll');
    });
  },
  klavioLoader: function() {
    var klavioScript = '<script type="text/javascript" data-type="xeo" async="" src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=MHYvqv&amp;shop=beekman1802.myshopify.com"></script>';
    if (typeof window.__klKey === 'undefined') {
      $('body').append(klavioScript);
    }
  },
  updateHeaderHeight: function () {
    /*Header spaces*/

    setTimeout(function() {
      var headerH = $('.header__section').outerHeight();
      $('#shopify-section-header').css('min-height', headerH/10 +'rem');
    }, 300);
  },
  stickyHeader: function () {
    /* sticky header when scroll on top */
    const stickyTop = $('header').offset().top;
    $('body').scroll(function() {
      const windowTop = $('body').scrollTop();
      if (stickyTop < windowTop) {
        $('.sticky-header').css('position', 'fixed');
      } else {
        $('.sticky-header').css('position', 'relative');
      }
    });
  }
};

$(document).ready(function() {
  header.init();
  header.updateHeaderHeight();
  header.klavioLoader();
  header.stickyHeader();
});
$(window).on('resize', function () {
  header.updateHeaderHeight();
});
