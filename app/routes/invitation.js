const service = require('../services/invitation.service');

module.exports = (app, modelsService) => {

    const registerGetInvitationByGuid = () => {
        const url = '/api/invitation/guid/:guid';
        app.get(url,
            (req, res) => {
                service.getInvitationByGuid(modelsService, req.params.guid)
                    .then(result => res.status(result.statusCode).send(result.invitation))
                    .catch(err => res.status(500).send(err.message) );
            });
        app.routesInfo['Invitation'].push({ model: 'Invitation', name: 'Get By GUID',  method: 'get', url: url });
    }

    const registerConfirmAttendance = () => {
        const url = '/api/invitation/confirmattendance';
        app.post(url,
            (req, res) => {
                service.confirmAttendance(modelsService, req.body)
                    .then(result => res.status(result.statusCode).send(result.message))
                    .catch(err => res.status(500).send(err) );
            });
        app.routesInfo['Invitation'].push({ model: 'Invitation', name: 'Confirm Attendance',  method: 'POST', url: url });
    }

    registerGetInvitationByGuid();
    registerConfirmAttendance();
    
};