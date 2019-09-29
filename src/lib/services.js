export function fetchFiles() {
  const filesMock = require('../data/files.json').files;
  return new Promise(resolve => setTimeout(() => resolve(filesMock), 2000));
}

export function fetchBranches() {
  const branchesMock = require('../data/branches.json').branches;
  return new Promise(resolve => setTimeout(() => resolve(branchesMock), 3000));
}
