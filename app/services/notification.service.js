const smsService = require('./sms.service');

const service = {}

service.getNotifications = async (modelsService) => {
    const notifications = await modelsService.getModel('Notification').find({}).sort({ order: 1 });
    const guests = await modelsService.getModel('Guest').find({});
    const phoneGuests = guests.filter(g => g.phone && g.phone.startsWith('+'));
    return notifications.map(n => Object.assign(n, { guests: countGuestsForNotification(n, phoneGuests) }));
}

service.send = async (modelsService, notificationId) => {
    const notification = await modelsService.getModel('Notification').findOne({ _id: notificationId });
    if (notification.type === 'Movil') {
        await smsService.sendSms(modelsService, notification);
    }
    notification.sentTime = Date.now();
    return notification.save();
}


const countGuestsForNotification = (notification, guests) => {
    let filteredGuests = [
        ...guests
    ];
    if (notification.isBusNotification) {
        filteredGuests = filteredGuests.filter(g => g.isTakingBus);
        if (notification.stayingPlace) {
            filteredGuests = filteredGuests.filter(g => g.stayingPlace === notification.stayingPlace);
        }
    }
    return filteredGuests.length;
}

module.exports = service;