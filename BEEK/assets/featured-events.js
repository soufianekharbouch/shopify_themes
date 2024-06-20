$(document).ready(function () {
  if($('.event_schedule .carousel_wrap .item').length > 0) {
    $('.event_schedule .carousel_wrap').addClass('owl-carousel').owlCarousel({
      nav: true,
      margin: 0,
      dots: false,
      items: 1,
      navText: [$('.sc_prev__btn'), $('.sc_next__btn')],
      responsive:{
        0: {
          items: 1,
        },
        992: {
          items: 3,
        }
      }
    });
  }

  if($('.main__carousel .item').length > 0) {
    $('.main__carousel').addClass('owl-carousel').owlCarousel({
      dots: false,
      nav: true,
      navText: [$('.sl_prev__btn'), $('.sl_next__btn')],
      margin: 0,
      dotsEach: 1,
      items: 1
    });
  }

  $(document).on('click', '.video__play', function (e) {
    e.preventDefault();
    showVideo($(this).attr('data-video'));
  });

  $(document).on('click', '.arrow__down a', function (e) {
    e.preventDefault();
    setTimeout(function () {
      $('html, body').stop();
    }, 800)
    $('html, body').animate({
      scrollTop: $('#eventInfo').offset().top - 100
    }, 800, 'linear');

  });

});

function showVideo(video) {
  var videoData = this.parseVideoUrl(video),
    frame = this.prepareVideoFrame(videoData);
    $('.main__carousel').addClass('video-active').append(frame);
}

function _getYoutubeId(srcid) {
  var ampersandPosition;
  if (srcid) {
    ampersandPosition = srcid.indexOf('&');
    if (ampersandPosition === -1) {
      return srcid;
    }
    srcid = srcid.substring(0, ampersandPosition);
  }

  return srcid;
}

function parseHref(href) {
  var a = document.createElement('a');
  a.href = href;

  return a;
}

function parseVideoUrl(href) {
  var id, type, vimeoRegex, useYoutubeNocookie = false;
  if (typeof href !== 'string') {
    return href;
  }
  href = this.parseHref(href);

  if (href.host.match(/youtube\.com/) && href.search) {
    id = href.search.split('v=')[1];

    if (id) {
      id = this._getYoutubeId(id);
      type = 'youtube';
    }
  } else if (href.host.match(/youtube\.com|youtu\.be|youtube-nocookie.com/)) {
    id = href.pathname.replace(/^\/(embed\/|v\/)?/, '').replace(/\/.*/, '');
    type = 'youtube';

    if (href.host.match(/youtube-nocookie.com/)) {
      useYoutubeNocookie = true;
    }
  } else if (href.host.match(/vimeo\.com/)) {
    type = 'vimeo';
    vimeoRegex = new RegExp(['https?:\\/\\/(?:www\\.|player\\.)?vimeo.com\\/(?:channels\\/(?:\\w+\\/)',
      '?|groups\\/([^\\/]*)\\/videos\\/|album\\/(\\d+)\\/video\\/|video\\/|)(\\d+)(?:$|\\/|\\?)'
    ].join(''));
    id = href.href.match(vimeoRegex)[3];
  }

  return id ? {
    id: id, type: type, s: href.search.replace(/^\?/, ''), useYoutubeNocookie: useYoutubeNocookie
  } : false;
}

function prepareVideoFrame(data) {
  var frame, src;
  if (data.type === 'vimeo') {
    src = 'https://player.vimeo.com/video/' +
      data.id + '?api=1&player_id=vimeo' +
      data.id;

    frame = $('<iframe/>')
      .attr('frameborder', 0)
      .attr('id', 'vimeo' + data.id)
      .attr('src', src)
      .attr('webkitallowfullscreen', '')
      .attr('mozallowfullscreen', '')
      .attr('allowfullscreen', '')
      .attr('referrerPolicy', 'origin');

    return frame;
  } else if (data.type === 'youtube') {
    src = 'https://www.youtube.com/embed/' +
      data.id + '?rel=0&enablejsapi=1&origin' +
      window.location.origin;

    frame = $('<iframe/>')
      .attr('frameborder', 0)
      .attr('id', 'youtube' + data.id)
      .attr('src', src)
      .attr('webkitallowfullscreen', '')
      .attr('mozallowfullscreen', '')
      .attr('allowfullscreen', '')
      .attr('referrerPolicy', 'origin');

    return frame;
  }

  return false;
}