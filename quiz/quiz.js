(function () {
  const form = document.getElementById("quiz-form");
  const results = document.getElementById("results");
  const scoreCorrect = document.getElementById("score-correct");
  const wrongBlock = document.getElementById("wrong-block");
  const wrongList = document.getElementById("wrong-list");
  const allCorrect = document.getElementById("all-correct");
  const range = document.getElementById("q6");
  const rangeValue = document.getElementById("q6-value");
  const resetBtn = document.getElementById("reset-btn");

  const answers = {
    1: {
      check(formData) {
        return formData.get("q1") === "title";
      },
      expected: "<title>",
      title: "Какой тег задаёт заголовок страницы во вкладке браузера?",
    },
    2: {
      check(formData) {
        const selected = formData.getAll("q2").sort().join(",");
        return selected === "align-items,flex-direction,justify-content";
      },
      expected: "justify-content, align-items, flex-direction",
      title: "Какие свойства относятся к Flexbox?",
    },
    3: {
      check(formData) {
        return formData.get("q3") === "POST";
      },
      expected: "POST",
      title: "Какой HTTP-метод обычно используют для отправки формы?",
    },
    4: {
      check(formData) {
        const value = (formData.get("q4") || "").trim().toLowerCase();
        return value === "color";
      },
      expected: "color",
      title: "Какое CSS-свойство меняет цвет текста?",
    },
    5: {
      check(formData) {
        const value = (formData.get("q5") || "").trim().toLowerCase().replace(/\s+/g, "");
        return value === "<p>" || value === "<p></p>";
      },
      expected: "<p> или <p></p>",
      title: "HTML-тег для абзаца",
    },
    6: {
      check(formData) {
        return String(formData.get("q6")) === "6";
      },
      expected: "6",
      title: "Сколько уровней заголовков в HTML?",
    },
  };

  function getUserAnswer(num, formData) {
    switch (num) {
      case 1:
        return formData.get("q1") || "не выбран";
      case 2: {
        const list = formData.getAll("q2");
        return list.length ? list.join(", ") : "не выбрано";
      }
      case 3:
        return formData.get("q3") || "не выбран";
      case 4:
        return (formData.get("q4") || "").trim() || "пусто";
      case 5:
        return (formData.get("q5") || "").trim() || "пусто";
      case 6:
        return formData.get("q6");
      default:
        return "";
    }
  }

  function clearMarks() {
    document.querySelectorAll(".q-card").forEach((card) => {
      card.classList.remove("ok", "wrong");
    });
  }

  range.addEventListener("input", () => {
    rangeValue.textContent = range.value;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const wrong = [];
    let correctCount = 0;

    clearMarks();

    Object.keys(answers).forEach((key) => {
      const num = Number(key);
      const card = document.querySelector(`.q-card[data-q="${num}"]`);
      const isCorrect = answers[num].check(formData);

      if (isCorrect) {
        correctCount += 1;
        if (card) card.classList.add("ok");
      } else {
        if (card) card.classList.add("wrong");
        wrong.push({
          num,
          title: answers[num].title,
          given: getUserAnswer(num, formData),
          expected: answers[num].expected,
        });
      }
    });

    scoreCorrect.textContent = String(correctCount);
    wrongList.innerHTML = "";

    if (wrong.length === 0) {
      wrongBlock.hidden = true;
      allCorrect.hidden = false;
    } else {
      allCorrect.hidden = true;
      wrongBlock.hidden = false;
      wrong.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<strong>Вопрос ${item.num}.</strong> ${item.title}<br>` +
          `Ваш ответ: <em>${escapeHtml(String(item.given))}</em><br>` +
          `Верно: ${escapeHtml(item.expected)}`;
        wrongList.appendChild(li);
      });
    }

    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      rangeValue.textContent = range.value;
      clearMarks();
      results.hidden = true;
      wrongList.innerHTML = "";
      wrongBlock.hidden = true;
      allCorrect.hidden = true;
    }, 0);
  });

  resetBtn.addEventListener("click", () => {
    /* reset handled by form reset event */
  });

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
