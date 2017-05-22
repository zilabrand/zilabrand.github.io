/**
 * Simple components brah
 */

import { each } from 'script/util';

export abstract class Component {
  private events: {
    target: EventTarget,
    event: keyof DocumentEventMap,
    handler: EventListenerOrEventListenerObject,
  }[] = [];

  public abstract render(): HTMLElement;

  public destroy(): void {
    each(this.events, e => e.target.removeEventListener(e.event, e.handler));
  }

  protected registerEvent(target: EventTarget, event: keyof DocumentEventMap, handler: EventListenerOrEventListenerObject) {
    target.addEventListener(event, handler);
    this.events.push({ target, event, handler });
  }
}

export abstract class InsertableComponent extends Component {
  protected parent: HTMLElement;

  public insert() {
    this.parent.appendChild(this.render());
  }
}

export abstract class InsertableIntoBody extends InsertableComponent {
  constructor() {
    super();
    this.parent = document.body;
  }
}
