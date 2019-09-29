const { store, setFiles } = require('./lib/store');
const FilterTable = require('./components/filter-table/filter-table');
const FileList = require('./components/file-list/file-list');

const el = document.querySelector('.FilterTable');
const filter = new FilterTable(el, store);

const fileList = document.querySelector('.FileList');
new FileList(fileList, store);

function fetchFiles() {
  const filesMock = require('./data/files.json').files;
  return new Promise(resolve => setTimeout(() => resolve(filesMock), 2000));
}

store.dispatch(dispatch =>
  fetchFiles().then(files => dispatch(setFiles(files)))
);
