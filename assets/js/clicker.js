class Upgrades {
  constructor(){
    this.upgrades = [
      {
        nome: "Hello, World!",
        preco: 10,
        descricao: "primeiro upgrade",
        modificadores: {batatasPSec: 0.1},
        liberar: ["Agora ta chato"]
      },
      {
        nome: "Agora ta chato",
        preco: 100,
        descricao: "segundo upgrade",
        modificadores: {batatasPSec: 0.1},
        liberar: []
      }
    ];
  }

  getUpgrade(nome){
    for(let upgrade of this.upgrades)
      if(nome==upgrade.nome)
        return upgrade;
  }

  aplicarModificador(clicker,modificador,valor){
    if(typeof modificador === "number")
      return clicker.status[modificador] = clicker.status[modificador]? clicker.status[modificador]+valor:valor;

    if(typeof modificador === "string"){

    }
  }

  ativarUpgrade(clicker,upgrade){
    let status = clicker.status;
    for (var modificador in upgrade.modificadores) {

    }
  }

  comprar(clicker,nome){
    let upgrade = this.getUpgrade(nome);
    if(clicker.status.batatas>=upgrade.preco){
      clicker.status.batatas-=upgrade.preco;
      clicker.mostrarPontos();
      return true;
    } else {
      return false;
    }
  }
}

class BatataClicker {
  constructor() {
    this.status = {};
    this.status.batatas= 0;

    this.dom = {};
    this.dom.batataClick = document.querySelector("#batata-click");
    this.dom.batataClick.addEventListener("click",this.adicionarBatata.bind(this));
  }

  adicionarBatata(){
    this.status.batatas++;
    this.mostrarPontos();
  }

  mostrarPontos(){
    console.log(this.status.batatas);
  }


}

let clicker = new BatataClicker(),
    upgrades = new Upgrades();
