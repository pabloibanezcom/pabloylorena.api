const groupService = require('./group.service');
const guestService = require('./guest.service');
const Invitation = require('../app/models/invitation');

const invitationService = {};

invitationService.getInvitations = () => {
    return new Promise((resolve, reject) => {
        groupService.getGroups()
            .then(groups => {
                Invitation.find({})
                    .then(invitations => {
                        resolve(invitations.map(inv => appendGroup(inv, groups)));
                    });
            })
            .catch(error => { reject(); });
    });
}

invitationService.getInvitation = (invitationGuid, isPublic) => {
    return new Promise((resolve, reject) => {
        guestService.getGuestsByInvitation(invitationGuid)
            .then(guests => {
                Invitation.find({ guid: invitationGuid })
                    .then(invitations => {
                        invitations[0]._doc.guests = guests;
                        resolve(getPublicInvitation(invitations[0]._doc, isPublic));
                    });
            })
            .catch(error => { reject(); });
    });
}

invitationService.updateInvitation = (invitation) => {
    invitation.guests.forEach(g => { guestService.updateGuest(g).exec(); });
    return Invitation.update({ _id: invitation._id }, invitation);
}

invitationService.updateInvitationByGuest = (invitation) => {
    invitation.guests.forEach(g => { guestService.updateGuestByGuest(g).exec(); });
    return Invitation.findOne({ guid: invitation.guid }, (err, doc) => {
        doc.guid = invitation.guid,
        doc.save();
    });
}

const appendGroup = (invitation, groups) => {
    invitation._doc.group = groups.find(g => g.id === invitation.groupId);
    return invitation;
}

const getPublicInvitation = (invitation, isPublic) => {
    if (!isPublic) { return invitation; }
    return {
        guid: invitation.guid,
        guests: invitation.guests.map(g => { return guestService.getPublicGuest(g) })
    };
}

module.exports = invitationService;