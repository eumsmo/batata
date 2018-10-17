class ReadTemplates{
  constructor(){
    this.folder = "";
    this.templates = {};
    this.loadedTemplates = {};
  }

  setFolder(str){
    if(str[str.length-1]!="/")str+='/';
    this.folder = str;
    return this;
  }

  noFolder(){
    this.folder = "";
    return this;
  }

  addTemplate(...names){
    if(names.length==1 && typeof names[0] == "object"){
      let obj = names[0];
      for(let name in obj)
        this.templates[name]=this.folder+obj[name];
    } else {
      for(let name of names)
        this.templates[name]=this.folder+name;
    }

    return this;
  }

  loadTemplates(callback){
    let promises = {}, that = this;
    for(let templateName in this.templates) {
      promises[templateName] = fetch(this.templates[templateName])
        .then(res=>res.text())
        .then(txt=>{
          delete that.templates[templateName];
          return [templateName,txt];
        })
        .catch(console.error);
    }

    Promise.all(Object.values(promises))
    .then(res=>{
      res.forEach(res=>
        that.loadedTemplates[res[0]] = res[1]
      );
      callback(that.loadedTemplates);
    });
    return this;
  }
}
class Template extends ReadTemplates{
  constructor(){
    super();
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

  render(name,...objs){
    let obj = {};
    objs.forEach(o=>obj=Object.assign(obj,o));

    let string = this.loadedTemplates[name],
        arr;

    if(!string) return console.error(new Error(`Template "${name}" doesn't exist or was not loaded!`));

    string = this.renderString(string,obj);
    arr = this.parser.parseFromString(string,"text/html").body.children;
    arr = Array.prototype.slice.apply(arr);
    return arr.length==1? arr[0] : arr;
  }

}
