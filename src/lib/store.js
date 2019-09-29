const createStore = require('./create-store');
const middleware = require('./middleware');

const initState = {
  filter: '',
  files: [],
};

const actionTypes = Object.freeze({
  SET_FILTER: 'setFilter',
  SET_FILES: 'setFiles',
});

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case actionTypes.SET_FILES:
      return {
        ...state,
        files: action.payload,
      };
    default:
      return state;
  }
}

module.exports.store = createStore(reducer, initState, middleware);

module.exports.setFilter = function(value) {
  return {
    type: actionTypes.SET_FILTER,
    payload: value,
  };
};

module.exports.setFiles = function(value) {
  return {
    type: actionTypes.SET_FILES,
    payload: value,
  };
};
