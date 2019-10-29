const JiraService = require('./jira-service');
const nodeSchedule = require('node-schedule');
const moment = require('moment');

const jiraService = new JiraService();

console.log('APP started.');

console.log(`
  - User: ${process.env.JIRA_USER}
  - Issue id or key: ${process.env.JOB_ISSUE_ID_OR_KEY}
  - Schedule rule: ${process.env.JOB_SCHEDULE_RULE}
  - Time spent: ${process.env.JOB_TIMESPENT}
  - Comment: ${process.env.JOB_COMMENT}
`);

if (!process.env.JOB_ISSUE_ID_OR_KEY) throw Error('Missing issue id or key.');
if (!process.env.JOB_SCHEDULE_RULE) throw Error('Missing job schedule rule.');
if (!process.env.JOB_TIMESPENT) throw Error('Missing time spent.');
if (!process.env.JOB_COMMENT) throw Error('Missing work log comment.');

jiraService
  .getCurrentUser()
  .then(currentUser => {
    console.log('Current user: ', currentUser);

    const job = nodeSchedule.scheduleJob(process.env.JOB_SCHEDULE_RULE, () => {
      console.log('APP running...');
      console.log(
        `Log work issue ${process.env.JOB_ISSUE_ID_OR_KEY} with time spent ${
          process.env.JOB_TIMESPENT
        } at ${moment().format()}`
      );

      jiraService
        .addLogWork(
          process.env.JOB_ISSUE_ID_OR_KEY,
          process.env.JOB_TIMESPENT,
          new Date(),
          process.env.JOB_COMMENT
        )
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
    });

    console.log('APP waiting...');
  })
  .catch(err => console.error(err));
