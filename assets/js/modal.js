class Modal {
  constructor(selector){
    this.el = Modal.elorstr(selector);
    this.closeBt;
    this.openBt;
    this.status = "closed"; // "closed", "opened"

    //this.closeEl(".close");
    this.closeCall = [];
    this.openCall = [];
    Modal.all.push(this);
  }

  static elorstr(str){
    if(typeof str == "string")
      return document.querySelector(str);
    else return str;
  }

  closeEl(selector){
    this.closeBt = Modal.elorstr(selector);
    this.setCloseEvt();
  }
  close(call){
    if(call!=undefined) return this.closeCall.push(call);
    else this.closeEvt();
  }
  setCloseEvt(){
    this.closeBt.addEventListener("click",this.closeEvt.bind(this));
  }
  closeEvt(){
    this.status = "closed";
    this.el.classList.add("hide");
    this.closeCall.forEach(call=>call());
  }

  openEl(selector){
    this.openBt = Modal.elorstr(selector);
    this.setOpenEvt();
  }
  open(call){
    if(call!=undefined) return this.openCall.push(call);
    else this.openEvt();
  }
  setOpenEvt(){
    this.openBt.addEventListener("click",this.openEvt.bind(this));
  }
  openEvt(){
    let that = this;
    this.status = "opened";
    Modal.all.forEach(modal=>{
      if(modal.isOpen() && !Object.is(modal,that))
        modal.close();
    });
    this.el.classList.remove("hide");
    this.openCall.forEach(call=>call());
  }

  isOpen(){return this.status==="opened"}
}

Modal.all = [];
