const service = require('../services/notification.service');

module.exports = (app, modelsService) => {

    app.routesInfo['Notification']= [];

    const registerSendSms = () => {
        const url = '/api/notification/sms';
        app.post(url,
            (req, res) => {
                service.notifyBySms(modelsService, req.body.text)
                    .then(result => res.status(200).send({}))
                    .catch(err => res.status(500).send(err.message) );
            });
        app.routesInfo['Notification'].push({ model: 'Notification', name: 'Send SMS',  method: 'post', url: url, body: { text: '' } });
    }

    registerSendSms();
    
};