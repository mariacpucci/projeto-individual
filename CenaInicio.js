//Define a classe CenaInicio, que estende a classe Scene do Phaser, usada para criar uma cena específica do jogo
class CenaInicio extends Phaser.Scene {
    constructor() {
        super({key:'CenaInicio'}); //chama o contrutor da classe com uma chave única para esta cena
    }
    preload(){
        //carrega as imagens antes de criar a cena
        this.load.image('fundo','assets/ceu2.jpg'); // imagem de fundo
    }

    create() {
        // inicia o jogo e cria os objetos

        //adciona a imagem de fundo da cena
        this.add.image(400, 300, 'fundo'); 

        //adciona o texto Coletar os Diamantes
        this.add.text(400, 300, 'Coletar os Diamantes', { fontSize: '32px', fill: '#6B238E' }).setOrigin(0.5);

        //cria um botão de texto interativo para começar o jogo
        let botaoComecar = this.add.text(400, 400, 'Começar', { fontSize: '24px', fill: '#6B238E' }).setOrigin(0.5);
        
        // torna o botão interativo
        botaoComecar.setInteractive({ useHandCursor: true });

        // defini que quando clicar no botão vai iniciar a proxima cena (CenaJogo)
        botaoComecar.on('pointerdown', () => this.scene.start('CenaJogo'));
    }
}
