const Group = require('../app/models/group');

const groupService = {};

groupService.getGroups = () => {
    return Group.find({});
}

module.exports = groupService;