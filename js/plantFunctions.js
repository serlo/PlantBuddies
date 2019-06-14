const slideUp = (target, duration) => {
  const s = target.style
  s.transitionProperty = 'height, margin, padding';
  s.transitionDuration = duration + 'ms';
  s.boxSizing = 'border-box';
  s.height = target.offsetHeight + 'px';
  target.offsetHeight;
  s.overflow = 'hidden';
  s.height = 0;
  s.paddingTop = 0;
  s.paddingBottom = 0;
  s.marginTop = 0;
  s.marginBottom = 0;
  window.setTimeout(() => {
    s.display = 'none';
    s.removeProperty('height');
    s.removeProperty('padding-top');
    s.removeProperty('padding-bottom');
    s.removeProperty('margin-top');
    s.removeProperty('margin-bottom');
    s.removeProperty('overflow');
    s.removeProperty('transition-duration');
    s.removeProperty('transition-property');
    //alert("!");
  }, duration);
}

const slideDown = (target, duration) => {
  const s = target.style
  s.removeProperty('display');
  let display = window.getComputedStyle(target).display;

  if (display === 'none')
    display = 'block';

  s.display = display;
  let height = target.offsetHeight;
  s.overflow = 'hidden';
  s.height = 0;
  s.paddingTop = 0;
  s.paddingBottom = 0;
  s.marginTop = 0;
  s.marginBottom = 0;
  target.offsetHeight;
  s.boxSizing = 'border-box';
  s.transitionProperty = "height, margin, padding";
  s.transitionDuration = duration + 'ms';
  s.height = height + 'px';
  s.removeProperty('padding-top');
  s.removeProperty('padding-bottom');
  s.removeProperty('margin-top');
  s.removeProperty('margin-bottom');
  window.setTimeout(() => {
    s.removeProperty('height');
    s.removeProperty('overflow');
    s.removeProperty('transition-duration');
    s.removeProperty('transition-property');
  }, duration);
}

const slideToggle = (target, duration) => {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

window.openBuddy = function openBuddy(e) {
  e.preventDefault();
  const container = e.target.nextElementSibling
  const openContainer = document.getElementById('results').querySelector('.open')

  if (openContainer) {
    slideUp(openContainer, 400)
    openContainer.classList = ''
  }

  if (!container.isSameNode(openContainer)) {
    slideDown(container, 400)
    container.classList = 'open'
  }

  if (e.screenX !== 0 && e.screenY !== 0) e.target.blur()
}

window.fade = function fade(el,fadeIn,callback) {
  var fadeFrom = fadeIn ? 0 : 1;
  var fadeTo = fadeIn ? 1 : 0;

  el.style.opacity = fadeFrom;

  var last = +new Date();
  var tick = function() {

    var amount = (new Date() - last) / 150;
    el.style.opacity = fadeIn ? +el.style.opacity + amount : +el.style.opacity - amount

    last = +new Date();
    if ( (fadeIn && (+el.style.opacity < 1)) || (!fadeIn && (+el.style.opacity > 0)) ) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
    else if(callback) callback()
  };

  tick();
}

// fadeIn(el);
