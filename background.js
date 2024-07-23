
export {background};

class background{
    constructor(param){
        this.pos = new THREE.Vector3();
        this.p = param;
        this.gameOver = false;
        this.nuvens();
    }


    nuvens(){
        this.nuvem = new THREE.Mesh(
            new THREE.BoxGeometry(50,50,100),
            new THREE.MeshStandardMaterial({color:0xffffff})
        );
        this.nuvem.position.x = this.randomInteger(0,1000);
        this.nuvem.position.y = this.randomInteger(70,80);
        this.nuvem.position.z = this.randomInteger(500,-1000);


        this.p.cena.add(this.nuvem);
        setInterval(() => {
            this.update();
        }, 10);

    }

    update(){
        if(this.gameOver == false){

            this.nuvem.position.x += -0.5;
        if(this.nuvem.position.x < -100){
            this.p.cena.remove(this.nuvem);
        } 
        }
    }
    acabouJogo(){
        this.gameOver = true;
    }

    removerNuvem(){
        this.p.cena.remove(this.nuvem);
    }

    randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
}