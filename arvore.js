export {Arvore};

class Arvore{
  constructor(params){

    this.tamanho = params.tamanho;
    this.arvore = new THREE.Group();

    this.folhas = new THREE.Mesh(
        new THREE.SphereGeometry(1*this.tamanho, 3*this.tamanho, 3*this.tamanho),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );

    this.folhas.position.y = 1.4*this.tamanho;

    this.tronco = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1*this.tamanho,0.2*this.tamanho,1*this.tamanho),
        new THREE.MeshLambertMaterial({color: 0x964B00})
    );

    this.arvore.add(this.folhas);
    this.arvore.add(this.tronco);
      

        //mudar a posição da arvore
        this.arvore.position.x = params.x;
        this.arvore.position.y = params.y;
        this.arvore.position.z = params.z;
      params.cena.add(this.arvore);
     
    }


}

