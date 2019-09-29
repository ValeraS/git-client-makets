import View from '../../lib/view';
import SimpleView from '../../lib/simple-view';
import { loadFiles } from '../../lib/store';

export class FileList extends View {
  componentDidMount() {
    const { filesLoaded, filesLoading } = this._store.getState();
    if (!filesLoaded && !filesLoading) {
      this._store.dispatch(loadFiles());
    }
  }

  render({ filter, files, filesLoading }) {
    if (filesLoading) {
      return 'Loading...';
    }

    let renderFiles = files;
    if (filter) {
      renderFiles = files.filter(({ name }) => name.includes(filter));
    }
    return renderFiles
      .map(
        ({ type, name, hash, message, committer, time }) => `
    <tr class="Table-Line Divider">
      <td class="Table-Col">
        <span class="FileTypeIcon FileTypeIcon_type_${type}">
          ${name}
        </span>
      </td>
      <td class="Table-Col">
        <a href="#" class="CommitHash Link">${hash}</a>
      </td>
      <td class="Table-Col">
        ${message}
      </td>
      <td class="Table-Col">
        <span class="Committer">
          <span class="Committer-FirstLetter">
          ${committer[0]}</span>${committer.slice(1)}
        </span>
      </td>
      <td class="Table-LastCol">
        ${time}
      </td>
    </tr>
  `
      )
      .join('');
  }
}

export class FileListHead extends SimpleView {
  render() {
    return `
    <tr class="Table-Head">
      <td class="Table-Col">
        Name
      </td>
      <td class="Table-Col">
        Last commit
      </td>
      <td class="Table-Col">
        Commit message
      </td>
      <td class="Table-Col">
        Committer
      </td>
      <td class="Table-LastCol">
        Updated
      </td>
    </tr>`;
  }
}
