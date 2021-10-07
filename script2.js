let revSound
let rawSound
let frontRightGain, backLeftGain, mixGain
let myImpulse
let savedURL
let slider
let backNoise
let rawSoundVol
let revSoundVol
let outputVol
let cry_backLeft
let cry_backRight
let cry_middleLeft
let cry_middleRight
let cry_frontLeft
let cry_frontRight
let frontRightVol = 0
let frontLeftVol = 0
let middleRightVol = 0
let middleLeftVol = 0
let backLeftVol = 0
let backRightVol = 0
let hrirImpulse
const volume = document.getElementById('volume')
const width = window.innerWidth
const height = window.innerHeight

function preload () {
  soundFormats('mp3', 'ogg', 'wav')
  revSound = loadSound('assets/audio/intro-tna004')
  backNoise = loadSound('assets/audio/NoiseTrackEQ.wav')
  rawSound = loadSound('assets/audio/intro-tna004')
  cry_backLeft = loadSound('assets/audio/cry_backleft.wav')
  cry_backRight = loadSound('assets/audio/cry_backright.wav')
  cry_frontLeft = loadSound('assets/audio/cry_frontleft.wav')
  cry_frontRight = loadSound('assets/audio/cry_frontright.wav')
  cry_middleLeft = loadSound('assets/audio/cry_middleleft.wav')
  cry_middleRight = loadSound('assets/audio/cry_middleright.wav')
  myImpulse = createConvolver('assets/impulses/backRight.wav')
  myImpulse.addImpulse('assets/impulses/backLeft.wav')
  myImpulse.addImpulse('assets/impulses/frontLeft.wav')
  myImpulse.addImpulse('assets/impulses/middleLeft.wav')
  myImpulse.addImpulse('assets/impulses/frontRight.wav')
  myImpulse.addImpulse('assets/impulses/middleRight.wav')
  myImpulse.process(revSound)
  myImpulse.process(cry_backLeft)
  myImpulse.process(cry_backRight)
  myImpulse.process(cry_frontLeft)
  myImpulse.process(cry_frontRight)
  myImpulse.process(cry_middleLeft)
  myImpulse.process(cry_middleRight)
}

function changeFile (fileName) {
  revSound.setPath('assets/audio/' + fileName)
  rawSound.setPath('assets/audio/' + fileName)
  myImpulse.process(revSound)
  revSound.pause()
  rawSound.pause()
}

function setup () {
  const cnv = createCanvas(innerWidth / 2, innerHeight - 50).parent('canvasContainer')
  cnv.mousePressed(startSound)
  cnv.text('click to play', 20, 20)
  fft = new p5.FFT()
  revSound.disconnect()
  myImpulse.process(revSound)
  slider = createSlider(0, 1, 0.8, 0.05).parent('sliderParent')

  // mixGain = new p5.Gain()
  // mixGain.connect()

  // frontRightGain = new p5.Gain()
  // frontRightGain.setInput(cry_frontRight)
  // frontRightGain.connect(mixGain)
  // frontRightGain.disconnect()

  // backLeftGain = new p5.Gain()
  // backLeftGain.setInput(cry_backLeft)
  // backLeftGain.connect(mixGain)
  // backLeftGain.disconnect()
}

function startSound () {
  if (rawSound.isPlaying() || revSound.isPlaying()) {
    rawSound.pause()
    revSound.pause()
  } else {
    rawSound.play()
    revSound.play()
  }
}

function draw () {
  background(100)

  const spectrum = fft.analyze()
  noStroke()
  fill(255, 123, 156)
  for (let i = 0; i < spectrum.length; i++) {
    const x = map(i, 0, spectrum.length, 0, width)
    const h = -height + map(spectrum[i], 0, 255, height, 0)
    rect(x, height, width / spectrum.length, h)
  }

  const waveform = fft.waveform()
  noFill()
  beginShape()
  stroke(42, 173, 140)
  for (let i = 0; i < waveform.length; i++) {
    const x = map(i, 0, waveform.length, 0, width)
    const y = map(waveform[i], -1, 1, 0, height)
    vertex(x, y)
  }
  endShape()

  rawSoundVol = slider.value()
  revSoundVol = 1 - rawSoundVol
  revSound.setVolume(revSoundVol)
  rawSound.setVolume(rawSoundVol)
  cry_backLeft.setVolume(backLeftVol)
  cry_backRight.setVolume(backRightVol)
  cry_frontLeft.setVolume(frontLeftVol)
  cry_frontRight.setVolume(frontRightVol)
  cry_middleLeft.setVolume(middleLeftVol)
  cry_middleRight.setVolume(middleRightVol)
  // function toggleRaw() {
  //     if (revSound.isPlaying()) {
  //         revSound.pause()
  //         rawSound.jump(Math.ceil(revSound.currentTime()))
  //         rawSound.play()
  //     } else if (rawSound.isPlaying()) {
  //         rawSound.pause()
  //         revSound.jump(Math.ceil(rawSound.currentTime()))
  //         revSound.play()
  //     } else {
  //         rawSound.play()
  //     }
  // }

  // function togglePlay() {
  //     if (revSound.isPlaying()) {
  //         revSound.pause()
  //     } else if (rawSound.isPlaying()) {
  //         rawSound.pause()
  //     } else {
  //         rawSound.play()
  //     }
}

function changeImpulse (id) {
  if (rawSound.isPlaying()) {
    // rawSound.pause()
  }
  myImpulse.toggleImpulse(id + '.wav')
  if (!revSound.isPlaying()) {
    revSound.jump(rawSound.currentTime())
    // revSound.play()
  }
  const activeElements = document.getElementsByClassName('active')
  if (activeElements.length !== 0) {
    activeElements[0].classList.toggle('active')
  }
  document.getElementById(id).classList.toggle('active')
  changeCry(id)
}

function changeCry (id) {
  const volumeFactor = parseFloat(document.getElementById(id).getAttribute('value'))
  console.log(volumeFactor)
  if (id === 'frontRight') {
    frontRightVol = 1 * volumeFactor
    frontLeftVol = 0
    middleRightVol = 0
    middleLeftVol = 0
    backLeftVol = 0
    backRightVol = 0
  } else if (id === 'backLeft') {
    frontRightVol = 0
    frontLeftVol = 0
    middleRightVol = 0
    middleLeftVol = 0
    backLeftVol = 1 * volumeFactor
    backRightVol = 0
  } else if (id === 'backRight') {
    frontRightVol = 0
    frontLeftVol = 0
    middleRightVol = 0
    middleLeftVol = 0
    backLeftVol = 0
    backRightVol = 1 * volumeFactor
  } else if (id === 'middleRight') {
    frontRightVol = 0
    frontLeftVol = 0
    middleRightVol = 1 * volumeFactor
    middleLeftVol = 0
    backLeftVol = 0
    backRightVol = 0
  } else if (id === 'middleLeft') {
    frontRightVol = 0
    frontLeftVol = 0
    middleRightVol = 0
    middleLeftVol = 1 * volumeFactor
    backLeftVol = 0
    backRightVol = 0
  } else if (id === 'frontLeft') {
    frontRightVol = 0
    frontLeftVol = 1 * volumeFactor
    middleRightVol = 0
    middleLeftVol = 0
    backLeftVol = 0
    backRightVol = 0
  }
}

function backgroundNoise () {
  backNoise.setVolume(0.05)
  if (backNoise.isPlaying()) {
    backNoise.pause()
  } else {
    backNoise.loop()
    loop()
  }
}

function toggleNoise () {
  if (cry_backLeft.isPlaying()) {
    cry_backRight.pause()
    cry_backLeft.pause()
    cry_frontLeft.pause()
    cry_frontRight.pause()
    cry_middleLeft.pause()
    cry_middleRight.pause()
  } else {
    cry_backRight.play()
    cry_backRight.loop()
    cry_backLeft.play()
    cry_backLeft.loop()
    cry_frontLeft.play()
    cry_frontLeft.loop()
    cry_frontRight.play()
    cry_frontRight.loop()
    cry_middleLeft.play()
    cry_middleLeft.loop()
    cry_middleRight.play()
    cry_middleRight.loop()
  }
}

function mixFiles (value) {
  rawSoundVol = 1 - value
  revSoundVol = value

  backLeftGain.amp(rawSoundVol)
  frontRightGain.amp(revSoundVol)

  console.log(value)

  console.log(rawSoundVol)
}
