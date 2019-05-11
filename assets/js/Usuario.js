
// import Batata;
// import Logger;
// import Terra;
// import Terraco;
// import Armazem;


class Usuario {
  constructor() {

    this.dinheiro = 0;

    this.armazem = new IArmazem();
    this.armazem.usuario = this;

    this.terreiro = new Terraco();
    this.terreiro.usuario = this;
    this.terreiro.atualizarTerras();

    this.logger = new Logger();
    this.resetarAcao();
  }

  // public void ganharDinheiro(int: dinheiro)
  ganharDinheiro(dinheiro){this.dinheiro+=dinheiro}

  // public void resetarAcao( )
  resetarAcao(){
    this.acao = {nome: "", detalhes: null};
  }

  // public void executarAcao(...mixed: args)
  executarAcao(...args){
    if(args[0] instanceof ItemSlot) return this.selecionarItem(args[0]);

    let acao = this.acao.nome,
        detalhes = this.acao.detalhes;

    switch (acao) {
      case "plantar":
        // args = [Terra: terra]
        // detalhes = ItemSlot: batatas
        let terra = args[0];

        if(detalhes instanceof ItemSlot && detalhes.construtor == Batata){
          if(!terra.estaPlantada()){
            if(detalhes.length>0){
              let batata = detalhes.get().usar(Date.now());
              terra.plantarBatata(batata);

              if(detalhes.length==0) this.resetarAcao();

              this.logger.log("Batata plantada!",true,false);
              return;
            } else this.logger.log("Usuário não possui batatas desse tipo em seu armazém!",false);
          } else this.logger.log("Terra não está vazia!",false);
        } else this.logger.log("Usuário não selecionou nenhuma batata!",false);

        this.resetarAcao();
        break;
      default:

        if(args[0] instanceof Terra){
          // args = [Terra: terra]
          let terra = args[0];

          if(terra.batata_plantada && terra.batata_plantada.estaPronta()){
            let batata = terra.coletarBatata();
            this.ganharDinheiro(batata.vender());
          }
        }
    }
  }

  // public void selecionarItem(ItemSlot: slot)
  selecionarItem(slot){

    if(slot.construtor == Batata){
      if(slot.length>0) this.acao = {nome: "plantar",detalhes: slot};
      else this.logger.log("Usuário não possui batatas desse tipo em seu armazém!",false);
    }
  }
}
