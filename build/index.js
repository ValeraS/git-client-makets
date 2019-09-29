// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"lib/create-store.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function createStore(reducer, initialState, middleware) {
  if (typeof middleware === 'function') {
    return applyMiddleware(middleware);
  }

  function applyMiddleware(middleware) {
    var store = createStore(reducer, initialState);
    var dispatchWithMiddleware = middleware({
      getState: store.getState,
      dispatch: store.dispatch
    });
    return Object.assign({}, store, {
      dispatch: dispatchWithMiddleware
    });
  }

  if (typeof reducer !== 'function') {
    throw new Error('Reducer must be a function');
  }

  var subscribers = [];
  var state = initialState;
  var isDispatching = false;

  function dispatch(action) {
    if (isDispatching) {
      throw new Error('Reducer may not dispatch actions');
    }

    if (!action || _typeof(action) !== 'object') {
      throw new Error('Action must be an object');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Action must have a "type" property');
    }

    try {
      isDispatching = true;
      state = reducer(state, action);
    } finally {
      isDispatching = false;
    }

    subscribers.map(function (listener) {
      return listener();
    });
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    subscribers.push(listener);
    return function () {
      subscribers = (_readOnlyError("subscribers"), subscribers.filter(function (l) {
        return l !== listener;
      }));
    };
  }

  function getState() {
    return state;
  }

  var store = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState
  };
  return store;
}

module.exports = createStore;
},{}],"lib/middleware.js":[function(require,module,exports) {
function middleware(_ref) {
  var getState = _ref.getState,
      dispatch = _ref.dispatch;
  return function (action) {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return dispatch(action);
  };
}

module.exports = middleware;
},{}],"lib/store.js":[function(require,module,exports) {
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createStore = require('./create-store');

var middleware = require('./middleware');

var initState = {
  filter: '',
  files: []
};
var actionTypes = Object.freeze({
  SET_FILTER: 'setFilter',
  SET_FILES: 'setFiles'
});

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_FILTER:
      return _objectSpread({}, state, {
        filter: action.payload
      });

    case actionTypes.SET_FILES:
      return _objectSpread({}, state, {
        files: action.payload
      });

    default:
      return state;
  }
}

module.exports.store = createStore(reducer, initState, middleware);

module.exports.setFilter = function (value) {
  return {
    type: actionTypes.SET_FILTER,
    payload: value
  };
};

module.exports.setFiles = function (value) {
  return {
    type: actionTypes.SET_FILES,
    payload: value
  };
};
},{"./create-store":"lib/create-store.js","./middleware":"lib/middleware.js"}],"lib/view.js":[function(require,module,exports) {
function View(el, store) {
  this._el = el;
  this._store = store;
  this._unsubscribe = store.subscribe(this._prepareRender.bind(this));

  this._prepareRender();
}

View.prototype._prepareRender = function () {
  this._el.innerHTML = this.render(this._store.getState());
};

View.prototype.render = function () {
  throw new Error('Render should be overridden');
};

View.prototype.destroy = function () {
  this._el.innerHTML = '';

  this._unsubscribe();
};

module.exports = View;
},{}],"components/filter-table/filter-table.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('../../lib/store'),
    setFilter = _require.setFilter;

var View = require('../../lib/view');

function debounce(fn) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  var id;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(id);
    id = setTimeout(function () {
      return fn.apply(void 0, args);
    }, timeout);
  };
}

var FilterTable =
/*#__PURE__*/
function (_View) {
  _inherits(FilterTable, _View);

  function FilterTable(el, store) {
    var _this;

    _classCallCheck(this, FilterTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterTable).call(this, el, store));
    _this._onInput = _this._onInput.bind(_assertThisInitialized(_this));

    _this._el.addEventListener('change', _this._onInput); // this._el.addEventListener('keydown', debounce(this._onInput));


    return _this;
  }

  _createClass(FilterTable, [{
    key: "_onInput",
    value: function _onInput(event) {
      this._store.dispatch(setFilter(event.target.value)); // document.querySelector('.FilterTable-Input').focus();

    }
  }, {
    key: "render",
    value: function render(_ref) {
      var filter = _ref.filter;
      return "<input class=\"FilterTable-Input\" value=\"".concat(filter, "\" type=\"search\" />");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(FilterTable.prototype), "destroy", this).call(this);

      this._el.removeEventListener('change', this._onInput);
    }
  }]);

  return FilterTable;
}(View);

module.exports = FilterTable;
},{"../../lib/store":"lib/store.js","../../lib/view":"lib/view.js"}],"components/file-list/file-list.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var View = require('../../lib/view');

var FileList =
/*#__PURE__*/
function (_View) {
  _inherits(FileList, _View);

  function FileList(el, store) {
    _classCallCheck(this, FileList);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileList).call(this, el.querySelector('tbody'), store));
  }

  _createClass(FileList, [{
    key: "render",
    value: function render(_ref) {
      var filter = _ref.filter,
          files = _ref.files;
      var renderFiles = files;

      if (filter) {
        renderFiles = files.filter(function (_ref2) {
          var name = _ref2.name;
          return name.includes(filter);
        });
      }

      return renderFiles.map(function (_ref3) {
        var type = _ref3.type,
            name = _ref3.name,
            hash = _ref3.hash,
            message = _ref3.message,
            committer = _ref3.committer,
            time = _ref3.time;
        return "\n    <tr class=\"Table-Line Divider\">\n      <td class=\"Table-Col\">\n        <span class=\"FileTypeIcon FileTypeIcon_type_".concat(type, "\">\n          ").concat(name, "\n        </span>\n      </td>\n      <td class=\"Table-Col\">\n        <a href=\"#\" class=\"CommitHash Link\">").concat(hash, "</a>\n      </td>\n      <td class=\"Table-Col\">\n        ").concat(message, "\n      </td>\n      <td class=\"Table-Col\">\n        <span class=\"Committer\">\n          <span class=\"Committer-FirstLetter\">\n          ").concat(committer[0], "</span>").concat(committer.slice(1), "\n        </span>\n      </td>\n      <td class=\"Table-LastCol\">\n        ").concat(time, "\n      </td>\n    </tr>\n  ");
      }).join('');
    }
  }]);

  return FileList;
}(View);

module.exports = FileList;
},{"../../lib/view":"lib/view.js"}],"data/files.json":[function(require,module,exports) {
module.exports = {
  "path": [],
  "filename": "arcadia",
  "committer": "robot-srch-releaser",
  "fileTabs": {
    "tabs": ["Files", "Branches"],
    "activeTab": "Files"
  },
  "files": [{
    "type": "dir",
    "name": "api",
    "hash": "d53dsv",
    "message": "[vcs] move http to arc",
    "committer": "noxoomo",
    "time": "4 s ago"
  }, {
    "type": "dir",
    "name": "ci",
    "hash": "d53dsv",
    "message": "ARCADIA-771: append /trunk/arcadia/",
    "committer": "annaveronika",
    "time": "Yesterday, 14:50"
  }, {
    "type": "dir",
    "name": "contrib",
    "hash": "d53dsv",
    "message": "[vcs] move http to arc",
    "committer": "noxoomo",
    "time": "4 s ago"
  }, {
    "type": "file",
    "name": "ya.make",
    "hash": "d53dsv",
    "message": "[vcs] move http to arc",
    "committer": "noxoomo",
    "time": "4 s ago"
  }]
};
},{}],"index.js":[function(require,module,exports) {
var _require = require('./lib/store'),
    store = _require.store,
    setFiles = _require.setFiles;

var FilterTable = require('./components/filter-table/filter-table');

var FileList = require('./components/file-list/file-list');

var el = document.querySelector('.FilterTable');
var filter = new FilterTable(el, store);
var fileList = document.querySelector('.FileList');
new FileList(fileList, store);

function fetchFiles() {
  var filesMock = require('./data/files.json').files;

  return new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve(filesMock);
    }, 2000);
  });
}

store.dispatch(function (dispatch) {
  return fetchFiles().then(function (files) {
    return dispatch(setFiles(files));
  });
});
},{"./lib/store":"lib/store.js","./components/filter-table/filter-table":"components/filter-table/filter-table.js","./components/file-list/file-list":"components/file-list/file-list.js","./data/files.json":"data/files.json"}]},{},["index.js"], "index")
//# sourceMappingURL=/index.js.map