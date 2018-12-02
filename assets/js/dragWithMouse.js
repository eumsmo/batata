// eu que fiz :)

function scrollWithMouse(){
  //if el has "wantToDrag", it will drag
  let status = {
    isDown:false,
    target:null
  }

  window.addEventListener("mouseup",()=> status.isDown = false);
  window.addEventListener("mousedown",evt => {
    status.isDown = true;
    let target = evt.target;
    while(target!=null && !target.classList.contains("wantToDrag"))
      target = target.parentElement;

    status.target = target;
  });
  window.addEventListener("mousemove", evt => {
    if(status.isDown && status.target!=null){
      status.target.scrollBy(-evt.movementX,-evt.movementY);
    }

  });
}

scrollWithMouse();
