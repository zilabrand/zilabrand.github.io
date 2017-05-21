/**
 * Slideshows!
 */

import { Component } from 'script/Component';

import {
  Theater,
  TheaterReady,
} from 'script/Theater';

import {
  div,
  each,
  List,
  map,
} from 'script/util';

export abstract class Slide extends Component {
  public abstract activate(): void;
  public abstract forSlideshow(slideshow: Slideshow): void;
}

export class Slideshow extends Component implements TheaterReady {
  public startAt: number = 0;
  public duration: number = 3000;

  private root: HTMLDivElement;
  private slides: List<Slide>;
  private slideElements: HTMLElement[];

  private interval: number;
  private current: number;

  private keyUpHandler: EventListener;

  constructor(slides: List<Slide>) {
    super();

    this.slides = slides;
    each(this.slides, slide => slide.forSlideshow(this));
    this.slideElements = map(this.slides, slide => slide.render());

    this.root = div(
      { attrs: { className: 'slideshow paused' } },
      ...this.slideElements,
      this.renderControls(),
    );
  }

  public render() {
    this.transition(this.startAt);

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
    this.interval = setInterval(() => this.next(), this.duration);
    this.root.classList.remove('paused');
    this.root.classList.add('playing');
  }

  public forTheater(theater: Theater): void {
    theater.registerDestroyer(this.root);
    each(this.slideElements, el => theater.registerDestroyer(el));
    // If it's the theater it's the only one and we can register key events
    this.registerEvent(window, 'keyup', (event: KeyboardEvent) => {
      if (event.keyCode === 37) {
        // Left arrow
        this.prev();
      }
      else if (event.keyCode === 39) {
        // Right arrow
        this.next();
      }
    });
  }

  public prev() {
    this.transition((this.current - 1) % this.slides.length);
  }

  public next() {
    this.transition((this.current + 1) % this.slides.length);
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

  private renderControls() {
    return div(
      { attrs: { className: 'controls' } },
      div({
        attrs: { className: 'prev' },
        listeners: { click: () => this.prev() },
      }),
      div({
        attrs: { className: 'pause-play' },
        listeners: { click: () => this.interval ? this.stop() : this.start() },
      }),
      div({
        attrs: { className: 'next' },
        listeners: { click: () => this.next() },
      }),
    );
  }

}
