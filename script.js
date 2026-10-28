const quizData = [
  {
    id: 'q1',
    question: 'Você usa a mesma senha em vários serviços?',
    options: ['Nunca', 'Às vezes', 'Frequentemente']
  },
  {
    id: 'q2',
    question: 'Você compartilha dados pessoais e fotos com visibilidade pública?',
    options: ['Nunca', 'Às vezes', 'Frequentemente']
  },
  {
    id: 'q3',
    question: 'Você abre links ou anexos sem confirmar a origem?',
    options: ['Nunca', 'Às vezes', 'Frequentemente']
  },
  {
    id: 'q4',
    question: 'Você ativa autenticação em duas etapas em contas importantes?',
    options: ['Sempre', 'Algumas vezes', 'Quase nunca']
  },
  {
    id: 'q5',
    question: 'Você revisa configurações de privacidade e segurança dos seus perfis?',
    options: ['Sempre', 'Algumas vezes', 'Quase nunca']
  }
];

const scoreMap = {
  0: 0,
  1: 1,
  2: 2
};

const answers = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null
};

const questionsContainer = document.getElementById('questions');
const riskLevelEl = document.getElementById('riskLevel');
const riskScoreEl = document.getElementById('riskScore');
const progressBar = document.getElementById('progressBar');
const recommendationsList = document.getElementById('recommendationsList');
const resetBtn = document.getElementById('resetQuiz');

const quickStats = {
  q1: document.getElementById('statQ1'),
  q2: document.getElementById('statQ2'),
  q3: document.getElementById('statQ3'),
  q4: document.getElementById('statQ4'),
  q5: document.getElementById('statQ5')
};

function getRiskLevel(score) {
  if (score <= 3) return { label: 'Baixo', className: 'low' };
  if (score <= 7) return { label: 'Médio', className: 'medium' };
  return { label: 'Alto', className: 'high' };
}

function getRecommendations(level) {
  const map = {
    Baixo: [
      'Continue com boas práticas de senha e privacidade.',
      'Mantenha a autenticação em duas etapas ativa.',
      'Revise as configurações de redes sociais com regularidade.'
    ],
    Médio: [
      'Crie senhas exclusivas e evite reutilizar em serviços diferentes.',
      'Ative a verificação em duas etapas nas contas mais importantes.',
      'Desconfie de links e anexos recebidos sem confirmação da origem.'
    ],
    Alto: [
      'Reduza o compartilhamento de dados em perfis públicos.',
      'Revise imediatamente senhas, dispositivos conectados e configurações de privacidade.',
      'Evite fornecer dados sensíveis em mensagens ou sites suspeitos.'
    ]
  };

  return map[level] || map.Baixo;
}

function renderQuestions() {
  questionsContainer.innerHTML = '';

  quizData.forEach((item) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'question';

    const title = document.createElement('p');
    title.textContent = item.question;
    questionCard.appendChild(title);

    const row = document.createElement('div');
    row.className = 'answer-row';

    item.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-btn';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        answers[item.id] = scoreMap[index] ?? 0;
        updateDashboard();
      });
      row.appendChild(btn);
    });

    questionCard.appendChild(row);
    questionsContainer.appendChild(questionCard);
  });
}

function updateDashboard() {
  const answered = Object.values(answers).filter((value) => value !== null).length;
  const total = Object.values(answers).reduce((sum, value) => sum + (value ?? 0), 0);
  const progress = (answered / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;

  const risk = getRiskLevel(total);
  riskLevelEl.textContent = risk.label;
  riskLevelEl.className = `risk-level ${risk.className}`;
  riskScoreEl.textContent = `${total} pontos`;

  recommendationsList.innerHTML = '';
  getRecommendations(risk.label).forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    recommendationsList.appendChild(li);
  });

  Object.entries(quickStats).forEach(([key, node]) => {
    node.textContent = answers[key] ?? 0;
  });
}

function resetQuiz() {
  Object.keys(answers).forEach((id) => {
    answers[id] = null;
  });
  updateDashboard();
}

renderQuestions();
updateDashboard();
resetBtn.addEventListener('click', resetQuiz);
