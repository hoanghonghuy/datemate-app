document.addEventListener("DOMContentLoaded", () => {
  // --- NEW: THEME SWITCHER LOGIC ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
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

  // UPDATED: displayResult function
  const displayResult = (resultElement, message, isError = false) => {
    const textSpan = resultElement.querySelector(".result-text");
    textSpan.innerHTML = message.replace(/\n/g, "<br>");
    resultElement.className = "result visible";
    if (isError) {
      resultElement.classList.add("error");
    }
  };

  // UPDATED: hideResult function
  const hideResult = (resultElement) => {
    if (resultElement) {
      resultElement.classList.remove("visible");
      const textSpan = resultElement.querySelector(".result-text");
      if (textSpan) {
        textSpan.innerHTML = "";
      }
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

  // --- GENERAL EVENT LISTENERS ---
  document.querySelectorAll(".btn-today").forEach((button) =>
    button.addEventListener("click", () => {
      const targetInput = document.getElementById(button.dataset.target);
      const today = new Date();
      targetInput.value = today.toLocaleDate_String("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      clearError(targetInput);
    })
  );
  document.querySelectorAll(".btn-clear").forEach((button) =>
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      card.querySelectorAll("input, select").forEach((el) => {
        if (el.type === "number") el.value = "1";
        else if (el.tagName.toLowerCase() === "select") el.selectedIndex = 0;
        else el.value = "";
        clearError(el);
      });
      hideResult(card.querySelector(".result"));
      if (card.dataset.card === "countdown" && countdownInterval)
        clearInterval(countdownInterval);
    })
  );
  document
    .querySelectorAll("input")
    .forEach((input) =>
      input.addEventListener("input", () => clearError(input))
    );

  // UPDATED: COPY BUTTON LOGIC
  document.querySelectorAll(".btn-copy").forEach((button) => {
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
    });
  });

  // --- FEATURE LOGIC (No changes here, it will work with the updated helpers) ---
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
    displayResult(
      differenceResult,
      `Khoảng cách là:\n- ${years} năm, ${months} tháng, và ${days} ngày.\n- Hoặc tổng cộng ${diffDays} ngày.`
    );
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
    displayResult(addSubtractResult, `Ngày kết quả là: ${formattedDate}`);
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
    displayResult(
      ageResult,
      `Tuổi của bạn là: ${years} năm, ${months} tháng, và ${days} ngày.`
    );
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
        displayResult(countdownResult, `Sự kiện "${name}" đã diễn ra!`);
        return;
      }
      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);
      displayResult(
        countdownResult,
        `Còn: ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây nữa là đến "${name}"`
      );
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
    displayResult(dayOfWeekResult, `Đó là ngày: ${formattedDate}`);
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
    displayResult(
      leapYearResult,
      `Năm ${year} ${isLeap ? "là" : "không phải là"} một năm nhuận.`
    );
  });
});
