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

class GallerySlide extends Slide {
  private src: string;
  private sizes: string;
  private root: HTMLDivElement;
  private loader: HTMLDivElement;
  private image: HTMLImageElement;

  constructor(src: string, sizes: string) {
    super();

    this.src = src;
    this.sizes = sizes;
    this.loader = div(
      { attrs: { className: 'gallery-loader' } },
      div(), div(), div(), div(),
    );
    this.root = div(
      { attrs: { className: 'gallery-slide' } },
      this.loader,
    );
  }

  public render(): HTMLDivElement {
    return this.root;
  }

  public forSlideshow(slideshow: Slideshow): void {
    this.registerEvent(this.root, 'click', () => slideshow.next());
  }

  public activate(): void {
    if (this.image) {
      return;
    }

    this.image = new Image();
    this.registerEvent(this.image, 'load', () => this.loader.remove());
    this.image.src = this.src;
    this.image.sizes = this.sizes;
    this.root.appendChild(this.image);
  }
}

export class Gallery {
  private slides: GallerySlide[];
  private startAt: number = 0;

  constructor(itemEls: List<Element>) {
    this.slides = map(itemEls, (itemEl, index) => {
      itemEl.addEventListener('click', () => this.show(index));

      return new GallerySlide(itemEl.getAttribute('data-src'), itemEl.getAttribute('data-sizes'));
    });
  }

  private show(index: number) {
    const slideshow = new Slideshow(this.slides);
    slideshow.startAt = index;

    const theater = new Theater(slideshow);
    theater.insert();
  }
}
