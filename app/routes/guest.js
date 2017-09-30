const http = require("http");
const guestService = require('../../services/guest.service');

module.exports = (app, passport) => {
    app.get('/api/guests',
        // passport.authenticate('admin'),
        (req, res) => {
            guestService.getGuests()
                .then(guests => res.send(guests))
                .catch(error => console.log(error));
        });

    app.post('/api/guests',
        // passport.authenticate('admin'),
        (req, res) => {
            guestService.addGuest(req.body)
                .then(guest => res.send(guest))
                .catch(error => console.log(error));
        });

    app.put('/api/guests',
        // passport.authenticate('admin'),
        (req, res) => {
            guestService.updateGuest(req.body)
                .then(guest => res.send(req.body))
                .catch(error => console.log(error));
        });
};