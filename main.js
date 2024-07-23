import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { Dinossauro} from "./dinossauro.js";
import { Cato } from './cato.js';
import { Passaro } from './passaro.js';
import { background } from './background.js';
import { Arvore } from './arvore.js';
//import { worldManager } from "./worldManager.js";

const _VS = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;


  const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth-15,window.innerHeight-20);

 document.body.appendChild(renderer.domElement);




 //camara----------------------------------
 const fov = 60;
 const aspect = 1920/1080; 
 const near = 1.0
 const far = 1000.0;

 var camara = new THREE.PerspectiveCamera(fov,aspect,near,far);
 camara.position.set(75,20,10);
 camara.position.x = -40.80913718739588;
 camara.position.z = 19.487611423718352;

 //camara ortografica
var camaraO = new THREE.OrthographicCamera(-80,200,80,-50,-20,1000);
camaraO.position.set(-20,-10,0);

//----------------------------------




var cena = new THREE.Scene();


//LUZES
var dlight = new THREE.DirectionalLight(0xFFFFFF,1.0);
dlight.position.set(30,100,10);
dlight.target.position.set(0,0,0);
cena.add(dlight);


const lightG = new THREE.PointLight( 0x00FF00, 1, 100 );
lightG.position.set( 20,8,-15 );
cena.add( lightG );
lightG.visible= true;

const lightR = new THREE.PointLight( 0xff0000, 1, 100 );
lightR.position.set( 20,12,-15 );
cena.add( lightR );
lightR.visible= false;

//criar o semaforo
semaforo();


var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
ambientLight.castShadow = true;
cena.add(ambientLight);


//camara mexer

const controls = new OrbitControls(camara,renderer.domElement);
controls.target.set(0,0,0);
controls.update();


// mundo
cena.background = new THREE.Color(0x808080);
cena.fog = new THREE.FogExp2(0x89b2eb, 0.00125);

const uniforms = {
  topColor: { value: new THREE.Color(0x0077FF) },
  bottomColor: { value: new THREE.Color(0x89b2eb) },
  offset: { value: 33 },
  exponent: { value: 0.6 }
};
const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: _VS,
    fragmentShader: _FS,
    side: THREE.BackSide,
});
cena.add(new THREE.Mesh(skyGeo, skyMat));

//cria um plano e adciona a cena
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2000,2000,10,10),
    new THREE.MeshStandardMaterial({color:0xf6f47})
);
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI/2;
plane.position.set(0,-1,0);
cena.add(plane);

//gerar chao
var Chao = new THREE.Mesh(
  new THREE.BoxGeometry(400,2,1),
  new THREE.MeshStandardMaterial({color:0x80FF80}),
);
Chao.position.y = -3;
Chao.position.x =20;

cena.add(Chao);


//sons
var audioGameOver = new Audio('/Sons/GameOver.mp3');
var SomJogo = new Audio('/Sons/AlarmeEminem.wav');
//variaveis necessárias
var gameOver = false;

//------------------------------DICIONAR OBJETOS AO MUNDO----------------------------------
var dino = new Dinossauro({cena:cena});
//adicionar arvores ao model
var arvore1 = new Arvore({cena:cena,x:-20,y:1,z:30,tamanho:6});
var arvore2 = new Arvore({cena:cena,x:40,y:1,z:-60,tamanho:6});
var arvore3 = new Arvore({cena:cena,x:200,y:1,z:-120,tamanho:6});
var arvore4 = new Arvore({cena:cena,x:400,y:1,z:-20,tamanho:6});
var arvore4 = new Arvore({cena:cena,x:100,y:1,z:20,tamanho:6});


//criar vetor de catos
var catos = [];
var passaros = [];
var nuvens = [];

var velocidade = 0.3;// velocidade inicial
var tempoGerarObjeto = 4000;

var pontos = 0;
var musica = false;
var c = 0;


Main_start();
//var cato = new Cato({cena:cena});

//--------------------------FUNÇÔES--------------------------------------------------
//funçao para adicionar obstaculos

function Main_start(){

  document.addEventListener('keydown',ev => {

    //click c para mudar camara
    if(ev.keyCode == 67 ){
      if(c==0){
        c=1;
      }else{
        c=0;
      }
    }
    //click enter para reiniciar
    if(ev.keyCode == 13 ){ 
      ReiniciarJogo();    
    }
    // apagarLuzes no "l"
    if(ev.keyCode == 76 ){
      apagarLuzes();
      }
      //Ativar musica do jogo "m"
      if(ev.keyCode == 77 ){ 
        ClickMusica();
      }
  });


 setTimeout(() => {
  if(gameOver == false)
  adicionarObstaculos();
 }, tempoGerarObjeto);

 //experimentar posição da camar
 //setInterval(() => {
 // console.log("x:" +camara.position.x)
 // console.log("y:" +camara.position.z)
//}, 20);
  //intervalo de tempo para verifica se houve coliçõ
  setInterval(() => {
    if(gameOver == false){
      VerificarColisao_Main();
    }
  }, 20);//de 0.02 em 0.02 segundo verificar se houve colição


//intervalo de adicionar pontos
  setInterval(() => {
    if(gameOver == false){
      AdicionarPontos();
    }
  }, 100);//de 0.1 em 0.1 segundo verificar se houve colição

  setInterval(() => {
    if(gameOver == false){
      adicionarNuvens();
    }
  }, 350);
}

//-----------------------------ADICIONAR OBSTACULOS-------------------------------
function adicionarObstaculos(){

  if(gameOver == false){

 //probabilidade do passaro vai ser 1/5
 if(getRandomInt(1, 5) == 1){
  //adicionar passaros
  passaros.push(new Passaro({cena:cena,vx:velocidade}));

}else{
  //adicionar catos
  catos.push(new Cato({cena:cena,vx:velocidade}));
  
} 

//sempre que for adicionado obstaculos a velocidade vai aumentar
if(velocidade <= 0.5){
    //a velocidade vai aumentr
    velocidade += 0.01;
    
}

if(tempoGerarObjeto > 1200){
  tempoGerarObjeto -= 100;
  }

 setTimeout(() => {
   if(gameOver == false)
   adicionarObstaculos();
 }, tempoGerarObjeto);

}

}
//-------------------------------------------------------------------------------
function adicionarNuvens(){
  nuvens.push(new background({cena:cena}));
}


function VerificarColisao_Main(){

for(let c of catos){
    verificarColicaoObstaculo(c);
    verificarSeObstaculoChegouAoFim(c);
}
//só faz a verificaçao dos passaros se o jogo ainda não tiver acabado

  for(let p of passaros){
    verificarColicaoObstaculo(p);
    verificarSeObstaculoChegouAoFim(p);
  }

}

function verificarSeObstaculoChegouAoFim(obstaculo){
  if(obstaculo.remover == true){
    //verificar se é cato ou passaro
    if(obstaculo.nome == "Cato"){
      cena.remove(obstaculo.box);
      cena.remove(obstaculo.Cato)
    }
    if(obstaculo.nome == "Passaro"){
      cena.remove(obstaculo.box);
      cena.remove(obstaculo.Passaro);
    }
    
  }
}

function verificarColicaoObstaculo(obstaculo){

  if(dino.VerificarColisao(obstaculo)){
    gameOver = true;
    document.getElementById('gameOverLabel').style.visibility = "visible";
    //para o som do jogo
    SomJogo.pause();
    //reiniciar o som
    SomJogo.currentTime = 0;
    //--
    audioGameOver.play();
    dino.acabouJogo();

    for(let c of catos){
      c.acabouJogo();
    }

    for(let p of passaros){
      p.acabouJogo();
    }

    for(let n of nuvens){
      n.acabouJogo();
    }
  }

}

//funçao reiniciar jogo
function ReiniciarJogo(){

  //O reiniciar só pode funcionar se o jogo já tiver terminado
  if(gameOver == true){
    //vai ter de apagar todos os objetos(dino, passaros e catos) da cena
    //apagar dino
    cena.remove(dino.box);
    cena.remove(dino.DinoObjeto);
   //apagar catos
   for(let c of catos){
    cena.remove(c.box);
    cena.remove(c.Cato);
 }   
 //apagar passaros
  for(let p of passaros){
    cena.remove(p.box);
    cena.remove(p.Passaro);
  }

  for(let n of nuvens){
    n.removerNuvem();
  }

  //limpar os vetores catos e os passaros
  //dino.pop();
  catos.pop();
  passaros.pop();
  catos = [];
  passaros = [];

  //parar o som
  audioGameOver.pause();
  //reiniciar o som
  audioGameOver.currentTime = 0;

  //começa o som do jogo de novo
  if(musica == true){
    SomJogo.play();
  }

  //adicionar o dino de novo
  dino = new Dinossauro({cena:cena})
   //passa o gameover para false
   gameOver = false;
  //adicionasse os obstaculos
  adicionarObstaculos();
  //dessaparece o texto a dizer gameover
  document.getElementById('gameOverLabel').style.visibility = "hidden";
  //reinicia o score
  pontos = 0;
  //reiniciar tempo do objeto
  tempoGerarObjeto = 4000;
  //reiniciar a velocidade
  velocidade = 0.15;
  //passa o gameover para false
  gameOver = false;

  }

}
//-----------------------------Função Apagar luz------------------------

function apagarLuzes(){
  var count = 0;

        if(dlight.visible == true){
          dlight.visible = false;
          ambientLight.visible = false;
          }else{
            dlight.visible = true;
            ambientLight.visible = true;
          }
      
      if(lightG.visible == true){
              lightR.visible = true;
              lightG.visible = false;
              count++;
              ambientLight.visible = true;

          }else{
              lightR.visible = false;
              lightG.visible = true;
              count++;
              ambientLight.visible = true;
          }

          if(count == 3){
              lightG.visible = false;
              lightR.visible = false;
              count =0;
              ambientLight.visible = false;
          }

}

//gerar semaforo
function semaforo(){

  const semaforo = new THREE.Group();

  const cilindro = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 8, 20),
      new THREE.MeshStandardMaterial({color:0xc6c7c3})
  );
  cilindro.position.set(20,3,-20);

  const retangulo = new THREE.Mesh(
      new THREE.BoxGeometry(3,7,4),
      new THREE.MeshStandardMaterial({color:0x171716})
  );
  retangulo.position.set(20,10,-20);

  //vermelho
  const circuloR = new THREE.Mesh(
      new THREE.CircleGeometry(1,32),
      new THREE.MeshStandardMaterial({color:0xf00a0a})
  );
  circuloR.position.set(20,12,-17.95);

  //verde
  const circuloG = new THREE.Mesh(
      new THREE.CircleGeometry(1,32),
      new THREE.MeshStandardMaterial({color:0x00FF00})
  );
  circuloG.position.set(20,8,-17.95);

  semaforo.add(cilindro);
  semaforo.add(retangulo);
  semaforo.add(circuloR);
  semaforo.add(circuloG);

  cena.add(semaforo);

}

function AdicionarPontos(){
 pontos += 1;

 var text = document.getElementById("pontos").innerHTML = pontos + " Pontos";
}

//função ligar e desligar musica
function ClickMusica(){

  if(musica == false){
    musica = true;
    SomJogo.play();
  }else{
    musica = false;
    SomJogo.pause();
    //reiniciar o som
    SomJogo.currentTime = 0;
  }

}

//funçao aleatoria
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//var w = new worldManager({cena:cena});
requestAnimationFrame(_RAF);



function _RAF(){
  if(c==0){
    renderer.render(cena,camara);
 
  }else{

    renderer.render(cena,camaraO);
  }

    requestAnimationFrame(_RAF);
}






