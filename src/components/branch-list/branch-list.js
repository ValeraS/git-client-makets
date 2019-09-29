import View from '../../lib/view';
import SimpleView from '../../lib/simple-view';
import { loadBranches } from '../../lib/store';

export class BranchList extends View {
  componentDidMount() {
    const { branchesLoaded, branchesLoading } = this._store.getState();
    if (!branchesLoaded && !branchesLoading) {
      this._store.dispatch(loadBranches());
    }
  }

  render({ filter, branches, branchesLoading }) {
    if (branchesLoading) {
      return 'Loading...';
    }

    let renderBranches = branches;
    if (filter) {
      renderBranches = branches.filter(({ name }) => name.includes(filter));
    }
    return renderBranches
      .map(
        ({ name, hash }) => `
    <tr class="Table-Line Divider">
      <td class="Table-Col">
        <span class="FileTypeIcon FileTypeIcon_type_branch">
          ${name}
        </span>
      </td>
      <td class="Table-LastCol">
        <a href="#" class="CommitHash Link">${hash}</a>
      </td>
    </tr>
    `
      )
      .join('');
  }
}

export class BranchListHead extends SimpleView {
  render() {
    return `
    <tr class="Table-Head">
      <td class="Table-Col">
        Name
      </td>
      <td class="Table-LastCol">
        Commit hash
      </td>
    </tr>`;
  }
}
