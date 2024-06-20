$(document).ready(() => {
  $('body').attr('id', 'microbiome-scroll-wrap');

  const thingsToAnimate = document.querySelectorAll('.animated');

  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animation-active');
      }
    });
  }, {threshold: 0.25});

  $('#microbiome-scroll-wrap').scroll(() => {
    thingsToAnimate.forEach((thing) => {
      observer.observe(thing);
    });
  });
});
