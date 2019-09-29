export default class SimpleView {
  constructor(el) {
    this._el = el;
    this._prepareRender();
  }

  _prepareRender() {
    this._el.innerHTML = this.render();
  }

  render() {
    throw new Error('Render should be overridden');
  }

  destroy() {
    this._el.innerHTML = '';
  }
}
