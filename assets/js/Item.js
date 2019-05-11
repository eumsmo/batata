// import Date;
// import Item;

class ItemSlot {

  // ItemSlot(Class: construtor)
  // ItemSlot(Class: construtor, int: quantidade_inicial)
  constructor(construtor,quantidade_inicial=0){
    this.construtor = construtor;
    this.quantidade = quantidade_inicial;
    this.ultima_alteracao = Date.now();
  }

  get length(){return this.quantidade}

  // public int add(int: quantidade)
  add(quantidade=1){
    this.quantidade += quantidade;
    this.ultima_alteracao = Date.now();
    return this.quantidade;
  }

  // public Item get( )
  get(){
    if(this.quantidade>0){
      this.quantidade--;
      this.ultima_alteracao = Date.now();
      return new Item(this.construtor);
    } else return null;
  }

  // public String toString( )
  toString(){return `[${this.construtor.name},${this.quantidade}]`}
}

class IItemSlot extends ItemSlot {
  constructor(construtor,quant){
    super(construtor,quant);

    this.usuario = null;

    let img = construtor.diretorio_imagem? construtor.diretorio_imagem: "moeda.png";
    this.elementos = this.constructor.gerarElemento(img, quant);
    this.elementos.item.addEventListener("click",this._eventoClique.bind(this));
  }

  _mudarContador(){
    this.elementos.contador.innerHTML = "x "+this.quantidade;
  }

  add(quant){
    super.add(quant);
    this._mudarContador();
  }

  get(){
    let retorno = super.get();
    this._mudarContador();
    return retorno;
  }

  _eventoClique(){
    if(this.usuario) this.usuario.executarAcao(this);
  }



  static gerarElemento(img,quant){
    let container = document.createElement("div"),
        imagem = document.createElement("img"),
        contador = document.createElement("span");

    imagem.src = "assets/img/"+img;

    contador.innerHTML = "x "+quant;
    contador.classList.add("quant");

    container.classList.add("item");
    container.appendChild(imagem);
    container.appendChild(contador);

    return {
      item: container,
      imagem, contador
    };
  }
}

// ===========================
// import Date;

class Item {

  // Item(Class: construtor)
  constructor(construtor){
    this.item = construtor;
    this.data_de_uso = null;
  }

  get usado(){return this.item==null}

  // public mixed usar(...mixed: args)
  usar(...args){
    let item = new this.item();
    this.item = null;
    this.data_de_uso = Date.now();
    return item;
  }

  // public String toString( )
  toString(){return `[${this.item.name}]`}
}
