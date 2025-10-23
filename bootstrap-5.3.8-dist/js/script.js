document.addEventListener("DOMContentLoaded", () => {
  // --- AOS (Animate On Scroll) ---
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }

  // --- CAROUSEL PARTICIPANTES ---
  const carousel = document.getElementById("participantsCarousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtnCarousel = document.getElementById("nextBtn");
  const indicatorsContainer = document.getElementById("carouselIndicators");
  const cards = document.querySelectorAll(".participant-card");
  let currentIndex = 2; // Middle card
  const totalCards = cards.length;

  if (carousel && cards.length > 0) {
    // Cria indicadores
    if (indicatorsContainer) {
      for (let i = 0; i < totalCards; i++) {
        const indicator = document.createElement("div");
        indicator.classList.add("indicator");
        if (i === currentIndex) indicator.classList.add("active");
        indicator.addEventListener("click", () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
      }
    }
    const indicators = document.querySelectorAll(".indicator");

    function updateCarousel() {
      cards.forEach((card, index) => {
        card.classList.remove("active");
        if (index === currentIndex) card.classList.add("active");
      });
      indicators.forEach((indicator, index) => {
        indicator.classList.remove("active");
        if (index === currentIndex) indicator.classList.add("active");
      });

      const cardWidth = cards[0].offsetWidth;
      const gap = 32;
      let scrollPosition = currentIndex * (cardWidth + gap);
      scrollPosition -= (carousel.offsetWidth / 2) - (cardWidth / 2);
      const maxScrollLeft = carousel.scrollWidth - carousel.offsetWidth;
      scrollPosition = Math.max(0, Math.min(scrollPosition, maxScrollLeft));
      carousel.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
      });
    }
    if (nextBtnCarousel) {
      nextBtnCarousel.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
      });
    }

    updateCarousel();
  }

  // --- QUIZ ---
  const quizData = window.quizData || []; // Caso você defina os dados globalmente
  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const questionText = document.getElementById("questionText");
  const quizOptions = document.getElementById("quizOptions");
  const nextBtnQuiz = document.getElementById("nextQuestionBtn");
  const restartBtn = document.getElementById("restartBtn");
  const progressBar = document.getElementById("progressBar");
  const currentQuestionSpan = document.getElementById("currentQuestion");
  const totalQuestionsSpan = document.getElementById("totalQuestions");
  const quizBody = document.getElementById("quizBody");
  const quizResult = document.getElementById("quizResult");
  const scoreText = document.getElementById("scoreText");
  const totalQuestionsResult = document.getElementById("totalQuestionsResult");
  const resultMessage = document.getElementById("resultMessage");

  function loadQuestion() {
    if (!quizData.length || !questionText || !quizOptions) return;

    answered = false;
    if (nextBtnQuiz) nextBtnQuiz.style.display = "none";

    const question = quizData[currentQuestion];
    questionText.textContent = question.question;
    quizOptions.innerHTML = "";

    question.options.forEach((option, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("quiz-option");
      optionDiv.textContent = option;
      optionDiv.addEventListener("click", () => selectOption(index, optionDiv));
      quizOptions.appendChild(optionDiv);
    });

    if (currentQuestionSpan) currentQuestionSpan.textContent = currentQuestion + 1;
    if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizData.length;
    if (totalQuestionsResult) totalQuestionsResult.textContent = quizData.length;

    if (progressBar) {
      const progress = ((currentQuestion + 1) / quizData.length) * 100;
      progressBar.style.width = progress + "%";
    }
  }

  function selectOption(selectedIndex, selectedElement) {
    if (answered) return;
    answered = true;

    const question = quizData[currentQuestion];
    const allOptions = document.querySelectorAll(".quiz-option");
    allOptions.forEach((option, index) => {
      option.style.pointerEvents = "none";
      if (index === question.correct) option.classList.add("correct");
      else if (index === selectedIndex) option.classList.add("incorrect");
    });

    if (selectedIndex === question.correct) score++;

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1 && nextBtnQuiz) {
        nextBtnQuiz.style.display = "inline-block";
      } else {
        showResults();
      }
    }, 1000);
  }

  function showResults() {
    if (quizBody) quizBody.style.display = "none";
    if (quizResult) quizResult.style.display = "block";
    if (scoreText) scoreText.textContent = score;

    let message = "";
    const percentage = (score / quizData.length) * 100;
    if (percentage === 100) message = "🎉 Perfeito!";
    else if (percentage >= 80) message = "👏 Excelente!";
    else if (percentage >= 60) message = "👍 Muito bem!";
    else if (percentage >= 40) message = "📚 Bom começo!";
    else message = "💪 Continue explorando!";

    if (resultMessage) resultMessage.textContent = message;
    if (restartBtn) restartBtn.style.display = "inline-block";
  }

  if (nextBtnQuiz) nextBtnQuiz.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
  });

  if (restartBtn) restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    if (quizBody) quizBody.style.display = "block";
    if (quizResult) quizResult.style.display = "none";
    if (restartBtn) restartBtn.style.display = "none";
    loadQuestion();
  });

  if (quizData.length) loadQuestion();

  // --- CHECKLIST E MURAL ---
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const checklistContainer = document.getElementById('checklist-container');
  const genderAnimation = document.getElementById('genderAnimation');
  const tasksDiv = document.getElementById('tasks');
  const submitBtn = document.getElementById('submitBtn');
  const modalBody = document.getElementById('modalBody');

  const tasks = [
    "Completar leitura do capítulo 1",
    "Assistir vídeo introdutório",
    "Responder questionário online",
    "Participar do fórum de discussão",
    "Realizar atividade prática 1",
    "Enviar resumo para avaliação",
    "Revisar notas da aula anterior",
    "Estudar conteúdo adicional",
    "Preparar apresentação em grupo",
    "Revisar material de referência",
    "Responder exercício de fixação",
    "Participar de quiz semanal",
    "Criar mapa mental",
    "Enviar relatório parcial",
    "Preparar resumo em PDF",
    "Estudar para prova",
    "Refletir sobre aprendizado"
  ];

  if (tasksDiv) {
    tasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.classList.add("task-item");
      div.innerHTML = `
        <input type="checkbox" id="task${index}" class="task-checkbox">
        <label for="task${index}">${task}</label>
      `;
      tasksDiv.appendChild(div);
    });
  }

  if (genderRadios.length && checklistContainer && genderAnimation) {
    genderRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'homem') {
          checklistContainer.style.backgroundColor = '#fff8b5';
          genderAnimation.innerHTML = `<img src="https://i.ibb.co/1f8yG5K/boy-animated.gif" alt="Homem">`;
          document.querySelectorAll(".task-checkbox").forEach(cb => cb.style.accentColor = '#FFD700');
        } else {
          checklistContainer.style.backgroundColor = '#f3e0ff';
          genderAnimation.innerHTML = `<img src="https://i.ibb.co/Jp3D7Hk/girl-animated.gif" alt="Mulher">`;
          document.querySelectorAll(".task-checkbox").forEach(cb => cb.style.accentColor = '#6f42c1');
        }
      });
    });
  }

  if (submitBtn && modalBody) {
    submitBtn.addEventListener('click', () => {
      const checkedTasks = [];
      document.querySelectorAll(".task-checkbox").forEach((cb, i) => {
        if (cb.checked) checkedTasks.push(tasks[i]);
      });

      const username = document.getElementById('username')?.value || "Usuário";
      modalBody.innerHTML = `
        <p><strong>${username}</strong>, você completou <strong>${checkedTasks.length}</strong> tarefas:</p>
        <ul>${checkedTasks.map(t => `<li>${t}</li>`).join('')}</ul>
      `;

      const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
      resultModal.show();
    });
  }
});
