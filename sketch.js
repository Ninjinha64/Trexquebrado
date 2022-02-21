//Variáveis

var trex, trex_running,trexcollide;
var edges;
var ground, groundImage;
var InvisibleGround;
var cloud, cloudImage;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var Score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameover,gameoverimg;
var restart,restartimg;
var jumpsound,diesound,checksound;

//Pre carregamento de imagens para criar uma animação em sprites
function preload() {
  //trex
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  trexcollide = loadAnimation ("trex_collided.png");
  //chão
  groundImage = loadImage("ground2.png");

  //nuvem
  cloudImage = loadImage("cloud.png");

  //obstaculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage ("restart.png");

  jumpsound = loadSound ("jump.mp3");
  checksound = loadSound ("checkPoint.mp3");
  diesound = loadSound ("die.mp3");
}


//Configuração
function setup() {
  //Criando a área do jogo
  createCanvas(windowWidth,windowHeight );
  var mensagem = "esta e uma mensagem(>:";
  //console.log (mensagem);
  //chão invisivel 
  

  //criando grupos de obstáculos e nuvens
  obstaculoG = new Group();
  nuvenG = new Group();

  //console.log("olá" + 5);

  gameover = createSprite(width/2,height/2);
  restart = createSprite(width/2,height/2+40);

  gameover.addImage(gameoverimg);
  restart.addImage(restartimg);
  
  gameover.scale = 0.5;
  restart.scale = 0.5;


  gameover.visible = false;
  restart.visible = false;

  // Score = 0;

  //criando o trex
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("faliceu",trexcollide);
  trex.scale = 0.5;

  //Criando as bordas para a área do jogo
  edges = createEdgeSprites();

  //CRIANDO UM SOLO
  ground = createSprite(width/2, height-20, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  InvisibleGround = createSprite(width/2, height-10, 400, 10);
  InvisibleGround.visible = false;

  //números aleatórios
  //var teste = Math.round(random(1, 100));
  //console.log(teste);
  trex.setCollider("circle",0,0,50);
  //trex.debug = true;

}


function draw() {

  background("white");
  //console.log(mensagem);
  text("pontuação: " + Score, width-100, 50);
  
console.log("isto e",gameState);

  if (gameState === PLAY) {
    //mover o solo 
    ground.velocityX = -(4+3*Score/100);
    //pontuação
    Score = Score + Math.round(getFrameRate() / 60);
  if (Score >0&& Score %1000 ===0){
  checksound.play();
     
  }
  
    //Recarregando o chão
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //Fazer o trex pular e voltar (resolução do bug)
    if (touches.length >0 && trex.y >= height-40) {
      trex.velocityY = -10;
      jumpsound.play();
      touches=[];
    }
    //Gravidade
    trex.velocityY = trex.velocityY + 0.5;

    criarNuvem();
    criarobstaculos();

    if (obstaculoG.isTouching(trex)) {
    //trex.velocityY = -10;
    //jumpsound.play();

      gameState = END;
      diesound.play ();
    }
  }

  else if (gameState === END) {
    //parar o solo
    ground.velocityX = 0;
    trex.velocityY = 0;

    trex.changeAnimation("faliceu",trexcollide);

    gameover.visible = true;
    restart.visible = true;

    obstaculoG.setLifetimeEach(-1);
    
    nuvenG.setLifetimeEach(-1);
    
    obstaculoG.setVelocityXEach(0);
    
    nuvenG.setVelocityXEach(0);
 
    if(touches.length>0){
      touches=[];
      reset();
    }

    if (mousePressedOver(restart)){
      //console.log("reiniciar o jogo");

    reset();

    }
  
  }

  trex.collide(InvisibleGround);

  drawSprites();
  }
  function reset(){
  gameState = PLAY;
  gameover.visible = false;
  restart.visible = false;
  obstaculoG.destroyEach();
  nuvenG.destroyEach();
  trex.changeAnimation("running", trex_running);
  Score=0;
  }
  function criarobstaculos() {
  if (frameCount % 60 == 0) {
    var obstaculo = createSprite(width+10, height-35, 10, 40);
    obstaculo.velocityX = -(6 +Score/100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1: obstaculo.addImage(obstaculo1);
        break;

      case 2: obstaculo.addImage(obstaculo2);
        break;

      case 3: obstaculo.addImage(obstaculo3);
        break;

      case 4: obstaculo.addImage(obstaculo4);
        break;

      case 5: obstaculo.addImage(obstaculo5);
        break;

      case 6: obstaculo.addImage(obstaculo6);
        break;

      default: break;
    }
    //atribuir dimensão e tempo de vida ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width+10;

    //adicione cada obstáculo ao grupo
    obstaculoG.add(obstaculo);
  }
}

function criarNuvem() {

  if (frameCount % 60 == 0) {
    cloud = createSprite(width+10, 100, 10, 10);
    cloud.y = Math.round(random(height-150, height-100));
    cloud.addImage("nuvem", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //tempo de vida 
    cloud.lifetime = width+10 ;

    //profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    // console.log(cloud.depth);
    // console.log(trex.depth);

    //adicionar nuvem ao grupo
    nuvenG.add(cloud);

  }
}
