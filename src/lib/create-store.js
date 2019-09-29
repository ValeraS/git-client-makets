function createStore(reducer, initialState, middleware) {
  if (typeof middleware === 'function') {
    return applyMiddleware(middleware);
  }

  function applyMiddleware(middleware) {
    const store = createStore(reducer, initialState);
    const dispatchWithMiddleware = middleware({
      getState: store.getState,
      dispatch: store.dispatch,
    });
    return Object.assign({}, store, {
      dispatch: dispatchWithMiddleware,
    });
  }

  if (typeof reducer !== 'function') {
    throw new Error('Reducer must be a function');
  }

  const subscribers = [];
  let state = initialState;
  let isDispatching = false;

  function dispatch(action) {
    if (isDispatching) {
      throw new Error('Reducer may not dispatch actions');
    }

    if (!action || typeof action !== 'object') {
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

    subscribers.map(listener => listener());
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    subscribers.push(listener);

    return function() {
      subscribers = subscribers.filter(l => l !== listener);
    };
  }

  function getState() {
    return state;
  }

  const store = {
    dispatch,
    subscribe,
    getState,
  };
  return store;
}

module.exports =createStore;
