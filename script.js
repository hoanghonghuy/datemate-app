document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // --- THEME SWITCHER LOGIC ---
  const themeToggle = document.getElementById("theme-toggle");
  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      themeToggle.checked = true;
    } else {
      body.classList.remove("dark-mode");
      themeToggle.checked = false;
    }
  };
  const saveThemePreference = (theme) => {
    localStorage.setItem("theme", theme);
  };
  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark) {
    applyTheme("dark");
  }
  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    applyTheme(newTheme);
    saveThemePreference(newTheme);
  });

  // --- NAVIGATION MENU LOGIC ---
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("overlay");
  const openMenu = () => body.classList.add("nav-open");
  const closeMenu = () => body.classList.remove("nav-open");
  menuToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    body.classList.contains("nav-open") ? closeMenu() : openMenu();
  });

  // --- SCROLL-TO-TOP BUTTON LOGIC ---
  const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- HISTORY PANEL LOGIC ---
  const HISTORY_KEY = "datemate_history";
  let history = [];
  const historyToggleBtn = document.getElementById("history-toggle-btn");
  const historyPanel = document.getElementById("history-panel");
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
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

  // --- SHARED CLOSE LOGIC FOR PANELS ---
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  overlay.addEventListener("click", () => {
    closeMenu();
    closeHistory();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (body.classList.contains("nav-open")) closeMenu();
      if (body.classList.contains("history-open")) closeHistory();
    }
  });

  // --- UI ENHANCEMENT & VALIDATION ---
  const autoFormatDateInput = (event) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, "");
    if (event.inputType === "deleteContentBackward") return;
    if (value.length >= 2) {
      let day = parseInt(value.substring(0, 2), 10);
      if (day > 31) value = "31" + value.substring(2);
      if (day === 0) value = "01" + value.substring(2);
    }
    if (value.length >= 4) {
      let month = parseInt(value.substring(2, 4), 10);
      if (month > 12) value = value.substring(0, 2) + "12" + value.substring(4);
      if (month === 0)
        value = value.substring(0, 2) + "01" + value.substring(4);
    }
    if (value.length > 2)
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    if (value.length > 5)
      value = `${value.substring(0, 5)}/${value.substring(5, 9)}`;
    input.value = value;
  };
  document
    .querySelectorAll(".date-input")
    .forEach((input) => input.addEventListener("input", autoFormatDateInput));

  // --- HELPER FUNCTIONS ---
  const parseDateString = (dateStr) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const parts = dateStr.match(regex);
    if (!parts) return null;
    const day = parseInt(parts[1], 10),
      month = parseInt(parts[2], 10),
      year = parseInt(parts[3], 10);
    if (year < 1000 || year > 9999 || month === 0 || month > 12) return null;
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      daysInMonth[1] = 29;
    }
    if (day > 0 && day <= daysInMonth[month - 1])
      return new Date(year, month - 1, day);
    return null;
  };
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
    textSpan.innerHTML = message.replace(/\n/g, "<br>");
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
    }
  };

  // --- ELEMENT SELECTION ---
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
    holidaysEl = document.getElementById("holidays"),
    calcWorkDaysBtn = document.getElementById("calcWorkDaysBtn"),
    workDaysResult = document.getElementById("workDaysResult");

  // --- GENERAL EVENT LISTENERS ---
  document.querySelectorAll(".btn-today").forEach((button) =>
    button.addEventListener("click", () => {
      const targetInput = document.getElementById(button.dataset.target);
      const today = new Date();
      targetInput.value = today.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      clearError(targetInput);
    })
  );
  document.querySelectorAll(".btn-clear").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      card.querySelectorAll("input, select, textarea").forEach((el) => {
        if (el.type === "number") el.value = "1";
        else if (el.tagName.toLowerCase() === "select") el.selectedIndex = 0;
        else el.value = "";
        clearError(el);
      });
      hideResult(card.querySelector(".result"));
      if (card.dataset.card === "countdown" && countdownInterval)
        clearInterval(countdownInterval);
    });
  });
  document
    .querySelectorAll("input, textarea")
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
          button.setAttribute("data-tooltip", "Đã sao chép!");
          button.classList.add("show-tooltip");
          setTimeout(() => {
            button.classList.remove("show-tooltip");
            button.setAttribute("data-tooltip", "Sao chép");
          }, 2000);
        } catch (err) {
          console.error("Không thể sao chép: ", err);
          button.setAttribute("data-tooltip", "Lỗi!");
        }
      }
    })
  );

  // --- FEATURE LOGIC ---
  calcWorkDaysBtn.addEventListener("click", () => {
    hideResult(workDaysResult);
    let isValid = true;
    const start = parseDateString(workStartDateEl.value);
    if (!start) {
      showError(workStartDateEl, "Ngày bắt đầu không hợp lệ.");
      isValid = false;
    }
    const end = parseDateString(workEndDateEl.value);
    if (!end) {
      showError(workEndDateEl, "Ngày kết thúc không hợp lệ.");
      isValid = false;
    }
    if (!isValid) return;
    if (start > end) {
      showError(workEndDateEl, "Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    const holidayStrings = holidaysEl.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const holidaySet = new Set();
    for (const str of holidayStrings) {
      const holidayDate = parseDateString(str);
      if (holidayDate) {
        holidaySet.add(holidayDate.toISOString().split("T")[0]);
      }
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

  calcDifferenceBtn.addEventListener("click", () => {
    hideResult(differenceResult);
    let isValid = true;
    const start = parseDateString(startDateEl.value);
    if (!start) {
      showError(startDateEl, "Ngày bắt đầu không hợp lệ.");
      isValid = false;
    }
    const end = parseDateString(endDateEl.value);
    if (!end) {
      showError(endDateEl, "Ngày kết thúc không hợp lệ.");
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
    const baseDate = parseDateString(baseDateEl.value);
    if (!baseDate) {
      showError(baseDateEl, "Ngày không hợp lệ.");
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
    const birth = parseDateString(birthDateEl.value);
    if (!birth) {
      showError(birthDateEl, "Ngày sinh không hợp lệ.");
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
    const targetDate = parseDateString(eventDateEl.value);
    if (!targetDate) {
      showError(eventDateEl, "Ngày sự kiện không hợp lệ.");
      return;
    }
    const name = eventNameEl.value.trim() || "Sự kiện";
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
      // Không lưu countdown vào lịch sử vì nó thay đổi liên tục
      displayResult(countdownResult, resultText, false);
    }, 1000);
  });

  findDayBtn.addEventListener("click", () => {
    hideResult(dayOfWeekResult);
    const date = parseDateString(findDayDateEl.value);
    if (!date) {
      showError(findDayDateEl, "Ngày không hợp lệ.");
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

  // --- INITIAL LOAD ---
  loadHistory();
});
