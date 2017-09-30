const createNew = (dataObj, models) => {
    return new Promise((resolve, reject) => {
        models['Invitation'].find({ 'alias': dataObj.invitationAlias }, (err, docs) => {
            const newObj = new models['Guest']();
            Object.entries(dataObj).forEach(entry => { newObj[entry[0]] = entry[1] });
            newObj.invitationGuid = docs[0].guid;
            newObj.save(err => {
                if (err) { reject() };
                resolve();
            });
        });
    });
}

module.exports = createNew;