var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var synth = window.speechSynthesis;
let msg = `I'm going to test you for extra sensory power. The other side of this card is a either a circle, plus, waves, square, or star. Clear your mind. When you're ready, say the name out loud.`;


var grammar = '#JSGF V1.0; grammar shapes; public <shape> =star | circle | square | plus | waves ;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let correctCount =0;
let types = ['circle','plus','waves','square','star'];
let unicodes = ['&#9675;','&#10133;','&#8967;&#8967;&#8967;','&#9633;','&#9734;'];
let cards =[];
for(let i = 0; i<types.length;i++){
    for(let j=0;j<5;j++){
        cards.push({
          type:`${types[i]}`,
          unicode:`${unicodes[i]}`});
    }
}
function* cardGen(){
  yield* cards;
}

function start(){
  console.log(cards);
  shuffle(cards);
  console.log(cards);
  let deck = cardGen();
  let cur;
  $('#begin').click(function(){
    $('.hidden').toggleClass('hidden');
    $('#next').toggleClass('hidden');
    $('#begin').toggleClass('hidden');
    let utterThis = new SpeechSynthesisUtterance(msg);
    synth.speak(utterThis);
    cur=deck.next();
    utterThis.onend = function(event) {
      recognition.start();
    }
  })
  $('#next').click(function(){
    $('#next').toggleClass('hidden');
    cur=deck.next();
    if(cur.value===undefined){
      finished();
    }else{
      $('#insideCard').removeClass();
      $('#insideCard').toggleClass('cardBack');
      $('#insideCard').html('');
      let utterThis = new SpeechSynthesisUtterance('What about this one?');
      synth.speak(utterThis);
      console.log(cur);
      utterThis.onend = function(event) {
        recognition.start();
      }
    }
   
  })
  recognition.onnomatch = function(event){
    console.log(`didn't catch that\n`);
    let utterThis = new SpeechSynthesisUtterance(`I'm sorry. I didn't quite catch that. Please try again. `);
      synth.speak(utterThis);
      console.log(cur);
      utterThis.onend = function(event) {
        recognition.start();
      }
  }
  recognition.onresult = function(event) {
    $('#next').toggleClass('hidden');
    console.log(event.results[0][0].transcript);
    $('#insideCard').toggleClass('cardBack');
    $('#insideCard').toggleClass(`${cur.value.type}`);
    $('#insideCard').html(cur.value.unicode);
    if(event.results[0][0].transcript.toLowerCase()==cur.value.type){
      correctCount++;
      $('#result').html(`Correct ${correctCount}/25`);
    }
    else $('#result').html(`Incorrect ${correctCount}/25`);
  }
    
}
function finished(){
  // $('#next').toggleClass('hidden');
  if(correctCount>10){
    $('#result').html('Congratulations you have ESP!');
  }
  else{
    $('#result').html('Unfortunately you are just an ordinary person');
  }
  
}
function shuffle(cards){
  function compare(a,b){
    return Math.random()-0.5
  }
  cards.sort(compare);
}

$(document).ready(function(){
  start();
})