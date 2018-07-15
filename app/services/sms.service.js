const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})

const from = process.env.SMS_FROM;

const service = {};

service.sendSms = async (modelsService, notification) => {
  const guestToSend = await getGuestsToSend(modelsService, notification);
  for (let guest of guestToSend) {
    await sendSmsToPerson(guest, notification.text);
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

const getGuestsToSend = async (modelsService, notification) => {
  const findQuery = buildFindQuery(notification);
  return await modelsService.getModel('Guest').find(findQuery).populate({ path: 'table', select: 'number name' });
}

const buildFindQuery = (notification) => {
  const query = { sendSms: true };
  if (notification.isBusNotification) {
    query.isTakingBus = true;
    if (notification.stayingPlace) {
      query.stayingPlace = notification.stayingPlace;
    }
  }
  return query;
}

module.exports = service;