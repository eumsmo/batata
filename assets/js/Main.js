class Main {
  constructor(){}

  // static public void main()
  static main(){
    let usuario = new Usuario();
    window.usuario = usuario;


    // Parte da Loja
    let loja = document.querySelector("#select"),
        loja_modal = new Modal(loja);
    loja_modal.openEl("#abrirComprarBtn");
    loja_modal.closeEl("#select .close");
  }
}

Main.main();
