import { store } from './lib/store';
import Filter from './components/filter/filter';
import Table from './components/table/table';
import Tabs from './components/tabs/tabs';

if (window.location.pathname === '/files.html') {
  const filterInput = document.querySelector('.FilterTable');
  if (filterInput) {
    new Filter(filterInput, store);
  }

  const tabsElement = document.querySelector('.Tabs');
  if (tabsElement) {
    new Tabs(tabsElement, store, ['Files', 'Branches']);
  }

  const tableElement = document.querySelector('.Table');
  if (tableElement) {
    new Table(tableElement, store);
  }
}
