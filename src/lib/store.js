import createStore from './create-store';
import middleware from './middleware';
import { fetchFiles, fetchBranches } from './services';

const initState = {
  filter: '',
  filesLoading: false,
  filesLoaded: false,
  files: [],
  branchesLoading: false,
  branchesLoaded: false,
  branches: [],
  activeTab: '',
};

const actionTypes = Object.freeze({
  SET_FILTER: 'setFilter',
  SET_FILES: 'setFiles',
  SET_FILES_LOADING: 'setFilesLoading',
  SET_BRANCHES: 'setBranches',
  SET_BRANCHES_LOADING: 'setBranchesLoading',
  SET_ACTIVE_TAB: 'setActiveTab',
});

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case actionTypes.SET_FILES_LOADING:
      return {
        ...state,
        filesLoading: true,
      };
    case actionTypes.SET_FILES:
      return {
        ...state,
        filesLoading: false,
        filesLoaded: true,
        files: action.payload,
      };
    case actionTypes.SET_BRANCHES_LOADING:
      return {
        ...state,
        branchesLoading: true,
      };
    case actionTypes.SET_BRANCHES:
      return {
        ...state,
        branchesLoading: false,
        branchesLoaded: true,
        branches: action.payload,
      };
    case actionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    default:
      return state;
  }
}

export const store = createStore(reducer, initState, middleware);

export function setFilter(value) {
  return {
    type: actionTypes.SET_FILTER,
    payload: value,
  };
}

export function setActiveTab(value) {
  return {
    type: actionTypes.SET_ACTIVE_TAB,
    payload: value,
  };
}

export function setFilesLoading() {
  return {
    type: actionTypes.SET_FILES_LOADING,
  };
}

export function setFiles(value) {
  return {
    type: actionTypes.SET_FILES,
    payload: value,
  };
}

export function setBranchesLoading() {
  return {
    type: actionTypes.SET_BRANCHES_LOADING,
  };
}

export function setBranches(value) {
  return {
    type: actionTypes.SET_BRANCHES,
    payload: value,
  };
}

export function loadFiles() {
  return dispatch => {
    dispatch(setFilesLoading());
    fetchFiles().then(files => dispatch(setFiles(files)));
  };
}

export function loadBranches() {
  return dispatch => {
    dispatch(setBranchesLoading());
    fetchBranches().then(branches => dispatch(setBranches(branches)));
  };
}
