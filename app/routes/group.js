const http = require("http");
const groupService = require('../../services/group.service');

module.exports = (app, passport) => {
     app.get('/api/groups',
    // passport.authenticate('admin'),
    (req, res) => {
        groupService.getGroups()
            .then(groups => res.send(groups))
            .catch(error => console.log(error));
    });
};