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
} from 'script/util';

export interface TheaterReady {
  forTheater(theater: Theater): void;
}

export function isTheaterReady(component: { forTheater?(): void }): component is TheaterReady {
  return !!component.forTheater;
}

export class Theater extends InsertableIntoBody implements Component {
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
    target.addEventListener('click', event => {
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

    return this.root;
  }

  private destroy() {
    this.root.remove();
  }
}
