const JiraService = require('./jira-service');

const jiraService = new JiraService();

jiraService
  .listWorkLogsByIssueIdOrKey('SCINFLUENCER-1742')
  .then(data => {
    console.log(data);
  })
  .then(() => {
    return jiraService
      .addLogWork(
        'SCINFLUENCER-1742',
        '1h',
        new Date(),
        '- Improve unit test coverage.'
      )
      .then(data => {
        console.log(data);
      });
  })
  .catch(err => {
    console.log(err);
  });
