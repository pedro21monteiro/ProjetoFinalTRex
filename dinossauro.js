export {Dinossauro};

class Dinossauro{
    constructor(params){
        this.pos = {x:0, y:0, z:0};
        this.alturaInicial = 1;
        this.vy = 0;//velocidade
        this.gravity = -0.02;//gravidade
        this.ComprimentoAresta = 4;
        //variavel game over para nao deixar o dino saltar depois de terminar o jogo
        this.gameOverDino = false;

       this.box = new THREE.Mesh(
            new THREE.BoxGeometry(this.ComprimentoAresta,this.ComprimentoAresta,this.ComprimentoAresta),
            new THREE.MeshStandardMaterial({color:0x80FF80}),
       );
       this.box.position.y += this.alturaInicial;//1.5
      this.box.visible = false;
       

    //minimos
    this.minX = this.box.position.x -(this.ComprimentoAresta/2);
    this.minY = this.box.position.y -(this.ComprimentoAresta/2);
    this.minZ = this.box.position.z -(this.ComprimentoAresta/2);
    //maximos
    this.maxX = this.box.position.x +(this.ComprimentoAresta/2);
    this.maxY = this.box.position.y +(this.ComprimentoAresta/2);
    this.maxZ = this.box.position.z +(this.ComprimentoAresta/2);
    //maximos

    //objeto dino
    this.tamanho = 0.5;

    this.DinoObjeto = new THREE.Group();
    this.tamanho = 1;
   
    this.Corpo = new THREE.Mesh(
      new THREE.BoxGeometry(3.5*this.tamanho,2*this.tamanho,2*this.tamanho),
      new THREE.MeshLambertMaterial({color: 0x524236})
  ); 
  this.Corpo.position.y += 2;
  this.Corpo.rotation.z =(Math.PI / 8);
  
  this.Cauda = new THREE.Mesh(
    new THREE.ConeGeometry(0.5*this.tamanho, 5*this.tamanho, 5*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x524236})
  );
  this.Cauda.position.y += 2.8*this.tamanho;
  this.Cauda.position.x -= 4*this.tamanho;
  this.Cauda.rotation.z =(3 * Math.PI / 8);
  
  //pernas
  this.Perna1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5*this.tamanho,1.5*this.tamanho,0.5*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x524236})
  );
  this.Perna1.position.x -= 1.25*this.tamanho;
  this.Perna1.position.y += 0*this.tamanho;
  this.Perna1.position.z -= 0.7*this.tamanho;
  
  
  this.Perna2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5*this.tamanho,1.5*this.tamanho,0.5*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x524236})
  );
  
  this.Perna2.position.x -= 1.25*this.tamanho;
  this.Perna2.position.y += 0*this.tamanho;
  this.Perna2.position.z += 0.7*this.tamanho;
  
  //pescoço
  
  this.Pescoco = new THREE.Mesh(
    new THREE.BoxGeometry(0.8*this.tamanho,1.4*this.tamanho,0.8*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x524236})
  ); 
  this.Pescoco.position.x += 1.3;
  this.Pescoco.position.y += 3.5;
  
  
  this.Cabeca = new THREE.Mesh(
    new THREE.BoxGeometry(2*this.tamanho,1.4*this.tamanho,1.4*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x524236})
  ); 
  this.Cabeca.position.x += 2;
  this.Cabeca.position.y += 4.5;
  this.Cabeca.rotation.z = - (Math.PI / 8);
  
  
  //braco
  
  this.Braco1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5*this.tamanho,1*this.tamanho,0.5*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x524236})
  );
  this.Braco1.position.x += 1.9*this.tamanho;
  this.Braco1.position.y += 1.2*this.tamanho;
  this.Braco1.position.z += 0.7*this.tamanho;
  
  
  this.Braco2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5*this.tamanho,1*this.tamanho,0.5*this.tamanho),
    new THREE.MeshLambertMaterial({color: 0x524236})
  );
  
  this.Braco2.position.x += 1.9*this.tamanho;
  this.Braco2.position.y += 1.2*this.tamanho;
  this.Braco2.position.z -= 0.7*this.tamanho;
  
  
  //adicion
  this.DinoObjeto.add(this.Corpo);
  this.DinoObjeto.add(this.Cauda);
  this.DinoObjeto.add(this.Perna1);
  this.DinoObjeto.add(this.Perna2);
  this.DinoObjeto.add(this.Pescoco);
  this.DinoObjeto.add(this.Cabeca);
  this.DinoObjeto.add(this.Braco1);
  this.DinoObjeto.add(this.Braco2);



        this.audioJump = new Audio('/Sons/jumpDinoSond.mp3');
        params.cena.add(this.box);
        params.cena.add(this.DinoObjeto);
        this.start();

      }
  //som do dinossauro a saltar
 
      start(){
        //saltar
        document.addEventListener('keydown',ev => {
          if(ev.keyCode == 32 ){
           this.jump();
          }
        });


        setInterval(() => {
          this.update();
        }, 10);
      }

      update(){
        if(this.gameOverDino == false){
          if(this.box.position.y + this.vy >= this.alturaInicial){
            this.box.position.y += this.vy;
            this.DinoObjeto.position.y += this.vy;
            this.vy += this.gravity;
            //atualizar minimo e maximo
            this.minY = this.box.position.y -(this.ComprimentoAresta/2);
            this.maxX = this.box.position.x +(this.ComprimentoAresta/2);
           }else{
                this.box.position.y = this.alturaInicial;
                this.DinoObjeto.position.y = this.alturaInicial;
                this.vy = 0;      
           }
        }         
    }

    jump(){
      if(this.gameOverDino == false){
        if(this.box.position.y == this.alturaInicial){
          this.vy = 1; 
          this.audioJump.play();
     }
      }
       
    }

    
    VerificarColisao(b) {//b de obstaculo
        if((this.minX <= b.maxX && this.maxX >= b.minX) &&
               (this.minY <= b.maxY && this.maxY >= b.minY) &&
               (this.minZ <= b.maxZ && this.maxZ >= b.minZ)){
                return true;//se colidiu sai true
               }
               else{
                   return false;
            }//se nao colidiu sai false
      }

      acabouJogo(){
        this.gameOverDino = true;
      }
}


