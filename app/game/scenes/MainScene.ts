import { Scene } from 'phaser';

interface GameResult {
  id: number;
  side: 'heads' | 'tails';
  amount: number;
  won: boolean;
  timestamp: Date;
}

export default class MainScene extends Scene {
  private balance: number = 100;
  private betAmount: number = 1;
  private selectedSide: 'heads' | 'tails' = 'heads';
  private isFlipping: boolean = false;
  private coin!: Phaser.GameObjects.Container;
  private coinFace!: Phaser.GameObjects.Text;
  private balanceText!: Phaser.GameObjects.Text;
  private gameHistory: GameResult[] = [];
  private historyTexts: Phaser.GameObjects.Text[] = [];
  private mainContainer!: Phaser.GameObjects.Container;
  private historyContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Set background color
    this.cameras.main.setBackgroundColor(0x282c34);

    // Create containers with fixed positions
    this.historyContainer = this.add.container(20, 20);
    this.mainContainer = this.add.container(300, 0);

    // Create UI elements
    this.createHistory();
    this.createCoin();
    this.createUI();
    this.createButtons();
  }

  private createCoin() {
    // Create coin container with custom class
    this.coin = this.add.container(200, 200);
    this.mainContainer.add(this.coin);

    // Create coin circle with custom styling
    const coinCircle = this.add.circle(0, 0, 60, 0xffd700);
    coinCircle.setData('class', 'game-coin');

    this.coinFace = this.add
      .text(0, 0, '?', {
        fontSize: '40px',
        color: '#000',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.coin.add([coinCircle, this.coinFace]);
  }

  private createUI() {
    // Balance text
    const balanceContainer = this.add.container(0, 0);
    this.balanceText = this.add
      .text(500, 50, `Balance: ${this.balance} FCT`, {
        fontSize: '24px',
        color: '#fff',
      })
      .setOrigin(0.5);
    balanceContainer.add(this.balanceText);

    // Bet amount controls
    const betText = this.add
      .text(200, 350, `Bet Amount: ${this.betAmount} FCT`, {
        fontSize: '20px',
        color: '#fff',
      })
      .setOrigin(0.5);

    const minusBtn = this.add
      .text(150, 400, '-', {
        fontSize: '24px',
        color: '#fff',
      })
      .setOrigin(0.5)
      .setInteractive();

    const plusBtn = this.add
      .text(250, 400, '+', {
        fontSize: '24px',
        color: '#fff',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.mainContainer.add([betText, minusBtn, plusBtn]);

    minusBtn.on('pointerdown', () => {
      this.betAmount = Math.max(1, this.betAmount - 1);
      betText.setText(`Bet Amount: ${this.betAmount} FCT`);
    });

    plusBtn.on('pointerdown', () => {
      this.betAmount = Math.min(this.balance, this.betAmount + 1);
      betText.setText(`Bet Amount: ${this.betAmount} FCT`);
    });
  }

  private createButtons() {
    // Side selection buttons with custom classes
    const headsBtn = this.add
      .rectangle(100, 500, 120, 40, 0x4a5568)
      .setData('class', 'game-button heads');
    const headsBtnText = this.add
      .text(100, 500, 'HEADS', {
        fontSize: '20px',
        color: '#fff',
      })
      .setOrigin(0.5);

    const tailsBtn = this.add
      .rectangle(300, 500, 120, 40, 0x4a5568)
      .setData('class', 'game-button tails');
    const tailsBtnText = this.add
      .text(300, 500, 'TAILS', {
        fontSize: '20px',
        color: '#fff',
      })
      .setOrigin(0.5);

    // Flip button with custom class
    const flipBtn = this.add
      .rectangle(200, 560, 200, 50, 0x48bb78)
      .setData('class', 'game-button flip');
    const flipBtnText = this.add
      .text(200, 560, 'FLIP COIN', {
        fontSize: '24px',
        color: '#fff',
      })
      .setOrigin(0.5);

    this.mainContainer.add([headsBtn, headsBtnText, tailsBtn, tailsBtnText, flipBtn, flipBtnText]);

    // Make buttons interactive with hover effects
    [headsBtn, tailsBtn, flipBtn].forEach((btn) => {
      btn
        .setInteractive()
        .on('pointerover', () => {
          btn.setScale(1.05);
        })
        .on('pointerout', () => {
          btn.setScale(1);
        });
    });

    headsBtn.on('pointerdown', () => {
      this.selectedSide = 'heads';
      headsBtn.setFillStyle(0x2b6cb0);
      tailsBtn.setFillStyle(0x4a5568);
    });

    tailsBtn.on('pointerdown', () => {
      this.selectedSide = 'tails';
      tailsBtn.setFillStyle(0x2b6cb0);
      headsBtn.setFillStyle(0x4a5568);
    });

    flipBtn.on('pointerdown', () => this.handleBet());
  }

  private createHistory() {
    // History background with custom class
    const historyBg = this.add
      .rectangle(120, 350, 220, 660, 0x1a202c)
      .setOrigin(0.5)
      .setData('class', 'game-history');

    const historyTitle = this.add
      .text(120, 40, 'Game History', {
        fontSize: '20px',
        color: '#fff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.historyContainer.add([historyBg, historyTitle]);
  }

  private handleBet() {
    if (this.isFlipping || this.balance < this.betAmount) return;

    this.isFlipping = true;
    this.balance -= this.betAmount;
    this.balanceText.setText(`Balance: ${this.balance} FCT`);

    // Hide the coin text during animation
    this.coinFace.setVisible(false);

    // Animate coin flip
    this.tweens.add({
      targets: this.coin,
      scaleX: 0,
      duration: 150,
      yoyo: true,
      repeat: 10,
      ease: 'Linear',
      onComplete: () => this.completeBet(),
    });
  }

  private completeBet() {
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    this.coinFace.setText(result.toUpperCase());
    this.coinFace.setVisible(true);

    const won = result === this.selectedSide;
    if (won) {
      this.balance += this.betAmount * 2;
      this.balanceText.setText(`Balance: ${this.balance} FCT`);
    }

    const gameResult: GameResult = {
      id: Date.now(),
      side: this.selectedSide,
      amount: this.betAmount,
      won,
      timestamp: new Date(),
    };

    this.gameHistory.unshift(gameResult);
    this.gameHistory = this.gameHistory.slice(0, 10);
    this.updateHistoryDisplay();

    this.isFlipping = false;
  }

  private updateHistoryDisplay() {
    // Clear existing history texts
    this.historyTexts.forEach((text) => text.destroy());
    this.historyTexts = [];

    // Add new history entries
    this.gameHistory.forEach((result, index) => {
      const text = this.add.text(
        20,
        80 + index * 40,
        `${result.side.toUpperCase()} - ${result.amount} FCT\n${result.won ? 'WON' : 'LOST'}`,
        {
          fontSize: '14px',
          color: result.won ? '#48bb78' : '#f56565',
          align: 'left',
        }
      );
      this.historyContainer.add(text);
      this.historyTexts.push(text);
    });
  }
}
