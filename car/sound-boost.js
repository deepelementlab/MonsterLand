// 音效系统代码片段
var AC;
function initAudio() {
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) {}
}

function playSound(freq, duration, type) {
  if (!AC) return;
  try {
    var osc = AC.createOscillator();
    var gain = AC.createGain();
    osc.connect(gain);
    gain.connect(AC.destination);
    osc.frequency.value = freq;
    osc.type = type || 'sine';
    gain.gain.setValueAtTime(0.1, AC.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, AC.currentTime + duration);
    osc.start(AC.currentTime);
    osc.stop(AC.currentTime + duration);
  } catch(e) {}
}

// 换道音效
function playLaneChange() {
  playSound(440, 0.1, 'square');
}

// 碰撞音效
function playCollision() {
  playSound(150, 0.3, 'sawtooth');
}

// 得分音效
function playScore() {
  playSound(880, 0.1, 'sine');
}

// 游戏结束音效
function playGameOver() {
  playSound(200, 0.5, 'sawtooth');
}
