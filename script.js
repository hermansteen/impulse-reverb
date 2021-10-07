let mySound
let rawSound
let myImpulse
let slider
const width = window.innerWidth
const height = window.innerHeight

function preload() {
  soundFormats('mp3', 'ogg', 'wav')
  mySound = loadSound('assets/audio/TheHangingGardens')
  rawSound = loadSound('assets/audio/TheHangingGardens')
  myImpulse = createConvolver('assets/impulses/backRight.wav')
  myImpulse.addImpulse('assets/impulses/backLeft.wav')
  myImpulse.addImpulse('assets/impulses/frontLeft.wav')
  myImpulse.addImpulse('assets/impulses/middleLeft.wav')
  myImpulse.addImpulse('assets/impulses/frontRight.wav')
  myImpulse.addImpulse('assets/impulses/middleRight.wav')
  document.getElementById('nowPlaying').innerText = 'Nu spelas: ' + "Default track"
}



function changeFile(fileName) {
  mySound.setPath('assets/audio/' + fileName)
  rawSound.setPath('assets/audio/' + fileName)
  myImpulse.process(mySound)
  mySound.pause()
  rawSound.pause()
  document.getElementById('nowPlaying').innerText = 'Nu spelas: ' + fileName
}

function setup() {
  const cnv = createCanvas(innerWidth / 2, innerHeight -50).parent('canvasContainer')
  cnv.mousePressed(togglePlay)
  cnv.text('click to play', 20, 20)
  fft = new p5.FFT()
  mySound.disconnect()
  myImpulse.process(mySound)
  slider = createSlider(0, 1, 0.5, 0.2).parent('sliderParent')
}

function draw() {
  background(100)

  const spectrum = fft.analyze()
  noStroke()
  fill(255, 123, 156)
  for (let i = 0; i < spectrum.length; i++) {
    const x = map(i, 0, spectrum.length, 0, width)
    const h = -height + map(spectrum[i], 0, 255, height, 0)
    rect(x, height, width / spectrum.length, h)
  }
  endShape()
  mySound.setVolume(slider.value())
  rawSound.setVolume(slider.value() - 0.15)
}

function toggleRaw() {
  if (mySound.isPlaying()) {
    mySound.pause()
    rawSound.jump(Math.ceil(mySound.currentTime()))
    rawSound.play()
  } else if (rawSound.isPlaying()) {
    rawSound.pause()
    mySound.jump(Math.ceil(rawSound.currentTime()))
    mySound.play()
  } else {
    rawSound.play()
  }
  if (activeElements.length !== 0) {
    activeElements[0].classList.toggle('active')
  }
}

function togglePlay() {
  if (mySound.isPlaying()) {
    mySound.pause()
  } else if (rawSound.isPlaying()) {
    rawSound.pause()
  } else {
    rawSound.play()
  }
}

function changeImpulse(id) {
  if (rawSound.isPlaying()) {
    rawSound.pause()
  }
  myImpulse.toggleImpulse(id + '.wav')
  if (!mySound.isPlaying()) {
    mySound.jump(rawSound.currentTime())
    mySound.play()
  }
  const activeElements = document.getElementsByClassName('active')
  if (activeElements.length !== 0) {
    activeElements[0].classList.toggle('active')
  }
  document.getElementById(id).classList.toggle('active')
}
