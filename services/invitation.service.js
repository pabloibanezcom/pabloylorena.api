const guestService = require('./guest.service');
const Invitation = require('../app/models/invitation');

const invitationService = {};

invitationService.getInvitations = () => {
    return Invitation.find({});
}

invitationService.updateInvitation = (invitation) => {
    invitation.guests.forEach(g => { guestService.updateGuest(g).exec(); });
    return Invitation.update({ _id: invitation._id }, invitation);
}

module.exports = invitationService;