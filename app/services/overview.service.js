const service = {};

service.getMainReport = async (modelsService) => {
    const guests = await modelsService.getModel('Guest').find({}).populate({
        path: 'invitation', select: 'alias', populate: [
            { path: 'group', select: 'name host' }]
    }
    );
    const result = {
        isAttendingFriday: getYesNoDoubtful(guests, 'isAttendingFriday'),
        isAttending: getYesNoDoubtful(guests, 'isAttending'),
        isAttendingExpectation: getYesNoDoubtful(guests, 'isAttendingExpectation')
    };
    return { statusCode: 200, report: result };
}

const getYesNoDoubtful = (guests, property) => {
    return {
        yes: getYesNoDoubtfulOption(guests.filter(g => g[property] === true)),
        no: getYesNoDoubtfulOption(guests.filter(g => g[property] === false)),
        doubtful: getYesNoDoubtfulOption(guests.filter(g => g[property] !== false && g[property] !== true))
    };
}

const getYesNoDoubtfulOption = (guests) => {
    return Object.assign({ 'total': guests.length }, groupByTypes(guests), groupByStayingPlace(guests), groupByGroup(guests));
}

const groupByTypes = (guests) => {
    return {
        'male': guests.filter(g => g.type === 1).length,
        'female': guests.filter(g => g.type === 2).length,
        'child': guests.filter(g => g.type === 3).length,
        'baby': guests.filter(g => g.type === 4).length
    }
}

const groupByStayingPlace = (guests) => {
    return {
        'navalmoral': guests.filter(g => g.stayingPlaceExpectation === 'Navalmoral').length,
        'jarandilla': guests.filter(g => g.stayingPlaceExpectation === 'Jarandilla').length,
        'otro': guests.filter(g => g.stayingPlaceExpectation === 'Otro').length
    }
}

const groupByGroup = (guests) => {
    const result = {};
    guests.forEach(g => {
        if (g.invitation && g.invitation.group && g.invitation.group.name) {
            if (result[g.invitation.group.name]) {
                result[g.invitation.group.name]++;
            } else {
                result[g.invitation.group.name] = 1;
            }
        }
    });
    return {
        groups: result
    }
}

module.exports = service;