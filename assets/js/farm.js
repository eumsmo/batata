// Esse codigo depende do template.js
const Img_batata_folder = "assets/img/";
const Terra = "";
const InfoBatatas = {
  "Batata Comum": {
    "descricao": "É a sua primeira batata!",
    "img": "potatoes.png",
    "preco": 1,
    "retorno": 2,
    "tempo": 10
  },
  "Batata Test": {
    "descricao": "Tudo é apenas uma simulação",
    "img": "potato.png",
    "preco": 15,
    "retorno": 35,
    "tempo": 30
  },
  "Batata Testa": {
    "descricao": "Não é uma testa de verdade",
    "img": "potato.png",
    "preco": 30,
    "retorno": 75,
    "tempo": 60
  }
};

const InfoUpgrades = {
  "": ""
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

const TEMP = new Template();
TEMP.setFolder("assets/templates")
.addTemplate({
  info_batata: "info_batata.html",
  terra: "terra.html"
});

let farm, user, tempo, loja;

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
        let el = TEMP.render("terra",{x:i,y:j});

        el.addEventListener('click',this.clickEvent.bind(this));
        this.grids[i][j] = el;
        this.farmEl.append(el);
      }
    }

    this.farmEl.style.gridTemplateColumns = `repeat(${x},${100/x}%)`;
    this.farmEl.style.gridTemplateRows = `repeat(${y}),${100/y}%`;
    this.updateDOM();
  }
  clickEvent(evt){
    let el = evt.currentTarget,
        i = el.dataset.x,
        j = el.dataset.y,
        grid = this.arr[i][j];

    if(!grid)
      this.addBatata(i,j);
    else if(grid.pronta)
      this.collectBatata(i,j);
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
      if(user.hasSelected() && user.plant()){
        this.arr[i][j] = new Batata(user.selected);
        this.updateDOM();
        return true;
      } else if(user.hasSelected())
        console.error("Usuario não tem nenhuma batata do tipo!");
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
    } else return false;
  }
  collectBatata(i,j){
    let batata = this.arr[i][j];
    if(batata.pronta){
      user.collect(batata);
      this.removeBatata(i,j);
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

  setReady(i,j){
    let mainEl = this.grids[i][j],
        indicadorEl = mainEl.querySelector(".indicador");
    console.log("ready!");
    if(this.arr[i][j].pronta){
      indicadorEl.innerHTML = "Pronto!";
    }
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
          that.setReady(i,j);
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

class Loja{
  constructor(){
    this.batatasEl = {};

    this.buyBatataHolder = document.querySelector("section.selectBatata");
    this.buyUpgradeHolder = document.querySelector("section.selectUpgrade");

    this.buyMenu = document.querySelector("#select");
    this.buyMenuAbrir = document.querySelector("#abrirComprarBtn");
    this.buyMenuClose = document.querySelector("#select .close");
    this.tabBtBatata = document.querySelector("span.selectBatata");
    this.tabBtUpgrade = document.querySelector("span.selectUpgrade");

    this.generateDOM();
    this.manageDOM();

  }

  isOpen(){
    return !this.buyMenu.classList.contains("hide");
  }

  generateDOM(){
    let el, that = this;
    for (let batata in InfoBatatas){
      el  = TEMP.render("info_batata",InfoBatatas[batata],{nome: batata}); //Gera um item de batata para comprar
      el.querySelector(".comprarBt").addEventListener("click",function(){
        if(user.buy(batata)){
          that.updateCounter(batata);
        }

      }.bind(this));
      this.buyBatataHolder.appendChild(el);
      this.batatasEl[batata] = el;
    }
  }

  updateAll(what){
    let str = what;
    str = str.charAt(0).toUpperCase() + str.slice(1);
    for (let batata in this.batatasEl) {
      this["update"+str](batata);
    }
  }

  updateCounter(batata){
    let el = this.batatasEl[batata];
    el.querySelector(".quant").innerHTML = `x ${user.armazem[batata]}`;
  }
  updateBuyable(batata){
    let current = this.batatasEl[batata];
    if(user.money >= InfoBatatas[batata].preco)
      current.classList.add("compravel");
    else
      current.classList.remove("compravel");
  }

  menuTabEvt(str){
    console.log(str);
    if(str==="batata"){
      this.buyMenu.classList.add("selectBatata");
      this.buyMenu.classList.remove("selectUpgrade");
    } else if (str==="upgrade") {
      this.buyMenu.classList.remove("selectBatata");
      this.buyMenu.classList.add("selectUpgrade");
    } else if(str==="open"){
      this.updateAll("buyable");
      this.updateAll("counter");
      this.buyMenu.classList.remove("hide");
      this.buyMenu.classList.add("selectBatata");
      this.buyMenu.classList.remove("selectUpgrade");
    } else if(str==="close") {
      this.buyMenu.classList.add("hide");
    }
  }

  manageDOM(){
    this.tabBtBatata.addEventListener("click",function(){this.menuTabEvt("batata")}.bind(this));
    this.tabBtUpgrade.addEventListener("click",function(){this.menuTabEvt("upgrade")}.bind(this));
    this.buyMenuClose.addEventListener("click",function(){this.menuTabEvt("close")}.bind(this));
    this.buyMenuAbrir.addEventListener("click",function(){this.menuTabEvt("open")}.bind(this));
  }
}

class User{
  constructor({money,armazem}={}){
    this._money = money||0;
    //O proximo pedacinho de código apenas define que qualquer alteração na propriedade money, quando o usuario estiver na loja, irá atualizar os elementos da mesma
    Object.defineProperty(this,"money",{
      get(){return this._money;},
      set(val){
        this._money = val;
        if(loja.isOpen()) loja.updateAll("buyable");
      }
    });

    this.selected = "none";
    this.armazem = User.newArmazem(armazem);
  }

  static newArmazem(obj){
    let armazem = obj||{};
    for(let batata in InfoBatatas)
      armazem[batata] = armazem[batata]||0;
    return armazem;
  }

  hasSelected(){
    return this.selected!="none";
  }

  select(tipo){
    this.selected = tipo;
  }

  buy(tipo){
    let batata = InfoBatatas[tipo];
    if(this.money >= batata.preco){
      this.money-=batata.preco;
      this.armazem[tipo]++;
      return true;
    } else return false;
  }

  plant(){
    if(this.armazem[this.selected]>0){
      this.armazem[this.selected]--;
      return true;
    } else return false;
  }

  collect(batata){
    let quant = InfoBatatas[batata.tipo].retorno;
    this.money+=quant;
    batata.tipo = "none";
  }
}

TEMP.loadTemplates(()=>{
  tempo = new Tempo(10);
  loja = new Loja();
  user = new User({armazem:{"Batata Comum": 10}});
  farm = new Farm();
  loja.updateAll("buyable");

  farm.fill(3,3);
  farm.fill(5,5);
  farm.resetDOM();
  user.select("Batata Comum");
  tempo.start();
});
