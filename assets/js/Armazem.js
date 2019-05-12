// import ItemSlot;

class Armazem {
  // Armazem( )
  // Armazem(...[Class: construtor[, int: quantidade]])
  constructor(...args){
    this.slots = {};

    if(args){
      for (let arg of args)
        this.add(...arg);
    }

  }
  get length(){return this.vetor.length;}

  // public void add(Class: construtor, int: quantidade)
  add(construtor,quantidade=undefined){
    if(this.slots[construtor]) this.slots[construtor].add(quantidade);
    else this.slots[construtor] = new ItemSlot(construtor,quantidade);
  }

  // public ItemSlot get(Class: construtor)
  get(construtor){
    return this.slots[construtor] || null;
  }

  // public String toString()
  toString(){
    let str = [];
    for (let slots in this.slots) str.push(slots.toString());
    return `[${str.join()}]`;
  }
}

class IArmazem extends Armazem {
  constructor(...args){
    super(...args);
    this.usuario = null;

    this.caixa = document.querySelector("#caixa");
    this.el = this.caixa.querySelector("main");

    this.modal = new Modal(this.caixa);
    this.modal.closeEl("#caixa .close");
    this.modal.openEl("#abrirCaixaBtn");
    this.modal.close();
  }

  // public void add(Class: construtor, int: quantidade)
  add(construtor,quantidade=undefined){
    super.add(construtor,quantidade);
    if(!(this.slots[construtor] instanceof IItemSlot)){
      let sem_interface = this.slots[construtor],
          com_interface =
          this.slots[construtor] = new IItemSlot(sem_interface.construtor,sem_interface.length);

      com_interface.usuario = this.usuario;
      com_interface.pai = this;
      this.el.appendChild(com_interface.elementos.item);
    }
  }

  close(){this.modal.close();}
}
