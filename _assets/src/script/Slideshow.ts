/**
 * Slideshows!
 */

import {
  div,
  each,
} from 'script/util';

interface Slideshow {
  start(): void;
  stop(): void;
}

// tslint:disable-next-line:function-name
// tslint:disable-next-line:export-name
export function initSlideshow(el: HTMLElement, {
  startAt,
  duration,
  transitionCallback
}: {
    startAt?: number,
    duration?: number,
    transitionCallback?(to: number): void
  } = {}
): Slideshow {
  startAt = startAt || 0;
  duration = duration || 1000;
  transitionCallback = transitionCallback || (to => undefined);

  const slides = el.querySelectorAll('.slide');

  let current = startAt;

  const transition = (to: number) => {
    each(slides, (slide, i) => {
      if (i !== to) {
        slide.classList.remove('active');
      }
    });
    slides[to].classList.add('active');
    transitionCallback(to);
    current = to;
  };

  const next = () => {
    const to = (current + 1) % slides.length;
    transition(to);
  };

  const prev = () => {
    const to = (current - 1) % slides.length;
    transition(to);
  };

  let interval: number;

  el.classList.add('paused');

  const start = (): void => {
    if (!interval) {
      interval = setInterval(next, duration);
      el.classList.remove('paused');
      el.classList.add('playing');
    }
  };

  const stop = (): void => {
    if (interval) {
      clearInterval(interval);
      el.classList.remove('playing');
      el.classList.add('paused');
    }
  };

  // Add controls!
  el.appendChild(div(
    { attrs: { className: 'controls' } },
    div({
      attrs: { className: 'prev' },
      listeners: { click: prev }
    }),
    div({
      attrs: { className: 'pause-play' },
      listeners: { click: () => (interval ? stop : start)() }
    }),
    div({
      attrs: { className: 'next' },
      listeners: { click: next }
    })
  ));

  each(slides, slide => slide.addEventListener('click', next));

  // Initialize
  transition(current);

  return {
    start: start,
    stop: stop
  };
}
