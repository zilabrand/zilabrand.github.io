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

export class Theater extends InsertableIntoBody implements Component {
  private container: HTMLDivElement;
  private contentComponent: Component;

  constructor(contentComponent: Component) {
    super();
    this.contentComponent = contentComponent;
  }

  public render() {
    this.container = div(
      {
        attrs: { className: 'theater-container' },
        listeners: {
          click: event => {
            if (event.target === this.container) {
              close();
            }
          },
        },
      },
      div(
        { attrs: { className: 'theater-content' } },
        this.contentComponent.render(),
      ),
      a({
        attrs: { className: 'theater-close' },
        listeners: { click: () => this.destroy },
      }),
    );

    return this.container;
  }

  public insert() {
    document.body.appendChild(this.render());
  }

  private destroy() {
    this.container.remove();
  }
}
