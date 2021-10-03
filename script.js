let mySound;
let myImpulse;
let myReverb;
let width = window.innerWidth;
let height = window.innerHeight;
function preload() {
    soundFormats("mp3", "ogg", "wav");
    mySound = loadSound("assets/audio/TheHangingGardens_01");
    myImpulse = createConvolver("assets/audio/Impulsfil.wav");
    mySound.setVolume(0.1);
}
function setup() {
    let cnv = createCanvas(innerWidth/2, innerHeight-50);
    cnv.mousePressed(togglePlay);
    text('tap here to play', 10, 20);
    fft = new p5.FFT();
    mySound.disconnect();
    myImpulse.process(mySound);
}

function draw(){
    background(220);
  
    let spectrum = fft.analyze();
    noStroke();
    fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, height, width / spectrum.length, h )
    }
  
    let waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(20);
    for (let i = 0; i < waveform.length; i++){
      let x = map(i, 0, waveform.length, 0, width);
      let y = map( waveform[i], -1, 1, 0, height);
      vertex(x,y);
    }
    endShape();
    text('tap to play', 20, 20);
}

function togglePlay() {
    if (mySound.isPlaying()) {
        mySound.pause();
      } else {
        mySound.loop();
      }
}