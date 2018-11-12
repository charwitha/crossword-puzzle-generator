(function (document, $, wordfind) {

  'use strict';
  var WordFindGame = function() {
    var wordList;
    var wordPositions = wordfind.wordPositions;
    console.log(wordPositions);
    var labelNo, output = '';

    var drawPuzzle = function (el, puzzle, words) {
      for (var i = 0, height = puzzle.length; i < height; i++) {
        var row = puzzle[i];
        output += '<tr>';
        for (var j = 0, width = row.length; j < width; j++) {

          output += '<td x="' + j + '" y="' + i + '">';
          
          if(/[A-Z]/.test(row[j])){
            for(var k = 0; k < wordPositions.length; k++) {
              if(wordPositions[k].x == j && wordPositions[k].y == i) {
                labelNo = k;
                output += '<label>'+ (labelNo + 1)+'</label>';
                break;
              }
            }
          }

          if(row[j] != '') {
           output += '<input class="puzzleSquare" type="text" data-value="' + row[j] + '" maxlength="1">';
           output += '</td>';
         }
       }
       output += '</tr>';
     }

     $(el).html(output);
   };
    /**
    * Draws the words by inserting an unordered list into el.
    *
    * @param {String} el: The jQuery element to write the words to
    * @param {[String]} words: The words to draw
    */
    var drawWords = function (el, hints) {

      var output = '<ol>';
      for (var i = 0, len = hints.length; i < len; i++) {
        var hint = hints[i];
        output += '<li class="word">' + hint;
      }
      output += '</ol>';

      $(el).html(output);
    };
    /**
    * Given two points, ensure that they are adjacent and determine what
    * orientation the second point is relative to the first
    *
    * @param {int} x1: The x coordinate of the first point
    * @param {int} y1: The y coordinate of the first point
    * @param {int} x2: The x coordinate of the second point
    * @param {int} y2: The y coordinate of the second point
    */
    var calcOrientation = function (x1, y1, x2, y2) {

      for (var orientation in wordfind.orientations) {
        var nextFn = wordfind.orientations[orientation];
        var nextPos = nextFn(x1, y1, 1);

        if (nextPos.x === x2 && nextPos.y === y2) {
          return orientation;
        }
      }
      return null;
    };

    return {
      /**
      * Creates a new word find game and draws the board and words.
      * @param {[String]} words: The words to add to the puzzle
      * @param {String} puzzleEl: Selector to use when inserting the puzzle
      * @param {String} wordsEl: Selector to use when inserting the word list
      * @param {Options} options: WordFind options to use when creating the puzzle
      */
      create: function(words, puzzleEl, wordsEl, hints, options) {

        var list = [];
        for (var j = 0; j < words.length; j++) 
          list.push({'word': words[j], 'hint': hints[j]});

        list.sort( function (a,b) {
          return (a.length < b.length) ? 1 : 0;
        });

        for (var k = 0; k < list.length; k++) {
          words[k] = list[k].word;
          hints[k] = list[k].hint;
        }

        console.log(words);
        console.log(hints);
        
        var puzzle = wordfind.newPuzzle(words, options);

        // draw out all of the words
        drawPuzzle(puzzleEl, puzzle, words);
        drawWords(wordsEl, hints);

        return puzzle;
      },
    };
  };
  /**
  * Allow game to be used within the browser
  */
  window.wordfindgame = WordFindGame();

}(document, jQuery, wordfind));