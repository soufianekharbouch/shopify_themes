var onSale = false;
var soldOut = false;
var priceVaries = false;
var images = [];
var firstVariant = {};
// Override Settings
var bcSfFilterSettings = {
  general: {
    limit: bcSfFilterConfig.custom.products_per_page,
    /* Optional */
    loadProductFirst: true
  }
};

BCSfFilter.prototype.afterGetFilterData = (function (_afterGetFilterData, $) {
  return function () {
    var url = (___PRIVATE_APP_URL ? ___PRIVATE_APP_URL : location.protocol + '//' + this.shopDomain)
      + 'metadata/products/';
    var productIds = $.map(arguments[0].products, function (i) {
      return i.id;
    });

    $.get((url + productIds.join(',')), {
      accentuate: ['short_description', 'custom_name', 'is_subscription_product', 'product_label']
    }).then($.proxy(function (result) { this.__storedData = result; }, this))
      .then(Function.apply.bind(_afterGetFilterData, this, arguments))
      .fail(Function.apply.bind(_afterGetFilterData, this, arguments));
  }
})(BCSfFilter.prototype.afterGetFilterData, jQuery);

// Declare Templates
var bcSfFilterTemplate = {
  'soldOutClass': ' sold-out',
  'saleClass': ' on-sale',
  'vendorHtml': '<p class="bc-sf-filter-product-item-vendor">{{itemVendorLabel}}</p>',
  // Grid Template
  'productGridItemHtml': '<div data-section-type="product" class="product__wrap {{gridWidthClass}}{{soldOutClass}}{{saleClass}} {{itemActiveSwapClass}}">' + //bc-sf-filter-product-item bc-sf-filter-product-item-grid
    '<script class="bc-sf-filter-product-script" data-id="bc-product-json-{{itemId}}" type="application/json">{{itemJson}}</script>' +
    '<div class="bc-sf-filter-product-item-inner">' +
    '<div class="bc-sf-filter-product-item-image img__wrap">' +
    '{{productLabel}}' +
    '<a href="{{itemUrl}}" class="bc-sf-filter-product-item-image-link"><div class="responsive-image__wrapper">{{itemImages}}</div></a>' +
    '<a href="{{itemUrl}}" class="view__details">View Details</a>' +
    '<div class="variant__count">{{variantsCount}}</div> ' +
    '</div>' +
    '<div class="bc-sf-filter-product-bottom product__name">' +
    '<a href="{{itemUrl}}" class="bc-sf-filter-product-item-title product__name">{{itemTitle}}</a>' + // Or metafield!
    '<div class="short__desc">{{short_description}}</div>' + // product.metafields.accentuate.short_description
    '<div class="to-cart__wrapper">' +
    '<form action="/cart/add" method="post" enctype="multipart/form-data">' +
    '{{variantInputs}}{{qtyInput}}' +
    '<div data-price-wrapper class="price__wrap"><span data-product-price>{{itemPrice}}</span></div>' +
    '{{buyButton}}' +
    '</form>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>',
  'productListItemHtml': '',
  'previousActiveHtml': '<li><a href="{{itemUrl}}">&larr;</a></li>',
  'previousDisabledHtml': '<li class="disabled"><span>&larr;</span></li>',
  'nextActiveHtml': '<li><a href="{{itemUrl}}">&rarr;</a></li>',
  'nextDisabledHtml': '<li class="disabled"><span>&rarr;</span></li>',
  'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
  'pageItemSelectedHtml': '<li><span class="active">{{itemTitle}}</span></li>',
  'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
  'paginateHtml': '<ul>{{previous}}{{pageItems}}{{next}}</ul>',
  'sortingHtml': '<select id="sort-by" class="sort-by-select">{{sortingItems}}</select>' +
    '<div class="arrow-wrap">' +
    '<svg width="12" height="6" viewBox="0 0 12 6"><polygon fill="#4A5761" points="0 0 5.394 5.394 0 10.787" transform="rotate(90 5.5 6)"/></svg>' +
    '</div>',
  'showLimitHtml': '',
  // Breadcrumb Template
  'breadcrumbHtml': '<a href="/">' + bcSfFilterConfig.label.breadcrumb_home + '</a> {{breadcrumbDivider}} {{breadcrumbItems}}',
  'breadcrumbDivider': '<span class="divider">/</span>',
  'breadcrumbItemLink': '<a href="{{itemLink}}">{{itemTitle}}</a>',
  'breadcrumbItemSelected': '<span>{{itemTitle}}</span>'
};
function reAssignPricing(data) {
  var minPriceWithoutGifts,
      excludeFreeGifts;
  if(!data.variants || !Array.isArray(data.variants)) {
    return data;
  }
  excludeFreeGifts = Array.prototype.filter.call(data.variants, function(v){
    try {
      return !~v.option_title.indexOf('% off)');
    } catch (e) {
      return true;
    }
  });
  // there is no free gifts, out of trap
  if(excludeFreeGifts.length === data.variants.length) {
    return data;
  }

  minPriceWithoutGifts = Math.min.apply(null, excludeFreeGifts.map(function (v) {
    return v.price;
  }));

  data.price_min = minPriceWithoutGifts;
  data.price_varies = data.price === data.compare_at_price;
  data.price = data.compare_at_price;

  return data;
}

/************************** CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
function prepareShopifyData(data) {
  data = reAssignPricing(data);
  // Displaying price base on the policy of Shopify, have to multiple by 100
  soldOut = !data.available; // Check a product is out of stock
  onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Convert images to array
  images = data.images_info;
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function (e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  return data;
}
/************************** END CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
/************************** BUILD PRODUCT LIST **************************/
// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function (data, index) {
  // Get Template
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;
  // Customize API data to get the Shopify data
  data = prepareShopifyData(data);
  // Add Custom class
  var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  var saleClass = onSale ? bcSfFilterTemplate.saleClass : '';
  itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);
  itemHtml = itemHtml.replace(/{{saleClass}}/g, saleClass);
  // Add Grid Width class
  itemHtml = itemHtml.replace(/{{gridWidthClass}}/g, buildGridWidthClass());
  // Add Images
  itemHtml = itemHtml.replace(/{{itemImages}}/g, buildImages(data));
  // Add Price
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, buildPrice(data));
  // Add Vendor
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, buildVendor(data));
  // itemActiveSwapClass
  var itemActiveSwapClass = bcSfFilterConfig.custom.active_image_swap ? 'has-bc-swap-image' : '';
  itemHtml = itemHtml.replace(/{{itemActiveSwapClass}}/g, itemActiveSwapClass);

  // Add data json
  var self = this;
  var itemJson = {
    "id": data.id,
    "title": data.title,
    "handle": data.handle,
    "vendor": data.vendor,
    "variants": data.variants,
    "url": self.buildProductItemUrl(data),
    "options_with_values": data.options_with_values,
    "images": data.images,
    "available": data.available,
    "price_min": data.price_min,
    "price_max": data.price_max,
    "compare_at_price_min": data.compare_at_price_min,
    "compare_at_price_max": data.compare_at_price_max
  };
  itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(itemJson));

  var customData = this.__storedData && this.__storedData[data.id] && this.__storedData[data.id].accentuate || {};

  // Add main attribute (Always put at the end of this function)
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, customData.custom_name ? customData.custom_name : data.title);
  itemHtml = itemHtml.replace(/{{productLabel}}/g, customData.product_label ? '<div class="product__label">'+customData.product_label+'</div>' : '');
  itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
  itemHtml = itemHtml.replace(/{{variantInputs}}/g, buildVariantInputs(data));
  itemHtml = itemHtml.replace(/{{qtyInput}}/g, buildQtyInput(data));
  itemHtml = itemHtml.replace(/{{buyButton}}/g, buildBuyBtn(data, this.buildProductItemUrl(data), customData.is_subscription_product ? true : false));
  itemHtml = itemHtml.replace(/{{variantsCount}}/g, buildVariantsCount(data));
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
  itemHtml = itemHtml.replace(/{{short_description}}/g, customData.short_description ? customData.short_description : '');
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));
  return itemHtml;
};
// Build Product List Item
BCSfFilter.prototype.buildProductListItem = function (data) {
  return '';
};
/************************** END BUILD PRODUCT LIST **************************/
/************************** BUILD PRODUCT ITEM ELEMENTS **************************/
function buildGridWidthClass() {
  var gridWidthClass = '';
  // On PC
  switch (bcSfFilterConfig.custom.products_per_row) {
    case 2:
      gridWidthClass = 'col-sm-6';
      break;
    case 3:
      gridWidthClass = 'col-sm-3';
      break;
    case 4:
        gridWidthClass = 'col-sm-4';
        break;
    case 6:
      gridWidthClass = 'col-sm-2';
      break;
    default:
      gridWidthClass = 'col-sm-3';
      break;
  }
  // On Mobile
  switch (bcSfFilterConfig.custom.products_per_row_mobile) {
    case 1:
      gridWidthClass += ' col-12';
      break;
    case 3:
      gridWidthClass += ' col-4';
      break;
    default:
      gridWidthClass += ' col-6';
      break;
  }
  return gridWidthClass;
}

function buildImages(data) {
  var html = '';
  // Build Main Image
  var thumbUrl = images.length > 0 ? bcsffilter.optimizeImage(images[0]['src']) : bcSfFilterConfig.general.no_image_url;
  html += '<img src="' + thumbUrl + '" class="responsive-image__image bc-sf-filter-product-item-main-image" />';
  // Build Image Swap
  if (bcSfFilterConfig.custom.active_image_swap) {
    var flipImageUrl = images.length > 1 ? bcsffilter.optimizeImage(images[1]['src']) : thumbUrl;
    html += '<img src="' + flipImageUrl + '" class="responsive-image__image bc-sf-filter-product-item-flip-image" />';
  }
  return html;
}

function buildVariantInputs(data) {
  var html = '';
  if (data.variants) {
    for (var i = 0; i < 1; i++) {
      var variant = data.variants[i];
      html += '<input type="hidden" id="variant-select" name="id" value="' + variant.id + '" />';
    }
  }
  return html;
}

function buildQtyInput(data) {
  return '<input type="hidden" id="Quantity-' + data.id + '" name="quantity" value="1" min="1">';
}

function buildBuyBtn(data, url, isSub) {
  var soldOutLabel = 'Sold Out';
  if (bcSfFilterConfig.label_basic.sold_out) {
    soldOutLabel = bcSfFilterConfig.label_basic.sold_out;
  }

  //     if (priceVaries) {
  //       return '<a href="'+url+'" class="add__to">' +
  //         '<span data-add-to-cart-text>' +
  //         (data.available ? 'Add To Cart': soldOutLabel) +
  //         '</span>' +
  //         '</a>';
  //     }

  if ((data.variants.length > 1) || isSub) {
    return '<a href="' + url + '" class="add__to">' +
      '<span>' +
      (data.available ? 'View Options' : soldOutLabel) +
      '</span>' +
      '</a>';
  }

  var inventoryPolicyContinue = false;
  for( i in data.variants ){
    if( data.variants[i].inventory_policy == 'continue' ){
      inventoryPolicyContinue = true;
      break;
    }
  }

  if( !inventoryPolicyContinue ){

    var url = (___PRIVATE_APP_URL ? ___PRIVATE_APP_URL : location.protocol + '//' + this.shopDomain) + 'metadata/quantities/';
    $.get((url + data.id))
        .then($.proxy(function (result) {
          if( result && result.hasOwnProperty( 'qty' ) && result.qty == 0 ){
            $('#buyBtn'+ data.id).attr( 'disabled', 'disabled' );
            $('#buyBtn'+ data.id +' span').replaceWith( '<span class="sold_out_product">' + soldOutLabel + '</span>' );
          }
        }, this));
  }

  if($('#selected_or_first_available_variant_'+data.handle).val()==="true")
  return '<button type="submit" name="add" class="add__to" id="buyBtn'+ data.selected_or_first_available_variant.id +'" data-add-to-cart>' +
    '<span data-add-to-cart-text>' +
      'Add To Cart' +
    '</span>' +
    '</button>';
    else
    return '<span class="sold_out_product">' + soldOutLabel + '</span>';
}
function buildVariantsCount(data) {
  if ((data.variants.length > 1)) {
    return '(' + data.variants.length + ') Sizes Available';
  }
  return '';
}

function buildVendor(data) {
  var html = '';
  if (bcSfFilterConfig.custom.show_vendor) {
    html = bcSfFilterTemplate.vendorHtml;
  }
  return html;
}

function buildPrice(data) {
  var html = '';
  if (bcSfFilterConfig.custom.show_price) {
    html = '<p class="bc-sf-filter-product-item-price">';
    if (onSale) {
      html += '<s>' + bcsffilter.formatMoney(data.variants[0].compare_at_price) + '</s> ';
      html += '<span class="bc-sf-filter-product-item-sale-price">' + bcsffilter.formatMoney(data.variants[0].price) + '</span>';
    } else {
      if (priceVaries) {
        html += (bcSfFilterConfig.label_basic.from) + ' ';
      }
      html += '<span class="bc-sf-filter-product-item-regular-price">' + bcsffilter.formatMoney(data.price_min) + '</span>';
    }
    html += '</p>';
  }
  return html;
}

/************************** END BUILD PRODUCT ITEM ELEMENTS **************************/
/************************** BUILD TOOLBAR **************************/
// Build Pagination
BCSfFilter.prototype.buildPagination = function (totalProduct) {
  // Get page info
  var currentPage = parseInt(this.queryParams.page);
  var totalPage = Math.ceil(totalProduct / this.queryParams.limit);
  // If it has only one page, clear Pagination
  if (totalPage == 1) {
    jQ(this.selector.pagination).html('');
    return false;
  }
  if (this.getSettingValue('general.paginationType') == 'default') {
    var paginationHtml = bcSfFilterTemplate.paginateHtml;
    // Build Previous
    var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
    previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
    paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);
    // Build Next
    var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextDisabledHtml;
    nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
    paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);
    // Create page items array
    var beforeCurrentPageArr = [];
    for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
      beforeCurrentPageArr.unshift(iBefore);
    }
    if (currentPage - 4 > 0) {
      beforeCurrentPageArr.unshift('...');
    }
    if (currentPage - 4 >= 0) {
      beforeCurrentPageArr.unshift(1);
    }
    beforeCurrentPageArr.push(currentPage);
    var afterCurrentPageArr = [];
    for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
      afterCurrentPageArr.push(iAfter);
    }
    if (currentPage + 3 < totalPage) {
      afterCurrentPageArr.push('...');
    }
    if (currentPage + 3 <= totalPage) {
      afterCurrentPageArr.push(totalPage);
    }
    // Build page items
    var pageItemsHtml = '';
    var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
    for (var iPage = 0; iPage < pageArr.length; iPage++) {
      if (pageArr[iPage] == '...') {
        pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
      } else {
        pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
      }
      pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
      pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
    }
    paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);
    jQ(this.selector.pagination).html(paginationHtml);
  }
};
BCSfFilter.prototype.buildFilterTreeMobileButton = function (a) {
  var b = !1;
  if (a.hasOwnProperty("filter") && a.filter.hasOwnProperty("options") && a.filter.options.length > 0) for (var c = a.filter.options, d = 0; d < c.length; d++) if (this.checkShowFilterOption(c[d])) {
    b = !0;
    break
  }
  if (b) {
    var e = this.getSelector("filterTreeMobile"), f = this.getSelector("filterTreeMobileButton"), g = !1,
      h = this.class.mobileButtonOpen, i = this.getSettingValue("label.refineMobile");
    jQ(f).hasClass(h) && (g = !0, i = this.getSettingValue("label.refineMobileCollapse"));
    var j = '<div id="bc-sf-filter-tree-mobile-button"><span>{{label}}</span><div class="arrow-wrap"><svg width="12" height="6" viewBox="0 0 12 6"><polygon fill="#4A5761" points="0 0 5.394 5.394 0 10.787" transform="rotate(90 5.5 6)"/></svg></div></div>'.replace(/{{label}}/g, i);
    jQ(e).html(j), g && jQ(f).addClass(h), this.buildFilterTreeMobileButtonEvent()
  }
};
// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function () {
  if (bcSfFilterConfig.custom.show_sorting && bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    jQ(this.selector.topSorting).html('');
    var sortingArr = this.getSortingList();
    if (sortingArr) {
      var paramSort = this.queryParams.sort || '';
      // Build content
      var sortingItemsHtml = '';
      for (var k in sortingArr) {
        var selected = '';
        if (paramSort == k) {
          selected = ' selected="selected"';
        }
        sortingItemsHtml += '<option value="' + k + '"' + selected + '>' + sortingArr[k] + '</option>';
      }
      var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
      jQ('.bc-sf-filter-custom-sorting').html(html);
    }
  }
};

// Build Sorting event
BCSfFilter.prototype.buildSortingEvent = function () {
  var _this = this;
  jQ('.sort-by-select').change(function (e) {
    e.preventDefault();
    onInteractWithToolbar(e, 'sort', _this.queryParams.sort, jQ(this).val());
  });
};
// For Toolbar - Build Display type
BCSfFilter.prototype.buildFilterDisplayType = function () {
  // There is no specific requirement for BEEKMAN to use different display types, omit
};
// Build Display type event
BCSfFilter.prototype.buildDisplayTypeEvent = function () {
  var _this = this;
  var topDisplayTypeSelector = jQ(this.getSelector('topDisplayType'));
  var listProductSelector = jQ(this.getSelector('products'));
  jQ(this.getSelector('topDisplayType') + ' a').click(function (e) {
    e.preventDefault();
    _this.internalClick = true;
    jQ(this).parent().children().removeClass('active');
    jQ(this).addClass('active');
    if (_this.queryParams.display == 'list') {
      topDisplayTypeSelector.find('.bc-sf-filter-display-list').addClass('active');
      listProductSelector.removeClass('bc-sf-filter-grid-view-items').addClass('bc-sf-filter-list-view-items');
    } else if (_this.queryParams.display == 'grid') {
      topDisplayTypeSelector.find('.bc-sf-filter-display-grid').addClass('active');
      listProductSelector.removeClass('bc-sf-filter-list-view-items').addClass('bc-sf-filter-grid-view-items');
    }
    var newUrl = jQ(this).attr('href');
    _this.onChangeData(newUrl, 'display');
  })
};
// Build Show Limit
BCSfFilter.prototype.buildFilterShowLimit = function () {
  if (bcSfFilterConfig.custom.show_limit && bcSfFilterTemplate.hasOwnProperty('showLimitHtml')) {
    jQ(this.selector.topShowLimit).html('');
    var numberList = this.getSettingValue('general.showLimitList');
    if (numberList != '') {
      // Build content
      var showLimitItemsHtml = '';
      var arr = numberList.split(',');
      for (var k = 0; k < arr.length; k++) {
        showLimitItemsHtml += '<option value="' + arr[k].trim() + '">' + arr[k].trim() + '</option>';
      }
      var html = bcSfFilterTemplate.showLimitHtml.replace(/{{showLimitItems}}/g, showLimitItemsHtml);
      jQ(this.selector.topShowLimit).html(html);
      // Set value
      jQ(this.selector.topShowLimit + ' select').val(this.queryParams.limit);
    }
  }
};
// Build Breadcrumb
BCSfFilter.prototype.buildBreadcrumb = function (colData, apiData) {
  if (bcSfFilterTemplate.hasOwnProperty('breadcrumbHtml')) {
    var breadcrumbItemsHtml = '';
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
      var colInfo = colData.collection;
      if (typeof this.collectionTags !== 'undefined' && this.collectionTags !== null) {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemLink.replace(/{{itemLink}}/g, '/collections/' + colInfo.handle).replace(/{{itemTitle}}/g, colInfo.title);
        breadcrumbItemsHtml += " {{breadcrumbDivider}} ";
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.collectionTags[0]);
      } else {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, colInfo.title);
      }
    } else {
      breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.getSettingValue('label.defaultCollectionHeader'));
    }
    var html = bcSfFilterTemplate.breadcrumbHtml.replace(/{{breadcrumbItems}}/g, breadcrumbItemsHtml)
    html = html.replace(/{{breadcrumbDivider}}/g, bcSfFilterTemplate.breadcrumbDivider);
    jQ(this.selector.breadcrumb).html(html);
  }
};
/************************** END BUILD TOOLBAR **************************/
// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function (data, eventType) {
  /* start-initialize-bc-al */
  var self = this;
  var alEnable = true;
  if (self.getSettingValue('actionlist.qvEnable') != '' || self.getSettingValue('actionlist.atcEnable') != '') {
    alEnable = self.getSettingValue('actionlist.qvEnable') || self.getSettingValue('actionlist.atcEnable');
  }
  if (alEnable === true && typeof BCActionList !== 'undefined') {
    if (typeof bcActionList === 'undefined') {
      bcActionList = new BCActionList();
    } else {
      if (typeof bcAlParams !== 'undefined' && typeof bcSfFilterParams !== 'undefined') {
        bcActionList.initFlag = false;
        bcActionList.alInit(bcSfFilterParams, bcAlParams);
      } else {
        bcActionList.alInit();
      }
    }
  }
  /* end-initialize-bc-al */
  // Call theme init function
  if (typeof theme !== 'undefined' && typeof theme.init === 'function') {
    $(theme.init);
  }
  // End For List View
};
// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function (data, eventType) {
  var _this = this;
  var totalProduct = '<span class="brackets"> ( </span>' + data.total_product + ' ' + bcSfFilterConfig.label.items_with_count_other + '<span class="brackets"> ) </span>';
  if (data.total_product == 1) {
    totalProduct = data.total_product + '<span> ' + bcSfFilterConfig.label.items_with_count_one + '</span>';
  }
  jQ('#bc-sf-filter-total-product').html(totalProduct);

  jQ('body').find('.bc-sf-filter-skeleton-button').remove();

  // Prevent double tap on iOS
  this.isMobile() && jQ(".bc-sf-filter-product-item").find("a").on("touchstart", function () { isScrolling = !1 }).on("touchmove", function () { isScrolling = !0 }).on("touchend", function () { isScrolling || (window.location = jQ(this).attr("href")) });

  // Fix image not loaded on mobile
  (this.isMobile() || null != navigator.userAgent.match(/iPad/i)) && (setTimeout(function () { jQ(".bc-sf-filter-product-item-image img").each(function () { var a = jQ(this).attr("src") + "3"; jQ(this).attr("src", a) }) }, 200), setTimeout(function () { jQ(".bc-sf-filter-product-item-image img").each(function () { var a = jQ(this).attr("src") + "3"; jQ(this).attr("src", a) }) }, 2e3));
};


// Build Default layout
function buildDefaultLink(a, b) { var c = window.location.href.split("?")[0]; return c += "?" + a + "=" + b } BCSfFilter.prototype.buildDefaultElements = function (a) { if (bcSfFilterConfig.general.hasOwnProperty("collection_count") && jQ("#bc-sf-filter-bottom-pagination").length > 0) { var b = bcSfFilterConfig.general.collection_count, c = parseInt(this.queryParams.page), d = Math.ceil(b / this.queryParams.limit); if (1 == d) return jQ(this.selector.pagination).html(""), !1; if ("default" == this.getSettingValue("general.paginationType")) { var e = bcSfFilterTemplate.paginateHtml, f = ""; f = c > 1 ? bcSfFilterTemplate.hasOwnProperty("previousActiveHtml") ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousHtml : bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml") ? bcSfFilterTemplate.previousDisabledHtml : "", f = f.replace(/{{itemUrl}}/g, buildDefaultLink("page", c - 1)), e = e.replace(/{{previous}}/g, f); var g = ""; g = c < d ? bcSfFilterTemplate.hasOwnProperty("nextActiveHtml") ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextHtml : bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml") ? bcSfFilterTemplate.nextDisabledHtml : "", g = g.replace(/{{itemUrl}}/g, buildDefaultLink("page", c + 1)), e = e.replace(/{{next}}/g, g); for (var h = [], i = c - 1; i > c - 3 && i > 0; i--)h.unshift(i); c - 4 > 0 && h.unshift("..."), c - 4 >= 0 && h.unshift(1), h.push(c); for (var j = [], k = c + 1; k < c + 3 && k <= d; k++)j.push(k); c + 3 < d && j.push("..."), c + 3 <= d && j.push(d); for (var l = "", m = h.concat(j), n = 0; n < m.length; n++)"..." == m[n] ? l += bcSfFilterTemplate.pageItemRemainHtml : l += m[n] == c ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml, l = l.replace(/{{itemTitle}}/g, m[n]), l = l.replace(/{{itemUrl}}/g, buildDefaultLink("page", m[n])); e = e.replace(/{{pageItems}}/g, l), jQ(this.selector.pagination).html(e) } } if (bcSfFilterTemplate.hasOwnProperty("sortingHtml") && jQ(this.selector.topSorting).length > 0) { jQ(this.selector.topSorting).html(""); var o = this.getSortingList(); if (o) { var p = ""; for (var q in o) p += '<option value="' + q + '">' + o[q] + "</option>"; var r = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, p); jQ(this.selector.topSorting).html(r); var s = void 0 !== this.queryParams.sort_by ? this.queryParams.sort_by : this.defaultSorting; jQ(this.selector.topSorting + " select").val(s), jQ(this.selector.topSorting + " select").change(function (a) { window.location.href = buildDefaultLink("sort_by", jQ(this).val()) }) } } };

BCSfFilter.prototype.prepareProductData = function (data) { var countData = data.length; for (var k = 0; k < countData; k++) { data[k]['images'] = data[k]['images_info']; if (data[k]['images'].length > 0) { data[k]['featured_image'] = data[k]['images'][0] } else { data[k]['featured_image'] = { src: bcSfFilterConfig.general.no_image_url, width: '', height: '', aspect_ratio: 0 } } data[k]['url'] = '/products/' + data[k].handle; var optionsArr = []; var countOptionsWithValues = data[k]['options_with_values'].length; for (var i = 0; i < countOptionsWithValues; i++) { optionsArr.push(data[k]['options_with_values'][i]['name']) } data[k]['options'] = optionsArr; if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) { var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim(); function updateMultiCurrencyPrice(oldPrice, newPrice) { if (typeof newPrice != 'undefined') { return newPrice; } return oldPrice; } data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]); data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]); data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]); data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]); } data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100; data[k]['price'] = data[k]['price_min']; data[k]['compare_at_price'] = data[k]['compare_at_price_min']; data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max']; var firstVariant = data[k]['variants'][0]; if (getParam('variant') !== null && getParam('variant') != '') { var paramVariant = data.variants.filter(function (e) { return e.id == getParam('variant') }); if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0] } else { var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { if (data[k]['variants'][i].available) { firstVariant = data[k]['variants'][i]; break } } } data[k]['selected_or_first_available_variant'] = firstVariant; var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { var variantOptionArr = []; var count = 1; var variant = data[k]['variants'][i]; var variantOptions = variant['merged_options']; if (Array.isArray(variantOptions)) { var countVariantOptions = variantOptions.length; for (var j = 0; j < countVariantOptions; j++) { var temp = variantOptions[j].split(':'); data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1]; data[k]['variants'][i]['option_' + temp[0]] = temp[1]; variantOptionArr.push(temp[1]) } data[k]['variants'][i]['options'] = variantOptionArr } data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100; data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100 } data[k]['description'] = data[k]['content'] = data[k]['body_html']; if (data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0) { data[k].tags = data[k]['original_tags'].slice(0); } } return data };
