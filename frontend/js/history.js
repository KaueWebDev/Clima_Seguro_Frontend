// Estruturas simulando fila, pilha e lista
class Queue {
    constructor() { this.items = []; }
    enqueue(item) { this.items.push(item); }
    dequeue() { return this.items.shift(); }
    getAll() { return [...this.items]; }
}

class Stack {
    constructor() { this.items = []; }
    push(item) { this.items.push(item); }
    pop() { return this.items.pop(); }
    getAll() { return [...this.items]; }
}

class LinkedListNode {
    constructor(data) { this.data = data; this.next = null; }
}
class LinkedList {
    constructor() { this.head = null; }
    add(data) {
        const node = new LinkedListNode(data);
        node.next = this.head;
        this.head = node;
    }
    toArray() {
        const arr = [];
        let current = this.head;
        while(current) { arr.push(current.data); current = current.next; }
        return arr;
    }
}

// Criando instâncias
const historyQueue = new Queue(); // mantém ordem de pesquisa
const historyStack = new Stack(); // permite acessar últimas pesquisas
const historyList = new LinkedList(); // guarda dados detalhados

const historyContainer = document.getElementById("history-container");

// Função para adicionar ao histórico
function addToHistory(city, state, country) {
    const entry = { city, state, country };

    historyQueue.enqueue(entry);
    historyStack.push(entry);
    historyList.add(entry);

    renderHistory();
}

// Renderiza o histórico no HTML
function renderHistory() {
    historyContainer.innerHTML = "";

    // Mostra da fila (ordem de pesquisa)
    const entries = historyQueue.getAll();

    entries.forEach((entry, index) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <span>${entry.city}, ${entry.state || ""}, ${entry.country}</span>
            <button data-index="${index}">Apagar</button>
        `;

        // Botão apagar
        div.querySelector("button").addEventListener("click", (e) => {
            const idx = e.target.getAttribute("data-index");
            removeFromHistory(idx);
        });

        historyContainer.appendChild(div);
    });
}

// Remove item do histórico
function removeFromHistory(index) {
    index = parseInt(index);
    // Remove da fila
    historyQueue.items.splice(index, 1);

    // Remove da pilha se necessário
    // Busca por igualdade e remove
    const stackIndex = historyStack.items.findIndex(it => it === historyQueue.items[index]);
    if(stackIndex > -1) historyStack.items.splice(stackIndex, 1);

    // Atualiza a lista (LinkedList) — recria do zero
    historyList.head = null;
    historyQueue.getAll().forEach(item => historyList.add(item));

    renderHistory();
}

// Exemplo de uso ao carregar clima
// Substitua loadWeather() do seu app.js:
async function loadWeather(lat, lon, name, country) {
    // ... seu código de fetch de clima ...
    // Depois de atualizar o DOM com os dados do clima:
    addToHistory(name, "", country); // se você tiver estado, pode passar
}

