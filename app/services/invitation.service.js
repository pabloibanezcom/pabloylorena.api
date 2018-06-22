const notificationService = require('./notification.service');

const service = {};

service.getInvitationByGuid = async (modelsService, requestGuid) => {
    const invitation = await modelsService.getModel('Invitation').findOne({ guid: requestGuid }).populate('guests');
    if (invitation) {
        return {
            statusCode: 200, data: {
                _id: invitation._id,
                guid: invitation.guid,
                alias: invitation.alias,
                guests: invitation.guests.map(g => {
                    return {
                        _id: g._id,
                        name: g.name,
                        type: g.type,
                        email: g.email,
                        phone: g.phone,
                        stayingPlace: g.stayingPlace,
                        isAttending: g.isAttending,
                        allergies: g.allergies,
                        additionalComments: g.additionalComments
                    }
                })
            }
        };
    }
    return { statusCode: 404, data: null };
}

service.confirmAttendance = async (modelsService, attendanceObj) => {
    const Invitation = modelsService.getModel('Invitation');
    const Guest = modelsService.getModel('Guest');
    const invitation = await Invitation.findOne({ guid: attendanceObj.guid });
    if (invitation) {
        invitation.isReplied = true;
        invitation.lastModified = Date.now();
        await invitation.save();
        for (let g of attendanceObj.guests) {
            await updateGuest(Guest, g);
        }
        const emailTo = await generateEmailTo(modelsService);
        // notificationService.notifyByEmail(emailTo, 'Boda - Asistencia confirmada', generateEmailHtml(attendanceObj));
        return { statusCode: 200, data: invitation };
    }
    return { statusCode: 404, data: null };
}

const updateGuest = async (model, guestData) => {
    const guest = await model.findById(guestData._id);
    if (guest) {
        guest.name = guestData.name;
        guest.type = guestData.type;
        guest.email = guestData.email;
        guest.phone = guestData.phone;
        guest.isAttending = guestData.isAttending;
        guest.stayingPlace = guestData.stayingPlace;
        guest.allergies = guestData.allergies;
        guest.order = guestData.order;
        guest.additionalComments = guestData.additionalComments;
        guest.lastModified = Date.now();
        await guest.save();
    }
    return guest;
}

const generateEmailHtml = (invitation) => {
    let htmlResult = '';
    htmlResult += `<h3>Invitacion confirmada - ${invitation.alias}</h3><ul>`;
    htmlResult += '<hr/>';
    invitation.guests.forEach(g => {
        htmlResult += `<h4>${g.name}</h4><ul>`;
        htmlResult += generateFieldHtml('Genero', getTypeLabel(g.type));
        htmlResult += generateFieldHtml('Email', getAttendingLabel(g.email));
        htmlResult += generateFieldHtml('Movil', getAttendingLabel(g.phone));
        htmlResult += generateFieldHtml('Asistencia', getAttendingLabel(g.isAttending));
        htmlResult += generateFieldHtml('Alojamiento', getStringLabel(g.stayingPlace));
        htmlResult += generateFieldHtml('Alergias', getStringLabel(g.allergies));
        htmlResult += generateFieldHtml('Otros comentarios', getStringLabel(g.additionalComments));
        htmlResult += '</ul>';
        htmlResult += '<hr/>';
    });
    return htmlResult;
}

const generateFieldHtml = (name, value) => {
    return "<li><b>" + name + ": </b><span>" + value + "</span></li>";
}

const generateEmailTo = async (modelsService) => {
    let result = "";
    const admins = await modelsService.getModel('User').find({ authLevel: 'admin' });
    for (let admin of admins) {
        result += admin.local.email + ', ';
    }
    return result.slice(0, -2);
}

const getStringLabel = (str) => {
    return str ? str : '';
}

const getAttendingLabel = (isAttending) => {
    return isAttending ? 'Si' : 'No';
}

const getTypeLabel = (type) => {
    if (type === 1) {
        return 'Hombre';
    }
    if (type === 2) {
        return 'Mujer';
    }
    if (type === 3) {
        return 'Niño';
    }
    if (type === 4) {
        return 'Bebe';
    }
    return '';
}

module.exports = service;