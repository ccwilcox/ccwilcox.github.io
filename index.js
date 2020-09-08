
//set up of deck
let correctCount =0;
let cardCount = 0;
let cardIndex = randomNum();
let cards =[
  {type:'circle', unicode:''},
  {type:'plus',unicode: '&#10133;'},
  {type:'waves',unicode: '&#8967;&#8967;&#8967;'},
  {type:'square',unicode: '&#9633;'},
  {type:'star',unicode: '&#9734;'}
];
let audio = document.getElementById('wow');
function randomNum(){
  return Math.floor(Math.random()*5);
}
console.log(`actual ${cardIndex}`);
function buttonClick(buttonNum){
  console.log(`clicked ${buttonNum}`);
  document.getElementById('cardButtons').classList.add('hidden');
  cardCount++;
  let cur = cards[cardIndex];

  if(buttonNum==cardIndex){
    audio.play();
    correctCount++;
  }else{
    navigator.vibrate(50);
  }

  document.getElementById('result').innerHTML = `Score: ${correctCount}/10`;
  let card = document.getElementById('card');
  card.classList.remove('ESPcard');
  card.classList.add('text-center');
  card.innerHTML = `<img src="${cur.type}.svg" height="300px" class="${cur.type}">`;
  document.getElementById('next').classList.remove('hidden');
  
}


function next(){
  cardIndex=randomNum();
  console.log(`actual ${cardIndex}`);
  document.getElementById('next').classList.add('hidden');
  document.getElementById('cardButtons').classList.remove('hidden');
  
  if(cardCount>=10){
    finished();
  }
  else{
    let card = document.getElementById('card');
    card.classList.add('ESPcard');
    card.classList.remove('text-center');
    card.innerHTML = `<div id="insideCard" class="cardBack"></div>`;
  }
}
  
// function for display when the test is over

function finished(){
  document.getElementById('cardButtons').remove();
  document.getElementById('card').remove();
  if(correctCount>4){
    document.body.style.backgroundColor='#ca7ddb';
    document.getElementById('result').innerHTML = 'Congratulations you have ESP!';
  }
  else{
      document.body.style.backgroundColor='darkgrey';
      document.getElementById('result').innerHTML = 'Unfortunately you are just an ordinary person.';
  }
}


