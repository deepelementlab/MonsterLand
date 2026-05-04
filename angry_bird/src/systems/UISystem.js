/**
 * UI系统模块 - Airbnb风格
 * 处理所有UI界面逻辑，包括游戏界面、结果界面、分数弹窗和UI状态更新
 * 设计风格: warm_marketplace, rounded_soft, lifestyle_commerce
 */
import { COLORS, POSITIONS, TEXT_STYLES, GAME_STATES, BUTTON_STATES } from '../utils/constants.js';

/**
 * 创建Airbnb风格圆角按钮 (Rectangle + Text组合)
 */
function createAirbnbButton(scene, x, y, text, bgColor, options) {
    if (!options) options = {};
    var fontSize = options.fontSize || '24px';
    var fontFamily = options.fontFamily || 'Arial';
    var textColor = options.textColor || '#FFFFFF';
    var borderRadius = options.borderRadius || 20;
    var padding = options.padding || { x: 30, y: 15 };
    var width = options.width || null;
    var height = options.height || null;

    var container = scene.add.container(x, y);
    
    var textObj = scene.add.text(0, 0, text, {
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: textColor
    }).setOrigin(0.5);
    
    var btnWidth = width || (textObj.width + padding.x * 2);
    var btnHeight = height || (textObj.height + padding.y * 2);
    
    var shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.1);
    shadow.fillRoundedRect(-btnWidth / 2, -btnHeight / 2 + 3, btnWidth, btnHeight, borderRadius);
    
    var bg = scene.add.graphics();
    var baseColor = Phaser.Display.Color.HexStringToColor(bgColor).color;
    bg.fillStyle(baseColor, 1);
    bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, borderRadius);
    
    container.add(shadow);
    container.add(bg);
    container.add(textObj);
    
    var hitArea = scene.add.rectangle(0, 0, btnWidth, btnHeight, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);
    
    hitArea.on('pointerover', function() {
        scene.tweens.add({
            targets: container, scaleX: 1.05, scaleY: 1.05,
            duration: 150, ease: 'Back.easeOut'
        });
    });
    
    hitArea.on('pointerout', function() {
        scene.tweens.add({
            targets: container, scaleX: 1, scaleY: 1,
            duration: 150, ease: 'Back.easeOut'
        });
    });
    
    hitArea.on('pointerdown', function() {
        scene.tweens.add({
            targets: container, scaleX: 0.95, scaleY: 0.95,
            duration: 80, ease: 'Quad.easeIn'
        });
    });
    
    hitArea.on('pointerup', function() {
        scene.tweens.add({
            targets: container, scaleX: 1, scaleY: 1,
            duration: 100, ease: 'Back.easeOut'
        });
    });
    
    container.hitArea = hitArea;
    container.bgGraphics = bg;
    container.textObj = textObj;
    container._btnWidth = btnWidth;
    container._btnHeight = btnHeight;
    container._borderRadius = borderRadius;
    container._bgColor = bgColor;
    
    return container;
}

export class UISystem {
    constructor(scene) {
        this.scene = scene;
        this.currentLevel = 1;
        this.levelData = null;
        this.scoreText = null;
        this.birdQueueText = null;
        this.pauseButton = null;
        this.levelText = null;
        this.resultOverlay = null;
        this.resultCard = null;
        this.resultTitle = null;
        this.resultScoreText = null;
        this.resultStarsText = null;
        this.resultButtons = [];
        this.pauseOverlayContainer = null;
        this.scorePopups = [];
    }
    
    init(config) {
        if (!config) config = {};
        if (config.level) this.currentLevel = config.level;
        if (config.levelData) this.levelData = config.levelData;
    }
    
    createGameUI() {
        var width = this.scene.cameras.main.width;
        
        this.pauseButton = createAirbnbButton(
            this.scene,
            POSITIONS.PAUSE_BUTTON_X + 25,
            POSITIONS.PAUSE_BUTTON_Y + 15,
            '||',
            '#FF385C',
            { fontSize: '20px', padding: { x: 15, y: 8 }, borderRadius: 16 }
        ).setDepth(50);
        
        var self = this;
        this.pauseButton.hitArea.on('pointerdown', function() {
            if (self.scene.pauseGame) self.scene.pauseGame();
        });
        
        this.levelText = this.scene.add.text(
            width / 2, POSITIONS.LEVEL_TEXT_Y,
            'Level ' + this.currentLevel,
            { fontSize: '24px', fontFamily: 'Arial', color: '#222222', padding: { x: 14, y: 7 } }
        ).setOrigin(0.5).setDepth(50);
        this._addRoundedBg(this.levelText, 0xF7F7F7, 14, 4);
        
        this.scoreText = this.scene.add.text(
            POSITIONS.SCORE_TEXT_X, POSITIONS.SCORE_TEXT_Y,
            '* 0',
            { fontSize: '24px', fontFamily: 'Arial', color: '#222222', padding: { x: 14, y: 7 } }
        ).setOrigin(0.5).setDepth(50);
        this._addRoundedBg(this.scoreText, 0xFFFFFF, 14, 6);
    }
    
    _addRoundedBg(textObj, color, radius, yOffset) {
        var bg = this.scene.add.graphics();
        var w = textObj.width + 28;
        var h = textObj.height + 14;
        var px = textObj.x - w / 2;
        var py = textObj.y - h / 2;
        bg.fillStyle(0x000000, 0.08);
        bg.fillRoundedRect(px, py + yOffset, w, h, radius);
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(px, py, w, h, radius);
        bg.setDepth(textObj.depth - 1);
        if (!textObj._bgRef) textObj._bgRef = [];
        textObj._bgRef.push(bg);
    }
    
    updateScore(score) {
        if (this.scoreText) {
            this.scoreText.setText('* ' + score);
            if (this.scoreText._bgRef) {
                this.scoreText._bgRef.forEach(function(b) { b.destroy(); });
                this.scoreText._bgRef = [];
            }
            this._addRoundedBg(this.scoreText, 0xFFFFFF, 14, 6);
        }
    }
    
    updateBirdQueue(count) {
        if (this.birdQueueText) {
            if (this.birdQueueText._bgRef) {
                this.birdQueueText._bgRef.forEach(function(b) { b.destroy(); });
            }
            this.birdQueueText.destroy();
        }
        this.birdQueueText = this.scene.add.text(
            POSITIONS.BIRD_QUEUE_X, POSITIONS.BIRD_QUEUE_Y,
            'Bird x ' + count,
            { fontSize: '22px', fontFamily: 'Arial', color: '#222222', padding: { x: 10, y: 5 } }
        ).setDepth(50);
        this._addRoundedBg(this.birdQueueText, 0xFFFFFF, 12, 4);
    }
    
    showScorePopup(points, x, y) {
        var popup = this.scene.add.text(x, y, '+' + points, {
            fontSize: '24px', fontFamily: 'Arial Black',
            color: '#FFB400', stroke: '#222222', strokeThickness: 2
        }).setOrigin(0.5).setDepth(60);
        
        this.scene.tweens.add({
            targets: popup, y: y - 60, alpha: 0,
            duration: 900, ease: 'Power2',
            onComplete: function() { popup.destroy(); }
        });
        this.scorePopups.push(popup);
    }
    
    showResult(resultType, score, stars, callbacks) {
        if (!callbacks) callbacks = {};
        var width = this.scene.cameras.main.width;
        var height = this.scene.cameras.main.height;
        var self = this;
        
        this.clearResultUI();
        
        this.resultOverlay = this.scene.add.rectangle(
            width / 2, height / 2, width, height, 0x222222, 0.6
        ).setDepth(80);
        
        var cardWidth = 420;
        var cardHeight = 380;
        var cardX = width / 2;
        var cardY = height / 2;
        
        this.resultCard = this.scene.add.graphics().setDepth(81);
        this.resultCard.fillStyle(0x000000, 0.12);
        this.resultCard.fillRoundedRect(cardX - cardWidth/2, cardY - cardHeight/2 + 6, cardWidth, cardHeight, 24);
        this.resultCard.fillStyle(0xFFFFFF, 0.97);
        this.resultCard.fillRoundedRect(cardX - cardWidth/2, cardY - cardHeight/2, cardWidth, cardHeight, 24);
        
        var titleText = resultType === 'win' ? 'Level Complete!' : 'Try Again';
        var titleColor = resultType === 'win' ? '#FF385C' : '#717171';
        this.resultTitle = this.scene.add.text(
            cardX, cardY - 130, titleText,
            { fontSize: '36px', fontFamily: 'Arial Black', color: titleColor }
        ).setOrigin(0.5).setDepth(82);
        
        this.resultScoreText = this.scene.add.text(
            cardX, cardY - 60, 'Score: ' + score,
            { fontSize: '28px', fontFamily: 'Arial', color: '#222222' }
        ).setOrigin(0.5).setDepth(82);
        
        if (resultType === 'win' && stars) {
            var starStr = '';
            for (var s = 0; s < stars; s++) starStr += '*';
            for (var s2 = stars; s2 < 3; s2++) starStr += 'o';
            this.resultStarsText = this.scene.add.text(
                cardX, cardY - 10, starStr,
                { fontSize: '36px', color: '#FFB400' }
            ).setOrigin(0.5).setDepth(82);
        }
        
        var btnY = cardY + 70;
        
        var retryBtn = createAirbnbButton(
            this.scene, cardX, btnY, 'Retry', '#FF385C',
            { fontSize: '22px', padding: { x: 28, y: 12 } }
        ).setDepth(82);
        if (callbacks.onRetry) retryBtn.hitArea.on('pointerdown', callbacks.onRetry);
        this.resultButtons.push(retryBtn);
        btnY += 55;
        
        if (resultType === 'win' && callbacks.hasNextLevel) {
            var nextBtn = createAirbnbButton(
                this.scene, cardX, btnY, 'Next Level', '#00A699',
                { fontSize: '22px', padding: { x: 28, y: 12 } }
            ).setDepth(82);
            if (callbacks.onNext) nextBtn.hitArea.on('pointerdown', callbacks.onNext);
            this.resultButtons.push(nextBtn);
            btnY += 55;
        }
        
        var menuBtn = createAirbnbButton(
            this.scene, cardX, btnY, 'Menu', '#717171',
            { fontSize: '20px', padding: { x: 24, y: 10 }, borderRadius: 16 }
        ).setDepth(82);
        if (callbacks.onMenu) menuBtn.hitArea.on('pointerdown', callbacks.onMenu);
        this.resultButtons.push(menuBtn);
        
        this.resultCard.setScale(0.8);
        this.resultCard.setAlpha(0);
        this.scene.tweens.add({
            targets: this.resultCard,
            scaleX: 1, scaleY: 1, alpha: 1,
            duration: 400, ease: 'Back.easeOut'
        });
    }
    
    showPauseOverlay(callbacks) {
        if (!callbacks) callbacks = {};
        var w = this.scene.cameras.main.width;
        var h = this.scene.cameras.main.height;
        var self = this;
        
        this.pauseOverlayContainer = this.scene.add.container(0, 0).setDepth(100);
        this.pauseOverlayContainer.add(
            this.scene.add.rectangle(w / 2, h / 2, w, h, 0x222222, 0.5)
        );
        
        var cardW = 360;
        var cardH = 340;
        var card = this.scene.add.graphics();
        card.fillStyle(0x000000, 0.1);
        card.fillRoundedRect(w/2 - cardW/2, h/2 - cardH/2 + 5, cardW, cardH, 24);
        card.fillStyle(0xFFFFFF, 0.97);
        card.fillRoundedRect(w/2 - cardW/2, h/2 - cardH/2, cardW, cardH, 24);
        this.pauseOverlayContainer.add(card);
        
        this.pauseOverlayContainer.add(
            this.scene.add.text(w / 2, h / 2 - 110, 'Pause', {
                fontSize: '36px', fontFamily: 'Arial Black', color: '#222222'
            }).setOrigin(0.5)
        );
        
        var resumeBtn = createAirbnbButton(
            this.scene, w / 2, h / 2 - 30, 'Resume', '#FF385C',
            { fontSize: '24px', padding: { x: 30, y: 14 } }
        );
        resumeBtn.hitArea.on('pointerdown', callbacks.onResume);
        this.pauseOverlayContainer.add(resumeBtn);
        
        var retryBtn = createAirbnbButton(
            this.scene, w / 2, h / 2 + 40, 'Restart', '#FFB400',
            { fontSize: '22px', padding: { x: 26, y: 12 }, textColor: '#222222' }
        );
        retryBtn.hitArea.on('pointerdown', callbacks.onRetry);
        this.pauseOverlayContainer.add(retryBtn);
        
        var menuBtn = createAirbnbButton(
            this.scene, w / 2, h / 2 + 105, 'Menu', '#717171',
            { fontSize: '20px', padding: { x: 24, y: 10 }, borderRadius: 16 }
        );
        menuBtn.hitArea.on('pointerdown', callbacks.onMenu);
        this.pauseOverlayContainer.add(menuBtn);
        
        card.setScale(0.8);
        card.setAlpha(0);
        this.scene.tweens.add({
            targets: card, scaleX: 1, scaleY: 1, alpha: 1,
            duration: 300, ease: 'Back.easeOut'
        });
    }
    
    hidePauseOverlay() {
        if (this.pauseOverlayContainer) {
            this.pauseOverlayContainer.destroy();
            this.pauseOverlayContainer = null;
        }
    }
    
    clearResultUI() {
        if (this.resultOverlay) { this.resultOverlay.destroy(); this.resultOverlay = null; }
        if (this.resultCard) { this.resultCard.destroy(); this.resultCard = null; }
        if (this.resultTitle) { this.resultTitle.destroy(); this.resultTitle = null; }
        if (this.resultScoreText) { this.resultScoreText.destroy(); this.resultScoreText = null; }
        if (this.resultStarsText) { this.resultStarsText.destroy(); this.resultStarsText = null; }
        this.resultButtons.forEach(function(btn) { if (btn) btn.destroy(); });
        this.resultButtons = [];
    }

    destroy() {
        this.clearResultUI();
        this.hidePauseOverlay();
        if (this.scoreText) {
            if (this.scoreText._bgRef) this.scoreText._bgRef.forEach(function(b) { b.destroy(); });
            this.scoreText.destroy();
            this.scoreText = null;
        }
        if (this.birdQueueText) {
            if (this.birdQueueText._bgRef) this.birdQueueText._bgRef.forEach(function(b) { b.destroy(); });
            this.birdQueueText.destroy();
            this.birdQueueText = null;
        }
        if (this.pauseButton) { this.pauseButton.destroy(); this.pauseButton = null; }
        if (this.levelText) {
            if (this.levelText._bgRef) this.levelText._bgRef.forEach(function(b) { b.destroy(); });
            this.levelText.destroy();
            this.levelText = null;
        }
        this.scorePopups.forEach(function(p) { if (p && p.destroy) p.destroy(); });
        this.scorePopups = [];
    }
}
