(function () {
  const track = document.getElementById("slider-track");
  const slides = Array.from(track.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const dotsWrap = document.getElementById("dots");
  const currentEl = document.getElementById("current-slide");
  const totalEl = document.getElementById("total-slides");
  const thumbs = Array.from(document.querySelectorAll(".thumb"));
  const viewport = track.parentElement;

  let index = 0;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  totalEl.textContent = String(slides.length);

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Слайд " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

  function goTo(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = "translateX(-" + index * 100 + "%)";
    currentEl.textContent = String(index + 1);

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("is-active", i === index);
    });
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      goTo(Number(thumb.dataset.index));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  });

  function onPointerDown(clientX) {
    dragging = true;
    startX = clientX;
    deltaX = 0;
    track.classList.add("is-dragging");
  }

  function onPointerMove(clientX) {
    if (!dragging) return;
    deltaX = clientX - startX;
    const percent = (deltaX / viewport.offsetWidth) * 100;
    track.style.transform = "translateX(calc(-" + index * 100 + "% + " + percent + "%))";
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");

    const threshold = viewport.offsetWidth * 0.18;
    if (deltaX < -threshold) {
      next();
    } else if (deltaX > threshold) {
      prev();
    } else {
      goTo(index);
    }
  }

  viewport.addEventListener("touchstart", (e) => {
    onPointerDown(e.touches[0].clientX);
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    onPointerMove(e.touches[0].clientX);
  }, { passive: true });

  viewport.addEventListener("touchend", onPointerUp);

  viewport.addEventListener("mousedown", (e) => {
    e.preventDefault();
    onPointerDown(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    onPointerMove(e.clientX);
  });

  window.addEventListener("mouseup", onPointerUp);

  window.addEventListener("resize", () => goTo(index));

  goTo(0);
})();
