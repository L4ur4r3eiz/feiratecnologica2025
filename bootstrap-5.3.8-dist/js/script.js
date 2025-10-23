// Declare AOS before using it
const AOS = window.AOS

// Initialize AOS (Animate On Scroll)
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  })

  // Participants Carousel
  const carousel = document.getElementById("participantsCarousel")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtnCarousel = document.getElementById("nextBtn") // Renamed to avoid conflict with quiz nextBtn
  const indicatorsContainer = document.getElementById("carouselIndicators")
  const cards = document.querySelectorAll(".participant-card")

  let currentIndex = 2 // Start with middle card active
  const totalCards = cards.length

  // Create indicators
  for (let i = 0; i < totalCards; i++) {
    const indicator = document.createElement("div")
    indicator.classList.add("indicator")
    if (i === currentIndex) indicator.classList.add("active")
    indicator.addEventListener("click", () => goToSlide(i))
    indicatorsContainer.appendChild(indicator)
  }

  const indicators = document.querySelectorAll(".indicator")

  function updateCarousel() {
    cards.forEach((card, index) => {
      card.classList.remove("active")
      if (index === currentIndex) {
        card.classList.add("active")
      }
    })

    indicators.forEach((indicator, index) => {
      indicator.classList.remove("active")
      if (index === currentIndex) {
        indicator.classList.add("active")
      }
    })

    // --- Início da correção ---
    // Recalcula a posição de scroll para garantir que todos os cards sejam visíveis
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth; // Largura de um card
      const gap = 32; // Seu gap de 2rem = 32px

      // Calcula a largura total de todos os cards e gaps até o card atual
      // e subtrai metade da largura do carrossel para centralizar o card atual.
      // Adiciona metade da largura do card atual para centralizá-lo.
      let scrollPosition = currentIndex * (cardWidth + gap);

      // Ajusta para centralizar o card atual na viewport do carrossel.
      // Isso é crucial para que o primeiro e o último card também apareçam corretamente.
      scrollPosition -= (carousel.offsetWidth / 2) - (cardWidth / 2);

      // Garante que o scroll não vá além do início (0) e nem além do final do conteúdo.
      const maxScrollLeft = carousel.scrollWidth - carousel.offsetWidth;
      scrollPosition = Math.max(0, Math.min(scrollPosition, maxScrollLeft));

      carousel.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
    // --- Fim da correção ---
  }
  function goToSlide(index) {
    currentIndex = index
    updateCarousel()
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards
    updateCarousel()
  })

  nextBtnCarousel.addEventListener("click", () => {
    // Use renamed variable
    currentIndex = (currentIndex + 1) % totalCards
    updateCarousel()
  })

  // Initialize carousel position
  updateCarousel()

  // Interactive quiz functionality
  // Quiz Data
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
  ]

  let currentQuestion = 0
  let score = 0
  let answered = false

  const questionText = document.getElementById("questionText")
  const quizOptions = document.getElementById("quizOptions")
  const nextBtnQuiz = document.getElementById("nextQuestionBtn")// Renamed to avoid conflict with carousel nextBtn
  const restartBtn = document.getElementById("restartBtn")
  const progressBar = document.getElementById("progressBar")
  const currentQuestionSpan = document.getElementById("currentQuestion")
  const totalQuestionsSpan = document.getElementById("totalQuestions")
  const quizBody = document.getElementById("quizBody")
  const quizResult = document.getElementById("quizResult")
  const scoreText = document.getElementById("scoreText")
  const totalQuestionsResult = document.getElementById("totalQuestionsResult")
  const resultMessage = document.getElementById("resultMessage")

  // Set total questions
  totalQuestionsSpan.textContent = quizData.length
  totalQuestionsResult.textContent = quizData.length

  function loadQuestion() {
    answered = false
    nextBtnQuiz.style.display = "none" // Use renamed variable

    const question = quizData[currentQuestion]
    questionText.textContent = question.question
    quizOptions.innerHTML = ""

    question.options.forEach((option, index) => {
      const optionDiv = document.createElement("div")
      optionDiv.classList.add("quiz-option")
      optionDiv.textContent = option
      optionDiv.addEventListener("click", () => selectOption(index, optionDiv))
      quizOptions.appendChild(optionDiv)
    })

    // Update progress
    currentQuestionSpan.textContent = currentQuestion + 1
    const progress = ((currentQuestion + 1) / quizData.length) * 100
    progressBar.style.width = progress + "%"
  }

  function selectOption(selectedIndex, selectedElement) {
    if (answered) return

    answered = true
    const question = quizData[currentQuestion]
    const allOptions = document.querySelectorAll(".quiz-option")

    allOptions.forEach((option, index) => {
      option.style.pointerEvents = "none"
      if (index === question.correct) {
        option.classList.add("correct")
      } else if (index === selectedIndex && selectedIndex !== question.correct) {
        option.classList.add("incorrect")
      }
    })

    if (selectedIndex === question.correct) {
      score++
    }

    // Show next button or finish
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        nextBtnQuiz.style.display = "inline-block" // Use renamed variable
      } else {
        showResults()
      }
    }, 1000)
  }

  function showResults() {
    quizBody.style.display = "none"
    quizResult.style.display = "block"
    scoreText.textContent = score

    let message = ""
    const percentage = (score / quizData.length) * 100

    if (percentage === 100) {
      message = "🎉 Perfeito! Você domina completamente o conteúdo do projeto sobre identidade feminina!"
    } else if (percentage >= 80) {
      message = "👏 Excelente! Você tem um ótimo conhecimento sobre o projeto e seus temas!"
    } else if (percentage >= 60) {
      message = "👍 Muito bem! Você entendeu os conceitos principais do projeto!"
    } else if (percentage >= 40) {
      message = "📚 Bom começo! Que tal reler o conteúdo do site para aprender mais?"
    } else {
      message = "💪 Continue explorando! Navegue pelo site para conhecer melhor o projeto!"
    }

    resultMessage.textContent = message
    restartBtn.style.display = "inline-block"
  }

  nextBtnQuiz.addEventListener("click", () => {
    // Use renamed variable
    currentQuestion++
    loadQuestion()
  })

  restartBtn.addEventListener("click", () => {
    currentQuestion = 0
    score = 0
    quizBody.style.display = "block"
    quizResult.style.display = "none"
    restartBtn.style.display = "none"
    loadQuestion()
  })

  // Initialize quiz
  loadQuestion()

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.backdropFilter = "blur(10px)"
    } else {
      navbar.style.background = "white"
      navbar.style.backdropFilter = "none"
    }
  })

  // Mural e Checklist

  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const checklistContainer = document.getElementById('checklist-container');
  const genderAnimation = document.getElementById('genderAnimation');
  const tasksDiv = document.getElementById('tasks');
  const submitBtn = document.getElementById('submitBtn');
  const modalBody = document.getElementById('modalBody');

  // Lista de tarefas
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

  // Cria checkboxes das tarefas
  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.classList.add("task-item");

    div.innerHTML = `
            <input type="checkbox" id="task${index}" class="task-checkbox">
            <label for="task${index}">${task}</label>
        `;
    tasksDiv.appendChild(div);
  });

  // Função para atualizar ícone e cor do checklist
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

  // Botão de resultado
  submitBtn.addEventListener('click', () => {
    const checkedTasks = [];
    document.querySelectorAll(".task-checkbox").forEach((cb, i) => {
      if (cb.checked) checkedTasks.push(tasks[i]);
    });

    const username = document.getElementById('username').value || "Usuário";

    modalBody.innerHTML = `
            <p><strong>${username}</strong>, você completou <strong>${checkedTasks.length}</strong> tarefas:</p>
            <ul>${checkedTasks.map(t => `<li>${t}</li>`).join('')}</ul>
        `;

    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
  });

  // Função para criar confetes animados
  function createConfetti() {
    const modal = document.getElementById('resultModal');
    for (let i = 0; i < 50; i++) {
      const conf = document.createElement('div');
      conf.classList.add('confetti');
      conf.style.left = Math.random() * modal.offsetWidth + 'px';
      conf.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      modal.appendChild(conf);
      setTimeout(() => conf.remove(), 2000);
    }
  }

  // Botão de resultado animado
  submitBtn.addEventListener('click', () => {
    const checkedTasks = [];
    document.querySelectorAll(".task-checkbox").forEach((cb, i) => {
      if (cb.checked) checkedTasks.push(tasks[i]);
    });

    const username = document.getElementById('username').value || "Usuário";

    modalBody.innerHTML = `
        <p><strong>${username}</strong>, você completou <strong>${checkedTasks.length}</strong> tarefas:</p>
        <ul>${checkedTasks.map(t => `<li>${t}</li>`).join('')}</ul>
    `;

    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();

    createConfetti(); // chama confetes
  });

});


