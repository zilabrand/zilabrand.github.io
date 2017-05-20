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

export interface Slide extends Component {
  activate(): void;
}

export class Slideshow implements Component {
  public startAt: number = 0;
  public duration: number = 3000;

  private root: HTMLDivElement;
  private slides: List<Slide>;
  private slideElements: HTMLDivElement[];

  private interval: number;
  private current: number;

  constructor(slides: List<Slide>) {
    this.slides = slides;

    this.slideElements = map(this.slides, slide => div(
      { attrs: { className: 'slide' } },
      slide.render(),
    ));

    this.root = div(
      { attrs: { className: 'slideshow' } },
      ...this.slideElements,
      this.renderControls(),
    );
  }

  public render() {
    return this.root;
  }

  public stop() {
    if (!this.interval) {
      return;
    }
    clearInterval(this.interval);
    this.root.classList.remove('playing');
    this.root.classList.add('paused');
  }

  public start() {
    if (this.interval) {
      return;
    }
    this.interval = setInterval(() => this.next, this.duration);
    this.root.classList.remove('paused');
    this.root.classList.add('playing');
  }

  private transition(to: number) {
    each(this.slideElements, (slideEl, i) => {
      if (i !== to) {
        slideEl.classList.remove('active');
      }
    });
    this.slides[to].activate();
    this.slideElements[to].classList.add('active');
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
        listeners: { click: () => this.prev },
      }),
      div({
        attrs: { className: 'pause-play' },
        listeners: { click: () => (this.interval ? this.stop : this.start)() },
      }),
      div({
        attrs: { className: 'next' },
        listeners: { click: () => this.next },
      }),
    );
  }

}
