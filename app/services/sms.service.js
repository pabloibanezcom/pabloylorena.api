const Nexmo = require('nexmo')

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
})

const from = process.env.SMS_FROM;

const service = {};

service.sendSms = async (modelsService, text) => {
    const guestToSend = await modelsService.getModel('Guest').find({ sendSms: true }).populate({ path: 'table', select: 'number name' });
    for (let guest of guestToSend) {
        await sendSmsToPerson(guest, text);
    }
    return true;
}

const sendSmsToPerson = async (person, text) => {
    const transformedtext = text.replace('{{guest.name}}', person.name).replace('{{guest.table}}', `${person.table.number} - ${person.table.name}`);
    if (process.env.ENABLE_SMS) {
        await nexmo.message.sendSms(from, person.phone, transformedtext);
    }
    logSmsSent(from, person.phone, transformedtext);
    return;
}

const logSmsSent = (from, number, text) => {
    console.log(`SMS sent from ${from} to ${number} with text - ${text}`);
}

module.exports = service;