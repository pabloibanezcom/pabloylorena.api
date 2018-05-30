const service = require('../services/notification.service');

module.exports = (app, modelsService) => {

    const registerSend = () => {
        const url = '/api/notification/:id/send';
        app.get(url,
            (req, res) => {
                service.send(modelsService, req.params.id)
                    .then(result => res.status(200).send(result))
                    .catch(err => res.status(500).send(err.message));
            });
        app.routesInfo['Notification'].push({ model: 'Notification', name: 'Send', method: 'GET', url: url });
    }

    registerSend();

};