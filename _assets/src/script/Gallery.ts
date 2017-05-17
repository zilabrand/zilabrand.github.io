/**
 * Galleries!
 */

import { Component } from 'script/Component';

import { initSlideshow, Slideshow } from 'script/Slideshow';
import {
  div,
  map,
} from 'script/util';

import { Theater } from 'script/Theater';

interface GalItem {
  el: Element;
  src: string;
}

export class Gallery implements Component {
  private static ITEM_CLASS = 'gal-item';

  private items: GalItem[];
  private startAt: number = 0;

  constructor(el: HTMLElement) {
    const itemEls = el.querySelectorAll(Gallery.ITEM_CLASS);
    this.items = map(itemEls, (itemEl, index) => {
      itemEl.addEventListener('click', () => this.show(index));

      return {
        el: itemEl,
        src: itemEl.getAttribute('data-src'),
      };
    });
  }

  public render() {
    // tslint:disable-next-line:no-unnecessary-callback-wrapper
    const slides = map(this.items, () => div());
    const slideshow = new Slideshow(slides);
    slideshow.startAt = this.startAt;


    return div();
  }

  private show(index: number) {
    this.startAt = index;
    const theater = new Theater(this);
    theater.insert();
  }
}


const close = () => {
  galContainer.remove();
  galContent.innerHTML = '';
};

const galContent = div({ attrs: { className: 'gal-content slideshow' } });

const closeButton = div({
  attrs: { className: 'gal-close' },
  listeners: { click: close },
});

const galContainer = div(
  {
    attrs: { className: 'gal-container' },
    listeners: {
      click: event => {
        if (event.target === galContainer) {
          close();
        }
      },
    },
  },
  galContent,
  closeButton,
);




// tslint:disable-next-line:export-name
export function createGallery(el: HTMLElement): void {
  const show = (index: number) => {
    const slides = map(galItems, () => {
      const slide = div();
      slide.className = 'slide';
      galContent.appendChild(slide);

      return slide;
    });

    initSlideshow(galContent, {
      startAt: index,
      duration: 2500,
      transitionCallback(to) {
        const slide = slides[to];
        if (!slide.getElementsByTagName('img').length) {
          const img = new Image();
          img.src = galItems[to].src;
          slide.appendChild(img);
        }
      },
    });

    document.documentElement.appendChild(galContainer);
  };

  const galItems = map(el.querySelectorAll('.gal-item'), (itemEl, index): GalItem => {
    itemEl.addEventListener('click', () => show(index));

    return {
      el: itemEl,
      src: itemEl.getAttribute('data-src'),
    };
  });

}
