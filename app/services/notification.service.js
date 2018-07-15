const smsService = require('./sms.service');

const service = {}

service.send = async (modelsService, notificationId) => {
    const notification = await modelsService.getModel('Notification').findOne({ _id: notificationId });
    if (notification.type === 'Movil') {
        await smsService.sendSms(modelsService, notification);
    }
    notification.sentTime = Date.now();
    return notification.save();
}

module.exports = service;