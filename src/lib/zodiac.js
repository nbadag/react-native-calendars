import XDate from 'xdate'

const signs = {
  capricorn: {
    start: {
      month: 12,
      day: 22,
    },
    end: {
      month: 1,
      day: 19,
    }
  },
  aquarius: {
    start: {
      month: 1,
      day: 20,
    },
    end: {
      month: 2,
      day: 18,
    }
  },
  pisces: {
    start: {
      month: 2,
      day: 19,
    },
    end: {
      month: 3,
      day: 20,
    }
  },
  aries: {
    start: {
      month: 3,
      day: 21,
    },
    end: {
      month: 4,
      day: 19,
    }
  },
  taurus: {
    start: {
      month: 4,
      day: 20,
    },
    end: {
      month: 5,
      day: 20,
    }
  },
  gemini: {
    start: {
      month: 5,
      day: 21,
    },
    end: {
      month: 6,
      day: 20,
    }
  },
  cancer: {
    start: {
      month: 6,
      day: 21,
    },
    end: {
      month: 7,
      day: 22,
    }
  },
  leo: {
    start: {
      month: 7,
      day: 23,
    },
    end: {
      month: 8,
      day: 22,
    }
  },
  virgo: {
    start: {
      month: 8,
      day: 23,
    },
    end: {
      month: 9,
      day: 22,
    }
  },
  libra: {
    start: {
      month: 9,
      day: 23,
    },
    end: {
      month: 10,
      day: 22,
    }
  },
  scorpio: {
    start: {
      month: 10,
      day: 23,
    },
    end: {
      month: 11,
      day: 21,
    }
  },
  sagittarius: {
    start: {
      month: 11,
      day: 22,
    },
    end: {
      month: 12,
      day: 21,
    }
  },
}

export const zodiacLocale = {
  ...XDate.locales[''],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  monthNames: Object.keys(signs).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
  monthNamesShort: Object.keys(signs).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
}

export default signs
