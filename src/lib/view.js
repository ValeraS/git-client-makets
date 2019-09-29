export default class View {
  constructor(el, store) {
    this._el = el;
    this._store = store;
    this._isDestroyed = false;
    this._unsubscribe = store.subscribe(this._prepareRender.bind(this));
    this._prepareRender();

    if (typeof this.componentDidMount === 'function') {
      Promise.resolve().then(() => this.componentDidMount());
    }
  }

  _prepareRender() {
    if (this._isDestroyed) {
      return;
    }

    const state = this._store.getState();

    if (
      typeof this.shouldComponentUpdate === 'function' &&
      !this.shouldComponentUpdate(state)
    ) {
      return;
    }

    this._el.innerHTML = this.render(state);
  }

  render() {
    throw new Error('Render should be overridden');
  }

  destroy() {
    this._isDestroyed = true;
    this._el.innerHTML = '';
    this._unsubscribe();
  }
}
