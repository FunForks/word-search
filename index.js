const prompt = require('prompt-sync')()
const { 
  setWordList,
  findNeighbours,
  findAnagrams,
  findReversedWords,
  findPalindromes,
  findLadders,
  findAnagramLadders
} = require('./word_search') 



/////////// ERROR-CHECKING, DISPLAY AND INTERFACE FUNCTIONS ///////////

/*
Place any functions which are called from the switch statement in the
while loop here. These functions can:

* Check that the user entered valid arguments
* Use console.log() to display useful error messages for invalid
  arguments
* Call the functions that have been imported from the word_search.js 
  script, and display their output using console.log()
*/




/////// INFINITE LOOP INTERFACE /////// INFINITE LOOP INTERFACE ///////

while (true){
  const input = prompt("> ") // returns the string typed by the user

  if (!input) {
    return // user pressed ^C
  }

  const [command, ...rest] = input.split(" ") // divide into words
                                  // ignore extra spaces
                                  .filter( word => !!word )
                                  // ignore case
                                  .map( word => word.toLowerCase())
  switch (command) {
    case "exit":
      return // exit the while loop

    default:
      console.log("Unknown command:", command)
  }
}