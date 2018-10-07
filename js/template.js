class Template{
  constructor(element,padrao){
    if(typeof element == "string")
      this.el = document.querySelector(element);
    else this.el = element;

    this.default = padrao;

    this.parser = new DOMParser();
  }
  renderString(str,obj){
    let that = this;
    return str.replace(/\$\{(.+?)\}/g,(match,p1)=> {
      if(obj[p1]!==undefined) return obj[p1];
      else if(obj["$default"]!==undefined) return obj["$default"];
      else if(that.default!==undefined) return that.default;
      else return obj[p1]? obj[p1]:"";
    });
  }

  render(...objs){
    let obj = {};
    objs.forEach(o=>Object.assign(obj,o));
    
    let string = this.el.innerHTML,
        arr;

    string = this.renderString(string,obj);
    arr = this.parser.parseFromString(string,"text/html").body.children;
    arr = Array.prototype.slice.apply(arr);

    return arr.length==1? arr[0] : arr;
  }
}
