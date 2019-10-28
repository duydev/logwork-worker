const JiraService = require('./jira-service');
const nodeSchedule = require('node-schedule');

const jiraService = new JiraService();

const job = nodeSchedule.scheduleJob(process.env.JOB_SCHEDULE_RULE, () => {
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
