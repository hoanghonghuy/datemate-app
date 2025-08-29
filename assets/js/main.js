document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  AOS.init({ duration: 600, once: true, easing: "ease-in-out" });
  const showToast = (text, isError = false) => {
    Toastify({
      text: text,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: isError
          ? "linear-gradient(to right, #ff5f6d, #ffc371)"
          : "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  };
  window.showToast = showToast;

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
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
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      applyTheme("dark");
    }
    themeToggle.addEventListener("change", () => {
      const newTheme = themeToggle.checked ? "dark" : "light";
      applyTheme(newTheme);
      saveThemePreference(newTheme);
    });
  }

  const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
  if (scrollToTopBtn) {
    const debounce = (func, delay = 150) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    };
    window.addEventListener(
      "scroll",
      debounce(() => {
        if (window.scrollY > 300) {
          scrollToTopBtn.classList.add("visible");
        } else {
          scrollToTopBtn.classList.remove("visible");
        }
      })
    );
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
