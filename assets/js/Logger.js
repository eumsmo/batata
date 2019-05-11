class Logger {
  constructor(){}

  log(mensagem, status=true, importante=true){
    if(!importante){
      if(!status) console.warn(mensagem);
    } else {
      if(!status) console.error(mensagem);
      else console.log(mensagem);
    }
  }

}
