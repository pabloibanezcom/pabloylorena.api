const Guest = require('../app/models/guest');

const guestService = {};

guestService.getGuests = () => {
    return Guest.find({});
}

guestService.getGuestsByInvitation = (invitationGuid) => {
    return Guest.find({ invitationGuid: invitationGuid });
}

guestService.addGuest = (guest) => {
    const newGuest = new Guest({
        name: guest.name,
        email: guest.email,
        isAllergic: guest.isAllergic,
        allergies: guest.allergies,
        busTime: guest.busTime
    });
    return newGuest.save();
}

guestService.updateGuest = (guest) => {
    return Guest.update({ _id: guest._id }, guest);
}

guestService.updateGuestByGuest = (guest) => {
    // return Guest.update({ _id: guest._id }, guest);

    return Guest.findOne({ _id: guest._id }, (err, doc) => {
        doc.name = guest.name,
        doc.email = guest.email,
        doc.type = guest.type,
        doc.isAllergic = guest.isAllergic,
        doc.allergies = guest.allergies,
        doc.busTime = guest.busTime, 
        doc.additionalComments = guest.additionalComments
        doc.save();
      });
}

guestService.getPublicGuest = (guest) => {
    return {
        _id: guest._id,
        name: guest.name,
        email: guest.email,
        type: guest.type,
        isAllergic: guest.isAllergic,
        allergies: guest.allergies,
        busTime: guest.busTime, 
        additionalComments: guest.additionalComments
    }
}

module.exports = guestService;