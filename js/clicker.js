class BatataClicker {
  constructor() {
    this.status = {
      batatas: 0
    };

    this.dom = {

    }
  }

  mostrarPontos(){
    this.status.batatas++;
    console.log(this.status.batatas);
  }

  main(){
    this.dom.batataClick = document.querySelector("#batata-click");
    this.dom.batataClick.addEventListener("click",this.mostrarPontos);
  }
}

(new BatataClicker()).main();
