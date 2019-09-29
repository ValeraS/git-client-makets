const View = require('../../lib/view');

class FileList extends View {
  constructor(el, store) {
    super(el.querySelector('tbody'), store);
  }

  render({filter, files}) {
    let renderFiles = files;
    if (filter) {
      renderFiles = files.filter(({ name }) => name.includes(filter));
    }
    return renderFiles.map(({type, name, hash, message, committer, time}) => `
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
  `).join('');
  }
}

module.exports = FileList;