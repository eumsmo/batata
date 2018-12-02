let fazendaEl = document.querySelector("#fazenda");

fazendaEl.addEventListener("wheel",e=>{
  //console.log(e);
  e.preventDefault();
  return false;
});

fazendaEl.scrollIntoView({block: "center", inline: "center"});

const centerVertScroll = ()=> fazenda.clientHeight - fazendaEl.firstElementChild.scrollHeight/2;
const centerHoriScroll = ()=> fazenda.clientWidth - fazendaEl.firstElementChild.scrollWidth/2;
const fazendaCenter = ()=> fazendaEl.scrollTo(centerHoriScroll(),centerVertScroll());

window.addEventListener("resize",fazendaCenter);
fazendaCenter();
