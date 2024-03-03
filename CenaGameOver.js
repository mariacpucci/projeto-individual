//define a classe CenaGameOver, que estende a classe Scene do Phaser,  para criar uma cena específica de game over
class CenaGameOver extends Phaser.Scene {
    //construtor da classe
    constructor() {
        super({key:'CenaGameOver'}); // chama o construtor da classe pai como chave única para cada cena
    }

    init(data) {
        // recebe os dados anteriores a cena
        // recebe a pontuação da cena anterios para exibir nessa nova cena
        this.pontuacao = data.pontuacao; 
    }

    preload(){
        //preload das imagens
        this.load.image('fundo','assets/ceu2.jpg'); //carrega imagem de fundo
    }

    create() {
        // inicia o jogo e cria os objetos

        //adciona a imagem de fundo da cena
        this.add.image(400, 300, 'fundo');

        // adiciona o texto game over e o posiciona 
        this.add.text(400, 300, 'Game Over', { fontSize: '32px', fill: '#6B238E' }).setOrigin(0.5);
        // adiciona o texto mostrando a pontuação final e o posiciona
        this.add.text(400, 350, `Pontuação: ${this.pontuacao}`, { fontSize: '24px', fill: '#6B238E' }).setOrigin(0.5);
        // adiciona um botão para reniciar o jogo e o posiciona
        let botaoReiniciar = this.add.text(400, 400, 'Reiniciar', { fontSize: '24px', fill: '#6B238E' }).setOrigin(0.5);
        // torna o botão interativo
        botaoReiniciar.setInteractive({ useHandCursor: true });
        // vai voltar para a CenaJogo o reiniciando quando o texto é clicado
        botaoReiniciar.on('pointerdown', () => this.scene.start('CenaJogo'));
    }
}
