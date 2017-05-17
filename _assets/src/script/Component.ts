/**
 * Simple components brah
 */

export interface Component {
  render(): HTMLElement;
}

export abstract class InsertableComponent implements Component {
  protected parent: HTMLElement;

  public abstract render(): HTMLElement;

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
