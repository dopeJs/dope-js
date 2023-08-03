const config = require('./cz-config');

function makeAdapter() {
  return {
    prompter(cz, commit) {
      cz.prompt(config.options).then((ans) => doCommit(ans, commit));
    },
  };
}

function doCommit(answers, commit) {
  var head = answers.type + ': ' + answers.subject.trim();

  var body = answers.body ? answers.body.trim() : '';
  if (body) {
    body = body.split('|').join('\n');
  }

  var breaking = answers.breaking ? answers.breaking.trim() : '';
  breaking = breaking ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '') : '';

  var issues = answers.issues ? answers.issues : '';

  var footer = [breaking, issues].filter((e) => !!e).join('\n');

  const result = [head, body, footer].filter((e) => !!e).join('\n\n');
  commit(result);
}

module.exports = makeAdapter(config);
