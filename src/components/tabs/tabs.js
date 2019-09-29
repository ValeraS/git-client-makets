import View from '../../lib/view';
import { setActiveTab } from '../../lib/store';

export default class Tabs extends View {
  constructor(el, store, tabs) {
    super(el, store);
    this._tabs = tabs;
    this._onClick = this._onClick.bind(this);
    this._el.addEventListener('click', this._onClick);
    this._store.dispatch(setActiveTab(this._tabs[0]));
  }

  _onClick(e) {
    if (e.target.nodeName === 'A') {
      this._store.dispatch(setActiveTab(e.target.innerHTML.trim()));
    }
  }

  render({ activeTab }) {
    if (!this._tabs) {
      return '';
    }
    return this._tabs
      .map(tab =>
        tab === activeTab
          ? `
    <div class="Tabs-Tab Typo-Caps Tabs-Tab_active_true Typo_weight_bold">
      ${tab}
    </div>
    `
          : `
    <div class="Tabs-Tab Typo-Caps Typo_weight_bold">
      <a href="#" class="Tabs-Link Link">${tab}</a>
    </div>
    `
      )
      .join('');
  }

  destroy() {
    super.destroy();
    this._el.removeEventListener('click', this._onClick);
  }
}
