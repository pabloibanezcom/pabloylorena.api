const generationService = require('../generation.service');

const createNew = (dataObj, models) => {
    return new Promise((resolve, reject) => {
        models['Group'].find({ 'name': dataObj.group.name, 'host': dataObj.group.host }, (err, docs) => {
            const newObj = new models['Invitation']();
            Object.entries(dataObj).forEach(entry => { newObj[entry[0]] = entry[1] });
            newObj.guid = generationService.guid();
            newObj.groupId = docs[0]._id;
            newObj.save((err, res) => {
                if (err) { reject() };
                resolve();
            });
        });
    });
}

module.exports = createNew;