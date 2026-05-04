import { SCENE_KEYS, COLORS } from '../utils/constants.js';
import { LevelsConfig } from '../config/game.config.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.MENU });
    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createMenuButtons();
        this.createBirdDecorations();
    }

    createBackground() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var sky = this.add.graphics();
        sky.fillGradientStyle(COLORS.SKY_TOP, COLORS.SKY_TOP, COLORS.SKY_BOTTOM, COLORS.SKY_BOTTOM, 1);
        sky.fillRect(0, 0, width, height);
        for (var i = 0; i < 5; i++) {
            this.createCloud(Phaser.Math.Between(100, width - 100), Phaser.Math.Between(50, 200));
        }
        var ground = this.add.graphics();
        ground.fillStyle(COLORS.GRASS, 1);
        ground.fillRect(0, height - 80, width, 20);
        ground.fillStyle(COLORS.GROUND, 1);
        ground.fillRect(0, height - 60, width, 60);
    }

    createCloud(x, y) {
        var cloud = this.add.graphics();
        cloud.fillStyle(0xFFFFFF, 0.9);
        cloud.fillCircle(0, 0, 30);
        cloud.fillCircle(25, 0, 40);
        cloud.fillCircle(50, 0, 30);
        cloud.fillCircle(25, -20, 25);
        cloud.setPosition(x, y);
        this.tweens.add({
            targets: cloud, x: x + 50,
            duration: Phaser.Math.Between(3000, 6000),
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }

    createTitle() {
        var width = this.cameras.main.width;
        this.titleText = this.add.text(width / 2, 130, 'Angry Birds', {
            fontSize: '64px', fontFamily: 'Arial Black',
            color: '#FF385C', stroke: '#FFFFFF', strokeThickness: 8,
            shadow: { color: '#000000', fill: true, offsetX: 2, offsetY: 3, blur: 6 }
        }).setOrigin(0.5);
        this.tweens.add({
            targets: this.titleText, y: 120,
            duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }

    createMenuButtons() {
        var width = this.cameras.main.width;
        this.menuContainer = this.add.container(0, 0);
        var self = this;
        this.menuContainer.add(this._makeBtn(
            width / 2, 280, 'Start Game', '#FF385C',
            function() { self.scene.start(SCENE_KEYS.GAME, { level: 1 }); }
        ));
        this.menuContainer.add(this._makeBtn(
            width / 2, 355, 'Level Select', '#00A699',
            function() { self.showLevelSelectPanel(); }
        ));
        this.menuContainer.add(this._makeBtn(
            width / 2, 430, 'How to Play', '#FFB400',
            function() { self.showHelpPanel(); }, '#222222'
        ));

    }
    _makeBtn(x, y, text, bgColor, callback, textColor) {
        var tc = textColor || '#FFFFFF';
        var container = this.add.container(x, y);
        var tmpText = this.add.text(0, 0, text, { fontSize: '26px', fontFamily: 'Arial', color: tc });
        var bw = tmpText.width + 60;
        tmpText.destroy();
        var bh = 52;
        var color = Phaser.Display.Color.HexStringToColor(bgColor).color;

        var shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.1);
        shadow.fillRoundedRect(-bw/2, -bh/2 + 3, bw, bh, 20);
        container.add(shadow);

        var bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-bw/2, -bh/2, bw, bh, 20);
        container.add(bg);

        var label = this.add.text(0, 0, text, { fontSize: '26px', fontFamily: 'Arial', color: tc }).setOrigin(0.5);
        container.add(label);

        var hit = this.add.rectangle(0, 0, bw, bh, 0x000000, 0);
        hit.setInteractive({ useHandCursor: true });
        container.add(hit);

        var scene = this;
        hit.on('pointerover', function() {
            scene.tweens.add({ targets: container, scaleX: 1.05, scaleY: 1.05, duration: 150, ease: 'Back.easeOut' });
        });
        hit.on('pointerout', function() {
            scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 150, ease: 'Back.easeOut' });
        });
        hit.on('pointerdown', function() {
            scene.tweens.add({ targets: container, scaleX: 0.95, scaleY: 0.95, duration: 80 });
        });
        hit.on('pointerup', function() {
            scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100, ease: 'Back.easeOut' });
        });
        if (callback) hit.on('pointerdown', callback);
        return container;
    }

    _parseProgress(progress) {
        var unlocked = 1;
        for (var i = 1; i <= LevelsConfig.length; i++) {
            if (progress[i] !== undefined) unlocked = i + 1;
        }
        if (unlocked > LevelsConfig.length) unlocked = LevelsConfig.length;
        return unlocked;
    }

    showLevelSelectPanel() {
        if (this.levelPanel) return;
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var progress = {};
        try { progress = JSON.parse(localStorage.getItem('angrybird_progress') || '{}'); } catch(e) {}
        var maxLevel = this._parseProgress(progress);
        var self = this;
        this.levelPanel = this.add.container(0, 0).setDepth(50);

        var overlay = this.add.rectangle(width/2, height/2, width, height, 0x222222, 0.5);
        overlay.setInteractive();
        overlay.on('pointerdown', function() { self.hideLevelSelectPanel(); });
        this.levelPanel.add(overlay);

        var panelBg = this.add.graphics();
        panelBg.fillStyle(0x000000, 0.08);
        panelBg.fillRoundedRect(width/2 - 255, height/2 - 205, 510, 410, 24);
        panelBg.fillStyle(0xFFFFFF, 0.97);
        panelBg.fillRoundedRect(width/2 - 250, height/2 - 200, 500, 400, 24);
        panelBg.fillStyle(0xFF385C, 1);
        panelBg.fillRoundedRect(width/2 - 250, height/2 - 200, 500, 6, {tl:24, tr:24, bl:0, br:0});
        this.levelPanel.add(panelBg);

        this.levelPanel.add(this.add.text(width/2, height/2 - 170, 'Select Level', {
            fontSize: '32px', fontFamily: 'Arial Black', color: '#222222'
        }).setOrigin(0.5));

        var cols = 3, startX = width/2 - 150, startY = height/2 - 100;
        LevelsConfig.forEach(function(level, index) {
            var col = index % cols;
            var row = Math.floor(index / cols);
            var bx = startX + col * 150;
            var by = startY + row * 120;
            var lvlNum = index + 1;
            var isUnlocked = lvlNum <= maxLevel;
            var stars = (typeof progress[lvlNum] === 'number' && progress[lvlNum] > 0) ? progress[lvlNum] : 0;

            var lvlBtn = self.add.container(bx, by);
            var bg = self.add.graphics();
            bg.fillStyle(0x000000, 0.06);
            bg.fillRoundedRect(-53, -37, 110, 80, 16);
            if (isUnlocked) {
                bg.fillStyle(0xFFFFFF, 0.97);
            } else {
                bg.fillStyle(0xF0F0F0, 0.9);
            }
            bg.fillRoundedRect(-55, -40, 110, 80, 16);
            if (isUnlocked) {
                bg.fillStyle(0xFF385C, 1);
                bg.fillRoundedRect(-55, -40, 110, 5, {tl:16, tr:16, bl:0, br:0});
            }
            lvlBtn.add(bg);

            lvlBtn.add(self.add.text(0, -18, level.name, {
                fontSize: '15px', fontFamily: 'Arial',
                color: isUnlocked ? '#222222' : '#B0B0B0'
            }).setOrigin(0.5));

            var starText = '';
            if (isUnlocked) {
                for (var si = 0; si < stars; si++) starText += '*';
                for (var si2 = stars; si2 < 3; si2++) starText += 'o';
            } else {
                starText = 'LOCK';
            }
            lvlBtn.add(self.add.text(0, 12, starText, {
                fontSize: '14px', color: isUnlocked ? '#FFB400' : '#999999'
            }).setOrigin(0.5));

            lvlBtn.setSize(110, 80);
            if (isUnlocked) {
                lvlBtn.setInteractive({ useHandCursor: true });
                lvlBtn.on('pointerdown', function() {
                    self.scene.start(SCENE_KEYS.GAME, { level: lvlNum });
                });
                lvlBtn.on('pointerover', function() {
                    self.tweens.add({ targets: lvlBtn, scaleX: 1.06, scaleY: 1.06, duration: 150, ease: 'Back.easeOut' });
                });
                lvlBtn.on('pointerout', function() {
                    self.tweens.add({ targets: lvlBtn, scaleX: 1, scaleY: 1, duration: 150 });
                });
            }
            self.levelPanel.add(lvlBtn);
        });

        var backBtn = self._makeBtn(width/2, height/2 + 170, 'Back', '#717171',
            function() { self.hideLevelSelectPanel(); });
        this.levelPanel.add(backBtn);

        panelBg.setScale(0.85);
        panelBg.setAlpha(0);
        this.tweens.add({ targets: panelBg, scaleX: 1, scaleY: 1, alpha: 1, duration: 350, ease: 'Back.easeOut' });
    }

    hideLevelSelectPanel() {
        if (this.levelPanel) { this.levelPanel.destroy(true); this.levelPanel = null; }
    }

    showHelpPanel() {
        if (this.helpPanel) return;
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var self = this;
        this.helpPanel = this.add.container(0, 0).setDepth(50);

        var overlay = this.add.rectangle(width/2, height/2, width, height, 0x222222, 0.5);
        overlay.setInteractive();
        overlay.on('pointerdown', function() { self.hideHelpPanel(); });
        this.helpPanel.add(overlay);

        var panelBg = this.add.graphics();
        panelBg.fillStyle(0x000000, 0.08);
        panelBg.fillRoundedRect(width/2 - 225, height/2 - 185, 450, 370, 24);
        panelBg.fillStyle(0xFFFFFF, 0.97);
        panelBg.fillRoundedRect(width/2 - 220, height/2 - 180, 440, 360, 24);
        panelBg.fillStyle(0xFF385C, 1);
        panelBg.fillRoundedRect(width/2 - 220, height/2 - 180, 440, 6, {tl:24, tr:24, bl:0, br:0});
        this.helpPanel.add(panelBg);

        this.helpPanel.add(this.add.text(width/2, height/2 - 145, 'How to Play', {
            fontSize: '30px', fontFamily: 'Arial Black', color: '#222222'
        }).setOrigin(0.5));

        var lines = [
            '1. Drag the bird on slingshot',
            '2. Aim and release to launch',
            '3. Destroy all pigs to win',
            '4. Earn stars based on score'
        ];
        for (var i = 0; i < lines.length; i++) {
            this.helpPanel.add(this.add.text(width/2, height/2 - 70 + i * 50, lines[i], {
                fontSize: '20px', fontFamily: 'Arial', color: '#222222'
            }).setOrigin(0.5));
        }

        var closeBtn = self._makeBtn(width/2, height/2 + 130, 'Close', '#FF385C',
            function() { self.hideHelpPanel(); });
        this.helpPanel.add(closeBtn);

        panelBg.setScale(0.85);
        panelBg.setAlpha(0);
        this.tweens.add({ targets: panelBg, scaleX: 1, scaleY: 1, alpha: 1, duration: 350, ease: 'Back.easeOut' });
    }

    hideHelpPanel() {
        if (this.helpPanel) { this.helpPanel.destroy(true); this.helpPanel = null; }
    }

    createBirdDecorations() {
        var height = this.cameras.main.height;
        var birdColors = [0xFF385C, 0xFFB400, 0x00A699];
        for (var i = 0; i < 3; i++) {
            var bird = this.add.graphics();
            bird.fillStyle(birdColors[i], 1);
            bird.fillCircle(0, 0, 20);
            bird.fillStyle(0xFFFFFF, 1);
            bird.fillCircle(-6, -4, 6);
            bird.fillCircle(6, -4, 6);
            bird.fillStyle(0x000000, 1);
            bird.fillCircle(-4, -4, 3);
            bird.fillCircle(8, -4, 3);
            bird.lineStyle(2, 0x000000, 1);
            bird.lineBetween(-12, -12, -1, -10);
            bird.lineBetween(1, -10, 12, -12);
            bird.fillStyle(0xFFA500, 1);
            bird.fillTriangle(16, 0, 28, 4, 28, -4);
            bird.setPosition(100 + i * 80, height - 100);
            this.tweens.add({
                targets: bird, y: height - 110,
                duration: 800 + i * 200, yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut', delay: i * 300
            });
        }
    }
}
