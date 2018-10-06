const Img_batata_folder = "img/";
const Terra = "";
const InfoBatatas = {
  "simples": {
    "img": "potatoes.png",
    "preco": 5,
    "tempo": 4
  },
  "test": {
    "img": "potato.png",
    "preco": 15
  }
};
function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

let farm, user, tempo;

class Batata{
  constructor(tipo){
    let agora = Date.now(),
        fimR = InfoBatatas[tipo].tempo*1000;
    this.tipo = tipo;
    this.pronta = false;
    this.tempo = {
      inicial: agora,
      final_relativa: fimR,
      final: fimR+agora,
      progresso: 0
    };
  }
}

class Farm{
  constructor(){
    this.arr = [];

    this.grids = [];
    this.xSize;
    this.ySize;
    this.farmEl = document.querySelector("#farm");

    tempo.add(this.updateTime.bind(this));
  }
  updateDOM(){
    let x = this.arr.length,
        y = this.arr[0].length;

    for(let i=0;i<x;i++)
      for(let j=0;j<y;j++){
        let el = this.grids[i][j],
            img = el.querySelector('img');

        if(this.arr[i][j]){
            el.classList.add("plantado");
            img.src = Img_batata_folder+ InfoBatatas[this.arr[i][j].tipo].img;
        } else if(el.classList.contains("plantado")){
            el.classList.remove("plantado");
            img.src="";
            console.log(img);
        }
      }
  }
  resetDOM(){
    let that = this;
    let x = this.arr.length,
        y = this.arr[0].length;
    this.farmEl.innerHTML = "";
    this.grids = [];

    for(let i=0;i<x;i++){
      this.grids[i] = [];
      for(let j=0;j<y;j++){
        let span = document.createElement("span"),
            indicador = document.createElement("span"),
            progresso = document.createElement("span"),
            barra = document.createElement("span"),
            img_batata = new Image();

        span.classList.add("terra");
        span.dataset.x = i;
        span.dataset.y = j;
        span.addEventListener('click',this.clickEvent.bind(this));

        indicador.innerHTML = "00:00:04";

        img_batata.classList.add("batata");
        indicador.classList.add("indicador");
        progresso.classList.add("progresso");
        barra.classList.add("barra");

        barra.appendChild(progresso);
        barra.appendChild(indicador);
        span.appendChild(img_batata);
        span.appendChild(barra);
        this.grids[i][j] = span;
        this.farmEl.append(span);
      }
    }

    this.farmEl.style.gridTemplateColumns = `repeat(${x},${100/x}%)`;
    this.farmEl.style.gridTemplateRows = `repeat(${y}),${100/y}%`;
    this.updateDOM();
  }
  clickEvent(evt){
    let el = evt.currentTarget,
        i = el.dataset.x,
        j = el.dataset.y;

    this.addBatata(i,j);
  }
  fill(x,y){
    this.xSize = x;
    this.ySize = y;

    if(this.arr.length>x)
      this.arr = this.arr.slice(0,x);

    for(let i=0;i<x;i++){
      if(this.arr[i] && this.arr[i].length>y)
        this.arr[i] = this.arr[i].slice(0,y);

      this.arr[i] = this.arr[i]||[];
      for(let j=0;j<y;j++) this.arr[i][j] = this.arr[i][j] || false;
    }

    this.resetDOM();
  }
  forEach(callback){ //if callback returns false, stop forEach.
    let x = this.arr.length,
        y = this.arr[0].length;

    for(let i=0;i<x;i++)
      for(let j=0;j<y;j++){
        if(callback(this.arr[i][j],i,j)===false)
          return;
      }
  }

  addBatata(i,j){
    if(i<this.xSize && j<this.ySize && this.arr[i][j]===false){
      if(user.hasSelected() && user.buy()){
        this.arr[i][j] = new Batata(user.selected);
        this.updateDOM();
        return true;
      } else if(user.hasSelected())
        console.error("Usuario não tem dinheiro suficiente!");
      else
        console.warn("Usuario não selecionou nenhuma batata!");
      return false;
    } else return false;
  }
  removeBatata(i,j){
    if(i<this.xSize && j<this.ySize){
      this.arr[i][j]=false;
      this.updateDOM();
      return true;
    }
  }
  updateProgress(time,i,j){
    let mainEl = this.grids[i][j],
        progressEl = mainEl.querySelector(".progresso"),
        indicadorEl = mainEl.querySelector(".indicador"),
        porcentagem = time.progresso/time.final_relativa;


    progressEl.style.width = (porcentagem*100)+"%";
    indicadorEl.innerHTML = msToTime(time.final-time.inicial-time.progresso);
    //console.log(mainEl,progressEl,indicadorEl);
  }
  updateTime(stop){
    let that = this;
    let agora = Date.now();
    this.forEach(function(el,i,j){
      if(el && !el.pronta){
        let tempo = el.tempo;
        tempo.progresso = agora-tempo.inicial;
        if(tempo.progresso>=tempo.final_relativa){
          el.pronta = true;
          console.log("ready");
        } else {
          this.updateProgress(tempo,i,j);
        }
      }
    }.bind(this));
  }
}

class Tempo {
  constructor(every){
    this.callbacks=[];
    this.time = every;
  }

  add(call){
    this.callbacks.push(call);
  }

  remove(index){
    this.callbacks[index]=null;
  }

  setInterval(newInterval){
    this.time = newInterval;
  }

  loop(){
    //console.log(this);
    let that = this;
    this.callbacks.forEach((call,i)=>{
      if(typeof call == "function")
        call(function(){that.remove(i)});
    });
    return setTimeout(this.loop.bind(this),that.time);
  }

  start(){
    this.loop();
  }
}

class User{
  constructor(){
    this.money = 0;
    this.selected = "none";
  }

  hasSelected(){
    return this.selected!="none";
  }

  select(tipo){
    this.selected = tipo;
  }

  buy(){
    let tipo = InfoBatatas[this.selected];
    if(this.money >= tipo.preco){
      this.money-=tipo.preco;
      return true;
    } else return false;
  }
}

tempo = new Tempo(10);
user = new User();
farm = new Farm();


farm.fill(3,3);
farm.fill(5,5);
farm.resetDOM();
user.select("simples");
user.money=99999;
tempo.start();
