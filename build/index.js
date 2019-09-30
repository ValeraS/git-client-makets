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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function createStore(reducer, initialState, middleware) {
  if (Array.isArray(middleware)) {
    return applyMiddleware(middleware);
  }

  function applyMiddleware(middleware) {
    var store = createStore(reducer, initialState);
    var middlewareApi = {
      getState: store.getState,
      dispatch: function dispatch() {
        return _dispatch.apply(void 0, arguments);
      }
    };

    var _dispatch = middleware.map(function (m) {
      return m(middlewareApi);
    }).reduce(function (a, b) {
      return function () {
        return a(b.apply(void 0, arguments));
      };
    }, function (a) {
      return a;
    })(store.dispatch);

    return Object.assign({}, store, {
      dispatch: _dispatch
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

    var currentSubscribers = subscribers;
    currentSubscribers.forEach(function (listener) {
      return listener();
    });
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    subscribers = [].concat(_toConsumableArray(subscribers), [listener]);
    return function () {
      subscribers = subscribers.filter(function (l) {
        return l !== listener;
      });
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
},{}],"lib/middleware.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      return next(action);
    };
  };
};

exports.default = _default;
},{}],"data/files.json":[function(require,module,exports) {
module.exports = {
  "path": [],
  "filename": "arcadia",
  "committer": "robot-srch-releaser",
  "fileTabs": {
    "tabs": ["Files", "Branches"],
    "activeTab": "Files"
  },
  "useFilter": true,
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
},{}],"data/branches.json":[function(require,module,exports) {
module.exports = {
  "path": [],
  "filename": "arcadia",
  "committer": "robot-srch-releaser",
  "fileTabs": {
    "tabs": ["Files", "Branches"],
    "activeTab": "Branches"
  },
  "useFilter": false,
  "branches": [{
    "name": "trunk",
    "hash": "9748ds893432438dsd823329d923482d"
  }, {
    "name": "users/a-aidyn00/my-feature-2",
    "hash": "9748ds893432438dsd823329d923482d"
  }, {
    "name": "users/a-aidyn00/my-feature-3",
    "hash": "9748ds893432438dsd823329d923482d"
  }, {
    "name": "users/a-aidyn00/my-feature-4",
    "hash": "9748ds893432438dsd823329d923482d"
  }, {
    "name": "users/a-aidyn00/my-feature-5",
    "hash": "9748ds893432438dsd823329d923482d"
  }]
};
},{}],"lib/services.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFiles = fetchFiles;
exports.fetchBranches = fetchBranches;

function fetchFiles() {
  var filesMock = require('../data/files.json').files;

  return new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve(filesMock);
    }, 2000);
  });
}

function fetchBranches() {
  var branchesMock = require('../data/branches.json').branches;

  return new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve(branchesMock);
    }, 3000);
  });
}
},{"../data/files.json":"data/files.json","../data/branches.json":"data/branches.json"}],"lib/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFilter = setFilter;
exports.setActiveTab = setActiveTab;
exports.setFilesLoading = setFilesLoading;
exports.setFiles = setFiles;
exports.setBranchesLoading = setBranchesLoading;
exports.setBranches = setBranches;
exports.loadFiles = loadFiles;
exports.loadBranches = loadBranches;
exports.store = void 0;

var _createStore = _interopRequireDefault(require("./create-store"));

var _middleware = _interopRequireDefault(require("./middleware"));

var _services = require("./services");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initState = {
  filter: '',
  filesLoading: false,
  filesLoaded: false,
  files: [],
  branchesLoading: false,
  branchesLoaded: false,
  branches: [],
  activeTab: ''
};
var actionTypes = Object.freeze({
  SET_FILTER: 'setFilter',
  SET_FILES: 'setFiles',
  SET_FILES_LOADING: 'setFilesLoading',
  SET_BRANCHES: 'setBranches',
  SET_BRANCHES_LOADING: 'setBranchesLoading',
  SET_ACTIVE_TAB: 'setActiveTab'
});

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_FILTER:
      return _objectSpread({}, state, {
        filter: action.payload
      });

    case actionTypes.SET_FILES_LOADING:
      return _objectSpread({}, state, {
        filesLoading: true
      });

    case actionTypes.SET_FILES:
      return _objectSpread({}, state, {
        filesLoading: false,
        filesLoaded: true,
        files: action.payload
      });

    case actionTypes.SET_BRANCHES_LOADING:
      return _objectSpread({}, state, {
        branchesLoading: true
      });

    case actionTypes.SET_BRANCHES:
      return _objectSpread({}, state, {
        branchesLoading: false,
        branchesLoaded: true,
        branches: action.payload
      });

    case actionTypes.SET_ACTIVE_TAB:
      return _objectSpread({}, state, {
        activeTab: action.payload
      });

    default:
      return state;
  }
}

var store = (0, _createStore.default)(reducer, initState, [_middleware.default]);
exports.store = store;

function setFilter(value) {
  return {
    type: actionTypes.SET_FILTER,
    payload: value
  };
}

function setActiveTab(value) {
  return {
    type: actionTypes.SET_ACTIVE_TAB,
    payload: value
  };
}

function setFilesLoading() {
  return {
    type: actionTypes.SET_FILES_LOADING
  };
}

function setFiles(value) {
  return {
    type: actionTypes.SET_FILES,
    payload: value
  };
}

function setBranchesLoading() {
  return {
    type: actionTypes.SET_BRANCHES_LOADING
  };
}

function setBranches(value) {
  return {
    type: actionTypes.SET_BRANCHES,
    payload: value
  };
}

function loadFiles() {
  return function (dispatch) {
    dispatch(setFilesLoading());
    (0, _services.fetchFiles)().then(function (files) {
      return dispatch(setFiles(files));
    });
  };
}

function loadBranches() {
  return function (dispatch) {
    dispatch(setBranchesLoading());
    (0, _services.fetchBranches)().then(function (branches) {
      return dispatch(setBranches(branches));
    });
  };
}
},{"./create-store":"lib/create-store.js","./middleware":"lib/middleware.js","./services":"lib/services.js"}],"lib/view.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var View =
/*#__PURE__*/
function () {
  function View(el, store) {
    var _this = this;

    _classCallCheck(this, View);

    this._el = el;
    this._store = store;
    this._isDestroyed = false;
    this._unsubscribe = store.subscribe(this._prepareRender.bind(this));

    this._prepareRender();

    if (typeof this.componentDidMount === 'function') {
      Promise.resolve().then(function () {
        return _this.componentDidMount();
      });
    }
  }

  _createClass(View, [{
    key: "_prepareRender",
    value: function _prepareRender() {
      if (this._isDestroyed) {
        return;
      }

      var state = this._store.getState();

      if (typeof this.shouldComponentUpdate === 'function' && !this.shouldComponentUpdate(state)) {
        return;
      }

      this._el.innerHTML = this.render(state);
    }
  }, {
    key: "render",
    value: function render() {
      throw new Error('Render should be overridden');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._isDestroyed = true;
      this._el.innerHTML = '';

      this._unsubscribe();
    }
  }]);

  return View;
}();

exports.default = View;
},{}],"components/filter/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _store = require("../../lib/store");

var _view = _interopRequireDefault(require("../../lib/view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Filter =
/*#__PURE__*/
function (_View) {
  _inherits(Filter, _View);

  function Filter(el, store) {
    var _this;

    _classCallCheck(this, Filter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Filter).call(this, el, store));
    _this._onInput = _this._onInput.bind(_assertThisInitialized(_this));

    _this._el.addEventListener('input', _this._onInput);

    return _this;
  }

  _createClass(Filter, [{
    key: "_onInput",
    value: function _onInput(event) {
      this._store.dispatch((0, _store.setFilter)(event.target.value));
    }
  }, {
    key: "render",
    value: function render() {
      return '';
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(Filter.prototype), "destroy", this).call(this);

      this._el.removeEventListener('input', this._onInput);
    }
  }]);

  return Filter;
}(_view.default);

exports.default = Filter;
},{"../../lib/store":"lib/store.js","../../lib/view":"lib/view.js"}],"lib/simple-view.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SimpleView =
/*#__PURE__*/
function () {
  function SimpleView(el) {
    _classCallCheck(this, SimpleView);

    this._el = el;

    this._prepareRender();
  }

  _createClass(SimpleView, [{
    key: "_prepareRender",
    value: function _prepareRender() {
      this._el.innerHTML = this.render();
    }
  }, {
    key: "render",
    value: function render() {
      throw new Error('Render should be overridden');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._el.innerHTML = '';
    }
  }]);

  return SimpleView;
}();

exports.default = SimpleView;
},{}],"components/file-list/file-list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileListHead = exports.FileList = void 0;

var _view = _interopRequireDefault(require("../../lib/view"));

var _simpleView = _interopRequireDefault(require("../../lib/simple-view"));

var _store = require("../../lib/store");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FileList =
/*#__PURE__*/
function (_View) {
  _inherits(FileList, _View);

  function FileList() {
    _classCallCheck(this, FileList);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileList).apply(this, arguments));
  }

  _createClass(FileList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$_store$getState = this._store.getState(),
          filesLoaded = _this$_store$getState.filesLoaded,
          filesLoading = _this$_store$getState.filesLoading;

      if (!filesLoaded && !filesLoading) {
        this._store.dispatch((0, _store.loadFiles)());
      }
    }
  }, {
    key: "render",
    value: function render(_ref) {
      var filter = _ref.filter,
          files = _ref.files,
          filesLoading = _ref.filesLoading;

      if (filesLoading) {
        return 'Loading...';
      }

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
}(_view.default);

exports.FileList = FileList;

var FileListHead =
/*#__PURE__*/
function (_SimpleView) {
  _inherits(FileListHead, _SimpleView);

  function FileListHead() {
    _classCallCheck(this, FileListHead);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileListHead).apply(this, arguments));
  }

  _createClass(FileListHead, [{
    key: "render",
    value: function render() {
      return "\n    <tr class=\"Table-Head\">\n      <td class=\"Table-Col\">\n        Name\n      </td>\n      <td class=\"Table-Col\">\n        Last commit\n      </td>\n      <td class=\"Table-Col\">\n        Commit message\n      </td>\n      <td class=\"Table-Col\">\n        Committer\n      </td>\n      <td class=\"Table-LastCol\">\n        Updated\n      </td>\n    </tr>";
    }
  }]);

  return FileListHead;
}(_simpleView.default);

exports.FileListHead = FileListHead;
},{"../../lib/view":"lib/view.js","../../lib/simple-view":"lib/simple-view.js","../../lib/store":"lib/store.js"}],"components/branch-list/branch-list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BranchListHead = exports.BranchList = void 0;

var _view = _interopRequireDefault(require("../../lib/view"));

var _simpleView = _interopRequireDefault(require("../../lib/simple-view"));

var _store = require("../../lib/store");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BranchList =
/*#__PURE__*/
function (_View) {
  _inherits(BranchList, _View);

  function BranchList() {
    _classCallCheck(this, BranchList);

    return _possibleConstructorReturn(this, _getPrototypeOf(BranchList).apply(this, arguments));
  }

  _createClass(BranchList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$_store$getState = this._store.getState(),
          branchesLoaded = _this$_store$getState.branchesLoaded,
          branchesLoading = _this$_store$getState.branchesLoading;

      if (!branchesLoaded && !branchesLoading) {
        this._store.dispatch((0, _store.loadBranches)());
      }
    }
  }, {
    key: "render",
    value: function render(_ref) {
      var filter = _ref.filter,
          branches = _ref.branches,
          branchesLoading = _ref.branchesLoading;

      if (branchesLoading) {
        return 'Loading...';
      }

      var renderBranches = branches;

      if (filter) {
        renderBranches = branches.filter(function (_ref2) {
          var name = _ref2.name;
          return name.includes(filter);
        });
      }

      return renderBranches.map(function (_ref3) {
        var name = _ref3.name,
            hash = _ref3.hash;
        return "\n    <tr class=\"Table-Line Divider\">\n      <td class=\"Table-Col\">\n        <span class=\"FileTypeIcon FileTypeIcon_type_branch\">\n          ".concat(name, "\n        </span>\n      </td>\n      <td class=\"Table-LastCol\">\n        <a href=\"#\" class=\"CommitHash Link\">").concat(hash, "</a>\n      </td>\n    </tr>\n    ");
      }).join('');
    }
  }]);

  return BranchList;
}(_view.default);

exports.BranchList = BranchList;

var BranchListHead =
/*#__PURE__*/
function (_SimpleView) {
  _inherits(BranchListHead, _SimpleView);

  function BranchListHead() {
    _classCallCheck(this, BranchListHead);

    return _possibleConstructorReturn(this, _getPrototypeOf(BranchListHead).apply(this, arguments));
  }

  _createClass(BranchListHead, [{
    key: "render",
    value: function render() {
      return "\n    <tr class=\"Table-Head\">\n      <td class=\"Table-Col\">\n        Name\n      </td>\n      <td class=\"Table-LastCol\">\n        Commit hash\n      </td>\n    </tr>";
    }
  }]);

  return BranchListHead;
}(_simpleView.default);

exports.BranchListHead = BranchListHead;
},{"../../lib/view":"lib/view.js","../../lib/simple-view":"lib/simple-view.js","../../lib/store":"lib/store.js"}],"components/table/table.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fileList = require("../file-list/file-list");

var _branchList = require("../branch-list/branch-list");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Table =
/*#__PURE__*/
function () {
  function Table(el, store) {
    _classCallCheck(this, Table);

    this._el = el;
    this._store = store;
    this._unsubscribe = store.subscribe(this._prepareRender.bind(this));

    this._prepareRender();
  }

  _createClass(Table, [{
    key: "_prepareRender",
    value: function _prepareRender() {
      this._destroyChildren();

      var _this$_store$getState = this._store.getState(),
          activeTab = _this$_store$getState.activeTab;

      var head = this._el.querySelector('thead');

      this._head = activeTab === 'Files' ? new _fileList.FileListHead(head, this._store) : new _branchList.BranchListHead(head, this._store);

      var body = this._el.querySelector('tbody');

      this._body = activeTab === 'Files' ? new _fileList.FileList(body, this._store) : new _branchList.BranchList(body, this._store);
    }
  }, {
    key: "_destroyChildren",
    value: function _destroyChildren() {
      if (this._head) {
        this._head.destroy();
      }

      if (this._body) {
        this._body.destroy();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyChildren();

      this._unsubscribe();
    }
  }]);

  return Table;
}();

exports.default = Table;
},{"../file-list/file-list":"components/file-list/file-list.js","../branch-list/branch-list":"components/branch-list/branch-list.js"}],"components/tabs/tabs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("../../lib/view"));

var _store = require("../../lib/store");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Tabs =
/*#__PURE__*/
function (_View) {
  _inherits(Tabs, _View);

  function Tabs(el, store, tabs) {
    var _this;

    _classCallCheck(this, Tabs);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tabs).call(this, el, store));
    _this._tabs = tabs;
    _this._onClick = _this._onClick.bind(_assertThisInitialized(_this));

    _this._el.addEventListener('click', _this._onClick);

    _this._store.dispatch((0, _store.setActiveTab)(_this._tabs[0]));

    return _this;
  }

  _createClass(Tabs, [{
    key: "_onClick",
    value: function _onClick(e) {
      if (e.target.nodeName === 'A') {
        this._store.dispatch((0, _store.setActiveTab)(e.target.innerHTML.trim()));
      }
    }
  }, {
    key: "render",
    value: function render(_ref) {
      var activeTab = _ref.activeTab;

      if (!this._tabs) {
        return '';
      }

      return this._tabs.map(function (tab) {
        return tab === activeTab ? "\n    <div class=\"Tabs-Tab Typo-Caps Tabs-Tab_active_true Typo_weight_bold\">\n      ".concat(tab, "\n    </div>\n    ") : "\n    <div class=\"Tabs-Tab Typo-Caps Typo_weight_bold\">\n      <a href=\"#\" class=\"Tabs-Link Link\">".concat(tab, "</a>\n    </div>\n    ");
      }).join('');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(Tabs.prototype), "destroy", this).call(this);

      this._el.removeEventListener('click', this._onClick);
    }
  }]);

  return Tabs;
}(_view.default);

exports.default = Tabs;
},{"../../lib/view":"lib/view.js","../../lib/store":"lib/store.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _store = require("./lib/store");

var _filter = _interopRequireDefault(require("./components/filter/filter"));

var _table = _interopRequireDefault(require("./components/table/table"));

var _tabs = _interopRequireDefault(require("./components/tabs/tabs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (window.location.pathname === '/files.html') {
  var filterInput = document.querySelector('.FilterTable');

  if (filterInput) {
    new _filter.default(filterInput, _store.store);
  }

  var tabsElement = document.querySelector('.Tabs');

  if (tabsElement) {
    new _tabs.default(tabsElement, _store.store, ['Files', 'Branches']);
  }

  var tableElement = document.querySelector('.Table');

  if (tableElement) {
    new _table.default(tableElement, _store.store);
  }
}
},{"./lib/store":"lib/store.js","./components/filter/filter":"components/filter/filter.js","./components/table/table":"components/table/table.js","./components/tabs/tabs":"components/tabs/tabs.js"}]},{},["index.js"], "index")
//# sourceMappingURL=/index.js.map