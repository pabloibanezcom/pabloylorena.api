const Guest = require('../app/models/guest');

const guestService = {};

guestService.getGuests = () => {
    return Guest.find({});
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

module.exports = guestService;