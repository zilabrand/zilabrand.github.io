/**
 * Galleries!
 */

import { initSlideshow } from 'script/Slideshow';
import {
  div,
  map,
} from 'script/util';

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


interface GalItem {
  el: Element;
  src: string;
}

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
