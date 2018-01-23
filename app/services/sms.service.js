const Nexmo = require('nexmo')

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
})

const from = process.env.SMS_FROM;

const service = {};

service.sendSms = async (modelsService, text) => {
    const guestToSend = await modelsService.getModel('Guest').find({sendSms: true});
    for (let guest of guestToSend) {
        await service.sendSmsToPerson({ name: guest.name, number: guest.phone}, text);
    }
    return true;
}

service.sendSmsToPerson = async (person, text) => {
    return await nexmo.message.sendSms(from, person.number, person.name + ', ' + text);
}

module.exports = service;