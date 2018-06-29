const service = {};

let _modelsService;

service.getMainReport = async (modelsService) => {
  _modelsService = modelsService;
  const guestData = await getGuestsData();
  const expectedGuests = {
    adults: guestData.wedding.types.find(t => t.type === 1).amount + guestData.wedding.types.find(t => t.type === 2).amount,
    children: guestData.wedding.types.find(t => t.type === 3).amount
  };
  const expensesData = await getExpensesData(expectedGuests);
  const result = {
    guests: guestData,
    expenses: expensesData
  };
  return { statusCode: 200, report: result };
}

const getGuestsData = async () => {
  const result = {
    wedding: {
      total: 0,
      types: [],
      staying: [],
      bus: {
        beforeWedding: 0,
        afterWedding: 0,
        afterVenue: 0
      }
    },
    friday: {
      total: 0,
      types: []
    },
    gift: 0
  };
  const guests = await _modelsService.getModel('Guest').find({});
  const invitations = await _modelsService.getModel('Invitation').find({ giftAmount: { $gt: 0 } });
  guests.forEach(g => {
    if (g.isAttendingExpectation) {
      sumType(result.wedding.types, g);
      sumStaying(result.wedding.staying, g);
    }
    if (g.isAttendingFriday) {
      sumType(result.friday.types, g);
    }
    if (g.isTakingBus && g.stayingPlace === 'Jarandilla') { result.wedding.bus.beforeWedding++ }
    if (g.isTakingBus) { result.wedding.bus.afterWedding++ }
    if (g.isTakingBus && g.stayingPlace === 'Navalmoral') { result.wedding.bus.afterVenue++ }
  });
  result.wedding.total = result.wedding.types.map(t => t.amount).reduce((a, b) => a + b);
  result.friday.total = result.friday.types.map(t => t.amount).reduce((a, b) => a + b);
  invitations.forEach(inv => {
    result.gift += inv.giftAmount ? inv.giftAmount : 0;
  });
  result.gift = roundMoney(result.gift);
  return result;
}

const getExpensesData = async (expectedGuests) => {
  const result = {
    total: 0,
    totalPaid: 0,
    categories: []
  };
  const expensesCategories = await _modelsService.getModel('ExpenseCategory').find({}).sort({ excludeFromTotal: 1, name: 1 }).populate([{ 'path': 'expenses' }]);
  expensesCategories.forEach(cat => {
    const catObj = {
      categoryData: Object.assign({}, cat._doc, { expenses: undefined }),
      total: 0,
      totalPaid: 0
    };
    cat.expenses.forEach(exp => {
      if (!exp.costPerGuest || exp.costPerGuest === 0) {
        catObj.total += exp.amount;
      } else if (exp.costPerGuest === 1) {
        catObj.total += expectedGuests.adults * exp.amount;
      } else if (exp.costPerGuest === 3) {
        catObj.total += expectedGuests.children * exp.amount;
      }
      catObj.totalPaid += exp.amountPaid;
    });
    result.categories.push(catObj);
  });
  result.total = roundMoney(result.categories.filter(c => !c.categoryData.excludeFromTotal).map(e => e.total).reduce((a, b) => a + b));
  result.totalPaid = roundMoney(result.categories.filter(c => !c.categoryData.excludeFromTotal).map(e => e.totalPaid).reduce((a, b) => a + b));
  result.categories.forEach(c => {
    c.total = roundMoney(c.total);
    c.totalPaid = roundMoney(c.totalPaid);
  });
  return result;
}

const sumType = (types, guest) => {
  let type = types.find(t => t.type === guest.type);
  if (!type) {
    type = { type: guest.type, amount: 0 };
    types.push(type);
  }
  type.amount++;
}

const sumStaying = (staying, guest) => {
  if (!guest.stayingPlaceExpectation) {
    return;
  }
  let stayingPlace = staying.find(s => s.place === guest.stayingPlaceExpectation);
  if (!stayingPlace) {
    stayingPlace = {
      place: guest.stayingPlaceExpectation,
      amount: 0
    }
    staying.push(stayingPlace);
  }
  stayingPlace.amount++;
}

const roundMoney = (amount) => {
  return amount.toFixed(2);
}

module.exports = service;