let fazendaEl = document.querySelector("#fazenda");

fazendaEl.addEventListener("wheel",e=>{
  console.log(e);
  e.preventDefault();
  return false;
});
