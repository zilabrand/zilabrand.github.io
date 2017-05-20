/**
 * Galleries!
 */

import { Component } from 'script/Component';

import {
  Slide,
  Slideshow,
} from 'script/Slideshow';

import {
  div,
  List,
  map,
} from 'script/util';

import { Theater } from 'script/Theater';

class GallerySlide implements Slide {
  private src: string;
  private root: HTMLDivElement;
  private hasActivated: Boolean;

  constructor(src: string) {
    this.src = src;
    this.root = div();
  }

  public render(): HTMLDivElement {
    return this.root;
  }

  public activate(): void {
    if (this.hasActivated) {
      return;
    }
    this.hasActivated = true;

    const image = new Image();
    image.src = this.src;
    this.root.appendChild(image);
  }
}

export class Gallery implements Component {
  private slides: GallerySlide[];
  private startAt: number = 0;

  constructor(itemEls: List<Element>) {
    this.slides = map(itemEls, (itemEl, index) => {
      itemEl.addEventListener('click', () => this.show(index));

      return new GallerySlide(itemEl.getAttribute('data-src'));
    });
  }

  public render() {
    const slideshow = new Slideshow(this.slides);
    slideshow.startAt = this.startAt;

    return slideshow.render();
  }

  private show(index: number) {
    this.startAt = index;
    const theater = new Theater(this);
    theater.insert();
  }
}
