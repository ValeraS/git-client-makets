const { setFilter } = require('../../lib/store');
const View = require('../../lib/view');

class FilterTable extends View {
  constructor(el, store) {
    super(el, store);
    this._onInput = this._onInput.bind(this);
    this._el.addEventListener('change', this._onInput);
  }

  _onInput(event) {
    this._store.dispatch(setFilter(event.target.value));
  }

  render({ filter }) {
    return `<input class="FilterTable-Input" value="${filter}" type="search" />`;
  }

  destroy() {
    super.destroy();
    this._el.removeEventListener('change', this._onInput);
  }
}

module.exports = FilterTable;