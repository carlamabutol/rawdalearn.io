(function () {
  "use strict";

  const ROW_REVEAL_DELAY = 1800; // ms the answer stays up before the row resets and the next teacher's turn begins
  const instructions = document.getElementById("instructions");

  const rows = Array.from(document.querySelectorAll(".dialogue-row")).map((section) => ({
    section,
    teacher: section.querySelector(".character.teacher"),
    student: section.querySelector(".character.student"),
  }));

  function setPhoto(button, active) {
    const photo = button.querySelector(".char-photo");
    if (!photo) return;
    photo.src = active ? photo.dataset.active : photo.dataset.standby;
  }

  function openBubble(button) {
    const bubble = document.getElementById(button.getAttribute("aria-controls"));
    if (bubble) bubble.classList.add("show");
    button.setAttribute("aria-expanded", "true");
  }

  function closeBubble(button) {
    const bubble = document.getElementById(button.getAttribute("aria-controls"));
    if (bubble) bubble.classList.remove("show");
    button.setAttribute("aria-expanded", "false");
  }

  function celebrate(button) {
    const rect = button.getBoundingClientRect();
    const colors = ["#189b93", "#d9a441", "#b3652f", "#eaf6f4"];
    for (let i = 0; i < 14; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = rect.left + rect.width / 2 + (Math.random() * 60 - 30) + "px";
      piece.style.top = rect.top + "px";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.15 + "s";
      confettiLayer.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  const confettiLayer = document.getElementById("confettiLayer");

  function beginTeacherTurn(index) {
    const row = rows[index];
    if (!row) {
      if (instructions) instructions.textContent = "أحسنت! لقد أنهيت الدرس كاملاً 🎉";
      return;
    }
    row.section.classList.add("active-row");
    setPhoto(row.teacher, true); // pre-set to the asking pose before any click
    row.teacher.disabled = false;
    row.teacher.classList.add("pulse");
    if (instructions) instructions.textContent = "اضغط على المعلم لتسمع السؤال 🌟";

    row.teacher.addEventListener(
      "click",
      () => {
        row.teacher.disabled = true;
        row.teacher.classList.remove("pulse");
        openBubble(row.teacher);
        beginStudentTurn(index);
      },
      { once: true }
    );
  }

  function beginStudentTurn(index) {
    const row = rows[index];
    row.student.disabled = false;
    row.student.classList.add("pulse");
    if (instructions) instructions.textContent = "اضغط على الطالب لتعرف الإجابة 🌟";

    row.student.addEventListener(
      "click",
      () => {
        row.student.disabled = true;
        row.student.classList.remove("pulse");
        setPhoto(row.student, true);
        openBubble(row.student);
        celebrate(row.student);
        if (instructions) instructions.textContent = "أحسنت! 👏";

        window.setTimeout(() => {
          closeBubble(row.teacher);
          closeBubble(row.student);
          setPhoto(row.teacher, false);
          setPhoto(row.student, false);
          row.section.classList.remove("active-row");
          beginTeacherTurn(index + 1);
        }, ROW_REVEAL_DELAY);
      },
      { once: true }
    );
  }

  beginTeacherTurn(0);
})();
