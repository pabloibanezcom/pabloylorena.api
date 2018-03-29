
const service = {};

service.updateGuestOrder = async (modelsService, guestId, order) => {
    const guest = await modelsService.getModel('Guest').findOne({ _id: guestId });
    guest.order = order;
    await guest.save()
    return { statusCode: 200, data: guest };
}

module.exports = service;