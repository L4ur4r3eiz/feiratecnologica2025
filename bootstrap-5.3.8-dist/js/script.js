// Declare AOS antes de usar
const AOS = window.AOS;

// Inicializa AOS
document.addEventListener("DOMContentLoaded", () => {
  if (AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }

  // ================== CARROSSEL ==================
  const carousel = document.getElementById("participantsCarousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtnCarousel = document.getElementById("nextBtn");
  const indicatorsContainer = document.getElementById("carouselIndicators");
  const cards = document.querySelectorAll(".participant-card");

  if (carousel && prevBtn && nextBtnCarousel && indicatorsContainer && cards.length > 0) {
    let currentIndex = 2;
    const totalCards = cards.length;

    // Cria indicadores
    for (let i = 0; i < totalCards; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add("indicator");
      if (i === currentIndex) indicator.classList.add("active");
      indicator.addEventListener("click", () => goToSlide(i));
      indicatorsContainer.appendChild(indicator);
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

      carousel.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    });

    nextBtnCarousel.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    });

    updateCarousel();
  }

  // ================== QUIZ ==================
  const quizData = [
    {
      question: "O que significa 'identidade da mulher' segundo o projeto?",
      options: [
        "Apenas aspectos biológicos",
        "Experiência interna e externa moldada por fatores culturais, sociais e pessoais",
        "Somente papéis sociais tradicionais",
        "Características físicas femininas",
      ],
      correct: 1,
    },
    {
      question: "Qual é a obra literária base do projeto?",
      options: ["Dom Casmurro", "Grande Sertão: Veredas", "Filhos do Quarto", "Memórias Póstumas de Brás Cubas"],
      correct: 2,
    },
    {
      question: "O que representa a 'renúncia dos sonhos pessoais'?",
      options: [
        "Desistir de hobbies",
        "Abrir mão de aspirações em favor de outras prioridades",
        "Não ter objetivos na vida",
        "Seguir apenas sonhos profissionais",
      ],
      correct: 1,
    },
    {
      question: "Qual é o objetivo principal do projeto?",
      options: [
        "Ensinar programação",
        "Promover reflexão sobre identidade feminina e empoderamento",
        "Criar um site bonito",
        "Vender livros",
      ],
      correct: 1,
    },
    {
      question: "O projeto é caracterizado como:",
      options: [
        "Apenas literário",
        "Somente tecnológico",
        "Interdisciplinar (Literatura, Sociologia, História, Artes)",
        "Exclusivamente artístico",
      ],
      correct: 2,
    },
  ];

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

  if (questionText && quizOptions && nextBtnQuiz && restartBtn && progressBar && currentQuestionSpan && totalQuestionsSpan && quizBody && quizResult && scoreText && totalQuestionsResult && resultMessage) {
    totalQuestionsSpan.textContent = quizData.length;
    totalQuestionsResult.textContent = quizData.length;

    function loadQuestion() {
      answered = false;
      nextBtnQuiz.style.display = "none";

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

      currentQuestionSpan.textContent = currentQuestion + 1;
      const progress = ((currentQuestion + 1) / quizData.length) * 100;
      progressBar.style.width = progress + "%";
    }

    function selectOption(selectedIndex, selectedElement) {
      if (answered) return;

      answered = true;
      const question = quizData[currentQuestion];
      const allOptions = document.querySelectorAll(".quiz-option");

      allOptions.forEach((option, index) => {
        option.style.pointerEvents = "none";
        if (index === question.correct) option.classList.add("correct");
        else if (index === selectedIndex && selectedIndex !== question.correct) option.classList.add("incorrect");
      });

      if (selectedIndex === question.correct) score++;

      setTimeout(() => {
        if (currentQuestion < quizData.length - 1) {
          nextBtnQuiz.style.display = "inline-block";
        } else {
          showResults();
        }
      }, 1000);
    }

    function showResults() {
      quizBody.style.display = "none";
      quizResult.style.display = "block";
      scoreText.textContent = score;

      const percentage = (score / quizData.length) * 100;
      let message = "";
      if (percentage === 100) message = "🎉 Perfeito! Você domina completamente o conteúdo do projeto sobre identidade feminina!";
      else if (percentage >= 80) message = "👏 Excelente! Você tem um ótimo conhecimento sobre o projeto e seus temas!";
      else if (percentage >= 60) message = "👍 Muito bem! Você entendeu os conceitos principais do projeto!";
      else if (percentage >= 40) message = "📚 Bom começo! Que tal reler o conteúdo do site para aprender mais?";
      else message = "💪 Continue explorando! Navegue pelo site para conhecer melhor o projeto!";

      resultMessage.textContent = message;
      restartBtn.style.display = "inline-block";
    }

    nextBtnQuiz.addEventListener("click", () => {
      currentQuestion++;
      loadQuestion();
    });

    restartBtn.addEventListener("click", () => {
      currentQuestion = 0;
      score = 0;
      quizBody.style.display = "block";
      quizResult.style.display = "none";
      restartBtn.style.display = "none";
      loadQuestion();
    });

    loadQuestion();
  }

  // ================== CHECKLIST ==================

  // Script.js
const tasks = [
  "Preparar as refeições da família 🍳",
  "Organizar a casa 🧹",
  "Ajudar os filhos nas tarefas escolares 📚",
  "Trabalhar ou estudar fora de casa 💼",
  "Cuidar da saúde física 🏃‍♀️",
  "Reservar tempo para lazer 🎬",
  "Gerenciar as finanças familiares 💰",
  "Apoiar emocionalmente familiares 💞",
  "Separar um tempo para autocuidado 🧖‍♀️",
  "Praticar um hobby pessoal 🎨",
  "Fazer compras ou mercado 🛒",
  "Acompanhar consultas médicas da família 🩺",
  "Cuidar de plantas ou animais 🌿🐶",
  "Conversar com amigos 👯‍♀️",
  "Planejar momentos de descanso ☕",
  "Refletir sobre o dia 🌅",
  "Delegar ou dividir tarefas ⚖️"
];

const tasksDiv = document.getElementById('tasks');
const checklistContainer = document.getElementById('checklist-container');
const genderAnimation = document.getElementById('genderAnimation');
const submitBtn = document.getElementById('submitBtn');
const modalBody = document.getElementById('modalBody');
const genderRadios = document.querySelectorAll('input[name="gender"]');

// Criar checkboxes dinamicamente
tasks.forEach((task, i) => {
  const div = document.createElement("div");
  div.classList.add("task-item");
  div.innerHTML = `<input type="checkbox" class="task-checkbox" id="task${i}"><label for="task${i}">${task}</label>`;
  tasksDiv.appendChild(div);
});

// Alterar gênero
genderRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const gender = radio.value;
    if(gender === 'homem') {
      checklistContainer.style.backgroundColor = '#fff4a3';
      genderAnimation.innerHTML = `<img src=" img/homemm.png">`;
      document.querySelectorAll('.task-checkbox').forEach(cb => cb.style.accentColor = '#FFD700');
    } else {
      checklistContainer.style.backgroundColor = '#f8c8dc';
      genderAnimation.innerHTML = `<img src="img/mulher.png">`;
      document.querySelectorAll('.task-checkbox').forEach(cb => cb.style.accentColor = '#d63384');
    }
  });
});

// Resultado Modal
submitBtn.addEventListener('click', () => {
  const checkedTasks = [];
  document.querySelectorAll('.task-checkbox').forEach((cb, i) => {
    if(cb.checked) checkedTasks.push(tasks[i]);
  });

  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  if(!gender) {
    modalBody.innerHTML = `<p style="font-weight:600;">Selecione um gênero antes de ver o resultado 💡</p>`;
    new bootstrap.Modal(document.getElementById('resultModal')).show();
    return;
  }

  let message = "";
  const completed = checkedTasks.length;
  if(gender==='homem'){
    if(completed<5) message="🤔 Poucas tarefas realizadas! Que tal refletir sobre o quanto as responsabilidades são compartilhadas?";
    else if(completed<10) message="👏 Boa tentativa! Dividir mais tarefas ajuda a equilibrar a rotina familiar.";
    else message="💪 Excelente! Você está contribuindo bastante — continue valorizando o cuidado e a parceria.";
  } else {
    if(completed<5) message="😔 Parece que você anda sobrecarregada. Lembre-se de descansar e pedir ajuda.";
    else if(completed<10) message="💖 Você está fazendo muito! Procure equilibrar responsabilidades sem se cobrar demais.";
    else message="🌟 Incrível! Sua dedicação é inspiradora, mas reserve tempo para si mesma também.";
  }

  modalBody.innerHTML = `<h5>${completed} de ${tasks.length} tarefas completadas</h5>
    <ul>${checkedTasks.map(t=>`<li>${t}</li>`).join('')}</ul>
    <p style="margin-top:15px;font-weight:600;">${message}</p>`;

  new bootstrap.Modal(document.getElementById('resultModal')).show();
});





});
