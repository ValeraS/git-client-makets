import { FileList, FileListHead } from '../file-list/file-list';
import { BranchList, BranchListHead } from '../branch-list/branch-list';

export default class Table {
  constructor(el, store) {
    this._el = el;
    this._store = store;
    this._unsubscribe = store.subscribe(this._prepareRender.bind(this));
    this._prepareRender();
  }

  _prepareRender() {
    this._destroyChildren();

    const { activeTab } = this._store.getState();

    const head = this._el.querySelector('thead');
    this._head =
      activeTab === 'Files'
        ? new FileListHead(head, this._store)
        : new BranchListHead(head, this._store);
    const body = this._el.querySelector('tbody');
    this._body =
      activeTab === 'Files'
        ? new FileList(body, this._store)
        : new BranchList(body, this._store);
  }

  _destroyChildren() {
    if (this._head) {
      this._head.destroy();
    }
    if (this._body) {
      this._body.destroy();
    }
  }

  destroy() {
    this._destroyChildren();
    this._unsubscribe();
  }
}
