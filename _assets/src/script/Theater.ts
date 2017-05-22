/**
 * Lightbox!
 */

import {
  Component,
  InsertableIntoBody,
} from 'script/Component';

import {
  a,
  div,
  each,
} from 'script/util';

export interface TheaterReady {
  forTheater(theater: Theater): void;
}

function isTheaterReady(component: Partial<TheaterReady>): component is TheaterReady {
  return !!component.forTheater;
}

export class Theater extends InsertableIntoBody {
  private root: HTMLDivElement;
  private contentComponent: Component;

  constructor(contentComponent: Component) {
    super();

    this.contentComponent = contentComponent;
    if (isTheaterReady(this.contentComponent)) {
      this.contentComponent.forTheater(this);
    }
  }

  public registerDestroyer(target: EventTarget): void {
    this.registerEvent(target, 'click', event => {
      if (event.target === target) {
        this.destroy();
      }
    });
  }

  public render() {
    const content = div(
      { attrs: { className: 'theater-content' } },
      this.contentComponent.render(),
    );

    this.root = div(
      { attrs: { className: 'theater-container' } },
      content,
      a({
        attrs: { className: 'theater-close' },
        listeners: { click: () => this.destroy() },
      }),
    );

    this.registerDestroyer(content);
    this.registerDestroyer(this.root);

    this.registerEvent(window, 'keyup', (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        // Escape key
        this.destroy();
      }
    });

    return this.root;
  }

  public destroy() {
    super.destroy();
    this.root.remove();
    this.contentComponent.destroy();
  }
}
