/*
Batata:
  Atributos:
    - static final String: diretorio_base
    - static String: nome, descricao, diretorio_imagem
    - static double: preco, retorno
    - static int: duracao
    - int: data_plantio
    - DOM: imagem

  Métodos:
    - Batata(Date)
    - boolean: estaPronta( )
    - int: getTempo_final()
    - static DOM: gerarElemento( )
*/

// import Date;

class Batata {
  // Batata(Date data_plantio)
  // Batata( )
  constructor(data_plantio=null){
    this.data_plantio = data_plantio;
    this.elemento = this.constructor.gerarElemento();
    this._vendida = false;
  }

  static get diretorio_base(){return "assets/img/"};
  static get nome(){return "Batata Comum"}
  static get descricao(){return "É a sua primeira batata!"}
  static get diretorio_imagem(){return "batatas.png"}
  static get preco(){return 1.0}
  static get retorno(){return 1.5}
  static get duracao(){return 10}

  // public boolean estaPronta( )
  estaPronta(){return Date.now() >= this.tempo_final}

  // public int getTempo_final( )
  get tempo_final(){return this.data_plantio+this.constructor.duracao*1000}

  // public double vender( )
  vender(){
    if(this.estaPronta() && !this._vendida){
      this._vendida = true;
      return this.constructor.retorno;
    }
  }

  // static public DOM gerarElemento( )
  static gerarElemento(){
    let imagem = document.createElement("img");
    imagem.classList.add("batata");
    imagem.src = this.diretorio_base+this.diretorio_imagem;
    return imagem;
  }
}
