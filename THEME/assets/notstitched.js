jQuery(document).ready(function ($) {
  checkLan();
  $(".ar_switcher").click(function (e) {
    e.preventDefault();
    let url = window.location.href;
    url = url.replace(".com/", ".com/ar/");
    window.location.href = url;
  });
  $(".en_switcher").click(function (e) {
    e.preventDefault();
    let url = window.location.href;
    url = url.replace(".com/ar", ".com");
    window.location.href = url;
  });

  jQuery(document).on("click", function (e) {
    if (
      !jQuery(event.target).parents(".product-size_detail").length &&
      jQuery("body").hasClass("open-slide") &&
      !jQuery(event.target).hasClass("product_size-button") &&
      !jQuery(event.target).parents(".product_size-button").length &&
      !jQuery(event.target).hasClass("product-size_detail")
    ) {
      jQuery(".close-btn").trigger("click");
    }
  });

  // accordiation
  $(".accordion").click(function () {
    $(this).toggleClass("active").next(".panel").slideToggle();
  });

  $(".product-info__accordion")
    .first()
    .find(".product-info__accordion-button")
    .addClass("active");
  $(".product-info__accordion")
    .first()
    .find(".product-info__accordion-button")
    .next()
    .slideDown(500);
  $(".product-info__accordion .product-info__accordion-button").click(
    function () {
      $(".product-info__accordion .product-info__accordion-button")
        .not($(this))
        .removeClass("active");
      $(".product-info__accordion .product-info__content")
        .not($(this).next())
        .slideUp();
      $(this).toggleClass("active");
      $(this).next().slideToggle(500);
    }
  );

  $(".product-info__accordion .product_size-button").on("click", function (e) {
    e.preventDefault();
    $("body").toggleClass("open-slide");
  });
  $(".close-btn").on("click", function (e) {
    e.preventDefault();
    $("body").toggleClass("open-slide");
  });

  // console.log("meadia",window.matchMedia("(max-width:499px)").matches)
  if (window.matchMedia("(max-width:699px)").matches) {
    $(".footer__block-list .footer__block--links")
      .first()
      .find(".footer__block-list .footer__block--links p.h6")
      .addClass("active");
    $(".footer__block-list .footer__block--links")
      .first()
      .find(".footer__block-list .footer__block--links p.h6")
      .next()
      .slideDown(500);
    $(".footer__block-list .footer__block--links p.h6").click(function (e) {
      e.preventDefault();
      $(".footer__block-list .footer__block--links p.h6")
        .not($(this))
        .removeClass("active");
      $(".footer__block-list .footer__block--links ul")
        .not($(this).next())
        .slideUp();
      $(this).toggleClass("active");
      $(this).next().slideToggle(500);
    });
  }
  $(".custom_link").on("click", function (e) {
    e.preventDefault();
    console.log("hello");
    let redirect = $(this).attr("href");
    window.location.replace("https://www.notstitched.com" + redirect + "");
  });

  // if(window.matchMedia("(max-width:499px)").matches && $('.home_page_custom')){
  //   console.log("hello")
  //   $('.product-list .product-card')

  // }

  let scrollTemp = 1;

  $(".product-gallery__carousel .product-gallery__media").bind(
    "mousewheel",
    function (e) {
      e.preventDefault();
      if (e.originalEvent.wheelDelta / 120 > 0) {
        scrollTemp
          ? $('.page-dots .tap-area[aria-current="true"]')
              .prev()
              .trigger("click")
          : "";
        scrollTemp = 0;
        setTimeout(function () {
          scrollTemp = 1;
        }, 1000);
      } else {
        scrollTemp
          ? $('.page-dots .tap-area[aria-current="true"]')
              .next()
              .trigger("click")
          : "";
        scrollTemp = 0;
        setTimeout(function () {
          scrollTemp = 1;
        }, 1000);
      }
    }
  );

  // bread crumb
  $(".product-card").on("click", function (e) {
    let test = $(".prose .h1").html();
    let product_handle = $(this).attr("data-href");
    let product_name = $(this).attr("data-name");

    localStorage.setItem("prod_href", product_handle);
    localStorage.setItem("prod_name", product_name);
    // setTimeout()
  });

  let demo = localStorage.getItem("prod_href");
  let coll_name = localStorage.getItem("prod_name");
  if (demo && coll_name ) {
    console.log("data", demo);
    $(".breadcrumb__list-item .custom").html(coll_name);
    $(".breadcrumb__list-item .custom").attr("href", "/collections/" + demo);
  }

  jQuery(
    ".header-sidebar__main-panel .header-sidebar__linklist [aria-controls]"
  ).on("click", function (e) {
    jQuery(this).parents("li").toggleClass("active");
    const has_class = jQuery(this).parents("li").hasClass("active");
    !has_class
      ? jQuery(this)
          .siblings("ul")
          .find('details[is="accordion-disclosure"]')
          .removeAttr("open")
      : "";

    jQuery(this).siblings('ul[role="list"]').slideToggle().show();
  });

  var interval = setInterval(doStuff, 2000);
  function doStuff() {
    const actionVal = $("#predictive-search-form").attr("action");
    const actionVal1 = $("#predictive-search-form1").attr("action");
    if (actionVal.includes("/a/search")) {
      $("#predictive-search-form").attr(
        "action",
        actionVal.replace("/a/", "/")
      );
      clearInterval(interval);
    }
    if (actionVal1.includes("/a/search")) {
      $("#predictive-search-form1").attr(
        "action",
        actionVal.replace("/a/", "/")
      );
      clearInterval(interval);
    }
  }
  // setTimeout(clearInterval(interval),20000)

  // var interval1 = setInterval(doStuff1, 1000);
  $(document).on("click", '[aria-controls="facets-drawer"]', function (e) {
    e.preventDefault();
    doStuff1();
    var interval = setInterval(doStuff, 2000);
  });

  function doStuff1() {
    const facets = $('form[is="facets-form"]').attr("action");
    if (facets.includes("/a/search")) {
      $('form[is="facets-form"]').attr("action", facets.replace("/a/", "/"));
    }
  }

  setTimeout(function(){
  const product_info = jQuery(".product-info").attr("customer_id");
    if (!product_info) {
      if (jQuery(".swym-wishlist-button-bar").length) {
        jQuery(".swym-wishlist-button-bar").remove();
      }
    }
  },3000)
});

jQuery(window).on("load resize", function ($) {
  const myInterval = setInterval(myTimer, 1000);

  function myTimer() {
    const date = new Date();
    if (jQuery(".buckscc-select").length > 0) {
      jQuery(".buckscc-currency-box").removeClass("currency-hidden");
      jQuery(".buckscc-select").removeAttr("style");
      // console.log('in')
      clearInterval(myInterval);
    }
  }
});

function checkLan() {
  const lan = jQuery("html").attr("lang");
  if (lan == "ar") {
    // jQuery('.tooltiptext').html('إضافة سريعة')
    jQuery(".ar_switcher").parents("li").hide();
    jQuery(".en_switcher").parents("li").show();
  } else if (lan == "en") {
    // jQuery('.tooltiptext').html('Quick Add')
    jQuery(".en_switcher").parents("li").hide();
    jQuery(".ar_switcher").parents("li").show();
  }
}

var wish_interval = setInterval(wishlistCheck, 1000);

function wishlistCheck() {
  const product_info = jQuery(".product-info").attr("customer_id");
  if (!product_info) {
    if (jQuery(".swym-wishlist-button-bar").length) {
      console.log("iffff",jQuery(".swym-wishlist-button-bar").length);
      jQuery(".swym-wishlist-button-bar").remove();
      setTimeout(jQuery(".swym-wishlist-button-bar").remove(), 1500);
      clearInterval(wish_interval);
    }
  } else {
    console.log("else");
    setTimeout(clearInterval(wish_interval), 20000);
  }
}
function wish_clear_interval() {
  clearInterval(wish_interval);
}
setTimeout(wish_clear_interval, 20000);
