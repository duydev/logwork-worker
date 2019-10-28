// https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-worklog-post
// https://github.com/steves/node-jira/blob/master/lib/jira.js
const { JiraApi } = require('jira');
const moment = require('moment');

class JiraService extends JiraApi {
  constructor() {
    const config = {
      protocol: process.env.JIRA_PROTOCOL,
      host: process.env.JIRA_HOST,
      port: process.env.JIRA_PORT,
      user: process.env.JIRA_USER,
      pass: process.env.JIRA_PASS,
      version: process.env.JIRA_API_VERSION
    };

    super(
      config.protocol,
      config.host,
      config.port,
      config.user,
      config.pass,
      config.version
    );
  }

  async listMyIssue(onlyOpen = false) {
    return new Promise((resolve, reject) => {
      this.getUsersIssues(this.username, onlyOpen, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }

  async listWorkLogsByIssueIdOrKey(issueIdOrKey) {
    var options = {
      rejectUnauthorized: this.strictSSL,
      uri: this.makeUri(`/issue/${issueIdOrKey}/worklog`),
      method: 'GET',
      json: true
    };

    return new Promise((resolve, reject) => {
      this.doRequest(options, function(error, response, body) {
        if (error) {
          return reject(error);
        }

        if (response.statusCode === 200) {
          return resolve(body);
        }

        return reject(
          response.statusCode + ': Error while retrieving issue types'
        );
      });
    });
  }

  async addLogWork(issueIdOrKey, timeSpent, dateStarted, comment) {
    if (!timeSpent) throw Error('Missing time spent.');
    if (!dateStarted) throw Error('Missing date started.');
    if (!comment) throw Error('Missing comment.');

    const body = {
      comment,
      started: moment(dateStarted).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
      timeSpent
    };

    console.log('BODY', body);

    var options = {
      rejectUnauthorized: this.strictSSL,
      uri: this.makeUri(
        `/issue/${issueIdOrKey}/worklog?notifyUsers=false&adjustEstimate=auto`
      ),
      body: body,
      method: 'POST',
      followAllRedirects: true,
      json: true
    };

    return new Promise((resolve, reject) => {
      this.doRequest(options, function(error, response, body) {
        if (error) {
          return reject(error);
        }

        if (response.statusCode === 201) {
          return resolve('Success');
        }
        if (response.statusCode === 400) {
          return reject('Invalid Fields: ' + JSON.stringify(body));
        }
        if (response.statusCode === 403) {
          return reject('Insufficient Permissions');
        }

        return reject(response.statusCode + ': Error while updating');
      });
    });
  }
}

module.exports = JiraService;
