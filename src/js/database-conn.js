// Initialize Firebase
var config = {
  apiKey: "AIzaSyAU4ESKHgz3xVjc7Gvc8BLEKRKQY-mWkWo",
  authDomain: "crossword-unlimited.firebaseapp.com",
  databaseURL: "https://crossword-unlimited.firebaseio.com",
  projectId: "crossword-unlimited",
  storageBucket: "crossword-unlimited.appspot.com",
  messagingSenderId: "811705674439"
};
firebase.initializeApp(config);

var scoreRef = firebase.database().ref('leaderboard/');
var suggRef = firebase.database().ref('messages/');

var postSuggestion = function(msg) {
  suggRef.push().set(msg);
};

var getScore = function(user, score, time) {
  var userScore = score;
  var userTime = time;

  scoreRef.push().set ({
    "Name" : user,
    "Score" : score,
    "Time" : time
  });
};

/*Get top-scores from firebase*/
var displayScores = function() {
  var scoreContent = "";
  var loader = '<div class="loading">';
  loader += '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>';
  loader += '<span class="sr-only">Loading...</span></div>';
  var headContent = '<div class="leader">';
  headContent += '<h3>LeaderBoard</h3>'+'<ol class="scoreBoard">';
  $('.panel-content').append(headContent);
  $('.leader ol').append(loader);
  
  scoreRef.orderByChild("Time").limitToFirst(15).on("child_added", function(snapshot) {
    var name = ""+snapshot.val().Name;
    var time = ""+snapshot.val().Time;

    scoreContent = "<li>"+name+"\t"+time+"</li>";
    $('div').remove('.loading');
    $('.leader ol').append(scoreContent);
  }, function (error) {
    console.log("Error: " + error.code);
  });
};