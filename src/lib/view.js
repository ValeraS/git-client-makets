function View(el, store) {
  this._el = el;
  this._store = store;
  this._unsubscribe = store.subscribe(
    this._prepareRender.bind(this)
  );
  this._prepareRender();
}

View.prototype._prepareRender = function() {
  this._el.innerHTML = this.render(this._store.getState());
}

View.prototype.render = function() {
  throw new Error('Render should be overridden');
}

View.prototype.destroy = function() {
  this._el.innerHTML = '';
  this._unsubscribe();
}

module.exports = View;