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
  private root: HTMLDivElement;
  private contentComponent: Component;

  constructor(contentComponent: Component) {
    super();
    this.contentComponent = contentComponent;
  }

  public render() {
    this.root = div(
      {
        attrs: { className: 'theater-container' },
        listeners: {
          click: event => {
            if (event.target === this.root) {
              this.destroy();
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
        listeners: { click: () => this.destroy() },
      }),
    );

    return this.root;
  }

  private destroy() {
    this.root.remove();
  }
}
