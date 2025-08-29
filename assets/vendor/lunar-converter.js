(function () {
  "use strict";

  // --- Core Data & Algorithm ---
  const LUNAR_INFO = [
    0x04bd8,
    0x04ae0,
    0x0a570,
    0x054d5,
    0x0d260,
    0x0d950,
    0x16554,
    0x056a0,
    0x09ad0,
    0x055d2,
    0x04ae0,
    0x0a5b6,
    0x0a4d0,
    0x0d250,
    0x1d255,
    0x0b540,
    0x0d6a0,
    0x0ada2,
    0x095b0,
    0x14977,
    0x04970,
    0x0a4b0,
    0x0b4b5,
    0x06a50,
    0x06d40,
    0x1ab54,
    0x02b60,
    0x09570,
    0x052f2,
    0x04970,
    0x06566,
    0x0d4a0,
    0x0ea50,
    0x06e95,
    0x05ad0,
    0x02b60,
    0x186e3,
    0x092e0,
    0x1c8d7,
    0x0c950,
    0x0d4a0,
    0x1d8a6,
    0x0b550,
    0x056a0,
    0x1a5b4,
    0x025d0,
    0x092d0,
    0x0d2b2,
    0x0a950,
    0x0b557,
    0x06ca0,
    0x0b550,
    0x15355,
    0x04da0,
    0x0a5b0,
    0x14573,
    0x052b0,
    0x0a9a8,
    0x0e950,
    0x06aa0,
    0x0aea6,
    0x0ab50,
    0x04b60,
    0x0aae4,
    0x0a570,
    0x05260,
    0x0f263,
    0x0d950,
    0x05b57,
    0x056a0,
    0x096d0,
    0x04dd5,
    0x04ad0,
    0x0a4d0,
    0x0d4d4,
    0x0d250,
    0x0d558,
    0x0b540,
    0x0b6a0,
    0x195a6,
    0x095b0,
    0x049b0,
    0x0a974,
    0x0a4b0,
    0x0b27a,
    0x06a50,
    0x06d40,
    0x0af46,
    0x0ab60,
    0x09570,
    0x04af5,
    0x04970,
    0x064b0,
    0x074a3,
    0x0ea50,
    0x06b58,
    0x055c0,
    0x0ab60,
    0x096d5,
    0x092e0,
    0x0c960,
    0x0d954,
    0x0d4a0,
    0x0da50,
    0x07552,
    0x056a0,
    0x0abb7,
    0x025d0,
    0x092d0,
    0x0cab5,
    0x0a950,
    0x0b4a0,
    0x0baa4,
    0x0ad50,
    0x055d9,
    0x04ba0,
    0x0a5b0,
    0x15176,
    0x052b0,
    0x0a930,
    0x07954,
    0x06aa0,
    0x0ad50,
    0x05b52,
    0x04b60,
    0x0a6e6,
    0x0a4e0,
    0x0d260,
    0x0ea65,
    0x0d530,
    0x05aa0,
    0x076a3,
    0x096d0,
    0x04bd7,
    0x04ad0,
    0x0a4d0,
    0x1d0b6,
    0x0d250,
    0x0d520,
    0x0dd45,
    0x0b5a0,
    0x056d0,
    0x055b2,
    0x049b0,
    0x0a577,
    0x0a4b0,
    0x0aa50,
    0x1b255,
    0x06d20,
    0x0ada0, // 2049
    0x14b63,
    0x09370,
    0x049f8,
    0x04970,
    0x064b0,
    0x168a6,
    0x0ea50,
    0x06b20,
    0x1a6c4,
    0x0aae0,
    0x092e0,
    0x0d2e3,
    0x0c960,
    0x0d557,
    0x0d4a0,
    0x0da50,
    0x05d55,
    0x056a0,
    0x0a6d0,
    0x055d4,
    0x052d0,
    0x0a9b8,
    0x0a950,
    0x0b4a0,
    0x0b6a6,
    0x0ad50,
    0x055a0,
    0x0aba4,
    0x0a5b0,
    0x052b0,
    0x0b273,
    0x06930,
    0x07337,
    0x06aa0,
    0x0ad50,
    0x14b55,
    0x04b60,
    0x0a570,
    0x054e4,
    0x0d160,
    0x0e968,
    0x0d520,
    0x0daa0,
    0x16aa6,
    0x056d0,
    0x04ae0,
    0x0a9d4,
    0x0a4d0,
    0x0d150,
    0x0f252,
    0x0d520, // 2099
  ];
  const CAN_NAMES = [
    "Canh",
    "Tân",
    "Nhâm",
    "Quý",
    "Giáp",
    "Ất",
    "Bính",
    "Đinh",
    "Mậu",
    "Kỷ",
  ];
  const CHI_NAMES = [
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi",
    "Tý",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
  ];

  function getLunarMonthDays(y, m) {
    return LUNAR_INFO[y - 1900] & (0x10000 >> m) ? 30 : 29;
  }
  function getLeapMonth(y) {
    return LUNAR_INFO[y - 1900] & 0xf;
  }
  function getLeapMonthDays(y) {
    return getLeapMonth(y) ? (LUNAR_INFO[y - 1900] & 0x10000 ? 30 : 29) : 0;
  }
  function getLunarYearDays(y) {
    let i,
      sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) sum += LUNAR_INFO[y - 1900] & i ? 1 : 0;
    return sum + getLeapMonthDays(y);
  }
  function jdn(dd, mm, yy) {
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    return (
      dd +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045
    );
  }

  function solarToLunar(dd, mm, yy) {
    const date = new Date(yy, mm - 1, dd);
    const date1900 = new Date(1900, 0, 31);
    let offset = Math.floor((date - date1900) / 86400000);

    let lunarYear, lunarMonth, lunarDay;
    let daysInYear = 0;
    for (lunarYear = 1900; lunarYear < 2100 && offset >= 0; lunarYear++) {
      daysInYear = getLunarYearDays(lunarYear);
      offset -= daysInYear;
    }
    if (offset < 0) {
      offset += daysInYear;
      lunarYear--;
    }

    const leapMonth = getLeapMonth(lunarYear);
    let isLeap = false;

    for (lunarMonth = 1; lunarMonth <= 12; lunarMonth++) {
      let daysInMonth;
      if (leapMonth > 0 && lunarMonth === leapMonth + 1 && !isLeap) {
        lunarMonth--;
        isLeap = true;
        daysInMonth = getLeapMonthDays(lunarYear);
      } else {
        isLeap = false;
        daysInMonth = getLunarMonthDays(lunarYear, lunarMonth);
      }
      if (offset < daysInMonth) break;
      offset -= daysInMonth;
    }
    lunarDay = offset + 1;

    const jd = jdn(dd, mm, yy);
    const dayCan = CAN_NAMES[jd % 10];
    const dayChi = CHI_NAMES[jd % 12];
    const monthCan =
      CAN_NAMES[((lunarYear - 1900) * 12 + lunarMonth - 1 + 12) % 10];
    const yearCan = CAN_NAMES[(lunarYear - 1900 + 6) % 10];
    const yearChi = CHI_NAMES[(lunarYear - 1900 + 8) % 12];

    return [
      lunarDay,
      lunarMonth,
      lunarYear,
      isLeap,
      dayCan,
      dayChi,
      monthCan,
      yearCan,
      yearChi,
    ];
  }

  function lunarToSolar(ld, lm, ly, isLeap) {
    const leapMonth = getLeapMonth(ly);
    if (isLeap && (leapMonth === 0 || lm !== leapMonth)) {
      throw new Error("Invalid leap month");
    }

    let offset = 0;
    for (let i = 1900; i < ly; i++) {
      offset += getLunarYearDays(i);
    }

    for (let i = 1; i < lm; i++) {
      offset += getLunarMonthDays(ly, i);
    }
    if (leapMonth > 0 && lm > leapMonth) {
      offset += getLeapMonthDays(ly);
    }
    if (isLeap) {
      offset += getLunarMonthDays(ly, lm);
    }

    offset += ld - 1;

    const date1900 = new Date(1900, 0, 31);
    const resultDate = new Date(date1900.getTime() + offset * 86400000);
    return resultDate;
  }

  window.lunarConverter = { convertSolar2Lunar: solarToLunar };

  window.holidayLibrary = {
    getTetNguyenDan: (year) => {
      return lunarToSolar(1, 1, year);
    },
    getVnHolidays: function (year) {
      const tet = this.getTetNguyenDan(year);
      const gioTo = lunarToSolar(10, 3, year);

      return [
        { name: `Tết Dương Lịch`, date: new Date(year, 0, 1) },
        { name: `Tết Nguyên Đán`, date: tet },
        { name: `Mùng 2 Tết`, date: new Date(tet.getTime() + 1 * 86400000) },
        { name: `Mùng 3 Tết`, date: new Date(tet.getTime() + 2 * 86400000) },
        { name: `Mùng 4 Tết`, date: new Date(tet.getTime() + 3 * 86400000) },
        { name: `Mùng 5 Tết`, date: new Date(tet.getTime() + 4 * 86400000) },
        { name: `Giỗ Tổ Hùng Vương (10/3)`, date: gioTo },
        { name: `Ngày Giải phóng Miền Nam`, date: new Date(year, 3, 30) },
        { name: `Ngày Quốc tế Lao động`, date: new Date(year, 4, 1) },
        { name: `Ngày Quốc Khánh`, date: new Date(year, 8, 2) },
        { name: `Nghỉ lễ Quốc Khánh`, date: new Date(year, 8, 1) },
      ].map((h) => ({ ...h, name: `${h.name} ${h.date.getFullYear()}` }));
    },
  };
})();
