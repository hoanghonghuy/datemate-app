document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("card-converter")) return;

  if (typeof holidayLibrary === "undefined") {
    console.error("Thư viện Ngày lễ (lunar-converter.js) chưa được tải.");
    return;
  }

  const body = document.body;
  const EVENT_NAME_KEY = "datemate_eventName";
  const SELECTED_DATE_KEY = "selectedDate";

  const HISTORY_KEY = "datemate_history";
  let history = [];
  const historyToggleBtn = document.getElementById("history-toggle-btn");
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const overlay = document.getElementById("overlay");
  const openHistory = () => body.classList.add("history-open");
  const closeHistory = () => body.classList.remove("history-open");
  const renderHistory = () => {
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyList.innerHTML = "<li>Chưa có lịch sử nào.</li>";
      return;
    }
    history.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.type}</strong><span>${item.result.replace(
        /\n/g,
        "<br>"
      )}</span>`;
      historyList.appendChild(li);
    });
  };
  const saveHistory = () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  };
  const loadHistory = () => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      history = JSON.parse(savedHistory);
    }
    renderHistory();
  };
  const addToHistory = (type, result) => {
    const newItem = { type, result, timestamp: new Date().toISOString() };
    history.unshift(newItem);
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    saveHistory();
    renderHistory();
  };
  historyToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    body.classList.contains("history-open") ? closeHistory() : openHistory();
  });
  clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử?")) {
      history = [];
      saveHistory();
      renderHistory();
    }
  });
  overlay.addEventListener("click", closeHistory);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("history-open"))
      closeHistory();
  });

  const showError = (inputElement, message) => {
    inputElement.classList.add("invalid");
    const parent =
      inputElement.closest(".input-group") ||
      inputElement.closest(".input-with-button").parentElement;
    const errorElement = parent.querySelector(".error-message");
    if (errorElement) errorElement.textContent = message;
  };
  const clearError = (inputElement) => {
    inputElement.classList.remove("invalid");
    const parent =
      inputElement.closest(".input-group") ||
      inputElement.closest(".input-with-button").parentElement;
    const errorElement = parent.querySelector(".error-message");
    if (errorElement) errorElement.textContent = "";
  };
  const displayResult = (
    resultElement,
    message,
    isError = false,
    type = ""
  ) => {
    const textSpan = resultElement.querySelector(".result-text");
    if (textSpan) textSpan.innerHTML = message.replace(/\n/g, "<br>");
    resultElement.className = "result visible";
    if (isError) {
      resultElement.classList.add("error");
    } else if (type) {
      addToHistory(type, message);
    }
  };
  const hideResult = (resultElement) => {
    if (resultElement) {
      resultElement.classList.remove("visible");
      const textSpan = resultElement.querySelector(".result-text");
      if (textSpan) textSpan.innerHTML = "";
      const formatList = resultElement.querySelector("#format-list");
      if (formatList) formatList.innerHTML = "";
    }
  };
  const getDateFromPicker = (element) =>
    element._flatpickr.selectedDates[0] || null;

  flatpickr(".date-input", {
    dateFormat: "d/m/Y",
    locale: "vn",
    allowInput: true,
  });

  const holidaySelectEl = document.getElementById("holiday-select");
  const excludeVnHolidaysEl = document.getElementById("exclude-vn-holidays");
  const holidayBlacklistContainer = document.getElementById(
    "holiday-blacklist-container"
  );
  const holidayBlacklistEl = document.getElementById("holiday-blacklist");
  const startDateEl = document.getElementById("startDate"),
    endDateEl = document.getElementById("endDate"),
    calcDifferenceBtn = document.getElementById("calcDifferenceBtn"),
    differenceResult = document.getElementById("differenceResult");
  const baseDateEl = document.getElementById("baseDate"),
    numUnitsEl = document.getElementById("numUnits"),
    unitEl = document.getElementById("unit"),
    addDateBtn = document.getElementById("addDateBtn"),
    subtractDateBtn = document.getElementById("subtractDateBtn"),
    addSubtractResult = document.getElementById("addSubtractResult");
  const birthDateEl = document.getElementById("birthDate"),
    calcAgeBtn = document.getElementById("calcAgeBtn"),
    ageResult = document.getElementById("ageResult");
  const eventNameEl = document.getElementById("eventName"),
    eventDateEl = document.getElementById("eventDate"),
    countdownBtn = document.getElementById("countdownBtn"),
    countdownResult = document.getElementById("countdownResult");
  let countdownInterval;
  const findDayDateEl = document.getElementById("findDayDate"),
    findDayBtn = document.getElementById("findDayBtn"),
    dayOfWeekResult = document.getElementById("dayOfWeekResult");
  const yearInputEl = document.getElementById("yearInput"),
    leapYearBtn = document.getElementById("leapYearBtn"),
    leapYearResult = document.getElementById("leapYearResult");
  const workStartDateEl = document.getElementById("workStartDate"),
    workEndDateEl = document.getElementById("workEndDate"),
    calcWorkDaysBtn = document.getElementById("calcWorkDaysBtn"),
    workDaysResult = document.getElementById("workDaysResult");
  const converterDateEl = document.getElementById("converterDate"),
    convertDateBtn = document.getElementById("convertDateBtn"),
    converterResultEl = document.getElementById("converterResult");

  document.querySelectorAll(".btn-today").forEach((button) =>
    button.addEventListener("click", () => {
      const targetInput = document.getElementById(button.dataset.target);
      if (targetInput._flatpickr) {
        targetInput._flatpickr.setDate(new Date(), true);
      }
      clearError(targetInput);
    })
  );
  document.querySelectorAll(".btn-get-date").forEach((button) =>
    button.addEventListener("click", () => {
      const savedDate = localStorage.getItem(SELECTED_DATE_KEY);
      const targetInput = document.getElementById(button.dataset.target);
      if (savedDate && targetInput) {
        targetInput._flatpickr.setDate(savedDate, true, "d/m/Y");
        window.showToast("Đã áp dụng ngày từ Lịch Vạn Niên!");
        localStorage.removeItem(SELECTED_DATE_KEY);
      } else {
        window.showToast("Chưa có ngày nào được chọn từ Lịch Vạn Niên.", true);
      }
    })
  );
  document.querySelectorAll(".btn-clear").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      card.querySelectorAll("input, select, textarea").forEach((el) => {
        if (el.type === "number") el.value = "1";
        else if (el.tagName.toLowerCase() === "select") el.selectedIndex = 0;
        else {
          el.value = "";
          if (el._flatpickr) el._flatpickr.clear();
          if (el.type === "checkbox") el.checked = true;
        }
        clearError(el);
      });
      hideResult(card.querySelector(".result"));
      if (card.dataset.card === "countdown" && countdownInterval)
        clearInterval(countdownInterval);
      if (card.dataset.card === "work-days")
        holidayBlacklistContainer.classList.remove("visible");
    });
  });
  document
    .querySelectorAll("input, textarea, select")
    .forEach((input) =>
      input.addEventListener("input", () => clearError(input))
    );
  document.querySelectorAll(".btn-copy").forEach((button) =>
    button.addEventListener("click", async () => {
      const resultBox = button.parentElement;
      const textToCopy = resultBox
        .querySelector(".result-text")
        .innerText.trim();
      if (textToCopy && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          window.showToast("Đã sao chép vào clipboard!");
        } catch (err) {
          window.showToast("Lỗi: Không thể sao chép.", true);
          console.error("Không thể sao chép: ", err);
        }
      }
    })
  );

  const populateHolidayDropdown = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const holidays = [
      ...window.holidayLibrary.getVnHolidays(currentYear),
      ...window.holidayLibrary.getVnHolidays(currentYear + 1),
    ];
    const upcomingHolidays = holidays
      .filter((h) => h.date >= today)
      .sort((a, b) => a.date - b.date);
    upcomingHolidays.forEach((holiday) => {
      const option = document.createElement("option");
      const y = holiday.date.getFullYear();
      const m = String(holiday.date.getMonth() + 1).padStart(2, "0");
      const d = String(holiday.date.getDate()).padStart(2, "0");
      option.value = `${y}-${m}-${d}`;
      option.textContent = holiday.name;
      holidaySelectEl.appendChild(option);
    });
  };
  holidaySelectEl.addEventListener("change", () => {
    const selectedOption =
      holidaySelectEl.options[holidaySelectEl.selectedIndex];
    if (!selectedOption.value) return;
    const [year, month, day] = selectedOption.value.split("-");
    const selectedDate = new Date(year, month - 1, day);
    eventNameEl.value = selectedOption.textContent;
    eventDateEl._flatpickr.setDate(selectedDate, true);
  });
  const populateHolidayBlacklist = (start, end) => {
    holidayBlacklistEl.innerHTML = "";
    if (!start || !end || start > end) {
      holidayBlacklistContainer.classList.remove("visible");
      return;
    }
    const holidaySet = new Map();
    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      window.holidayLibrary.getVnHolidays(year).forEach((h) => {
        if (h.date >= start && h.date <= end) {
          const dateString = h.date.toISOString().split("T")[0];
          if (!holidaySet.has(dateString)) holidaySet.set(dateString, h);
        }
      });
    }
    if (holidaySet.size === 0) {
      holidayBlacklistContainer.classList.remove("visible");
      return;
    }
    holidaySet.forEach((h) => {
      const item = document.createElement("div");
      item.className = "holiday-list-item";
      const dateString = h.date.toISOString().split("T")[0];
      item.innerHTML = `<input type="checkbox" id="holiday-${dateString}" value="${dateString}" checked><label for="holiday-${dateString}">${h.name}</label>`;
      holidayBlacklistEl.appendChild(item);
    });
    holidayBlacklistContainer.classList.add("visible");
  };
  excludeVnHolidaysEl.addEventListener("change", () => {
    if (excludeVnHolidaysEl.checked) {
      populateHolidayBlacklist(
        getDateFromPicker(workStartDateEl),
        getDateFromPicker(workEndDateEl)
      );
    } else {
      holidayBlacklistContainer.classList.remove("visible");
    }
  });
  [workStartDateEl, workEndDateEl].forEach((el) => {
    if (el._flatpickr) {
      el._flatpickr.config.onChange.push(() => {
        if (excludeVnHolidaysEl.checked)
          populateHolidayBlacklist(
            getDateFromPicker(workStartDateEl),
            getDateFromPicker(workEndDateEl)
          );
      });
    }
  });

  calcWorkDaysBtn.addEventListener("click", () => {
    hideResult(workDaysResult);
    let isValid = true;
    const start = getDateFromPicker(workStartDateEl);
    if (!start) {
      showError(workStartDateEl, "Vui lòng chọn ngày hợp lệ.");
      isValid = false;
    }
    const end = getDateFromPicker(workEndDateEl);
    if (!end) {
      showError(workEndDateEl, "Vui lòng chọn ngày hợp lệ.");
      isValid = false;
    }
    if (!isValid) return;
    if (start > end) {
      showError(workEndDateEl, "Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    const holidaySet = new Set();
    if (excludeVnHolidaysEl.checked) {
      const selectedHolidays = holidayBlacklistEl.querySelectorAll(
        'input[type="checkbox"]:checked'
      );
      selectedHolidays.forEach((cb) => holidaySet.add(cb.value));
    }
    let workingDays = 0;
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = holidaySet.has(currentDate.toISOString().split("T")[0]);
      if (!isWeekend && !isHoliday) {
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    displayResult(
      workDaysResult,
      `Có tổng cộng ${workingDays} ngày làm việc.`,
      false,
      "Tính Ngày Làm Việc"
    );
  });
  convertDateBtn.addEventListener("click", () => {
    hideResult(converterResultEl);
    const date = getDateFromPicker(converterDateEl);
    if (!date) {
      showError(converterDateEl, "Vui lòng chọn ngày hợp lệ.");
      return;
    }
    const year = date.getFullYear(),
      month = String(date.getMonth() + 1).padStart(2, "0"),
      day = String(date.getDate()).padStart(2, "0");
    const formats = [
      { label: "ISO 8601 (Y-M-D)", value: `${year}-${month}-${day}` },
      { label: "Kiểu Mỹ (M/D/Y)", value: `${month}/${day}/${year}` },
      {
        label: "Văn bản (Tiếng Việt)",
        value: date.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
      {
        label: "Văn bản (Tiếng Anh)",
        value: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
      {
        label: "Rút gọn (Tiếng Anh)",
        value: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      },
    ];
    const formatList = document.getElementById("format-list");
    formatList.innerHTML = "";
    formats.forEach((format) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${format.label}:</strong><span>${format.value}</span>`;
      formatList.appendChild(li);
    });
    converterResultEl.classList.add("visible");
    addToHistory("Chuyển Đổi Định Dạng", `Ngày gốc: ${converterDateEl.value}`);
  });
  calcDifferenceBtn.addEventListener("click", () => {
    hideResult(differenceResult);
    let isValid = true;
    const start = getDateFromPicker(startDateEl);
    if (!start) {
      showError(startDateEl, "Vui lòng chọn ngày hợp lệ.");
      isValid = false;
    }
    const end = getDateFromPicker(endDateEl);
    if (!end) {
      showError(endDateEl, "Vui lòng chọn ngày hợp lệ.");
      isValid = false;
    }
    if (!isValid) return;
    if (start > end) {
      showError(endDateEl, "Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    let years = end.getFullYear() - start.getFullYear(),
      months = end.getMonth() - start.getMonth(),
      days = end.getDate() - start.getDate();
    if (days < 0) {
      months--;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const resultText = `Khoảng cách là:\n- ${years} năm, ${months} tháng, và ${days} ngày.\n- Hoặc tổng cộng ${diffDays} ngày.`;
    displayResult(differenceResult, resultText, false, "Tính Khoảng Cách Ngày");
  });
  const handleDateManipulation = (operation) => {
    hideResult(addSubtractResult);
    const baseDate = getDateFromPicker(baseDateEl);
    if (!baseDate) {
      showError(baseDateEl, "Vui lòng chọn ngày hợp lệ.");
      return;
    }
    const amount = parseInt(numUnitsEl.value, 10);
    const resultDate = new Date(baseDate.getTime());
    const sign = operation === "add" ? 1 : -1;
    if (unitEl.value === "days")
      resultDate.setDate(resultDate.getDate() + amount * sign);
    if (unitEl.value === "weeks")
      resultDate.setDate(resultDate.getDate() + amount * 7 * sign);
    if (unitEl.value === "months")
      resultDate.setMonth(resultDate.getMonth() + amount * sign);
    if (unitEl.value === "years")
      resultDate.setFullYear(resultDate.getFullYear() + amount * sign);
    const formattedDate = resultDate.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    displayResult(
      addSubtractResult,
      `Ngày kết quả là: ${formattedDate}`,
      false,
      "Thêm / Bớt Ngày"
    );
  };
  addDateBtn.addEventListener("click", () => handleDateManipulation("add"));
  subtractDateBtn.addEventListener("click", () =>
    handleDateManipulation("subtract")
  );
  calcAgeBtn.addEventListener("click", () => {
    hideResult(ageResult);
    const birth = getDateFromPicker(birthDateEl);
    if (!birth) {
      showError(birthDateEl, "Vui lòng chọn ngày hợp lệ.");
      return;
    }
    const today = new Date();
    if (birth > today) {
      showError(birthDateEl, "Ngày sinh không thể ở tương lai.");
      return;
    }
    let years = today.getFullYear() - birth.getFullYear(),
      months = today.getMonth() - birth.getMonth(),
      days = today.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const resultText = `Tuổi của bạn là: ${years} năm, ${months} tháng, và ${days} ngày.`;
    displayResult(ageResult, resultText, false, "Tính Tuổi");
  });
  countdownBtn.addEventListener("click", () => {
    hideResult(countdownResult);
    const targetDate = getDateFromPicker(eventDateEl);
    if (!targetDate) {
      showError(eventDateEl, "Vui lòng chọn ngày hợp lệ.");
      return;
    }
    const name = eventNameEl.value.trim() || "Sự kiện";
    localStorage.setItem(EVENT_NAME_KEY, name);
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      const distance = targetDate.getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(countdownInterval);
        const resultText = `Sự kiện "${name}" đã diễn ra!`;
        displayResult(countdownResult, resultText, false, "Đếm Ngược Sự Kiện");
        return;
      }
      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);
      const resultText = `Còn: ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây nữa là đến "${name}"`;
      displayResult(countdownResult, resultText, false);
    }, 1000);
  });
  findDayBtn.addEventListener("click", () => {
    hideResult(dayOfWeekResult);
    const date = getDateFromPicker(findDayDateEl);
    if (!date) {
      showError(findDayDateEl, "Vui lòng chọn ngày hợp lệ.");
      return;
    }
    const formattedDate = date.toLocaleDateString("vi-VN", { weekday: "long" });
    const resultText = `Đó là ngày: ${formattedDate}`;
    displayResult(dayOfWeekResult, resultText, false, "Tìm Thứ Trong Tuần");
  });
  leapYearBtn.addEventListener("click", () => {
    hideResult(leapYearResult);
    const yearStr = yearInputEl.value;
    if (!/^\d{4}$/.test(yearStr)) {
      showError(yearInputEl, "Vui lòng nhập năm có 4 chữ số.");
      return;
    }
    const year = parseInt(yearStr, 10);
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const resultText = `Năm ${year} ${
      isLeap ? "là" : "không phải là"
    } một năm nhuận.`;
    displayResult(leapYearResult, resultText, false, "Kiểm Tra Năm Nhuận");
  });

  const loadInitialData = () => {
    loadHistory();
    const savedEventName = localStorage.getItem(EVENT_NAME_KEY);
    if (savedEventName) {
      eventNameEl.value = savedEventName;
    }
    populateHolidayDropdown();
  };
  loadInitialData();
});
