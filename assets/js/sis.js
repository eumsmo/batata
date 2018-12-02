let fazendaEl = document.querySelector("#fazenda"),
    fazendaConteudo  =document.querySelector("#fazenda > section");

fazendaEl.addEventListener("wheel",e=>{
  //console.log(e);
  e.preventDefault();
  return false;
});

fazendaEl.scrollIntoView({block: "center", inline: "center"});

const centerVertScroll = ()=> fazenda.clientHeight - fazendaConteudo.scrollHeight/2;
const centerHoriScroll = ()=> fazenda.clientWidth - fazendaConteudo.scrollWidth/2;
const fazendaCenter = ()=> fazendaEl.scrollTo(centerHoriScroll(),centerVertScroll());

window.addEventListener("resize",fazendaCenter);
fazendaCenter();
