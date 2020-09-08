const XDate = require('xdate');
const signs = require('./lib/zodiac').default;

// @todo?
function sameMonth(a, b) {
  return a instanceof XDate && b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();
}

function sameSign(a, b) {
  const signNames = Object.keys(signs)
  let aSign
  let bSign

  for (let i = 0; i < signNames.length; i++) {
    const sign = signs[signNames[i]]

    if (
      ((a.getMonth() + 1) === sign.start.month && a.getDate() >= sign.start.day)
      ||
      ((a.getMonth() + 1) === sign.end.month && a.getDate() <= sign.end.day)
    ) {
      aSign = signNames[i]
    }
  }

  for (let j = 0; j < signNames.length; j++) {
    const sign = signs[signNames[j]]

    if (
      ((b.getMonth() + 1) === sign.start.month && b.getDate() >= sign.start.day)
      ||
      ((b.getMonth() + 1) === sign.end.month && b.getDate() <= sign.end.day)
    ) {
      bSign = signNames[j]
    }
  }

  return a instanceof XDate && b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    aSign === bSign
}

// @todo?
function sameDate(a, b, locale) {
  const func = locale === 'zodiac'
    ? sameSign
    : sameMonth

  return a instanceof XDate && b instanceof XDate &&
    func(a, b) &&
    a.getDate() === b.getDate();
}

function getSignName(xd) {
  const signNames = Object.keys(signs)
  let signName

  for (let i = 0; i < signNames.length; i++) {
    const sign = signs[signNames[i]]

    if (
      ((xd.getMonth() + 1) === sign.start.month && xd.getDate() >= sign.start.day)
      ||
      ((xd.getMonth() + 1) === sign.end.month && xd.getDate() <= sign.end.day)
    ) {
      signName = signNames[i]
    }
  }

  return signName
}

function isGTE(a, b) {
  return b.diffDays(a) > -1;
}

function isLTE(a, b) {
  return a.diffDays(b) > -1;
}

function fromTo(a, b) {
  const days = [];
  let from = +a, to = +b;
  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

function month(xd) {
  const year = xd.getFullYear(), month = xd.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

function sign(xd) {
  const signNames = Object.keys(signs)
  let sign

  for (let s = 0; s < Object.keys(signs).length; s++) {
    const month = xd.getMonth() + 1
    const date = xd.getDate()

    const start = signs[signNames[s]].start
    const end = signs[signNames[s]].end

    if (
      (month === start.month && date >= start.day)
      ||
      (month === end.month && date <= end.day)
    ) {
      sign = signs[signNames[s]]
    }
  }

  const year = xd.getFullYear()
  const firstDay = new XDate(sign.start.month === 12 ? year - 1 : year, sign.start.month - 1, sign.start.day, 0, 0, 0, true)
  const lastDay = new XDate(year, sign.end.month - 1, sign.end.day, 0, 0, 0, true)

  return fromTo(firstDay, lastDay)
}

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function page(xd, firstDayOfWeek, showSixWeeks, locale) {
  const days = locale === 'zodiac' ? sign(xd) : month(xd);

  let before = [], after = [];

  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  const from = days[0].clone();
  const daysBefore = from.getDay();

  if (from.getDay() !== fdow) {
    from.addDays(-(from.getDay() + 7 - fdow) % 7);
  }

  const to = days[days.length - 1].clone();
  const day = to.getDay();
  if (day !== ldow) {
    to.addDays((ldow + 7 - day) % 7);
  }

  const daysForSixWeeks = (((daysBefore + days.length) / 6) >= 6);

  if (showSixWeeks && !daysForSixWeeks) {
    to.addDays(7);
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameSign,
  sameDate,
  getSignName,
  sign,
  month,
  page,
  fromTo,
  isLTE,
  isGTE
};
