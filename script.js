(function () {
  "use strict";

  const characters = Array.from(document.querySelectorAll(".character"));
  const confettiLayer = document.getElementById("confettiLayer");

  function closeBubble(button) {
    const bubbleId = button.getAttribute("aria-controls");
    const bubble = document.getElementById(bubbleId);
    if (!bubble) return;
    bubble.classList.remove("show");
    button.setAttribute("aria-expanded", "false");
  }

  function openBubble(button) {
    const bubbleId = button.getAttribute("aria-controls");
    const bubble = document.getElementById(bubbleId);
    if (!bubble) return;
    bubble.classList.add("show");
    button.setAttribute("aria-expanded", "true");
  }

  function isOpen(button) {
    return button.getAttribute("aria-expanded") === "true";
  }

  function toggleCharacter(button) {
    const wasOpen = isOpen(button);
    if (wasOpen) {
      closeBubble(button);
    } else {
      openBubble(button);
      button.classList.remove("pulse");

      if (button.classList.contains("teacher")) {
        const partnerId = button.getAttribute("data-partner");
        const partner = partnerId ? document.getElementById(partnerId) : null;
        if (partner) partner.classList.add("pulse");
      }

      if (button.classList.contains("student")) {
        celebrate(button);
      }
    }
  }

  characters.forEach((button) => {
    button.addEventListener("click", () => toggleCharacter(button));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".char-slot")) {
      characters.forEach(closeBubble);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      characters.forEach(closeBubble);
    }
  });

  // gentle nudge: pulse the first teacher on load to invite interaction
  const firstTeacher = document.querySelector(".character.teacher");
  if (firstTeacher) firstTeacher.classList.add("pulse");

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
})();
