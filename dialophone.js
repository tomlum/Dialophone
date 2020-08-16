let channel = 1;
let dialNum = 91;
let triggerNum = 64;

let lowNote = 48;  //C3
let highNote = 72; //C5
let velocity = 100;

let microtonal = true;

////////////////////////
////////////////////////
////////////////////////

let on = false;
let note = lowNote;
let range = highNote - lowNote;

function getPitch(val) {
  return lowNote + Math.floor((val / 127) * range);
}

function getPitchBend(val) {
  return ((val / 127) * range - Math.floor((val / 127) * range)) * 4096;
}

function HandleMIDI(event) {
  if (event.number === triggerNum) {
    if (event.value >= 127) {
      on = true;

      event = new NoteOn();
      event.velocity = velocity;
      event.pitch = note;
      event.channel = channel;
    } else {
      on = false;
      event = new NoteOff();
      event.pitch = note;
      event.velocity = velocity;
      event.channel = channel;
    }
    event.send();
  }

  if (event.number === dialNum) {
    const offEvent = new NoteOff();
    offEvent.channel = channel;
    offEvent.pitch = note;
    offEvent.velocity = velocity;
    offEvent.send();

    note = getPitch(event.value);

    if(microtonal){
      const bend = new PitchBend();
      bend.value = getPitchBend(event.value);
      bend.channel = channel;
      bend.send();
    }

    event = new NoteOn();
    event.velocity = velocity;
    event.pitch = note;
    event.channel = channel;
	  if (on) {
      event.send();
    }
  }
  
  if (event.number !== triggerNum) {
    event.trace();
  }
}
