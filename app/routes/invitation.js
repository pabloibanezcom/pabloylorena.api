const http = require("http");
const invitationService = require('../../services/invitation.service');

module.exports = (app, passport) => {
    app.get('/api/admin/invitations',
        // passport.authenticate('admin'),
        (req, res) => {
            invitationService.getInvitations()
                .then(invitations => res.send(invitations))
                .catch(error => console.log(error));
        });

    app.get('/api/admin/invitation/:guid',
        // passport.authenticate('admin'),
        (req, res) => {
            invitationService.getInvitation(req.param('guid'), false)
                .then(invitation => res.send(invitation))
                .catch(error => console.log(error));
        });

    app.get('/api/invitation/:guid',
        (req, res) => {
            invitationService.getInvitation(req.param('guid'), true)
                .then(invitation => res.send(invitation))
                .catch(error => console.log(error));
        });

    app.put('/api/admin/invitation',
        // passport.authenticate('admin'),
        (req, res) => {
            invitationService.updateInvitation(req.body)
                .then(invitation => res.send(req.body))
                .catch(error => console.log(error));
        });

    app.put('/api/invitation',
        (req, res) => {
            invitationService.updateInvitationByGuest(req.body)
                .then(invitation => res.send(req.body))
                .catch(error => console.log(error));
        });
};