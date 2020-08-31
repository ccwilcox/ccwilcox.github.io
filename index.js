var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var synth = window.speechSynthesis;

//set up for speech recognition
let grammar = '#JSGF V1.0; grammar shapes; public <shape> =star | circle | square | plus | waves ;'
let recognition = new SpeechRecognition();
let speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//initial play message
let msg = `I'm going to test you for extra sensory power. The other side of this card is a either a circle, plus, waves, square, or star. Clear your mind. When you're ready, say the name out loud.`;

//set up of deck
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

//card generator
function* cardGen(){
    yield* cards;
}
// all of the test except the end screen
$(document).ready(function(){
    correctCount=0;
    shuffle(cards);
    //uncomment if you want to cheat
    //console.log(cards);
    let deck = cardGen();
    let cur;
    //starts the test/voice message playing
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
    //flips card to back again and starts listening 
    //next card oh also plays another message
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
            utterThis.onend = function(event) {
                recognition.start();
            }
        }
    })

    //Don't know when this would happen or if
    // but felt like a good idea to add
    recognition.onnomatch = function(event){

        let utterThis = new SpeechSynthesisUtterance(`I'm sorry. I didn't quite catch that. Please try again. `);
        synth.speak(utterThis);
        utterThis.onend = function(event) {
            recognition.start();
        }
    }

    // reveals the card
    // checks if the guess was correct
    // updates the correctCount if necessary and displays it

    recognition.onresult = function(event) {
        $('#next').toggleClass('hidden');
        // uncomment this if you want to see what the 
        // speech recognition is hearing
        //console.log(event.results[0][0].transcript);
        $('#insideCard').toggleClass('cardBack');
        $('#insideCard').toggleClass(`${cur.value.type}`);
        $('#insideCard').html(cur.value.unicode);
        if(event.results[0][0].transcript.toLowerCase()==cur.value.type){
        correctCount++;
        $('#result').html(`Correct ${correctCount}/25`);
        }
        else $('#result').html(`Incorrect ${correctCount}/25`);
    } 
})

// function for display when the test is over
// and if they don't have esp it lets them take the test again
function finished(){
    $('#card').toggleClass('hidden');
    if(correctCount>10){
        $('body').css('background-color','#ca7ddb');
        $('#result').html('Congratulations you have ESP!');
    }
    else{
        $('body').css('background-color','darkgrey');
        $('#result').html('Unfortunately you are just an ordinary person.\n Would you like to try again?');
    }
    
  
}
//simple shuffle function
function shuffle(cards){
    function compare(a,b){
        return Math.random()-0.5
    }
    cards.sort(compare);
}

