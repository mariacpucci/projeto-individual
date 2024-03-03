//define a classe CenaJogo, que estende a classe Scene do Phaser para criar uma cena do jogo
class CenaJogo extends Phaser.Scene {
    //construtor da classe
    constructor() {
        super({ key: 'CenaJogo' }); // chama o construtor da classe pai como uma chave única para a cena
    }

    preload() {
        //carrega as imagens antes de criar a cena
        this.load.image('fundo', 'assets/ceu2.jpg'); // imagem de fundo
        this.load.image('plataforma', 'assets/plataforma.png'); // imagem da plataforma
        this.load.image('diamante', 'assets/diamante.png'); // imagem do diamante
        this.load.image('veneno', 'assets/veneno.png'); // imagem do veneno
        this.load.spritesheet('dude', 'assets/player.png', { frameWidth: 64, frameHeight: 64 }); //sprite sheet do jogador e as dimensões
    }

    create() {
        // inicia o jogo e cria os objetos

        //adciona a imagem de fundo da cena
        this.add.image(400, 300, 'fundo');

        //adciona as imagens das plataformas e o lugar que elas vão estar
        this.plataformas = this.physics.add.staticGroup();
        this.plataformas.create(400, 568, 'plataforma').setScale(2, 0.5).refreshBody();
        this.plataformas.create(100, 450, 'plataforma').setScale(0.2).refreshBody();
        this.plataformas.create(700, 450, 'plataforma').setScale(0.2).refreshBody();
        this.plataformas.create(400, 300, 'plataforma').setScale(0.2).refreshBody();
        this.plataformas.create(200, 150, 'plataforma').setScale(0.2).refreshBody();
        this.plataformas.create(600, 130, 'plataforma').setScale(0.2).refreshBody();

        //adiciona a sprite sheet do jogador e configura suas propriedades físicas, como rebote e colisão com as bordas do mundo
        this.jogador = this.physics.add.sprite(100, 450, 'dude');
        this.jogador.setBounce(0.2);
        this.jogador.setCollideWorldBounds(true);

        // adiciona colisor entre o jogador e as plataformas
        this.physics.add.collider(this.jogador, this.plataformas);

        //define as animações do jogador para esquerda
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        //define as animações do jogador parado
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 0 }],
            frameRate: 20
        });

        //define as animações do jogador para direita
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        //configura o teclado para controlar o jogador
        this.teclado = this.input.keyboard.createCursorKeys();

        // cria uma lista para o diamante do jogo
        this.listaDeDiamantes = []; 

        // criando um único diamante com propriedades físicas 
        let diamanteMovel = this.physics.add.sprite(Phaser.Math.Between(0, 800), 16, 'diamante');
        diamanteMovel.setBounce(1);
        diamanteMovel.setCollideWorldBounds(true);
        diamanteMovel.setVelocity(Phaser.Math.Between(-200, 200), 20);
        diamanteMovel.allowGravity = false;
        diamanteMovel.setScale(0.05); // ajuste o tamanho conforme necessário
        
        // adiciona o diamante móvel à lista
        this.listaDeDiamantes.push(diamanteMovel);
        
        // colisores e sobreposições para o diamante
        this.physics.add.collider(diamanteMovel, this.plataformas);
        this.physics.add.overlap(this.jogador, diamanteMovel, this.coletarDiamante, null, this);
        
        //cria e configura os venenos
        this.venenos = this.physics.add.group(); // cria um grupo para os venenos

        //configura cada um dos venenos dentro desse grupo
        this.venenos.children.iterate(function(child) {
            child.setBounce(1);
            child.setCollideWorldBounds(true);
            child.setVelocity(Phaser.Math.Between(-200, 200), 20);
            child.allowGravity = false;
            child.setScale(0.05); // ajustando o tamanho dos venenos para serem iguais aos diamantes
        });


        // colisores e sobreposições para i veneno
        this.physics.add.collider(this.venenos, this.plataformas);
        this.physics.add.collider(this.jogador, this.venenos, this.tocarVeneno, null, this);

        // configura a pontuação 
        this.pontuacao = 0;
        this.pontuacaoTexto = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#6B238E' });
    }

    update() {
        // atualiza a lógica do jogo

        //controla o movimento do jogador com base na entrada do teclado
        //movimento para esquerda
        if (this.teclado.left.isDown) {
            this.jogador.setVelocityX(-160);
            this.jogador.anims.play('left', true);
        //movimento para direita 
        } else if (this.teclado.right.isDown) {
            this.jogador.setVelocityX(160);
            this.jogador.anims.play('right', true);
        //fica para olhando para frentw
        } else {
            this.jogador.setVelocityX(0);
            this.jogador.anims.play('turn');
        }

        // permite o jogador pular quando tiver tocando no chão ou em alguma das plataformas
        if (this.teclado.up.isDown && this.jogador.body.touching.down) {
            this.jogador.setVelocityY(-330);
        }
    }


    // método de coleta do diamante
    coletarDiamante(jogador, diamante) {
        diamante.disableBody(true, true);

        this.pontuacao += 1; // adiciona a física
        this.pontuacaoTexto.setText('Pontuação: ' + this.pontuacao);

        // reativa o diamante móvel em uma nova posição depois de coletado
        let x = Phaser.Math.Between(0, 800);
        let y = 16;
        diamante.enableBody(true, x, y, true, true);
        diamante.setVelocity(Phaser.Math.Between(-200, 200), 20);

        // cria um veneno toda vez que o diamante for coletado
        var X = (this.jogador.X < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var veneno = this.venenos.create(x, 16, 'veneno');
        veneno.setBounce(1);
        veneno.setCollideWorldBounds(true);
        veneno.setVelocity(Phaser.Math.Between(-200, 200), 20);
        veneno.allowGravity = false;
        veneno.setScale(0.06);
    }

    // quando o jogador toca no veneno
    tocarVeneno(jogador, veneno) {
        this.physics.pause(); // pausa a física do jogo

        jogador.setTint(0xff0000);
        jogador.anims.play('turn');

        this.scene.start('CenaGameOver', { pontuacao: this.pontuacao }); // inicia a próxima cena do jogo(CenaGameOver)
    }
}
