const service = require('../services/guest.service');

module.exports = (app, modelsService) => {

    const registerUpdateGuestOrder = () => {
        const url = '/api/guest/order/:id';
        app.put(url,
            (req, res) => {
                service.updateGuestOrder(modelsService, req.params.id, req.body.order)
                    .then(result => res.status(result.statusCode).send(result.data))
                    .catch(err => res.status(500).send(err) );
            });
        app.routesInfo['Guest'].push({ model: 'Guest', name: 'Update guest order',  method: 'PUT', url: url, body: { order: 0 } });
    }

    registerUpdateGuestOrder();
    
};