const service = {};

let _modelsService;

service.getMainReport = async (modelsService) => {
  _modelsService = modelsService;
  const guestData = await getGuestsData();
  const expectedGuests = {
    adults: guestData.types.find(t => t.type === 1).amount + guestData.types.find(t => t.type === 2).amount,
    children: guestData.types.find(t => t.type === 3).amount
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
    expected: 0,
    attendingFriday: 0,
    types: [
      {
        type: 1,
        amount: 0
      },
      {
        type: 2,
        amount: 0
      },
      {
        type: 3,
        amount: 0
      },
      {
        type: 4,
        amount: 0
      }
    ],
    staying: [],
    gift: 0
  };
  const guests = await _modelsService.getModel('Guest').find({});
  const invitations = await _modelsService.getModel('Invitation').find({ giftAmount: { $gt: 0 } });
  guests.forEach(g => {
    result.expected += g.isAttendingExpectation ? 1 : 0;
    result.attendingFriday += g.isAttendingFriday ? 1 : 0;
    if (g.isAttendingExpectation) {
      sumType(result.types, g);
      sumStaying(result.staying, g);
    }
  });
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
  const type = types.find(t => t.type === guest.type);
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