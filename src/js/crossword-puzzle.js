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
  
var refScore = firebase.database().ref('leaderboard/'),
    refMessages = firebase.database().ref('messages/'),
    refClues = firebase.database().ref('clues/'),
    refTopics = firebase.database().ref('topics/'),
    allTopics = {},
    t;

/** Get all hints from firebase */
refClues.orderByChild('name').once('value').then(function(snapshot) {
    allTopics = snapshot.val();
});

/**Get Topic details */
var buildPuzzle = function(topic) {
    var puzzleContainer = $('#puzzle'), 
        cluesContainer = $('#words'),
        topicInfo = [],
        words = [],
        clues = [];

    for(var item in allTopics) {
        if(item === topic) {
            topicInfo = allTopics[topic].information;
            words = Object.keys(allTopics[topic].hints);
            clues = Object.values(allTopics[topic].hints);
        }
    }

    $('.sec-3-1').css('background-image', 'url("'+ topicInfo.logo +'")');
    $('.sec-1-1').css('background-image', 'url("'+ topicInfo.image +'")');
    $('#puzzle').css('background-image', 'url("'+ topicInfo.image +'")');
    $('.info').append(topicInfo.info);

    wordfindgame.create(words, puzzleContainer, cluesContainer, clues);
    wordfind.newPuzzle(words, {height: 100, width:100, fillBlanks: false});
}

/** Get and set all topics from firebase */
refTopics.orderByChild('name').once('value').then(function(snapshot) {
    var topics = snapshot.val();
    var $elem = $('#select-topic');
    var options = '';
    
    for (var i in Object.keys(topics)) {
        options += '<option class="topic" value="'+ Object.values(topics)[i] +'">'+ Object.keys(topics)[i] +'</option>';
    }
    $elem.append(options);

    $elem.on('change', function() {
        var selectedTopic = $elem.val();
        var user = $('#name-box').val();
        
        if(user) {
            buildPuzzle(selectedTopic);
        } else {
          alert("Please fill your name and choose a topic!");
          location.reload();
        }
    });
});

/** Send messages to firebase */
var postMessage = function(message) {
    refMessages.push().set(message);
};

/*Get top-scores from firebase*/
var displayScores = function() {
    var scoreContent = "";
    var loader = '<div class="loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>';
    var headContent = '<div class="leader"><h3>LeaderBoard</h3>'+'<ol class="scoreBoard">';
    $('.panel-content').append(headContent);
    $('.leader ol').append(loader);
    
    refScore.orderByChild("Time").limitToFirst(10).on("child_added", function(snapshot) {
        scoreContent = "<li>"+ snapshot.val().Name +"\t"+ snapshot.val().Time +"</li>";
        $('div').remove('.loading');
        $('.leader ol').append(scoreContent);
    }, function (error) {
        console.log("Error: " + error.code);
    });
};

/** Set Puzzle Board */
var getGame = function() {
    $('.sec-7-1').css('width', '6.25%');

    setTimeout(function() {
        $('.sec-6-1').css('height', '12.5vh');
        $('.sec-6-1').css('bottom', '12.5vh');
    }, 400);

    setTimeout(function() {
        $('.sec-5-1').css('width', '12.5%');
    }, 800);

    setTimeout(function() {
        $('.sec-4-1').css('height', '25vh');
        $('.sec-4-1').css('bottom', '25vh');
    }, 1200);

    setTimeout(function() {
        $('.sec-3-1').css('height', '50vh');
        $('.sec-3-1').css('bottom', '50vh');
    }, 1600);

    setTimeout(function() {
        $('.sec-2-1').css('width', '25%');
    }, 2000);

    setTimeout(function() {
        $('.sec-1-1').css('width', '50%');
    }, 2400);
};

/**Remove puzzle board */
var removeGame = function() {
    setTimeout(function() {
        $('.sec-7-1').css('width', '0');
        $('.sec-6-1').css('height', '0');
    }, 2400);

    setTimeout(function() {
        $('.sec-6-1').css('bottom', '0');
    }, 2000);

    setTimeout(function() {
        $('.sec-5-1').css('width', '0');
        $('.sec-4-1').css('height', '0');
    }, 1600);

    setTimeout(function() {
        $('.sec-4-1').css('bottom', '-10vh');
        $('.sec-3-1').css('height', '0');
    }, 1200);

    setTimeout(function() {
        $('.sec-3-1').css('bottom', '0vh');
    }, 800);

    setTimeout(function() {
        $('.sec-2-1').css('width', '0');
    }, 400);

    $('.sec-1-1').css('width', '0');
};

/** Timer */
var timer = function() {
    var countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 15);

    var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
        $('.timer').text(minutes+ " : " +seconds);
    
        if (distance < 0) {
            clearInterval(x);
            submitBoard()
            $('#exit').click();
        }
    }, 1000);
};

/**Submit Board with answers */
var submitBoard = function() {
    var $puzzlegrid = $('.puzzleSquare'),
        score = 0;
        time = $('.timer').text();
        answers = $('.puzzleSquare').length;
        beginner = (answers * 50) / 100;
        inter = (answers * 85) / 100;

    user = $('#name-box').val();
    selectedTopic = $('#select-topic').text();

    for(var i = 0; i < $puzzlegrid.length; i++) {
        var cellValue = $puzzlegrid[i].value;
        var solValue = $puzzlegrid[i].getAttribute("data-value").toUpperCase();
        if(cellValue.toUpperCase() == solValue) {
        score++;
        }
    }
    
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

$(document).ready(function() {
    var $panel = $('.panel-content'),
        $sidebar = $('.side-panel'),
        $close = $('.panel-close');

    // Click Events
    $('#start').on('click', function () {
        getGame();
        setTimeout(timer, 3000);
    });

    $('#exit').click(function() {
        removeGame();
        setTimeout(function() {
            location.reload();
        }, 2500);
    });

    $('#submit').click(function() {
        alert("Submit the board?");
        submitBoard();
        clearTimeout(t);
        removeGame();
      });
  
    $('#suggest').click(function() {
        var panelContent = '<p>Please suggest your topic or write any message here...</p>' 
            + '<input class="panel-field" type="text" placeholder="Topic/Message" name="message">'
            + '<button class="panel-btn" id="post">Post</button>';
    
        $sidebar.addClass('active');
        
        setTimeout(function() {
            $panel.append(panelContent);
        }, 300);
    });
  
    $('#fame').click(function() {
        var panelContent = displayScores();
        $sidebar.addClass('active');

        setTimeout(function() {
            $panel.append(panelContent);
        }, 500);
    });
  
    $('#info').click(function() {
        $sidebar.addClass('active')
    });
  
    $('#reset').click(function () {
        $('.puzzleSquare').val('');
    });
  
    $('.side-panel').on('click', '#post', function() {
        var msg = $('.panel-field').val();
        postMessage(msg);
        $panel.append('Posted!!')

        setTimeout(function() {
            $close.click();
        }, 500);
    });
  
    $close.click(function () {
        $sidebar.removeClass('active');
        $panel.empty();
    });
})