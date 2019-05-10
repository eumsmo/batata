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
    - int: getTempoFinal()
    - static DOM: gerarElemento( )
*/

// import Date;

class Batata {
  // Batata(Date data_plantio)
  constructor(data_plantio){
    this.data_plantio = data_plantio;
    this.elemento = this.constructor.gerarElemento();
  }

  static get diretorio_base(){return "assets/img/"};
  static get nome(){return "Batata Comum"}
  static get descricao(){return "É a sua primeira batata!"}
  static get diretorio_imagem(){return "batatas.png"}
  static get preco(){return 1.0}
  static get retorno(){return 1.5}
  static get duracao(){return 10}

  // boolean estaPronta( )
  estaPronta(){return Date.now() >= this.tempoFinal}

  // int getTempoFinal( )
  get tempoFinal(){return this.data_plantio+this.constructor.duracao}

  // static DOM gerarElemento( )
  static gerarElemento(){
    let imagem = document.createElement("img");
    imagem.classList.add("batata");
    imagem.src = this.diretorio_base+this.diretorio_imagem;
    return imagem;
  }
}
