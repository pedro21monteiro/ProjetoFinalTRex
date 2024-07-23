export {Cato};

class Cato{
    constructor(params){

        this.pos = {x:0, y:0, z:0};
        this.vx = -params.vx;//velocidade
        this.nome = "Cato";
        //distancia do objeto ao dino
        this.distancia = 100;

        this.gameOverCato = false;
        this.remover = false;
        this.ComprimentoAresta = 5;
        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(this.ComprimentoAresta,this.ComprimentoAresta,this.ComprimentoAresta),
            new THREE.MeshStandardMaterial({color:0x8080FF}),
        );

        this.box.position.x += this.distancia;
        this.box.position.y +=1.5;//1
        //meter a box invisivel
        this.box.visible = false;

        //minimos
    this.minX = this.box.position.x -(this.ComprimentoAresta/2);
    this.minY = this.box.position.y -(this.ComprimentoAresta/2);
    this.minZ = this.box.position.z -(this.ComprimentoAresta/2);
    //maximos
    this.maxX = this.box.position.x +(this.ComprimentoAresta/2);
    this.maxY = this.box.position.y +(this.ComprimentoAresta/2);
    this.maxZ = this.box.position.z +(this.ComprimentoAresta/2);
   
     
    //gerar o cato--------------------------------------------------
    this.tamanho = 0.6;
    this.Cato = new THREE.Group();
    this.cilindroT = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8*this.tamanho,0.8*this.tamanho,5*this.tamanho,20*this.tamanho),
      new THREE.MeshStandardMaterial({color:0x00FF00})
    );
    this.cilindroT.position.set(0.5*this.tamanho,1*this.tamanho,0*this.tamanho);

    this.cilindroE = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8*this.tamanho,0.8*this.tamanho,5*this.tamanho,20*this.tamanho),
      new THREE.MeshStandardMaterial({color:0x00FF00})
    );
    this.cilindroE.position.set(-1*this.tamanho,3*this.tamanho,0*this.tamanho);
    //this.cilindroE.rotation.y += 3Math.PI/2;

    this.cilindroD = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8*this.tamanho,0.8*this.tamanho,5*this.tamanho,20*this.tamanho),
      new THREE.MeshStandardMaterial({color:0x00FF00})
    );
    this.cilindroD.position.set(2*this.tamanho,5*this.tamanho,0);

      //adicionar os cilindros ao cato
      this.Cato.add(this.cilindroT);
      this.Cato.add(this.cilindroE);
      this.Cato.add(this.cilindroD);

      this.Cato.position.x += this.distancia;

      //-------------------------------------------------
        params.cena.add(this.box);
        params.cena.add(this.Cato);
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
        if(this.gameOverCato == false){
          if(this.box.position.x + this.vx >= -5){
            this.box.position.x += this.vx;
            //alterar o cato
            this.Cato.position.x += this.vx;
            //tem de atualizr o min e max de apenas o x
            this.minX = this.box.position.x -(this.ComprimentoAresta/2);
            this.maxX = this.box.position.x +(this.ComprimentoAresta/2);
           }else{
             //o cubo desaparece
             this.remover = true;
           }
        }      
    }
    acabouJogo(){
      this.gameOverCato = true;
    }

  
}