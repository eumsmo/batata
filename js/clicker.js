let clicker, upgrades;

class Upgrades {
  constructor(){
    this.upgrades = [
      {
        nome: "Hello, World!",
        preco: "10b",
        descricao: "primeiro upgrade",
        modificadores: {batatasPSec: 0.1},
        liberar: ["Agora ta chato"]
      },
      {
        nome: "Agora ta chato",
        preco: "100b",
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

  convertPreco(preco){
    
  }

  comprar(clicker,nome){
    let upgrade = this.getUpgrade(nome);
    if(clicker.status.batatas>=upgrade)
  }
}

class BatataClicker {
  constructor() {
    this.status = {};
    this.status.batatas= 0;

    this.dom = {};
    this.dom.batataClick = document.querySelector("#batata-click");
    this.dom.batataClick.addEventListener("click",function(){this.mostrarPontos()}.bind(this));
  }

  mostrarPontos(){
    this.status.batatas++;
    console.log(this.status.batatas);
  }
}

(new BatataClicker());
