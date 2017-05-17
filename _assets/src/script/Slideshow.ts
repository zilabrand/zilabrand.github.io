/**
 * Slideshows!
 */

import { Component } from 'script/Component';

import {
  div,
  each,
  List,
  map,
} from 'script/util';

export class Slideshow implements Component {
  public startAt: number = 0;
  public duration: number = 3000;

  private slides: HTMLElement[];
  private container: HTMLDivElement;
  private interval: number;
  private current: number;

  constructor(slideContents: List<HTMLElement>) {
    this.slides = map(slideContents, content =>
      div({ attrs: { className: 'slide' } }, content),
    );
  }

  public transitionCallback: (to: number) => void = () => undefined;

  readonly public render() {
    if (!this.container) {
      this.container = div(
        { attrs: { className: 'slideshow' } },
        ...this.slides,
        this.renderControls(),
      );
    }

    return this.container;
  }

  readonly public stop() {
    if (!this.interval) {
      return;
    }
    clearInterval(this.interval);
    this.render().classList.remove('playing');
    this.render().classList.add('paused');
  }

  readonly public start() {
    if (this.interval) {
      return;
    }
    this.interval = setInterval(() => this.next, this.duration);
    this.render().classList.remove('paused');
    this.render().classList.add('playing');
  }

  private transition(to: number) {
    each(this.slides, (slide, i) => {
      if (i !== to) {
        slide.classList.remove('active');
      }
    });
    this.slides[to].classList.add('active');
    this.transitionCallback(to);
    this.current = to;
  }

  private prev() {
    this.transition((this.current - 1) % this.slides.length);
  }

  private next() {
    this.transition((this.current + 1) % this.slides.length);
  }

  private renderControls() {
    return div(
      { attrs: { className: 'controls' } },
      div({
        attrs: { className: 'prev' },
        listeners: { click: () => this.prev }
      }),
      div({
        attrs: { className: 'pause-play' },
        listeners: { click: () => (this.interval ? this.stop : this.start)() }
      }),
      div({
        attrs: { className: 'next' },
        listeners: { click: () => this.next }
      }),
    ));
  }

}

interface SlideshowI {
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
): SlideshowI {
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
