var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
  return setTimeout(callback, 1);
};

var easeOutBounce = function(pos) {
  if (pos < (1 / 2.75)) {
    return 7.5625 * pos * pos;
  } else if (pos < (2 / 2.75)) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
  } else if (pos < (2.5 / 2.75)) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
  } else {
    return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
  }
};

if (document.getElementById('welcome')) {
  var intro_text_el = document.getElementById('intro-text');
  var change_text_el = intro_text_el.getElementsByClassName('write')[0];
  var text_strings = change_text_el.dataset.strings.split('|');
  var initial_pause = 1000;
  var selection_pause = 3000;
  var end_pause = 1000;
  var char_pause = 100;
  var text_index = 0;

  var animate = function(word) {
    intro_text_el.classList.remove('selected');
    change_text_el.innerHTML = '';

    var i = 0;
    for (j = 0; j < word.length; j++) {
      var letter = word[j];
      setTimeout(function() {
        return change_text_el.innerHTML += word[change_text_el.innerHTML.length];
      }, i++ * char_pause + initial_pause);
    }

    setTimeout(function() {
      intro_text_el.classList.add('selected');
    }, initial_pause + i * char_pause + selection_pause);

    setTimeout(function() {
      if (++text_index >= text_strings.length) {
        text_index = 0;
      }
      return animate(text_strings[text_index]);
    }, initial_pause + i * char_pause + selection_pause + end_pause);
  };
  animate(text_strings[text_index]);

  var skills_container = document.getElementById('skills');
  var skills_elements = skills_container.getElementsByClassName('skill');

  var progressBars = function(step) {
    if (step == null) {
      step = 0;
    }

    var canvases = document.getElementsByTagName('canvas');

    for (j = 0, len = canvases.length; j < len; j++) {
      var canvas = canvases[j];
      var padding = 10;
      var lineWidth = 10;
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = x - padding - lineWidth / 2;
      var percent = parseInt(canvas.dataset.progress) * step;
      var start = 1.5 * Math.PI;
      var end = start + 2 * percent / 100 * Math.PI;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.height, canvas.width);
      ctx.beginPath();
      ctx.arc(x, y, radius, start, end);
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  var start = null;
  var animateSkills = function() {
    var duration = 2000;
    if (!start) {
      start = (new Date()).getTime();
    }
    var diff = (new Date()).getTime() - start;
    if (diff > duration) {
      return progressBars(1);
    }
    var step = diff / duration;
    progressBars(easeOutBounce(step));
    return setTimeout(animateSkills, requestAnimationFrame);
  };

  for (j = 0; j < skills_elements.length; j++) {
    var skill = skills_elements[j];
    var name = skill.dataset.name;
    var name_el = document.createElement('span');
    name_el.classList.add('name');
    name_el.innerHTML = name;
    var progress = skill.dataset.percent;
    var progress_el = document.createElement('canvas');
    progress_el.dataset.progress = progress;
    progress_el.width = progress_el.height = 280;
    var percent_el = document.createElement('span');
    percent_el.classList.add('percent');
    percent_el.innerHTML = progress + '%';
    skill.appendChild(name_el);
    skill.appendChild(percent_el);
    skill.appendChild(progress_el);
  }

  var header = document.getElementsByTagName('header')[0];
  var articles = document.getElementsByTagName('article');
  var wheight = window.innerHeight;
  var divs = document.querySelectorAll('.parallax');
  var skills_container = document.getElementById('skills');
  var skills = skills_container.getElementsByClassName('skill');
  var works_container = document.getElementById('works');
  var works = works_container.getElementsByClassName('block-wrapper');

  window.addEventListener('scroll', function() {
    var scroll_top = document.body.scrollTop;
    if (scroll_top > 60) {
      header.classList.add('white');
    } else {
      header.classList.remove('white');
    }

    var active = document.body.querySelector('#navigation a.active');
    if (active) {
      active.classList.remove('active');
    }

    var current_article = '';
    for (k = 0; k < articles.length; k++) {
      var article = articles[k];
      var rect = article.getBoundingClientRect();
      if (rect.top < wheight / 2) {
        current_article = article;
      }
    }

    var current_article_el = document.getElementById('navigation').querySelector('.' + current_article.id);
    if (current_article_el) {
      current_article_el.classList.add('active');
    }

    for (l = 0; l < divs.length; l++) {
      var div = divs[l];
      var speed = parseInt(div.dataset.speed) / 100 || 0.1;
      var vpos = scroll_top * speed;
      div.style.backgroundPosition = '50% calc(50% + ' + vpos + 'px)';
    }

    var animated = false;
    if (animated === false && skills_container.getBoundingClientRect().top < wheight / 2) {
      animated = true;
      animateSkills();
    }

    for (m = 0, len3 = works.length; m < len3; m++) {
      work = works[m];
      if (work.getBoundingClientRect().top < wheight) {
        work.classList.add('in');
      }
    }
  });
}

// Send email
var contactForm = document.getElementById('contact-form-element');
contactForm.addEventListener('submit', function(ev) {
  ev.preventDefault();
  fetch(contactForm.action, {
    method: 'POST',
    body: new FormData(contactForm),
  }).then(function(response) {
    grecaptcha.reset();
    if (response.ok) {
      document.getElementById('contact-form-element').style.display = 'none';
      document.getElementById('contact-success').style.display = 'block';
    } else {
      document.getElementById('contact-error').style.display = 'block';
      switch (response.status) {
        case 400:
          console.error('Bad Request');
          break;
        case 429:
          console.error('Too many requests');
          break;
        default:
          console.error('An error has been occurred');
          break;
      }
    }
  });
}, false);
