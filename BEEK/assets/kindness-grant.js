$(document).ready(function () {

  var mq = window.matchMedia('(max-width: 1023px)'),
    mobVideo = document.getElementById('mobRippleVideo'),
    deskVideo = document.getElementById('deskRippleVideo'),
    $form = $('#kindnessGrant'),
    numInput = $('.people__num')[0],
    rippleVal;

  $(document).on('click', '.get__started', handleGetStartedButtons);

  function handleGetStartedButtons(e) {
    if ($(e.currentTarget).attr('href') === '#') {
      e.preventDefault();

      setTimeout(function () {
          $('html, body').stop();
      }, 800);
      $('html, body').animate({
          scrollTop: $('.kindnessgrant-form-section')[0].offsetTop - 100
      }, 800, 'linear');
    }
  }

  $(document).on('click', '.submit__calculate', function(e) {
    e.preventDefault();
    var video;
    var $personDescVal = $('.person__description option:selected').data('multiplier'),
        $stateVal = $('.state__residence option:selected').data('multiplier');

    rippleVal = parseInt(Number(numInput.value) * 0.1 * Number($personDescVal) * 2.53 * Number($stateVal), 10);

    if ($form[0].checkValidity()) {
      var url = $form.attr('action'),
        formData = new FormData($form[0]),
        formDataObject = Object.fromEntries(formData.entries());
        formDataObject.ripple_effect = rippleVal;

      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(formDataObject),
        success: function(data)
        {
          console.log(data);
        }
      });

      setTimeout(function () {
        $('html, body').stop();
      }, 800);
      const scrollToTop = window.matchMedia('(max-width: 800px)').matches
      ? $('.kindnessgrant-ripple')[0].offsetTop - 100
      : $('.kindnessgrant-ripple')[0].offsetTop + 200

      $('html, body').animate({
        scrollTop: scrollToTop
      }, 800, 'linear');

      $('.calculated__amount > span').fadeOut(1000, function() {
        $(this).text('');
      });

      if (mq.matches) {
        video = mobVideo;
      } else {
        video = deskVideo;
      }

      if (!video.paused) {
        video.pause();
        video.currentTime = 0;
      }

      setTimeout(function() {
        video.play();
      }, 800);

      setTimeout(function(){
        $('.calculated__amount > span').text(rippleVal + ' People!').fadeIn(1000);
      }, 2000);

    } else {
      $form[0].reportValidity();
    }
  });

  function drawVideoCanvas(v,c) {
    if (v.paused || v.ended) return false;
    var w = v.videoWidth,
      h = v.videoHeight;
    c.canvas.width = w;
    c.canvas.height = h;
    c.drawImage(v,0,0,w,h);
    v.timeout = setTimeout(drawVideoCanvas, 25, v, c);
  }

  document.querySelectorAll('.play__in_canvas').forEach(function(v) {
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
    v.parentNode.appendChild(canvas);
    drawVideoCanvas(v, ctx);

    v.addEventListener('playing', function() {
      if (typeof v.timeout === 'number') clearTimeout(v.timeout);
      drawVideoCanvas(this, ctx);
    });
  });
});
