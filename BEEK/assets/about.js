$(document).ready(() => {
  $('body').attr('id', 'beekman-our-story');

  $('.ourStory_carousel_wrap').addClass('owl-carousel').owlCarousel({
    autoWidth: false,
    dots: false,
    nav: true,
    navText: [$('.customPrevBtnMobi'), $('.customNextBtnMobi')],
    margin: 0,
    dotsEach: 1,
    loop: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      812: {
        items: 3,
      },
    },
  });

  $('.ourStory_carousel_wrap_dt').addClass('owl-carousel').owlCarousel({
    autoWidth: false,
    dots: false,
    nav: true,
    navText: [$('.customPrevBtn'), $('.customNextBtn')],
    margin: 0,
    dotsEach: 1,
    loop: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  // SCROLLING ANIMATIONS ====================================

  const sections = document.querySelectorAll('.section');
  const yellowbar = document.getElementById('yellow-bar');

  function changeActiveClass(node) {
    if (node.classList.contains('inactive')) {
      node.classList.replace('inactive', 'active');
    } else {
      node.classList.add('active');
    }
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio === 1) {
        changeActiveClass(entry.target);
      } else {
        entry.target.classList.replace('active', 'inactive');
        window.setTimeout(() => { entry.target.classList.remove('inactive'); }, 500);
      }
    });
  }, { threshold: 1 });

  $('#beekman-our-story').scroll(() => {
    yellowbar.style.width = `calc(12rem + ${($(window).height() - yellowbar.getBoundingClientRect().top) / $(window).height() * 100}%)`;
    sections.forEach((section) => {
      observer.observe(section);
    });
    if (document.getElementById('our_story_neighbor_wrap').classList.contains('active')) {
      neighborVideo.play();
    }
  });
});

$(window).on('load', () => $('#dt-our-story').addClass('loaded'));
