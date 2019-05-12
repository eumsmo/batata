class Main {
  constructor(){}

  // static public void main()
  static main(){
    let usuario = new Usuario();
    window.usuario = usuario;

    let tempo = new Tempo(10);
    tempo.push(usuario.terreiro.atualizar.bind(usuario.terreiro));

    // Parte da Loja
    let loja = document.querySelector("#select"),
        loja_modal = new Modal(loja);
    loja_modal.openEl("#abrirComprarBtn");
    loja_modal.closeEl("#select .close");

    usuario.armazem.add(Batata,10)
  }
}

Main.main();
