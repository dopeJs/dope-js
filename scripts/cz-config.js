/* eslint-disable no-multi-spaces */

const { getPackagesSync } = require('./get-packages');

const types = [
  { value: 'feat',     name: 'feat:     A new feature' },
  { value: 'fix',      name: 'fix:      Fix a well know bug.' },
  { value: 'amend',    name: 'amend:    Fix errata.' },
  { value: 'wip',      name: 'wip:      Work In Process, should be squashed' },
  { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature, just restructuring existing code or clean code' },
  { value: 'style',    name: 'style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)' },
  { value: 'docs',     name: 'docs:     Documentation only changes' },
  { value: 'config',   name: 'config:   Change project configurations.' },
  { value: 'test',     name: 'test:     Adding missing tests or correcting existing tests' },
  { value: 'revert',   name: 'revert:   Reverts a previous commit' },
  { value: 'perf',     name: 'perf:     A code change that improves performance' },
  { value: 'chore',    name: 'chore:    Other changes that don\'t modify src or test files' },
];

const scopes = getPackagesSync({ all: true }).map(name => ({ name }));
scopes.push(
  { name: 'demo' }, // alias of `demos`
  { name: 'svgson' }, // alias of `svgson-loader` and `rollup-plugin-svgson`
  { name: 'overall' },
);

const options = [
  {
    type: 'list',
    name: 'type',
    message: 'Select the type of change that you\'re committing:',
    choices: types,
  },
  {
    type: 'list',
    name: 'scope',
    message: 'Denote the SCOPE of this change:',
    choices: scopes,
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
  },
  {
    type: 'input',
    name: 'body',
    message: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
  },
  {
    type: 'confirm',
    name: 'isBreaking',
    message: 'Are there any breaking changes?',
    default: false,
  },
  {
    type: 'input',
    name: 'breaking',
    message: 'Describe the breaking changes:\n',
    when: function(answers) {
      return answers.isBreaking;
    },
  },
  {
    type: 'confirm',
    name: 'isIssueAffected',
    message: 'Does this change affect any open issues?',
    default: false,
  },
  {
    type: 'input',
    name: 'issues',
    message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
    when: function(answers) {
      return answers.isIssueAffected;
    },
  },
];

module.exports = { types, scopes, options };
