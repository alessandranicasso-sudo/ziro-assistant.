// ========================================
// ZIRO — FUNÇÕES INICIAIS
// ========================================

const $ = (selector) => document.querySelector(selector);

const storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  },

  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// ========================================
// NAVEGAÇÃO ENTRE AS SEÇÕES
// ========================================

const pageTitles = {
  chat: "Conversas",
  diary: "Diário",
  memory: "Memória",
  settings: "Configurações"
};

function showView(name) {
document.querySelectorAll(".view").forEach(view => {
view.classList.toggle("active", view.id === "view-${name}");
});

document.querySelectorAll(".nav-item").forEach(button => {
button.classList.toggle("active", button.dataset.view === name);
});

$("#page-title").textContent = pageTitles[name] || "Ziro";

document.body.classList.remove("menu-open");
}

document.querySelectorAll(".nav-item").forEach(button => {
button.addEventListener("click", () => {
showView(button.dataset.view);
});
});

$("#menu-toggle").addEventListener("click", () => {
document.body.classList.toggle("menu-open");
});


// ========================================
// CONVERSA
// ========================================

const chatForm = $("#chat-form");
const chatInput = $("#chat-input");
const messages = $("#messages");
const welcome = $("#welcome");

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.className = `message ${sender}`;
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollIntoView({ behavior: "smooth", block: "end" });
}

function getReply(text) {
  const message = text.toLowerCase();

  if (message.includes("oi") || message.includes("olá")) {
    return "Olá! 💜 Estou aqui. O que vamos explorar hoje?";
  }

  if (message.includes("triste") || message.includes("ansioso")) {
    return "Podemos conversar sobre isso com calma. Quer organizar o que está sentindo ou prefere pensar em outra coisa?";
  }

  if (message.includes("ideia") || message.includes("projeto")) {
    return "Vamos desenvolver essa ideia! Podemos dividir o projeto em etapas menores e organizar tudo.";
  }

  if (message.includes("obrigado") || message.includes("obrigada")) {
    return "Disponha! 💜";
  }

  return "Recebi sua mensagem! Ainda estou aprendendo a conversar de verdade. Por enquanto, minha inteligência artificial não está conectada, mas podemos continuar testando a interface.";
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = chatInput.value.trim();

  if (!text) return;

  welcome.hidden = true;

  addMessage(text, "user");
  chatInput.value = "";

  setTimeout(() => {
    addMessage(getReply(text), "assistant");
  }, 400);
});

$("#new-chat").addEventListener("click", () => {
  messages.replaceChildren();
  welcome.hidden = false;
  chatInput.value = "";
  showView("chat");
  chatInput.focus();
});

// ========================================
// DIÁRIO
// ========================================

const diaryForm = $("#diary-form");
const diaryTitle = $("#diary-title");
const diaryBody = $("#diary-body");
const diaryEntries = $("#diary-entries");

function renderDiary() {
  diaryEntries.replaceChildren();

  storage.get("ziro-diary").forEach(entry => {
    const card = document.createElement("article");
    card.className = "panel";

    const title = document.createElement("h3");
    title.textContent = entry.title || "Sem título";

    const date = document.createElement("small");
    date.textContent = entry.date;

    const body = document.createElement("p");
    body.textContent = entry.body;
    body.style.whiteSpace = "pre-wrap";

    card.append(title, date, body);
    diaryEntries.appendChild(card);
  });
}

diaryForm.addEventListener("submit", event => {
  event.preventDefault();

  const body = diaryBody.value.trim();

  if (!body) {
    diaryBody.focus();
    return;
  }

  const entries = storage.get("ziro-diary");

  entries.unshift({
    title: diaryTitle.value.trim(),
    body,
    date: new Date().toLocaleString("pt-BR")
  });

  storage.save("ziro-diary", entries);

  diaryTitle.value = "";
  diaryBody.value = "";

  renderDiary();
});

// ========================================
// MEMÓRIA
// ========================================

const memoryForm = $("#memory-form");
const memoryText = $("#memory-text");
const memoryEntries = $("#memory-entries");

function renderMemories() {
  memoryEntries.replaceChildren();

  storage.get("ziro-memory").forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "panel";

    const text = document.createElement("p");
    text.textContent = item.text;
    text.style.whiteSpace = "pre-wrap";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Apagar memória";

    removeButton.addEventListener("click", () => {
      const memories = storage.get("ziro-memory");
      memories.splice(index, 1);
      storage.save("ziro-memory", memories);
      renderMemories();
    });

    card.append(text, removeButton);
    memoryEntries.appendChild(card);
  });
}

memoryForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = memoryText.value.trim();

  if (!text) {
    memoryText.focus();
    return;
  }

  const memories = storage.get("ziro-memory");

  memories.unshift({
    text,
    date: new Date().toISOString()
  });

  storage.save("ziro-memory", memories);

  memoryText.value = "";
  renderMemories();
});

// ========================================
// INICIALIZAÇÃO
// ========================================

renderDiary();
renderMemories();

console.log("Ziro iniciado com sucesso! 💜");