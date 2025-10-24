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
    else message="💪 Excelente! Sua dedicação é inspiradora e você está contribuindo bastante — continue valorizando o cuidado e a parceria.";
  } else {
    if(completed<5) message="🤔 Poucas tarefas realizadas! Que tal refletir sobre o quanto as responsabilidades são compartilhadas?";
    else if(completed<10) message="💖 Você está fazendo muito! Procure equilibrar responsabilidades sem se cobrar demais.";
    else message="🌟 Incrível! Sua dedicação é inspiradora, mas reserve tempo para si mesma também.";
  }

  modalBody.innerHTML = `<h5>${completed} de ${tasks.length} tarefas completadas</h5>
    <ul>${checkedTasks.map(t=>`<li>${t}</li>`).join('')}</ul>
    <p style="margin-top:15px;font-weight:600;">${message}</p>`;

  new bootstrap.Modal(document.getElementById('resultModal')).show();
});


});



// Lista de respostas de todos os cards
const allResponses = {
  1: [
    "Antes do casamento e da maternidade, eu tinha a oportunidade de se dedicar intensamente ao meu desenvolvimento pessoal, carreira e vida social, com mais liberdade e foco em si mesma. Essa fase é caracterizada por uma rotina mais flexível e decisões pautadas nas próprias necessidades e desejos.",
    "Intransigente",
    "Era muito nova tinha muitos sonhos.",
    "Trabalhava muito. Meu sonho era comprar uma casa",
    "Eu era uma jovem sonhadora que trabalha e estudava e tinha uma vida social.",
    "Antes da maternidade, eu era apenas uma menina cheia de sonhos da juventude.",
    "Eu apenas estudava e trabalhava não tinha uma responsabilidade muito grande"
  ],
  2: [
    "Sim a experiência de ser mãe e mulher é profundamente transformadora, mudando o corpo, as prioridades, o tempo e a percepção do mundo.",
    "Precisei me reinventar",
    "Ah com certeza vamos amadurecendo e se reinventando ao longo da vida.",
    "Mudou tudo. Parei de trabalhar para cuidar da família",
    "Depois que casei e virei mãe tudo mudou, veio os desafios preocupações e a responsabilidade",
    "Eu estou ainda me reinventando a todo momento.",
    "Não sou mais a mesma pessoa pois hoje sou mais madura e responsável e bem mais sentimental algumas situações"
  ],
  3: [
    "As prioridades passam a girar em torno do filho, o que afeta desde o sono e a rotina até os planos de viagem, além de gerar novas responsabilidades e preocupações.",
    "Mudei hábitos alimentares, interesso menos por futilidade, tenho preocupação com o futuro",
    "A vida de solteira não é muito desafiadora, mas a partir do momento que casamos e temos nossas famílias a prioridade muda, com a responsabilidade e função de esposa e mãe mudamos muito.",
    "Ex: mais responsabilidade e saber que no lar temos um papel importante.",
    "Antes eu me preocupava com meu futuro. Hoje me preocupo muito mais com o futuro dos meus filhos.",
    "Hoje me vejo uma mulher matura, consciente, cheia de afazeres domésticos, sinto que me deixei de lado, minha prioridade é minha família, meus filhos e meu marido.",
    "Em mim percebi, que mesmo na dor no sofrimento precisamos engolir toda dor e seguir.",
    "Hoje a minha prioridade sempre são meus filhos o bem estar deles"
  ],
  4: [
    "Como mãe, é mais comum que os sonhos sejam colocados em pausa, e não totalmente interrompidos. A maternidade traz uma fase de profundas transformações na vida da mulher e, embora possa exigir uma readequação de prioridades e tempo, não significa necessariamente o fim dos projetos pessoais.",
    "Deixei em pausa",
    "Em parte sim, mas as vezes nos colocamos em segundo plano.",
    "Está em pausa",
    "Tive que deixar de lado, já que não tenho uma profissão, pois engravidei cedo, virei mãe e fiquei em segundo plano",
    "Estão em pausa.",
    "Ainda continuo correndo atrás dos meus sonhos, os meus filhos me mostraram que sou capaz"
  ],
  5: [
    "Sim, a sociedade ainda impõe expectativas específicas e muitas vezes irreais sobre as mulheres e mães, mesmo que os papéis de gênero tradicionais tenham sido desafiados. Essas expectativas se manifestam em diversas áreas da vida, causando pressão e sobrecarga.",
    "A expectativa de que temos que dar conta de tudo",
    "Sim, a mulher tem que dar conta de casa, esposo e filho, quando algo sai do trilho ainda a culpam.",
    "Não",
    "Sim, percebo que as portas se fecham na área profissional quando você fala que tem filhos.",
    "Ainda colocam essas expectativas em ser mãe, tem que ser o exemplo, o espelho, para que os filhos tentem se espelhar, mas nem sempre seguem da forma que achamos o certo o bom.",
    "Sim, principalmente em termos de emprego ela não consegue, pois já é mãe, temos algumas dificuldades"
  ],
  6: [
    "Essa percepção “melhor” como mulher, esposa e mãe pode ser moldado por diversos fatores, como o autocuidado, o apoio do parceiro e a libertação da pressão por perfeição. Ninguém deveria ser obrigado a atender a um padrão externo, pois a definição de sucesso nesses papéis é pessoal e construída no contexto individual.",
    "Que nós também precisamos de cuidado",
    "Que somos humanas e tem dias e dias, não precisamos dar conta de tudo o tempo todo.",
    "Não tenho uma opinião",
    "Que mesmo sendo esposa e mãe, temos sonhos e vontade de crescer profissionalmente, temos sonhos.",
    "Que as mães também erram, também precisam de carinho e descanso.",
    "Nós somos as verdadeiras heroínas, não somos muito fortes até mesmo nas pressões."
  ],
  7: [
    "Manter os próprios sonhos e praticar o autocuidado são essenciais para a saúde física e mental das mulheres, pois contribuem para a autoestima, o bem-estar e a realização pessoal. Historicamente, muitas mulheres foram condicionadas a colocar as necessidades dos outros à frente das suas, mas priorizar a si mesma é crucial para evitar a exaustão e o esgotamento.",
    "Ame-se acima de tudo. Respeite seu corpo, cuide da sua saúde física e mental. Se cuidem",
    "Manter sempre as suas metas e não se anular pelos outros.",
    "Procurar o melhor para si mesma dentro das suas possibilidades.",
    "Priorize a si mesmo, não se deixe porque o tempo não volta.",
    "Enfrentem seus medos, lutem para que cada dia seja melhor, chore quando precisar, gritem, depois lave o rosto, coloque sua melhor roupa, faça maquiagem, cabelo, unhas e apareça linda, desejada",
    "Não desistir, você é capaz e dará conta de tudo: casa, marido, filhos, trabalho e principalmente de si mesma"
  ]
};

// Inicializa o índice de cada card
const indices = {};

// Função para atualizar respostas automaticamente
function startResponseRotation() {
  for (let cardId in allResponses) {
    indices[cardId] = 0;
    const responseElement = document.getElementById(`response-text-${cardId}`);
    if (responseElement) {
      setInterval(() => {
        indices[cardId] = (indices[cardId] + 1) % allResponses[cardId].length;
        responseElement.textContent = allResponses[cardId][indices[cardId]];
      }, 7000); // 7 segundos
    }
  }
}

// Inicia a rotação ao carregar a página
window.addEventListener('DOMContentLoaded', startResponseRotation);



// ===================== MURAL DINÂMICO =====================
document.addEventListener("DOMContentLoaded", () => {
  const postText = document.getElementById("postText");
  const postBtn = document.getElementById("postBtn");
  const muralPosts = document.getElementById("muralPosts");

  if (!postText || !postBtn || !muralPosts) return;

  let posts = JSON.parse(localStorage.getItem("muralPosts")) || [];

  function renderPosts() {
    muralPosts.innerHTML = "";
    posts.forEach((post, index) => {
      const card = document.createElement("div");
      card.classList.add("col-12", "col-md-6", "col-lg-4");

      card.innerHTML = `
        <div class="mural-post" data-index="${index}">
          <p class="mural-text">${post.text}</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">${post.date}</small>
            <div>
              <button class="like-btn"><i class="fa-solid fa-heart${post.liked ? ' text-danger' : ''}"></i></button>
              <span class="like-count">${post.likes}</span>
            </div>
          </div>
        </div>
      `;
      muralPosts.appendChild(card);
    });
  }

  function savePosts() {
    localStorage.setItem("muralPosts", JSON.stringify(posts));
  }

  postBtn.addEventListener("click", () => {
    const text = postText.value.trim();
    if (!text) return alert("Escreva algo antes de publicar 💬");

    const newPost = {
      text,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }),
      likes: 0,
      liked: false,
    };

    posts.unshift(newPost);
    savePosts();
    renderPosts();
    postText.value = "";
  });

  muralPosts.addEventListener("click", (e) => {
    const btn = e.target.closest(".like-btn");
    if (!btn) return;
    const card = btn.closest(".mural-post");
    const index = parseInt(card.dataset.index);

    posts[index].liked = !posts[index].liked;
    posts[index].likes += posts[index].liked ? 1 : -1;
    savePosts();
    renderPosts();
  });

  renderPosts();

  function renderPosts() {
  muralPosts.innerHTML = "";
  posts.forEach((post, index) => {
    const card = document.createElement("div");
    card.classList.add("col-12", "col-md-6", "col-lg-4");

    // Escolhe uma cor de fundo aleatória para o post
    const colors = ["color1", "color2", "color3", "color4", "color5"];
    const colorClass = colors[index % colors.length];

    card.innerHTML = `
      <div class="mural-post ${colorClass}" data-index="${index}">
        <p class="mural-text">${post.text}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">${post.date}</small>
          <div>
            <button class="like-btn"><i class="fa-solid fa-heart${post.liked ? ' text-danger' : ''}"></i></button>
            <span class="like-count">${post.likes}</span>
          </div>
        </div>
      </div>
    `;
    muralPosts.appendChild(card);
  });
}

// Animação de brilho ao curtir
muralPosts.addEventListener("click", (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;
  const card = btn.closest(".mural-post");
  const index = parseInt(card.dataset.index);

  posts[index].liked = !posts[index].liked;
  posts[index].likes += posts[index].liked ? 1 : -1;
  savePosts();
  renderPosts();

  // Efeito de brilho rápido no coração
  const icon = btn.querySelector("i");
  icon.classList.add("glowing");
  setTimeout(() => icon.classList.remove("glowing"), 600);
});


});
