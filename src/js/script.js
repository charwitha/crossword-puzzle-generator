var gameURL;

var getGame = function() {
  $('.sec-7-1').css('width', '6.25%');

  setTimeout(function() {
    $('.sec-6-1').css('height', '12.5vh');
    $('.sec-6-1').css('bottom', '12.5vh');
  }, 500);

  setTimeout(function() {
    $('.sec-5-1').css('width', '12.5%');
  }, 1000);

  setTimeout(function() {
    $('.sec-4-1').css('height', '25vh');
    $('.sec-4-1').css('bottom', '25vh');
  }, 1500);

  setTimeout(function() {
    $('.sec-3-1').css('height', '50vh');
    $('.sec-3-1').css('bottom', '50vh');
  }, 2000);

  setTimeout(function() {
    $('.sec-2-1').css('width', '25%');
  }, 2500);

  setTimeout(function() {
    $('.sec-1-1').css('width', '50%');
  }, 3000);
};

var removeGame = function() {
  setTimeout(function() {
    location.reload();
  }, 3500);

  setTimeout(function() {
    $('.sec-7-1').css('width', '0');
    $('.sec-6-1').css('height', '0');
  }, 3000);

  setTimeout(function() {
    $('.sec-6-1').css('bottom', '0');
  }, 2500);

  setTimeout(function() {
    $('.sec-5-1').css('width', '0');
    $('.sec-4-1').css('height', '0');
  }, 2000);

  setTimeout(function() {
    $('.sec-4-1').css('bottom', '-10vh');
    $('.sec-3-1').css('height', '0');
  }, 1500);

  setTimeout(function() {
    $('.sec-3-1').css('bottom', '0vh');
  }, 1000);

  setTimeout(function() {
    $('.sec-2-1').css('width', '0');
  }, 500);

  $('.sec-1-1').css('width', '0');
};

$('#exit').click(function() {
  removeGame();
});

var buildPuzzle = function(data) {
  var puzzleContainer = $('#puzzle'), 
  cluesContainer = $('#words');
  var words = [],
  hints = [],
  pick = [];
  var i = 0; j = 0;

  for(var x in data) {
    words[i] = x;
    i++;
  }

  for(var y in data) {
    hints[j] = data[y];
    j++;
  }

  /*var keys = Object.keys(data);
  var values = Object.values(data);
  for(var g = 0; g < 24; g++) {
    var index = Math.floor(Math.random() * keys.length);
    words[i] = keys[index];
    hints[j] = values[index];
    i++; j++;
  }
  */
  console.log(words);
  console.log(hints);

  var gamePuzzle = wordfindgame.create(words, puzzleContainer, cluesContainer, hints);
  var puzzle = wordfind.newPuzzle(words, {height: 100, width:100, fillBlanks: false});
};

var setGame = function(url) {
  $.ajax({
    url: url,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      $('.sec-3-1').css('background-image', 'url("'+data.logo+'")');
      $('.sec-1-1').css('background-image', 'url("'+data.image+'")');
      $('#puzzle').css('background-image', 'url("'+data.image+'")');
      $('.info').append(data.info);


      $('#start').click(function () {
        getGame();
        setTimeout(timer, 3000);
      });
    }, error: function() {
      alert("Could not fetch the data");
    }
  });
};

var getJson = function(url) {
  $.ajax({
    url: url,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      buildPuzzle(data);
      setGame(gameURL);
    }, error: function() {
      alert("Could not fetch the data");
      location.reload();
    }
  });
};

$('#select-topic').change(function() {
  var selectedTopic = $('#select-topic').val();
  var user = $('#name-box').val();
  if((selectedTopic != '') && (user != '')) {
    var dataURL = 'data/'+ selectedTopic +'/words_hints.json';
    gameURL = 'data/'+ selectedTopic +'/info.json';
    getJson(dataURL);
  } else {
    alert("Please fill your name and choose a topic!");
    location.reload();
  }
});

var setTopics = function(data) {
  var topics = "";
  var topicsLength = data.length;

  for(var i = 0; i < topicsLength; i++) {
    topics += '<option class="topic" value="'+data[i].value+'">';
    topics += data[i].name;
    topics += '</option>';
  }
  $('#select-topic').append(topics);
};

$(document).ready(function() {
  var topicList = 'data/topics.json';

  var getTopics = function() {
   $.ajax({
    url: topicList,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      setTopics(data);
    }, error: function() {
      alert("Could not fetch the topic list");
    }
  });
 };
 getTopics();
});

$('#suggest').click(function() {
  var panelContent = "";

  panelContent += '<p>Please suggest your topic or write any message here...</p>';
  panelContent += '<input class="panel-field" type="text" placeholder="Topic/Message" name="message">';
  panelContent += '<button class="panel-btn" id="post">Post</button>';

  $('.panel-head').css('display', 'block');
  $('.side-panel').css('width', '25vw');
  setTimeout(function() {
    $('.panel-content').append(panelContent);
  }, 250);
});

$('#fame').click(function() {
  var panelContent = displayScores();

  $('.panel-head').css('display', 'block');
  $('.side-panel').css('width', '25vw');
  setTimeout(function() {
    $('.panel-content').append(panelContent);
  }, 250);
});

$('#info').click(function() {
  $('.panel-head').css('display', 'block');
  $('.side-panel').css('width', '35vw');
});

$('#reset').click(function () {
  $('.puzzleSquare').val('');
});

$('#new').click(function() {
  location.reload();
  getGame();
  setTimeout(timer, 3000);
});

$('.side-panel').on('click', '#post', function() {
  var msg = $('.panel-field').val();
  postSuggestion(msg);
  $('.side-panel').css('width', '0');
  $('.panel-head').css('display', 'none');
  $('.panel-content').empty();
});

$('.panel-close').click(function () {
  $('.side-panel').css('width', '0');
  $('.panel-head').css('display', 'none');
  $('.panel-content').empty();
});