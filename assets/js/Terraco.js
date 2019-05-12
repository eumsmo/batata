/*
Terraço:
Atributos:
-Terra: terras[ ][ ]
-int: tamanho
-DOM: elemento


Métodos:
-void: gerarTerras( )
-void: atualizarTerras( )

*/

// import Terra;

class Terraco {
  constructor() {
    this.usuario = null;

    this.tamanho = 5;
    this.terras = [];
    this.elemento = document.querySelector("#farm");
  }

  // public void atualizarTerras()
  atualizarTerras(){
    let tamanho_inicial = this.terras.length,
        tamanho_final = this.tamanho;

    if(tamanho_inicial!=tamanho_final){
      let tam = this.tamanho;
      this.elemento.style.gridTemplateColumns = `repeat(${tam},${100/tam}%)`;
      this.elemento.style.gridTemplateRows = `repeat(${tam}),${100/tam}%`;
    }

    if(tamanho_inicial<tamanho_final){
      for(let i = 0; i < tamanho_final; i++){
        if(this.terras[i]==undefined) this.terras[i] = [];
        for(let j = 0; j < tamanho_final; j++){
          if(this.terras[i][j]==undefined){
            this.terras[i][j] = new Terra(this.usuario);
            this.elemento.appendChild(this.terras[i][j].elementos.terra);
          }
        }
      }
    } else if(tamanho_inicial>tamanho_final){
      for (let i = 0; i < tamanho_inicial; i++) {
        for (let j = (i>=tamanho_final)? 0: tamanho_final; j < tamanho_inicial; j++) {
          this.terras[i][j].deletarBatata();
          this.terras[i][j].elementos.terra.remove();
          this.terras[i][j] = undefined;
        }
      }
    }
  }

  // public void atualizar(int: agora)
  atualizar(agora){
    for(let i=0; i< this.tamanho; i++){
      for(let j=0; j< this.tamanho; j++){
        let terra = this.terras[i][j];
        terra.atualizar(agora);
      }
    }
  }


}
