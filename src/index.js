const moment = require('moment');
const nodeSchedule = require('node-schedule');
const { jiraService } = require('./jira-service');

function log(msg, ...args) {
  console.log(`${moment().format()} - ${msg}`, ...args);
}

function logNextRun(job) {
  log('Next run: ', moment(job.nextInvocation().toISOString()).format());
}

function printConfigInfo() {
  log(`
    Config info:
    - User: ${process.env.JIRA_USER}
    - Issue id or key: ${process.env.JOB_ISSUE_ID_OR_KEY}
    - Schedule rule: ${process.env.JOB_SCHEDULE_RULE}
    - Time spent: ${process.env.JOB_TIMESPENT}
    - Comment: ${process.env.JOB_COMMENT}
  `);
}

async function jobExecute(job) {
  log('Job executing...');

  const data = await jiraService.addLogWork(
    process.env.JOB_ISSUE_ID_OR_KEY,
    process.env.JOB_TIMESPENT,
    new Date(),
    process.env.JOB_COMMENT
  );

  log(JSON.stringify(data));

  logNextRun(job);
}

async function main() {
  printConfigInfo();

  log('APP started.');

  if (!process.env.JOB_ISSUE_ID_OR_KEY) throw Error('Missing issue id or key.');
  if (!process.env.JOB_SCHEDULE_RULE) throw Error('Missing job schedule rule.');
  if (!process.env.JOB_TIMESPENT) throw Error('Missing time spent.');
  if (!process.env.JOB_COMMENT) throw Error('Missing work log comment.');

  try {
    const currentUser = await jiraService.getCurrentUser();

    log('Current user: ', currentUser);

    const job = nodeSchedule.scheduleJob(process.env.JOB_SCHEDULE_RULE, () => {
      jobExecute(job).catch(err => {
        console.error(err.stack);
      });
    });

    logNextRun(job);

    log('APP waiting...');
  } catch (err) {
    console.error(err.stack);
  }
}

main();
