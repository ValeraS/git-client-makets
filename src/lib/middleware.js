export default function middleware({ getState, dispatch }) {
  return function(action) {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return dispatch(action);
  };
}
