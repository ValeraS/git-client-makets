import { setFilter } from '../../lib/store';
import View from '../../lib/view';

export default class Filter extends View {
  constructor(el, store) {
    super(el, store);
    this._onInput = this._onInput.bind(this);
    this._el.addEventListener('input', this._onInput);
  }

  _onInput(event) {
    this._store.dispatch(setFilter(event.target.value));
  }

  render() {
    return '';
  }

  destroy() {
    super.destroy();
    this._el.removeEventListener('input', this._onInput);
  }
}
