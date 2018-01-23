const emailService = require('./email.service');
const smsService = require('./sms.service');

const service = {}

service.notifyByEmail = (to, subject, htmlBody) => {
    emailService.sendEmail(to, subject, htmlBody);
}

service.notifyBySms = async (modelsService, text) => {
    return smsService.sendSms(modelsService, text);
}

module.exports = service;