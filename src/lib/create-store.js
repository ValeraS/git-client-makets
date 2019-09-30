export default function createStore(reducer, initialState, middleware) {
  if (Array.isArray(middleware)) {
    return applyMiddleware(middleware);
  }

  function applyMiddleware(middleware) {
    const store = createStore(reducer, initialState);
    const middlewareApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };
    const dispatch = middleware
      .map(m => m(middlewareApi))
      .reduce((a, b) => (...args) => a(b(...args)), a => a)(store.dispatch);
    return Object.assign({}, store, {
      dispatch,
    });
  }

  if (typeof reducer !== 'function') {
    throw new Error('Reducer must be a function');
  }

  let subscribers = [];
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

    let currentSubscribers = subscribers;
    currentSubscribers.forEach(listener => listener());
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    subscribers = [...subscribers, listener];

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
