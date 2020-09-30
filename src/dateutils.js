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
  const aSign = getSignName(a, transits)
  let bSign = getSignName(b, transits)

  return aSign === bSign
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

  const year = xd.getFullYear()
  const zodiac = transits[year.toString()]
  let sign

  Object.keys(zodiac).forEach((signId) => {
    const date = moment(xd.toISOString())
    const start = new Date(zodiac[signId].startUTC).toISOString()
    const end = new Date(zodiac[signId].endUTC).toISOString()

    if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
      sign = zodiac[signId]
    }
  })

  if (!sign && xd.getMonth() === 11) {
    sign = transits[(year + 1).toString()]['CP']
  } else if (!sign) {
    Object.keys(zodiac).forEach((signId) => {
      const nextDay = moment(xd.toISOString()).add(24, 'hours')
      const start = new Date(zodiac[signId].startUTC).toISOString()
      const end = new Date(zodiac[signId].endUTC).toISOString()

      if (nextDay.isSameOrAfter(start) && nextDay.isSameOrBefore(end)) {
        sign = zodiac[signId]
      }
    })
  }

  return sign ? sign.name.toLowerCase() : null
}

function getSignId(date, transits) {
  let xd

  if (typeof date === 'string') {
    xd = new XDate(date)
  } else {
    xd = date
  }

  const year = xd.getFullYear()
  const zodiac = transits[year.toString()]
  let sign

  Object.keys(zodiac).forEach((signId) => {
    const date = moment(xd.toISOString())
    const start = new Date(zodiac[signId].startUTC).toISOString()
    const end = new Date(zodiac[signId].endUTC).toISOString()

    if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
      sign = zodiac[signId]
    }
  })

  if (!sign) {
    sign = transits[(year + 1).toString()]['CP']
  }

  return sign ? sign.id : null
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

  const year = xd.getFullYear()
  const zodiac = transits[year.toString()]
  let sign

  Object.keys(zodiac).forEach((signId) => {
    const date = moment(xd.toISOString())
    const start = new Date(zodiac[signId].startUTC).toISOString()
    const end = new Date(zodiac[signId].endUTC).toISOString()

    if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
      sign = zodiac[signId]
    }
  })

  if (!sign) {
    sign = transits[(year + 1).toString()]['CP']
  }

  const days = sign ? sign.days : []

  return days.map((day) => new Date(day))
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
  const rawDays = locale === 'zodiac' ? sign(xd, transits, debugFlag) : month(xd);
  let xdays

  if (locale === 'zodiac') {
    xdays = rawDays.map((d) => new XDate(d.toISOString()))
  }

  const days = xdays || rawDays

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
  getSignId,
  getSignName,
  sign,
  month,
  page,
  fromTo,
  isLTE,
  isGTE
};
