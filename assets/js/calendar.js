document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("card-calendar")) return;

  if (
    typeof window.lunarConverter === "undefined" ||
    typeof window.holidayLibrary === "undefined"
  ) {
    console.error(
      "Thư viện Âm lịch hoặc Ngày lễ (lunar-converter.js) chưa được tải."
    );
    return;
  }

  let calendarDate = new Date();
  const calendarGrid = document.getElementById("calendar-grid");
  const monthYearDisplay = document.getElementById("month-year-display");
  const prevMonthBtn = document.getElementById("prev-month-btn");
  const nextMonthBtn = document.getElementById("next-month-btn");
  const todayBtn = document.getElementById("today-btn");

  const modal = document.getElementById("day-detail-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeModalBtn = document.querySelector(".close-modal-btn");
  const useDateBtn = document.getElementById("use-date-btn");
  let selectedDateForTools = null;

  const openModal = () => {
    modal.classList.add("visible");
    modalOverlay.classList.add("visible");
  };
  const closeModal = () => {
    modal.classList.remove("visible");
    modalOverlay.classList.remove("visible");
  };

  const zodiacHours = {
    Tý: "23-1",
    Sửu: "1-3",
    Dần: "3-5",
    Mão: "5-7",
    Thìn: "7-9",
    Tỵ: "9-11",
    Ngọ: "11-13",
    Mùi: "13-15",
    Thân: "15-17",
    Dậu: "17-19",
    Tuất: "19-21",
    Hợi: "21-23",
  };
  const getZodiacHours = (chiNgay) => {
    const base1 = ["Dần", "Thân"];
    if (base1.includes(chiNgay))
      return ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"]
        .map((c) => `${c}: ${zodiacHours[c]}`)
        .join(", ");
    const base2 = ["Mão", "Dậu"];
    if (base2.includes(chiNgay))
      return ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"]
        .map((c) => `${c}: ${zodiacHours[c]}`)
        .join(", ");
    const base3 = ["Thìn", "Tuất"];
    if (base3.includes(chiNgay))
      return ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"]
        .map((c) => `${c}: ${zodiacHours[c]}`)
        .join(", ");
    const base4 = ["Tỵ", "Hợi"];
    if (base4.includes(chiNgay))
      return ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"]
        .map((c) => `${c}: ${zodiacHours[c]}`)
        .join(", ");
    const base5 = ["Tý", "Ngọ"];
    if (base5.includes(chiNgay))
      return ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"]
        .map((c) => `${c}: ${zodiacHours[c]}`)
        .join(", ");
    // Default for Sửu, Mùi
    return ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"]
      .map((c) => `${c}: ${zodiacHours[c]}`)
      .join(", ");
  };

  const renderCalendar = (year, month) => {
    calendarGrid.innerHTML = "";
    monthYearDisplay.textContent = `Tháng ${month + 1}, ${year}`;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startDayOfWeek = firstDay.getDay();
    if (startDayOfWeek === 0) startDayOfWeek = 7;

    const holidaysInYear = [
      ...window.holidayLibrary.getVnHolidays(year),
      ...window.holidayLibrary.getVnHolidays(year - 1),
    ];
    const holidaysInMonth = holidaysInYear.reduce((acc, h) => {
      if (h.date.getFullYear() === year && h.date.getMonth() === month) {
        acc[h.date.getDate()] = h.name;
      }
      return acc;
    }, {});

    for (let i = 1; i < startDayOfWeek; i++) {
      calendarGrid.innerHTML += `<div class="day-cell out-month"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const today = new Date();
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = !!holidaysInMonth[day];

      const [
        lunarDay,
        lunarMonth,
        lunarYear,
        isLeap,
        dayCan,
        dayChi,
        monthCan,
        yearCan,
        yearChi,
      ] = window.lunarConverter.convertSolar2Lunar(day, month + 1, year);
      const isSpecialLunar = lunarDay === 1 || lunarDay === 15;

      const cell = document.createElement("div");
      cell.className = "day-cell";
      if (isToday) cell.classList.add("today");
      if (isWeekend) cell.classList.add("weekend");
      if (isHoliday) {
        cell.classList.add("holiday");
        cell.title = holidaysInMonth[day];
      }
      cell.innerHTML = `<div class="solar-day">${day}</div><div class="lunar-day ${
        isSpecialLunar ? "special" : ""
      }">${lunarDay === 1 ? `${lunarDay}/${lunarMonth}` : lunarDay}</div>`;

      cell.addEventListener("click", () => {
        document.getElementById("modal-solar-date").textContent =
          currentDate.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        document.getElementById(
          "modal-lunar-date"
        ).textContent = `Ngày ${lunarDay} tháng ${lunarMonth}${
          isLeap ? " (nhuận)" : ""
        } năm ${yearCan} ${yearChi}`;
        document.getElementById(
          "modal-lunar-details"
        ).textContent = `(Ngày ${dayCan} ${dayChi}, Tháng ${monthCan})`;

        const holidayInfo = document.getElementById("modal-holiday");
        if (isHoliday) {
          holidayInfo.textContent = holidaysInMonth[day];
          holidayInfo.style.display = "inline-block";
        } else {
          holidayInfo.style.display = "none";
        }

        document.getElementById("zodiac-hours-list").textContent =
          getZodiacHours(dayChi);

        selectedDateForTools = currentDate;
        openModal();
      });
      calendarGrid.appendChild(cell);
    }
  };

  prevMonthBtn.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar(calendarDate.getFullYear(), calendarDate.getMonth());
  });
  nextMonthBtn.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar(calendarDate.getFullYear(), calendarDate.getMonth());
  });
  todayBtn.addEventListener("click", () => {
    calendarDate = new Date();
    renderCalendar(calendarDate.getFullYear(), calendarDate.getMonth());
  });

  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  useDateBtn.addEventListener("click", () => {
    if (selectedDateForTools) {
      const dateString = selectedDateForTools.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      localStorage.setItem("selectedDate", dateString);
      window.location.href = "tools.html";
    }
  });

  renderCalendar(calendarDate.getFullYear(), calendarDate.getMonth());
});
