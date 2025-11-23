export class Node {
    constructor(data) { this.data = data; this.next = null; }
}

export class LinkedList {
    constructor() { this.head = null; }
    add(data) { const node = new Node(data); node.next = this.head; this.head = node; }
    toArray() { const arr=[]; let current=this.head; while(current){ arr.push(current.data); current=current.next;} return arr; }
}

export class Queue {
    constructor(){ this.items=[]; }
    enqueue(item){ this.items.push(item); }
    dequeue(){ return this.items.shift(); }
    getAll(){ return this.items; }
}

export class Stack {
    constructor(){ this.items=[]; }
    push(item){ this.items.push(item); }
    pop(){ return this.items.pop(); }
    getAll(){ return this.items; }
}

export class HashTable {
    constructor(){ this.data={}; }
    set(key,value){ this.data[key]=value; }
    get(key){ return this.data[key]; }
}
