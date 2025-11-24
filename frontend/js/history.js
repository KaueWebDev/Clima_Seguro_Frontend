// Importa as estruturas de dados utilizadas para armazenar o histórico
import { Queue, Stack, LinkedList } from './structure.js';

// Estruturas independentes para registrar o histórico em diferentes formas
const historyQueue = new Queue(); // Armazena entradas em ordem FIFO
const historyStack = new Stack(); // Armazena entradas em ordem LIFO
const historyList = new LinkedList(); // Armazena toda a lista de forma encadeada
export const historyContainer = document.getElementById("history-container");

// Função responsável por adicionar uma nova entrada ao histórico
export function addToHistory(city,state,country){
    const entry={city,state,country};
    historyQueue.enqueue(entry);
    historyStack.push(entry);
    historyList.add(entry);
    renderHistory();
}

// Função responsável por renderizar o histórico no HTML
export function renderHistory(){
    historyContainer.innerHTML="";
    const arr=historyList.toArray();
    arr.forEach((item,index)=>{
        const div=document.createElement("div");
        div.className="history-item";
        div.textContent=`${item.city}, ${item.state||''}, ${item.country}`;
        const btn=document.createElement("button");
        btn.textContent="❌";
        btn.addEventListener("click",()=>{
            arr.splice(index,1);
            const newList=new LinkedList();
            arr.forEach(e=>newList.add(e));
            historyList.head=newList.head;
            renderHistory();
        });
        div.appendChild(btn);
        historyContainer.appendChild(div);
    });
}
