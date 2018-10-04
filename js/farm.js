const Img_batata_folder = "img/";
const Terra = "";
const Imagens_de_batata = {
  "simples": "potatoes.png"
};

class Farm{
  constructor(){
    this.arr = [];

    this.grids = [];
    this.xSize;
    this.ySize;
    this.farmEl = document.querySelector("#farm");
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
            img.src = Img_batata_folder+ Imagens_de_batata[this.arr[i][j]];
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
        let span = document.createElement("span"),
            img_batata = new Image(),
            img_dirt = new Image();

        span.classList.add("terra");
        span.dataset.x = i;
        span.dataset.y = j;
        span.addEventListener('click',this.clickEvent.bind(this));

        img_batata.classList.add("batata");
        img_dirt.classList.add("fundo_terra");

        span.appendChild(img_dirt,img_batata);
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

    this.addBatata("simples",i,j);
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

  addBatata(tipo,i,j){
    console.log('a');
    if(i<this.xSize && j<this.ySize && this.arr[i][j]===false){
      this.arr[i][j] = tipo;
      this.updateDOM();
      return true;
    }
  }
  removeBatata(i,j){
    if(i<this.xSize && j<this.ySize){
      this.arr[i][j]=false;
      this.updateDOM();
      return true;
    }
  }
}

let farm = new Farm();
farm.fill(3,3);
farm.fill(5,5);
farm.resetDOM();
