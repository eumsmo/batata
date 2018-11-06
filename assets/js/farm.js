// Esse codigo depende do template.js (feita por eumsmo)
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

// Carregar templates usando template.js
const TEMP = new Template();
TEMP.setFolder("assets/templates")
.addTemplate({
  info_batata: "info_batata.html",
  terra: "terra.html",
  item: "item.html",
  slot: "slot.html"
});

// Inicializar variaveis
let farm, user, tempo, loja, display, caixa, save;

// Estrutura de uma terra plantada
class Batata{
  constructor(tipo){
    let agora = Date.now(),
        fimR = InfoBatatas[tipo].tempo*1000;

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
class Farm{
  constructor(){
    this.arr = []; // Vetor com objetos sobre cada terra

    this.grids = []; // Vetor com elemento HTML de cada terra
    // Tamanho da area de plantio (sempre x = y)
    this.xSize;
    this.ySize;


    this.farmEl = document.querySelector("#farm"); // Elemento HTML da area de plantio
    tempo.add(this.updateTime.bind(this)); // Adiciona função de atualizar terras ao cronômetro*
    this.fill(5,5); // Inicia area de plantio
  }

  // Atualiza cada terra do DOM
  updateDOM(){

    this.forEach("grids",(el,i,j)=>{ // Percorre this.grids como dois for(i,j)
      let img = el.querySelector('img'); // Seleciona a imagem de uma unica terra

      if(this.arr[i][j]){ // Se posição está plantada
          el.classList.add("plantado"); // Adiciona classe "plantado"
          img.src = Img_batata_folder+ InfoBatatas[this.arr[i][j].tipo].img; // Coloca imagem de batata na terra
      } else if(el.classList.contains("plantado")){ // Senão, se o elemento DOM não está atualizado
          el.classList.remove("plantado"); // Remove classe "plantado"
          img.src=""; // Remove imagem de batata da terra
      }
    });
  }

  // Reseta o conteudo da area de plantio (DOM)
  resetDOM(){
    let x = this.xSize,
        y = this.ySize;

    this.farmEl.innerHTML = ""; // Limpa o conteudo da area de plantio
    this.grids = []; // Limpa o vetor de elementos

    for(let i=0;i<x;i++){
      this.grids[i] = []; // Inicia matriz
      for(let j=0;j<y;j++){
        // Cria elemento html baseado no template "terra"
        let el = TEMP.render("terra",{x:i,y:j});

        // Adiciona [Evento de click] ao elemento
        el.addEventListener('click',this.clickEvent.bind(this));
        this.grids[i][j] = el; // Adiciona elemento na matriz
        this.farmEl.append(el); // Coloca elemento no DOM
      }
    }

    this.farmEl.style.gridTemplateColumns = `repeat(${x},${100/x}%)`;
    this.farmEl.style.gridTemplateRows = `repeat(${y}),${100/y}%`;
    this.updateDOM();
  }

  // [Evento de click] ao clicar na terra
  clickEvent(evt){
    let el = evt.currentTarget, //Pega o elemento clicado
        i = el.dataset.x, // Encontra x na matriz
        j = el.dataset.y, // Encontra y na matriz
        grid = this.arr[i][j]; // Encontra elemento na matriz

    // Se batata estiver pronta, colher
    if(grid && grid.pronta) return this.collectBatata(i,j);

    // To construindo isso ainda :|
    switch (user.mode){
      case "plant":
        if(!grid) this.addBatata(i,j); // Se terra está vazia, plantar
        break;
      case "remove":
        break;
      case "item":
        break;
    }

  }

  // Ajusta tamanho da area de plantio
  fill(x,y){
    // Atualiza propriedades xSize e ySize (sempre x = y)
    this.xSize = x;
    this.ySize = y;

    if(this.arr.length>x) // Se a matriz for maior que o tamanho
      this.arr = this.arr.slice(0,x); // Corta matriz para o tamanho


    for(let i=0;i<x;i++){
      if(this.arr[i] && this.arr[i].length>y) // Se o vetor for maior que o tamanho
        this.arr[i] = this.arr[i].slice(0,y); // Corta o vetor para o tamanho

      this.arr[i] = this.arr[i]||[]; // Se existir, mantem, caso contrário, cria nova
      for(let j=0;j<y;j++)
        this.arr[i][j] = this.arr[i][j] || false; // Se existir, mantem, caso contrário define como falso (não tem)
    }

    this.resetDOM(); // Atualiza o DOM
  }

  // Percorre this[what] como dois for(i,j)
  forEach(what, callback){
    /* Parametros de callback: (el, i, j)
     * el: o elemento atual
     * i,j: o indice do elemento na matriz
     */

    for(let i=0;i<this.xSize;i++)
      for(let j=0;j<this.ySize;j++){
        // Chama callback com os parametros
        // Se callback retornar falso, termina forEach
        if(callback(this[what][i][j],i,j)===false)
          return;
      }
  }

  // Adiciona batata nas posição do parametro
  addBatata(i,j){
    // Se os indices estão no limite
    // E a posição está vazia
    if(i<this.xSize && j<this.ySize && this.arr[i][j]===false){
      let selected = user.selected;
      // Se o usuario tiver selecionado uma batata, e é posição planta-la
      if(user.hasSelected() && user.plant()){
        this.arr[i][j] = new Batata(selected); // Coloca batata nos indices selecionados
        this.updateDOM(); // Atualiza o DOM
        return true;
      } else if(user.hasSelected()){ // Se não foi possivel plantar a batata, mas o usúario tem alguma batata selecionada
          // Dá console.warn alertando
          console.warn("Usuario não tem nenhuma batata do tipo!");
      }
      else // Caso o usuário não tenha selecionado batata, console.warn alertando
        console.warn("Usuario não selecionou nenhuma batata!");

      return false;
    }
    else return false; // Caso indices não estejam no limite
  }

  // Remove batata nas posições do parametro
  removeBatata(i,j){
    // Se os indices estão no limite
    // E a posição não está vazia
    if(i<this.xSize && j<this.ySize && this.arr[i][j]!=false){
      this.arr[i][j]=false; // Define posição como falsa (vazia)
      this.updateDOM(); // Atualiza o DOM
      return true;
    } else return false;
  }

  // Pega batata pronta nas posições do parametro
  collectBatata(i,j){
    let batata = this.arr[i][j]; //Seleciona batata
    if(batata.pronta){ // Se batata está pronta
      user.collect(batata); // Coleta
      this.removeBatata(i,j); // Remove batata
    }
  }

  // Atualiza progresso de batata plantada
  updateProgress(time,i,j){
    let mainEl = this.grids[i][j], // Seleciona a batata
        progressEl = mainEl.querySelector(".progresso"), // Seleciona a barra de progresso
        indicadorEl = mainEl.querySelector(".indicador"), // Seleciona o indicador de tempo
        porcentagem = time.progresso/time.final_relativa; // Calcula porcentagem

    // Atualiza DOM
    progressEl.style.width = (porcentagem*100)+"%";
    indicadorEl.innerHTML = msToTime(time.final-time.inicial-time.progresso);
    //console.log(mainEl,progressEl,indicadorEl);
  }

  // Marca batata como pronta
  setReady(i,j){
    let mainEl = this.grids[i][j], // Seleciona batata
        progressEl = mainEl.querySelector(".progresso"), // Seleciona barra de progresso
        indicadorEl = mainEl.querySelector(".indicador"); // Seleciona indicador de tempo

    console.log("Pronto!");
    if(this.arr[i][j].pronta){ // Se batata estiver pronta
      progressEl.style.width = "100%"; // Marca barra de progresso como 100%
      indicadorEl.innerHTML = "Pronto!"; // Marca o indicador como "Pronto!"
      mainEl.classList.add("pronta"); // Adiciona classe "pronta"
    }
  }

  // Atualiza progresso do objeto
  updateTime(stop){

    let agora = Date.now();
    this.forEach("arr",(el,i,j)=>{
      if(el && !el.pronta){ // Se o elemento não estiver pronto
        let tempo = el.tempo; // Seleciona tempo da batata
        tempo.progresso = agora-tempo.inicial; // Atualiza progresso da batata

        if(tempo.progresso>=tempo.final_relativa){ // Se o progresso estiver completo
          el.pronta = true; // Marca batata como pronta
          this.setReady(i,j); // Chama função para marcar o elemento da batata
        } else {  // Caso não estiver completo
          this.updateProgress(tempo,i,j);
        }
      }
    });
  }

  // Função de importar valores
  importObj(obj){
    this.arr = obj.arr||[];
    this.xSize = obj.size||5;
    this.ySize = obj.size||5;
    this.fill(this.xSize,this.ySize);

    // Atualiza elementos que já estão pronto
    this.forEach("arr",(el,i,j)=>{
      if(el && el.pronta) this.setReady(i,j);
    });
  }

  // Função de exportar valores
  exportObj(){
    return {
      arr: this.arr,
      size: this.xSize
    };
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
    this.modal = new Modal(this.buyMenu);
    this.modal.openEl("#abrirComprarBtn");
    this.modal.closeEl("#select .close");

    this.tabBtBatata = document.querySelector("span.selectBatata");
    this.tabBtUpgrade = document.querySelector("span.selectUpgrade");

    this.generateDOM();
    this.manageDOM();

  }

  isOpen(){
    return !this.buyMenu.classList.contains("hide");
  }

  buyButtonClickEvt(batata){
    if(user.buy(batata))
      this.updateCounter(batata);
  }

  plantClickEvt(batata){
    if(user.hasBatata(batata)){
      user.select(batata);
      this.modal.close();
    }
  }

  generateDOM(){
    let el;
    for (let batata in InfoBatatas){
      el  = TEMP.render("info_batata",InfoBatatas[batata],{nome: batata}); //Gera um item de batata para comprar
      el.querySelector(".comprarBt").addEventListener("click",()=>this.buyButtonClickEvt(batata));
      el.querySelector(".img_quant").addEventListener("click",()=>this.plantClickEvt(batata));
      this.buyBatataHolder.appendChild(el);
      this.batatasEl[batata] = el;
    }
  }

  updateAll(what){ //what = "counter", "buyable"
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
    this.tempoAnimacao = 1000;

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
    this.selected.classList.add("animation");

    if(!passo){
      setTimeout(()=>that.updateSelected("remover animacao"),this.tempoAnimacao);
      setTimeout(()=>that.updateSelected("mudar conteudo"),this.tempoAnimacao/2);

    } else if(passo == "remover animacao"){
      this.selected.classList.remove("animation");
    } else if(passo == "mudar conteudo"){
      if(user.hasSelected()){
        that.displaySelected.innerHTML = user.selected;
      }
      else {
        that.displaySelected.innerHTML = "";
      }
    }

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
    this._money = 1;
    Object.defineProperty(this,"money",{
      get(){return this._money;},
      set(val){
        this._money = val;
        this.moneyUpdate(val);
      }
    });

    this.mode = "plant"; // "none", "plant", "remove", "item"
    this.selected = "none";
    this.armazem = {};
    this.dataInicio = Date.now();
    this.nome = "teste";

    for(let batata in InfoBatatas)
      this.armazem[batata] = this.armazem[batata]||0;

    this.conteudo = document.querySelector("body > main");
    this.conteudo.addEventListener("click",this.clickEvtOutise.bind(this));
  }

  clickEvtOutise(evt){
    let el = evt.target;
    if(el.parentElement == this.conteudo) this.select("none");
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
    this.armazem = obj.armazem;
    this.nome = obj.nome;
    this.dataInicio = obj.inicio;

    caixa.updateDOM();
  }
  exportObj(){
    return {
      money: this.money,
      armazem: this.armazem,
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
    farm.importObj(obj.farm);
    user.importObj(obj.user);
  }
  saveData(slot){
    let obj = {
      user: user.exportObj(),
      farm: farm.exportObj()
    }


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

function main(){
  save = new Save();
  tempo = new Tempo(10);
  loja = new Loja();
  caixa = new Box();
  display = new Display();
  user = new User();
  farm = new Farm();

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
