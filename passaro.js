export {Passaro};

class Passaro{
  constructor(params){
      this.pos = {x:0, y:0, z:0};
      this.nome = "Passaro";
      this.vx = -params.vx;//velocidade
      this.gameOverPassaro = false;
      this.remover = false;
      this.ComprimentoAresta = 4;
      this.box = new THREE.Mesh(
          new THREE.BoxGeometry(this.ComprimentoAresta,this.ComprimentoAresta,this.ComprimentoAresta),
          new THREE.MeshStandardMaterial({color:0xFF8080}),
      );

      this.box.position.x += 100;
      this.box.position.y += 2.5;
      //minimos
  this.minX = this.box.position.x -(this.ComprimentoAresta/2)-0.5;
  this.minY = this.box.position.y -(this.ComprimentoAresta/2);
  this.minZ = this.box.position.z -(this.ComprimentoAresta/2);
  //maximos
  this.maxX = this.box.position.x +(this.ComprimentoAresta/2);
  this.maxY = this.box.position.y +(this.ComprimentoAresta/2)-1.5;
  this.maxZ = this.box.position.z +(this.ComprimentoAresta/2);
 

  //meter o cubo invisivel
  this.box.visible = false;

  //passaro
  this.tamanho = 0.6;
  this.Passaro = new THREE.Group();
   

  this.Corpo = new THREE.Mesh(
      new THREE.BoxGeometry(8*this.tamanho,2*this.tamanho,3*this.tamanho),
      new THREE.MeshLambertMaterial({color: 0x000000})
  );

  this.Asa1 = new THREE.Mesh(
    new THREE.BoxGeometry(2.5*this.tamanho,1*this.tamanho,7*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x9e9898})
);
this.Asa1.position.z += 4*this.tamanho;

this.Asa2 = new THREE.Mesh(
  new THREE.BoxGeometry(2.5*this.tamanho,1*this.tamanho,7*this.tamanho),
  new THREE.MeshLambertMaterial({color: 0x9e9898})
);
this.Asa2.position.z -= 4*this.tamanho;



this.Cabeca = new THREE.Mesh(
  new THREE.BoxGeometry(2*this.tamanho,2*this.tamanho,2*this.tamanho),
  new THREE.MeshLambertMaterial({color: 0x000000})
);
this.Cabeca.position.x -= 4*this.tamanho;
this.Cabeca.position.y += 1.5*this.tamanho;

this.Bico = new THREE.Mesh(
  new THREE.ConeGeometry(1*this.tamanho, 2*this.tamanho, 5*this.tamanho),
  new THREE.MeshLambertMaterial({color: 0xfbff00})
);
this.Bico.position.y += 1.7*this.tamanho;
this.Bico.position.x -= 6*this.tamanho;
//falta rodar o bico
this.Bico.rotation.z = Math.PI / 2;

//pernas
this.Perna1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5*this.tamanho,1*this.tamanho,0.5*this.tamanho),
  new THREE.MeshLambertMaterial({color: 0xff9d47})
);
this.Perna1.position.x += 2*this.tamanho;
this.Perna1.position.y -= 1*this.tamanho;
this.Perna1.position.z -= 1*this.tamanho;


this.Perna2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5*this.tamanho,1*this.tamanho,0.5*this.tamanho),
  new THREE.MeshLambertMaterial({color: 0xff9d47})
);

this.Perna2.position.x += 2*this.tamanho;
this.Perna2.position.y -= 1*this.tamanho;
this.Perna2.position.z += 1*this.tamanho;

this.Crista = new THREE.Mesh(
  new THREE.BoxGeometry(1.5*this.tamanho, 1*this.tamanho, 0.8*this.tamanho),
  new THREE.MeshLambertMaterial({color: 0xff9d47})
);
this.Crista.position.x -= 4.2*this.tamanho;
this.Crista.position.y += 3*this.tamanho;
  



      //adicionar partes ao passaro
this.Passaro.add(this.Corpo);
this.Passaro.add(this.Asa1);
this.Passaro.add(this.Asa2);
this.Passaro.add(this.Cabeca);
this.Passaro.add(this.Bico);
this.Passaro.add(this.Perna1);
this.Passaro.add(this.Perna2);
this.Passaro.add(this.Crista);

     

this.Passaro.position.y +=2*this.tamanho;
this.Passaro.position.x += 100;


      params.cena.add(this.box);
      params.cena.add(this.Passaro);
      this.start();

      //game over
    }
//som do dinossauro a saltar

    start(){
      //saltar

      setInterval(() => {
        this.update();
      }, 10);
    }


    update(){
      //só atualiza as posições se o jogo ainda nao terminou
      if(this.gameOverPassaro == false){
        if(this.box.position.x + this.vx >= -5){
          this.box.position.x += this.vx;
          //atualizar posição do passaro
          this.Passaro.position.x += this.vx;
          //tem de atualizr o min e max de apenas o x
          this.minX = this.box.position.x -(this.ComprimentoAresta/2) -0.5;//-0.5 por causa das hitbox
          this.maxX = this.box.position.x +(this.ComprimentoAresta/2);
         }else{
           //o cubo desaparece
           this.remover = true;
         }
      }     
  }
    acabouJogo(){
     this.gameOverPassaro = true;
    }
}