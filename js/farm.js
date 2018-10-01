class Farm{
  constructor(){
    this.arr = [];

    this.grids = [];
    this.farmEl = document.querySelector("#farm");
  }
  updateDOM(){
    let x = this.arr.length,
        y = this.arr[0].length;

    for(let i=0;i<x;i++)
      for(let j=0;j<y;j++){
        let index = 2*i+y,
            el = this.grids[index];

        if(this.arr[i][j])
          el.classList.add("plantado");
      }
  }
  resetDOM(){
    let x = this.arr.length,
        y = this.arr[0].length;
    this.farmEl.innerHTML = "";
    this.grids = [];

    for(let i=0;i<x;i++)
      for(let j=0;j<y;j++){
        let span = document.createElement("span");
        span.classList.add("terra");

        this.grids.push(span);
        this.farmEl.append(span);
      }

    this.farmEl.style.gridTemplateColumns = `repeat(${x},${100/x}%)`;
    this.farmEl.style.gridTemplateRows = `repeat(${y}),${100/y}%`;
    this.updateDOM();
  }

  fill(x,y){
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

}

let farm = new Farm();
farm.fill(3,3);
farm.arr[1][1] = true;
farm.fill(5,5);
farm.resetDOM();
