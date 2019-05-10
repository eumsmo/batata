/*
Terra:
  Atributos:
    - Batata: batata_plantada
    - DOM: elementos{}

  Métodos:
    - Terra(Batata)
    - Terra( )
    - boolean: estaPlantada( )
    - void: plantarBatata(Batata)
    - void: deletarBatata( )
    - Batata: coletarBatata( )
    - static DOM{}: gerarElemento( )
*/

// import Batata;

class Terra {
  // Terra(Batata batata) ou Terra( )
  constructor(batata=null) {
    this.elementos = this.constructor.gerarElemento();
    this.batata_plantada = batata;
  }

  // boolean estaPlantada()
  estaPlantada(){return this.batata_plantada!=null}

  // void plantarBatata(Batata batata)
  plantarBatata(batata){
    if(!(batata instanceof Batata) || this.estaPlantada())return;
    this.batata_plantada = batata;

    this.elementos.batata = batata.elemento;
    this.elementos.terra.appendChild(batata.elemento);
    this.elementos.terra.classList.add("plantado");
  }

  // void deletarBatata()
  deletarBatata(){
    if(this.estaPlantada()){
      this.elementos.batata.remove();
      this.elementos.batata = null;
      this.batata_plantada = null;

      this.elementos.terra.classList.remove("plantado");
    }
  }

  // Batata coletarBatata()
  coletarBatata(){
    if(this.estaPlantada() && this.batata_plantada.estaPronta()){
      let batata = this.batata_plantada;
      this.deletarBatata();
      return batata;
    } else return null;
  }

  // private void atualizarElemento(int agora)
  _atualizarElemento(agora){

    let batata = this.batata_plantada,
        inicial = batata.data_plantio,
        final = batata.tempo_final,
        porcentagem = 100*((agora-inicial)/(final-inicial));

    const {indicador,barra} = this.elementos.progresso;
    const terra = this.elementos.terra;

    if(porcentagem>=100){
      indicador.innerHTML = "Pronto!";
      barra.style.width = "100%";
      terra.classList.add("pronta");
    } else {
      barra.style.width = porcentagem+"%";
      indicador.innerHTML = this.constructor.formatarHora(time.final,-agora);
    }
  }

  // void atualizar(int agora)
  atualizar(agora){
    if(this.estaPlantada()) this._atualizarElemento(agora);
  }

  // private void eventoClique(Event evento)
  _eventoClique(evento){

  }

  // static DOM{} gerarElemento()
  static gerarElemento(){
    let terra_container = document.createElement("span"),
        progresso_container = document.createElement("span"),
        progresso_barra = document.createElement("span"),
        progresso_indicador = document.createElement("span");


    progresso_barra.classList.add("progresso");
    progresso_indicador.classList.add("indicado");

    progresso_container.classList.add("barra");
    progresso_container.appendChild(progresso_barra);
    progresso_container.appendChild(progresso_indicador);

    terra_container.classList.add("terra");
    terra_container.appendChild(progresso_container);

    return {
      terra: terra_container,
      batata: null,
      progresso:{
        container: progresso_container,
        barra: progresso_barra,
        indicador: progresso_indicador
      }
    };
  }

  // static String formatarHora()
  static formatarHora(duration) {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }
}
