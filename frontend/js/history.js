import { Queue, Stack, LinkedList } from './structure.js';

const historyQueue = new Queue();
const historyStack = new Stack();
const historyList = new LinkedList();
export const historyContainer = document.getElementById("history-container");

export function addToHistory(city,state,country){
    const entry={city,state,country};
    historyQueue.enqueue(entry);
    historyStack.push(entry);
    historyList.add(entry);
    renderHistory();
}

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
