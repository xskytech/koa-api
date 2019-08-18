const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');

const { mailer: { sendgridApiKey, emails } } = require('../config');

sgMail.setApiKey(sendgridApiKey);

class Mailer {
  static async send({
    to, from = emails.support, subject, template, params
  }) {
    return sgMail.send({
      to,
      from,
      subject,
      html: await ejs.renderFile(`${__dirname}/../public/templates/${template}.ejs`, params)
    });
  }
}

module.exports = Mailer;
