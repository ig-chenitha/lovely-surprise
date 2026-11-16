(() => {
  "use strict";
  const root = document.getElementById("countdown");
  if (!root) return;

  const target = new Date(root.dataset.date).getTime();
  const fields = {
    days: document.getElementById("countdownDays"),
    hours: document.getElementById("countdownHours"),
    minutes: document.getElementById("countdownMinutes"),
    seconds: document.getElementById("countdownSeconds")
  };
  const note = document.getElementById("countdownNote");
  let timer = null;

  function updateCountdown() {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      Object.values(fields).forEach(field => { if (field) field.textContent = "00"; });
      if (note) note.textContent = "Our special day is here! ♡";
      if (timer) window.clearInterval(timer);
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
    Object.entries(values).forEach(([key, value]) => {
      if (fields[key]) fields[key].textContent = key === "days" ? String(value) : String(value).padStart(2, "0");
    });
  }

  updateCountdown();
  timer = window.setInterval(updateCountdown, 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateCountdown();
  });
})();