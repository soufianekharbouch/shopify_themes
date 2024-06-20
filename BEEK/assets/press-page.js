$(document).ready(() => {
  const media = window.matchMedia('(min-width: 1024px)');
  let filterIsLoaded = false;
  let filteredArticles = [];
  function destroySliders() {
    if ($('.badges__carousel.carousel').data('owl.carousel')) {
      $('.badges__carousel.carousel').owlCarousel('destroy').removeClass('owl-carousel');
    }
  }

  function initSliders() {
    if ($('.badges__carousel.carousel .badge__item').length > 6) {
      $('.badges__carousel.carousel').addClass('owl-carousel').owlCarousel({
        autoWidth: false,
        dots: false,
        nav: true,
        navText: [$('.badges__nav .prev__btn').clone(), $('.badges__nav .next__btn').clone()],
        margin: 0,
        items: 6,
        rewind: true,
        loop: false,
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

  function renderPressGrid(articles) {
    $('.press__grid').empty();
    const monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (!filterIsLoaded) {
      renderFilters(articles);
    }
    articles.each((index, article) => {
      let artDate = new Date(article.date),
        month = artDate.getMonth(),
        day = artDate.getDate(),
        year = artDate.getFullYear();
      month = monthes[month];
      const articleTpl = `<div class="article__wrap">
        <div class="responsive-image__wrapper ">
          ${article.url ? `<a href="${article.url}" target="_blank">` : ''}
            <img src="${article.img}" alt="${article.name}">
          ${article.url ? '</a>' : ''}
        </div>
        <div class="details-block">
          <div class="art__logo" style="background-image: url('${article.logo}')"></div>
          ${article.url ? `<a href="${article.url}" target="_blank">` : ''}
            <h3>${article.name}</h3>
          ${article.url ? '</a>' : ''}
          <p class="art__date">${month} ${day}, ${year}</p>
        </div>
        </div>`;

      $('.press__grid').append(articleTpl);
    });
  }

  function renderFilters(array) {
    const unique = [];
    const filters = array.toArray().map((item) => item.tag);
    filters.forEach((filter, i) => {
      if (unique.indexOf(filter) === -1 || i === 0) {
        unique.push(filter);
      }
    });
    unique.sort();
    const digitalItem = unique.splice(1, 1)[0];
    unique.push(digitalItem);
    unique.forEach((item) => {
      $(`<li data-action="filter"><span>${item}</span></li>`).insertAfter('.all');
    });
    if ($(window).width() < 768) {
      $('.mobile_trigger_filter').on('click', function(e) {
        $(e.target).toggleClass('active');
      });
    }
    $('.list_press_filters li').on('click', setFilter);
    filterIsLoaded = true;
  }

  function setFilter(e) {
    e.preventDefault();
    const $elem = $(e.target).closest('li');
    const action = $elem.data('action');
    highlightFilter($elem, action);
    if (action === 'filter') {
      filteredArticles = filterArticles(window.articlesList, $(e.target).text());
    } else if (action === 'sort') {
      sortArticles(filteredArticles.length ? filteredArticles : window.articlesList, $(e.target).text());
    } else {
      filteredArticles = [];
      renderPressGrid($(window.articlesList));
    }
  }

  function highlightFilter(el, action) {
    var target = el;
    var $all = $('.all');
    if (action === 'filter') {
      target.addClass('active').siblings().removeClass('active');
    }

    if (action === 'sort') {
      target.addClass('active').siblings('[data-action="sort"]').removeClass('active');
    }

    if (target.hasClass('all')) {
      target.addClass('active').siblings().removeClass('active');
    } else {
      $all.removeClass('active');
    }

  }

  function filterArticles(articles, type) {
    const filteredArticlesList = articles.filter((item) => {
      return item.tag === type;
    });
    renderPressGrid($(filteredArticlesList));
    return filteredArticlesList;
  }

  function sortArticles(articles, type) {
    let callback;

    switch (type) {
      case 'Oldest':
        callback = function(a, b) {
          if (Date.parse(a.date) < Date.parse(b.date)) {
            return -1;
          }
          if (Date.parse(a.date) > Date.parse(b.date)) {
            return 1;
          }
          return 0;
        };
        break;
      case 'Newest':
        callback = function(a, b) {
          if (Date.parse(a.date) > Date.parse(b.date)) {
            return -1;
          }
          if (Date.parse(a.date) < Date.parse(b.date)) {
            return 1;
          }
          return 0;
        };
        break;
      default:
        callback = function(a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        };
        break;
    }
    articles.sort(callback);
    renderPressGrid($(articles));
  }

  checkMQ();
  renderPressGrid($(window.articlesList));
  $(window).on('resize', () => {
    checkMQ();
  });
});
