import _ from 'lodash';

const currentDate = new Date();

function cloneDate(date) {
  return new Date(date.getTime());
}

// Adds one month to `date`
function addMonth(date) {
  const newDate = cloneDate(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

function lastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function generateMonthlyRecurring({name, amount, startDate, description, categoryId}) {
  const today = cloneDate(currentDate);
  const oneMonthFromNow = addMonth(today);
  const lastDayNextMonth = lastDayOfMonth(oneMonthFromNow);

  const startDateObj = new Date(startDate);
  let startDateClone = cloneDate(startDateObj);

  const dates = [];
  while(startDateClone < lastDayNextMonth) {
    dates.push(cloneDate(startDateClone));
    startDateClone = addMonth(startDateClone);
  }

  return dates.map(date => {
    return {
      name, amount, description,
      categoryId,
      date: cloneDate(startDateClone),
      recurring: 'monthly'
    };
  });
}

export default _.concat(
  generateMonthlyRecurring({name: 'Gas', amount: '67.00', startDate: '2015-10-01', categoryId: 1}),
  generateMonthlyRecurring({name: 'Rent', amount: '2000.00', startDate: '2015-06-01', categoryId: 1}),
  generateMonthlyRecurring({name: 'Spotify', amount: '9.99', startDate: '2016-01-06', categoryId: 1}),
  generateMonthlyRecurring({name: 'Water', amount: '24.76', startDate: '2016-03-01', categoryId: 1}),
  generateMonthlyRecurring({name: 'Trash', amount: '21.10', startDate: '2015-07-01', categoryId: 1}),
  generateMonthlyRecurring({name: 'iCloud Storage', amount: '9.99', startDate: '2015-06-15', categoryId: 1}),
  generateMonthlyRecurring({name: "Renter's insurance", amount: '15.50', startDate: '2015-10-01', categoryId: 1}),
  generateMonthlyRecurring({name: "Car insurance", amount: '23.87', startDate: '2016-04-04', categoryId: 1}),
  generateMonthlyRecurring({name: "GitHub", amount: '7.00', startDate: '2015-10-01', categoryId: 1}),
);
