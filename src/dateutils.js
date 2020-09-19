const moment = require('moment');
const XDate = require('xdate');
const signs = require('./lib/zodiac').default;

// @todo?
function sameMonth(a, b) {
  return a instanceof XDate && b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();
}

function sameSign(a, b, transits) {
  const signNames = Object.keys(signs)
  let aSign
  let bSign

  const transitA = transits.find((t) => {
    const m = moment(a.toISOString())
    return m.isSameOrAfter(t.Start) && m.isBefore(t.End)
  })

  const transitB = transits.find((t) => {
    const m = moment(a.toISOString())
    return m.isSameOrAfter(t.Start) && m.isBefore(t.End)
  })

  aSign = transitA['Sign Change']
  bSign = transitB['Sign Change']

  return a instanceof XDate && b instanceof XDate &&
    aSign === bSign
}

// @todo?
function sameDate(a, b, locale, transits) {
  const func = locale === 'zodiac'
    ? sameSign
    : sameMonth

  return a instanceof XDate && b instanceof XDate &&
    func(a, b, transits) &&
    a.getDate() === b.getDate();
}

function getSignName(date, transits) {
  let xd

  if (typeof date === 'string') {
    xd = new XDate(date)
  } else {
    xd = date
  }

  const transit = transits.find((t) => {
    const m = moment(xd.toISOString())
    return m.isSameOrAfter(t.Start) && m.isBefore(t.End)
  })

  return transit['Sign Change'].toLowerCase()
}

function isGTE(a, b) {
  return b.diffDays(a) > -1;
}

function isLTE(a, b) {
  return a.diffDays(b) > -1;
}

function fromTo(a, b, debugFlag) {
  const days = [];
  let from = +a, to = +b;

  for (; from <= to; from = new XDate(from).addDays(1).getTime()) {
    days.push(new XDate(from));
  }

  // if (debugFlag === 'month') {
  //   console.log(days)
  // }
  return days;
}

function month(xd) {
  const year = xd.getFullYear(), month = xd.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

function sign(date, transits, debugFlag) {
  let xd

  if (typeof date === 'string') {
    xd = new XDate(date)
  } else {
    xd = date
  }

  const transit = transits.find((t) => {
    const m = moment(xd.toISOString())
    return m.isSameOrAfter(t.Start) && m.isBefore(t.End)
  })

  const days = fromTo(transit.Start, transit.End, debugFlag)

  if (transits[transits.indexOf(transit) - 1] && days[days.length - 1].getDate() === transits[transits.indexOf(transit) - 1].End.getDate()) {
    days.unshift()
  }

  if (transits[transits.indexOf(transit) + 1] && days[days.length - 1].getDate() === transits[transits.indexOf(transit) + 1].Start.getDate()) {
    days.pop()
  }

  return days
}

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function page(xd, firstDayOfWeek, showSixWeeks, locale, transits, debugFlag) {
  const days = locale === 'zodiac' ? sign(xd, transits, debugFlag) : month(xd);

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
