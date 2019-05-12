class Tempo extends Array{
  constructor(mls){
    super();
    this.mls = mls;
    this.update();
  }

  update(){
    let now = Date.now();
    for (let update of this)
      if(typeof update == "function")
        update(now);
    setTimeout(this.update.bind(this),this.mls);
  }
}
