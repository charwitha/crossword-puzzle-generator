var seconds = 0, minutes = 0, hours = 0, t;
var user, selectedTopic;

console.log(user);

var add = function() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }

  $('.timer').text((minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" + (seconds > 9 ? seconds : "0" + seconds));
  
  if(minutes <= 9) {
    timer();
  } else {
    getPuzzleFill();
  }
};

var timer = function() {
  t = setTimeout(add, 1000);
};

var getScoreMsg = function(score, time) {
  var getFill = $('.puzzleSquare').length;
  var beginner = (getFill * 50) / 100;
  var inter = (getFill * 85) / 100;

  if(score >= inter) {
    alert("Expert");
    getScore(user, score, time);
  } else if(score >=beginner && score < inter) {
    alert("Moderate");
  } else if(score == 0) {
    alert("Zero!");
  } else {
    alert("Beginner");
  }
};

var getPuzzleFill = function() {
  var $puzzlegrid = $('.puzzleSquare');
  var score = 0;
  var time = $('.timer').text();

  user = $('#name-box').val();
  selectedTopic = $('#select-topic').text();

  for(var i = 0; i < $puzzlegrid.length; i++) {
    var cellValue = $puzzlegrid[i].value;
    var solValue = $puzzlegrid[i].getAttribute("data-value").toUpperCase();
    console.log(cellValue);
    if(cellValue.toUpperCase() == solValue) {
      score++;
    }
  }
  getScoreMsg(score, time);
};

$('#submit').click(function() {
  alert("Submit the board?");
  getPuzzleFill();
  clearTimeout(t);
  removeGame();
});

