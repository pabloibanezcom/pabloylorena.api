const notificationService = require('./notification.service');

const service = {};

service.getInvitationByGuid = async (modelsService, requestGuid) => {
    const invitation = await modelsService.getModel('Invitation').findOne({ guid: requestGuid }).populate('guests');
    if (invitation) {
        return { statusCode: 200, invitation: {
            _id: invitation._id,
            guid: invitation.guid,
            guests: invitation.guests.map(g => {return { 
                name: g.name,
                fullName: g.fullName,
                type: g.type,
                email: g.email,
                phone: g.phone,
                busTime: g.busTime,
                isAttending: g.isAttending,
                allergies: g.allergies,
                additionalComments: g.additionalComments
            }})
        } };
    }
    return { statusCode: 404, invitation: null };
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
        notificationService.notifyByEmail(emailTo, 'Boda - Asistencia confirmada', generateEmailHtml(invitation));
        return { statusCode: 200, message: 'Invitation updated' };
    }
    return { statusCode: 404, message: 'Invitation not found' };
}

const updateGuest = async (model, guestData) => {
    const guest = await model.findById(guestData._id);
    if (guest) {
        guest.isAttending = guestData.isAttending;
        guest.name = guestData.name;
        guest.allergies = guestData.allergies;
        guest.email = guestData.email;
        guest.phone = guestData.phone;
        guest.busTime = guestData.busTime;
        guest.additionalComments = guestData.additionalComments;
        guest.lastModified = Date.now();
        await guest.save();
    }
    return guest;
}

const generateEmailHtml = (invitation) => {
    let htmlResult = "";
    htmlResult += "<h3>Invitacion confirmada</h3><ul>";
    htmlResult += generateFieldHtml('GUID', invitation.guid);
    htmlResult += generateFieldHtml('Alias', invitation.alias);
    htmlResult += "</ul>";
    return htmlResult;
}

const generateFieldHtml = (name, value) => {
    return "<li><b>" + name + ": </b><span>" + value + "</span></li>";
}

const generateEmailTo = async (modelsService) => {
    let result = "";
    const admins = await modelsService.getModel('User').find({ isAdmin: true });
    for (let admin of admins) {
        result += admin.local.email + ', ';
    }
    return result.slice(0, -2);
}

module.exports = service;