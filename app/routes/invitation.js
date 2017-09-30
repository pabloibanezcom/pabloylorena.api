const http = require("http");
const invitationService = require('../../services/invitation.service');

module.exports = (app, passport) => {
    app.get('/api/invitations',
        // passport.authenticate('admin'),
        (req, res) => {
            invitationService.getInvitations()
                .then(invitations => res.send(invitations))
                .catch(error => console.log(error));
        });

    app.put('/api/invitations',
        // passport.authenticate('admin'),
        (req, res) => {
            invitationService.updateInvitation(req.body)
                .then(invitation => res.send(req.body))
                .catch(error => console.log(error));
        });
};