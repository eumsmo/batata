//(function(){// Esse codigo depende do template.js (feita por eumsmo)
const Img_batata_folder = "assets/img/";
let InfoBatatas, InfoUpgrades;

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
function formatDate(date){
  let data = new Date(date),
      dia = data.getDate();
      mes = data.getMonth()+1;
      ano = data.getFullYear();

  dia = (dia<10)? "0"+dia:dia;
  mes = (mes<10)? "0"+mes:mes;

  return dia+'/'+mes+'/'+ano;
}
function milliToDays(milli){
  let hours = milli/3600000;
  return (hours/24+'').slice(0,3);
}
function moneyFormat(val){return val.toFixed(2)}

// Carregar templates usando template.js
const TEMP = new Template();
TEMP.setFolder("assets/templates")
.addTemplate({
  info_batata: "info_batata.html",
  upgrades: "upgrades.html",
  terra: "terra.html",
  item: "item.html",
  slot: "slot.html"
});

// Inicializar variaveis
let farm, upgrades, user, tempo, loja, display, caixa, save, profile;
let all; //Objeto aponta para todas variaveis

// Estrutura de uma terra plantada
class Batata{
  constructor(tipo,agora){
    let fimR = InfoBatatas[tipo].tempo*1000;

    this.tipo = tipo; // Nome referente a batata plantada
    this.pronta = false;
    this.tempo = {
      inicial: agora, // Momento que foi plantada
      final_relativa: fimR, // Duração
      final: fimR+agora, // Momento para terminar
      progresso: 0 // Progresso
    };
  }
}
class Terra{
  constructor() {

    this.plantada = false;

    // Cria elemento html baseado no template "terra"
    this.el = TEMP.render("terra");

    // Adiciona [Evento de click] ao elemento
    this.el.addEventListener('click',this.clickEvent.bind(this));
  }

  // Adiciona batata na terra
  addBatata(){

    if(this.plantada===false){
      let selected = user.selected;
      if(user.hasSelected() && user.plant()){
        this.plantada = new Batata(selected,Date.now());
        this.updateDOM();
        return true;
      }
      else if(user.hasSelected())
        console.warn("Usuario não tem nenhuma batata do tipo!");
      else console.warn("Usuario não selecionou nenhuma batata!");

      return false;
    }
    else return false; // Caso indices não estejam no limite
  }

  // Remove batata na terra
  removeBatata(){

    if(this.plantada!=false){
      this.plantada=false; // Define terra como falsa (vazia)
      this.updateDOM();
      return true;
    } else return false;
  }

  // Pega batata pronta
  collectBatata(evt){
    let batata = this.plantada; //Seleciona batata
    if(batata.pronta){ // Se batata está pronta
      let val = InfoBatatas[batata.tipo].retorno;
      user.collect(batata); // Coleta
      this.removeBatata(); // Remove batata
      display.coinAnimation(evt.pageX,evt.pageY,val); // Roda animação
    }
  }

  // Atualiza progresso de batata plantada
  updateProgress(time){
    let mainEl = this.el, // Seleciona a batata
        progressEl = mainEl.querySelector(".progresso"), // Seleciona a barra de progresso
        indicadorEl = mainEl.querySelector(".indicador"), // Seleciona o indicador de tempo
        porcentagem = time.progresso/time.final_relativa; // Calcula porcentagem

    // Atualiza DOM
    progressEl.style.width = (porcentagem*100)+"%";
    indicadorEl.innerHTML = msToTime(time.final-time.inicial-time.progresso);
  }

  updateTime(){
    let agora = Date.now();
    if(this.plantada && !this.plantada.pronta){
      let tempo = this.plantada.tempo; // Seleciona tempo da batata
      tempo.progresso = agora-tempo.inicial; // Atualiza progresso da batata

      if(tempo.progresso>=tempo.final_relativa){ // Se o progresso estiver completo
        this.plantada.pronta = true;
        this.setReady();
      } else // Caso não estiver completo
        this.updateProgress(tempo);

    }
  }

  // Marca batata como pronta
  setReady(){
    let mainEl = this.el, // Seleciona batata
        progressEl = mainEl.querySelector(".progresso"), // Seleciona barra de progresso
        indicadorEl = mainEl.querySelector(".indicador"); // Seleciona indicador de tempo

    if(this.plantada.pronta){ // Se batata estiver pronta
      progressEl.style.width = "100%"; // Marca barra de progresso como 100%
      indicadorEl.innerHTML = "Pronto!"; // Marca o indicador como "Pronto!"
      mainEl.classList.add("pronta"); // Adiciona classe "pronta"
    }
  }

  updateDOM(){
    let img = this.el.querySelector('img'); // Seleciona a imagem de uma unica terra

    if(this.plantada!=false){
      console.log("hahaha");
        this.el.classList.add("plantado"); // Adiciona classe "plantado"
        img.src = Img_batata_folder+ InfoBatatas[this.plantada.tipo].img; // Coloca imagem de batata na terra
    } else if(this.el.classList.contains("plantado")){ // Se o elemento DOM não está atualizado
        this.el.classList.remove("plantado"); // Remove classe "plantado"
        img.src=""; // Remove imagem de batata da terra
    }

    if(this.plantada && this.plantada.pronta) this.setReady();
  }

  // [Evento de click] ao clicar na terra
  clickEvent(evt){
    let el = this.el;

    if(this.plantada && this.plantada.pronta){
      return this.collectBatata(evt);
    }

    // To construindo isso ainda :|
    switch (user.mode){
      case "plant":
        if(!this.plantada) this.addBatata();
        break;
      case "remove":
        break;
      case "item":
        break;
    }

  }

  exportObj(){
    if(!this.plantada) return false;
    else return {
      tipo: this.plantada.tipo,
      inicio: this.plantada.tempo.inicial
    };
  }


  importObj(obj){
    if(obj==false) this.plantada=false;
    else this.plantada = new Batata(obj.tipo,obj.inicio);
    this.updateDOM();
  }

}

class Farm{
  constructor(){
    this.arr = []; // Vetor com objetos sobre cada terra

    // Tamanho da area de plantio (sempre x = y)
    this.xSize;
    this.ySize;
    this.size;


    this.farmEl = document.querySelector("#farm"); // Elemento HTML da area de plantio
    tempo.add(this.updateTime.bind(this)); // Adiciona função de atualizar terras ao cronômetro*
    this.fill(4,4); // Inicia area de plantio
  }

  // Reseta o conteudo da area de plantio (DOM)
  resetDOM(){
    let x = this.xSize,
        y = this.ySize;

    this.farmEl.innerHTML = ""; // Limpa o conteudo da area de plantio
    this.arr = []; // Limpa o vetor de elementos

    for(let i=0;i<x;i++){
      this.arr[i] = []; // Inicia matriz
      for(let j=0;j<y;j++){
        this.arr[i][j] = new Terra();
        this.farmEl.append(this.arr[i][j].el);
      }
    }

    this.farmEl.style.gridTemplateColumns = `repeat(${x},${100/x}%)`;
    this.farmEl.style.gridTemplateRows = `repeat(${y}),${100/y}%`;
    this.forEach(el=>el.updateDOM());
    //this.updateDOM();
  }

  // Ajusta tamanho da area de plantio
  fill(x,y){
    if(x!=undefined){
      // Atualiza propriedades xSize e ySize (sempre x = y)
      this.xSize = x;
      this.ySize = y;
    }
    this.size = this.xSize;

    this.resetDOM(); // Atualiza o DOM
  }

  static matrizForEach(matriz,call){
    for(let i=0;i<matriz.length;i++)
      for(let j=0;j<matriz[i].length;j++){
        // Chama callback com os parametros
        // Se callback retornar falso, termina forEach
        if(call(matriz[i][j],i,j)===false)
          return;
      }
  }


  // Percorre terras
  forEach(callback){
    Farm.matrizForEach(this.arr,callback);
  }

  // Atualiza progresso do objeto
  updateTime(stop){

    this.forEach(el=> el.updateTime());
  }

  // Função de importar valores
  importObj(obj){

  this.fill(this.xSize,this.ySize);

  Farm.matrizForEach(obj.arr,(terra,i,j)=>{
    let nObj = (terra)? {tipo: terra.tipo, inicio: terra.inicio || terra.tempo.inicial} : false;
    this.arr[i][j].importObj(nObj);
  });

  }

  // Função de exportar valores
  exportObj(){
    let arr=[];

    this.forEach((el,i,j)=>{
      if(!arr[i]) arr[i]=[];
      arr[i][j] = el.exportObj();
    });

    return {arr};
  }

}

class Upgrades{
  /*
    exec: {
      "campo que deseja modificar": {
        "$propriedade": valor, // adiciona valor a propriedade
        "propriedade": valor, // define valor a propriedade
        "funcao": parametro, // código analisa automatica se é propriedade ou função
        "funcao": [array], //ex: "funcao": [[1,2,3]] (1 parametro vetor)
        "funcao": [parametros...] //ex: "funcao": [1,2,3] (3 parametros inteiros)
      }
    }
  */
  constructor(){
    this.all = {};
    this.if = {};

    for (let upgrade in InfoUpgrades){
      this.add(upgrade);

      // Controle se upgrade é aplicavel
      let func = eval("()=>`"+InfoUpgrades[upgrade].if+"`");
      this.if[upgrade]  = ()=> eval(func());
    }


  }

  add(name,upgrade){
    this.all[name] = false;
  }
  can(name){
    let cmp = this.if[name];
    return cmp();
  }
  buy(name){
    let upgrade = InfoUpgrades[name];
    if(upgrade && !this.all[name] && user.money >= upgrade.preco){
      user.money -= upgrade.preco;
      this.all[name]=true;
      user.addUpgrade(name);
      this.exec(name);
      this.showImport(name);
      return true;
    }
    return false;
  }
  exec(name){
    if(!this.can(name)) return;
    let upgrade = InfoUpgrades[name],
        func = upgrade.exec;


    for (let where in func){
      let cause = func[where], place = all[where];
      console.log(where);
      for(let effect in cause){
        let val = cause[effect];
        if(place[effect] && place[effect].constructor == Function){
          if(val.constructor != Array) place[effect](val);
          else place[effect](...val);
        } else {
          if(effect.startsWith("$")) place[effect.slice(1)]+=val;
          else place[effect]=val;
        }
      }
    }

    /*for (let where in func){
      let part = all[where], effects=func[where];
      if(effects.constructor === Array){
        effects.forEach(effect=>{
          if(effect.constructor === Array){
            let args = effect.slice(1);
            part[effect[0]](...args);
          } else part[effect]();
        });
      }
      else part[effects]();
    }*/

  }

  show(upgrade){
    console.log(upgrade);
    let el = loja.upgradesEl[upgrade];
    el.classList.add("show");
  }

  showImport(upgrade){
    let show = InfoUpgrades[upgrade].show;
    if(show)
    show.forEach(this.show);
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
    this.buyMenu = document.querySelector("#select");
    this.modal = new Modal(this.buyMenu);
    this.modal.openEl("#abrirComprarBtn");
    this.modal.closeEl("#select .close");

    this.noUpgradeEl;

    this.batatasEl = {};
    this.upgradesEl = {};

    this.buyBatataHolder = document.querySelector("section.selectBatata");
    this.buyUpgradeHolder = document.querySelector("section.selectUpgrade");

    this.tabBtBatata = document.querySelector("span.selectBatata");
    this.tabBtUpgrade = document.querySelector("span.selectUpgrade");

    this.generateDOM();
    this.manageDOM();

  }

  // Exclusivo da batata
  plantClickEvt(batata){
    if(user.hasBatata(batata)){
      user.select(batata);
      this.modal.close();
    }
  }
  updateCounter(what,batata){
    let el = this.batatasEl[batata];
    el.querySelector(".quant").innerHTML = `x ${user.armazem[batata]}`;
  }

  // Exclusivo do upgrade
  async updateUpgrade(upgrade){
    let el = this.upgradesEl[upgrade];
    await el.remove(); // elemento.remove() não é sincrona e não possui callback! É necessário assim esperar
    delete this.upgradesEl[upgrade];

    if(JSON.stringify(this.upgradesEl) == "{}"){
      this.noUpgradeEl.classList.add("show");
      this.buyUpgradeHolder.append(this.noUpgradeEl);
    }

  }

  // Não exclusivos
  updateAll(what){ //what = "counter", "buyable"
    let str = what;
    str = str.charAt(0).toUpperCase() + str.slice(1);
    for (let batata in this.batatasEl)
      this["update"+str]("batata",batata);

    if(what=="buyable")
      for (let upgrade in this.upgradesEl)
        this.updateBuyable("upgrade",upgrade);
  }
  updateBuyable(what,el){
    let current = this[what+'sEl'][el],
        coiso = (what=="batata")? InfoBatatas[el] : InfoUpgrades[el];

    if(user.money >= coiso.preco)
      current.classList.add("compravel");
    else
      current.classList.remove("compravel");
  }
  buyButtonClickEvt(what,coiso){
    if(what=="batata" && user.buy(coiso))
      this.updateCounter(what,coiso);
    else if(what=="upgrade" && upgrades.buy(coiso))
      this.updateUpgrade(coiso);
  }

  isOpen(){
    return !this.buyMenu.classList.contains("hide");
  }

  appendUpgrade(upgrade, el){
    this.buyUpgradeHolder.appendChild(el);
    this.upgradesEl[upgrade] = el;
  }
  generateUpgrade(upgrade){
    let info = InfoUpgrades[upgrade],
        el = TEMP.render("upgrades",info,{
          nome: upgrade,
          preco:moneyFormat(info.preco)
        });

    let btn = el.querySelector(".comprarBt");

    if(info.preco == 16){ // Ver se é um elemento em especifico
      // Se sim, remove o botão e guarda elemento para o futuro
      btn.remove();
      el.querySelector('.informacao').style.marginRight = "0";
      this.noUpgradeEl = el;
    } else {
      // Caso o contrário, segue normalmente
      btn.addEventListener("click",()=>this.buyButtonClickEvt("upgrade",upgrade));
      this.appendUpgrade(upgrade,el);
      if(info.starts) el.classList.add("show");
    }
    return el;
  }

  generateDOM(){
    let el;
    for (let batata in InfoBatatas){
      let info = InfoBatatas[batata];
      el  = TEMP.render("info_batata",info,{
        nome: batata,
        preco:moneyFormat(info.preco),
        retorno:moneyFormat(info.retorno)
      }); //Gera um item de batata para comprar
      el.querySelector(".comprarBt").addEventListener("click",()=>this.buyButtonClickEvt("batata",batata));
      el.querySelector(".img_quant").addEventListener("click",()=>this.plantClickEvt(batata));
      this.buyBatataHolder.appendChild(el);
      this.batatasEl[batata] = el;
    }

    for(let upgrade in InfoUpgrades)
      this.generateUpgrade(upgrade);

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
      this.modal.open(function(){
        this.updateAll("buyable");
        this.updateAll("counter");
        this.buyMenu.classList.add("selectBatata");
        this.buyMenu.classList.remove("selectUpgrade");
      }.bind(this));

    }
  }
  manageDOM(){
    this.tabBtBatata.addEventListener("click",function(){this.menuTabEvt("batata")}.bind(this));
    this.tabBtUpgrade.addEventListener("click",function(){this.menuTabEvt("upgrade")}.bind(this));
    this.modal.open(function(){this.menuTabEvt("open")}.bind(this));
  }
}
class Display{
  constructor(){
    this.selectTempo = 1000;
    this.coinTempo = 500;

    this.conteudoEl = document.querySelector("#conteudo");
    this.displayMoney = document.querySelector("#display_money");
    this.selected = document.querySelector("#selecionada");
    this.displaySelected = document.querySelector("#selecionada span");
  }

  moneyFormat(val){return val.toFixed(2)}

  updateMoney(){
    this.displayMoney.innerHTML = this.moneyFormat(user.money);
  }

  updateSelected(passo){
    let that = this;

    switch(passo){
      case "remover animacao":
        this.selected.classList.remove("quickAnimation");
        this.selected.classList.remove("animation");
        break;
      case "mudar conteudo":
        if(user.hasSelected()) this.displaySelected.innerHTML = user.selected;
        else this.displaySelected.innerHTML = "";
        break;
      case undefined: // Primeira chamada
        if(this.displaySelected.innerHTML!=""){ //Se o elemento tinha algo escrito, roda toda animação
          this.selected.classList.add("animation");
          setTimeout(()=>that.updateSelected("remover animacao"),this.selectTempo);
          setTimeout(()=>that.updateSelected("mudar conteudo"),this.selectTempo/2);
        } else { // Caso esteja vazio, roda animação rápida
          this.selected.classList.add("quickAnimation");
          setTimeout(()=>that.updateSelected("remover animacao"),this.selectTempo/2);
          this.updateSelected("mudar conteudo");
        }
        break;
    }

  }

  coinAnimation(x,y,recebido){
    let coin = document.createElement("span"),
        img = new Image();

    img.src = "assets/img/potato.png";

    coin.style.top = `calc(${y+'px - 2.5em'})`;
    coin.style.left = x+'px';
    coin.innerHTML = "+"+this.moneyFormat(recebido);

    coin.appendChild(img);
    this.conteudoEl.appendChild(coin);
    coin.classList.add("moedinha");
    setTimeout(()=>coin.remove(),this.coinTempo-50);
  }
}
class Box{
  constructor(){
    this.items = {};

    this.el = document.querySelector("#caixa");
    this.modal = new Modal(this.el);
    this.modal.closeEl("#caixa .close");
    this.modal.openEl("#abrirCaixaBtn");
    this.modal.close();
    this.armazem = this.el.querySelector("main");
  }

  generateItem(batata,quant){
    let item = {img: InfoBatatas[batata].img, quant}
    return TEMP.render("item",item);
  }

  clickEvt(batata){
    if(user.hasBatata(batata)){
      user.select(batata);
      this.modal.close();
    }
  }

  generateDOM(){
    let quant;
    this.armazem.innerHTML ="";
    for (let batata in InfoBatatas) {
      this.items[batata] = this.generateItem(batata,quant);
      this.items[batata].addEventListener("click",function(){
        this.clickEvt(batata);
      }.bind(this));
      this.armazem.appendChild(this.items[batata]);
    }

    this.updateDOM();
  }

  updateEl(el,quant){
    if(el.style.display=="none")
      el.style.display = "inline-block";
    el.querySelector('.quant').innerHTML = 'x '+quant;
  }

  updateDOM(){
    let quant;
    for (let batata in InfoBatatas){
      let el = this.items[batata];
      quant = user.armazem[batata];
      if(quant>0)this.updateEl(el,quant);
      else if(el.style.display!="none")
        el.style.display = "none";
    }
  }
}
class User{
  constructor(){
    //O proximo pedacinho de código apenas define que qualquer alteração na propriedade money, quando o usuario estiver na loja, irá atualizar os elementos da mesma
    this._money = 0;
    Object.defineProperty(this,"money",{
      get(){return this._money;},
      set(val){
        this._money = val;
        this.moneyUpdate(val);
      }
    });

    this.upgrades = [];

    this.mode = "plant"; // "none", "plant", "remove", "item"
    this.selected = "none";
    this.armazem = {};
    this.dataInicio = Date.now();
    this.nome = "Fazendeiro Comum";

    for(let batata in InfoBatatas)
      this.armazem[batata] = this.armazem[batata]||0;

    this.conteudo = document.querySelector("body > main");
    this.conteudo.addEventListener("click",this.clickEvtOutise.bind(this));
  }

  clickEvtOutise(evt){
    let el = evt.target;
    if(el.parentElement == this.conteudo) this.select("none");
  }

  addMoney(quant){
    console.log(quant);
    this.money+=quant;
  }

  addUpgrade(upgrade){
    user.upgrades.push(upgrade);
  }
  moneyUpdate(){
    display.updateMoney();
    /*if(loja.isOpen())*/ loja.updateAll("buyable");
  }
  hasSelected(){
    return this.selected!="none";
  }
  select(tipo){
    this.selected = tipo;
    display.updateSelected();
  }
  buy(tipo){
    let batata = InfoBatatas[tipo];
    if(this.money >= batata.preco){
      this.money-=batata.preco;
      this.armazem[tipo]++;
      caixa.updateDOM();
      return true;
    } else return false;
  }
  hasBatata(tipo){
    return this.armazem[tipo]>0;
  }
  plant(){
    if(this.hasBatata(this.selected)){
      this.armazem[this.selected]--;
      if(this.armazem[this.selected]==0)
        this.select("none");
      loja.updateAll("counter");
      caixa.updateDOM();
      return true;
    } else return false;
  }
  collect(batata){
    let quant = InfoBatatas[batata.tipo].retorno;
    this.money+=quant;
    batata.tipo = "none";
  }

  changeMode(modo){
    this.mode = modo;
    farm.farmEl.classList.value = (modo == "none")? "" : modo;
  }

  importObj(obj){
    this.money = obj.money;

    for (let item in obj.armazem) this.armazem[item] = obj.armazem[item];

    obj.upgrades.forEach((upgrade,i)=>{
      this.upgrades[i]=upgrade;
      loja.updateUpgrade(upgrade);
      upgrades.exec(upgrade);
      upgrades.showImport(upgrade);
    });

    this.nome = obj.nome;
    this.dataInicio = obj.inicio;

    profile.nomeEl.innerHTML = this.nome;
    caixa.updateDOM();
  }
  exportObj(){
    return {
      money: this.money,
      armazem: this.armazem,
      upgrades: this.upgrades,
      nome: this.nome,
      inicio: this.dataInicio,
      ultimo: Date.now()
    }
  }
}
class Save {
  constructor() {
    this.el = document.querySelector("#slots");
    this.modal = new Modal(this.el);
    this.modal.openEl("#abrirSaveBtn");
    this.modal.closeEl("#slots .close");
    this.container = this.el.querySelector("main");

    this.numSlots = 6;
    this.slots=[];
    this.slotsEl=[];

    for(let i=0;i<this.numSlots;i++)
      this.slots.push(this.getData(i));
    this.generateDOM();
  }

  goTo(slot){
    let data = this.getData(slot);
    if(data){
      // Update localStorage
      this.setData(data);

      // Update game
      this.updateSlots();
      this.updateEl(slot);
      loja.updateAll("counter");
    }
  }
  getData(slot){
    let obj = localStorage.getItem("slot-"+slot);
    if(obj) return JSON.parse(obj);
    else return false;
  }
  setData(obj){
    console.log(farm.xSize);
    user.importObj(obj.user);
    farm.importObj(obj.farm);
  }
  saveData(slot){
    let obj = {
      user: user.exportObj(),
      farm: farm.exportObj()
    }

    profile.update(obj.user);
    // Update localStorage
    obj = JSON.stringify(obj);
    localStorage.setItem('slot-'+slot,obj);

    // Update game
    this.updateSlots();
    this.updateEl(slot);
  }
  deleteData(slot){
    // Update localStorage
    localStorage.removeItem('slot-'+slot);

    // Update game
    this.updateSlots();
    this.updateEl(slot);
  }

  updateSlots(){
    this.slots.forEach((el,i)=>
      this.slots[i] = this.getData(i)
    );
  }
  generateDOM(){
    this.container.innerHTML = "";
    this.slots.forEach((slot,i)=>{
      let el = TEMP.render("slot"),
          saveBtn = el.querySelector(".save"),
          loadBtn = el.querySelector(".load"),
          deleteBtn = el.querySelector(".delete");

      saveBtn.addEventListener("click",function(){
        this.saveData(i);
      }.bind(this));

      deleteBtn.addEventListener("click",function(){
        this.deleteData(i);
      }.bind(this));

      loadBtn.addEventListener("click",function(){
        this.goTo(i);
      }.bind(this));

      this.slotsEl.push(el);
      this.container.append(el);
      this.updateEl(i);
    });
  }
  updateEl(i){
    let el = this.slotsEl[i],
        slot = this.slots[i];

    if(slot){
      let user = slot.user;
      el.querySelector(".nome").innerHTML = user.nome;
      el.querySelector(".inicio").innerHTML = formatDate(user.inicio);
      el.querySelector(".ultimo").innerHTML = formatDate(user.ultimo);
      el.querySelector(".dinheiro").innerHTML = user.money;
      el.classList.remove("vazio");
      el.classList.add("naoVazio");
    } else {
      el.classList.add("vazio");
      el.classList.remove("naoVazio");
    }
  }
}
class Profile {
  constructor(){
    this.el = document.querySelector("#user");
    this.modal = new Modal(this.el);
    this.modal.openEl("#abrirUserBtn");
    this.modal.closeEl("#user .close");
    //this.container = this.el.querySelector("main");

    this.resetBtn = document.querySelector("#resetBtn");
    this.resetBtn.addEventListener("click",this.resetClickEvt.bind(this));

    this.criacaoEl = document.querySelector("#criacao");
    this.vividoEl = document.querySelector("#vividos");
    this.dinheiroEl = document.querySelector("#didinheiro");

    this.nomeEl = document.querySelector("#nome");
    this.nomeEl.innerHTML = user.nome;
    this.nomeEl.addEventListener("input",this.nomeChangeEvt.bind(this));
  }

  resetClickEvt(){
    let alerta = "Você deseja apagar todo seu progresso no jogo?\n(Atenção! Essa ação é irreversível.)";
    if(window.confirm(alerta)){
      tempo.callbacks = [];
      save.deleteData(0);
      window.location.reload();
    }
  }

  nomeChangeEvt(){
    user.nome = this.nomeEl.innerHTML;
  }

  update(obj){
    this.criacaoEl.innerHTML = formatDate(obj.inicio);
    this.vividoEl.innerHTML = milliToDays(Date.now() - obj.inicio) + " dias";
    this.dinheiroEl.innerHTML = "R$ "+moneyFormat(obj.money);
  }
}

function main(){
  save = new Save();
  tempo = new Tempo(10);
  loja = new Loja();
  caixa = new Box();
  display = new Display();
  user = new User();
  upgrades = new Upgrades();
  farm = new Farm();
  profile = new Profile();
  all = {farm, upgrades, user, tempo, loja, display, caixa, save, profile};

  loja.updateAll("counter");
  user.moneyUpdate();
  caixa.generateDOM();

  farm.resetDOM();
  user.select("none");

  // TEMP:
  save.goTo(0);
  tempo.add(()=>{save.saveData(0)});
  // END TEMP

  tempo.start();
}

// Pegar informações por Fetch (requisição http)

let fetchInfoBatatas = fetch("assets/json/info_batatas.json").then(res=>res.json()),
    fetchInfoUpgrades = fetch("assets/json/info_upgrades.json").then(res=>res.json());

Promise.all([fetchInfoBatatas,fetchInfoUpgrades])
.then(res=> {
  InfoBatatas = res[0];
  InfoUpgrades = res[1];
  TEMP.loadTemplates(main);
});
//})();
