/**
 * wordify.js
 * 
 * A companion script for wordr.js, wordify creates a command prompt
 * that allows you to call the public functions of the wordr module.
 * 
 * NOTE: You must run `npm install prompt-sync` before using this script
 * 
 * The functions in this script ensure that the wordr functions are
 * called with the correct syntax. Error messages are shown if the 
 * commands typed into the prompt are invalid
 */

// Run `npm install prompt-sync` before use
const prompt = require('prompt-sync')()


// Read in functions from wordr
const { 
  setWordList,
  findNeighbours,
  findAnagrams,
  findReversedWords,
  findPalindromes,
  findLadders,
  findAnagramLadders,
  findSimpleLadders,
  findGoodStarters
} = require('./wordr')


// Used to check which word list has been loaded
let charCount = 0


// HELP // HELP // HELP // HELP // HELP // HELP // HELP // HELP //

function help() {
  console.log(`Wordify commands:
* exit
  Exits Wordify.

* help
  Prints this Help message, complete with examples.

* h
  Prints a concise help message with no examples.

* load word1 word2 ... wordN
  (where all words are the same length)
  Loads that exact list of words

  > load hips hops cops coos coop chop shop ship
  Loaded 8 4-letter words

* load N:
  (where N is a number from 2 to 16)
  Shortcut: ld N
  Loads a list of words of N characters.

  > load 4
  Loaded 2022 4-letter words

* anagrams [word]:
  Prints a list of all anagrams, if no argument is given, or anagrams of the given word.
  Shortcut: a [word]

  > anagrams stop
  [ "stop", "spot", "post", "tops", "pots", "opts" ]

  > anagrams
  [ "with", "whit" ]
  ...
  [ "toed", "dote" ]
  Found 340 anagrams for 4-letter words.

* reversed:
  Prints a list of pairs of words that use the same letters in the reverse order.
  Shortcut: r

  > reversed
  [ "said", "dias" ]
  ...
  [ "blub", "bulb" ]
  Found 102 reversed pairs in the list of 4-letter words.

* palindromes:
  Prints a list of all words that read the same forwards and backwards.
  Shortcut: p

  > palindromes
  [ "sees", "noon", "deed", "poop" ]
  Found 4 palindromes in the list of 4-letter words.

* neighbours [word or integer column count]
  Prints an array of all words that differ from word by only one letter.
  If an integer argument is provided, an array of all words that have
  at least one neighbour will be shown, with integer defining the 
  number of columns. If no argument is given, 4 columns will be shown.
  Shortcut: n [word | integer]

  > neighbours word
  [ "cord", "ford", "lord", "ward", "woad", "wold", "wood", "wore", "work", "worm", "worn" ]
  Found 11 neighbours in the list of 4-letter words.

  > neighbours 5
  Words with at least 1 neighbour:
  [ "able", "ably", "aces", "ache", "acid",
  ...
    "zips", "zone", "zoom", "zoos"]
  Found 1964 words with neighbours

* ladders word1 word2:
  Prints a list of the shortest word ladders from word1 to word2.
  Shortcut: l word1 word2

  > ladders make done
  [ "make", "mane", "dane", "done" ]
  Found 1 word ladder in the list of 4-letter words.

* anagramLadders [word]:
  where word may be:
  • "=short"
  • "=long"
  • "=reversed"
  • any word with the right number of letters
  • left blank
  Prints a list of word ladders for pairs of anagrams for the current word set. Special cases for 'word':
  • "=short": prints the list of all the shortest ladders
  • "=long": prints the list of all the longest ladders
  • "=reversed": prints the list of all ladders for reversed word pairs
  If 'word' is absent, all anagram ladders will be printed, sorted from shortest to longest.
  If 'word' is any word in the currently loaded word list, then all the word ladders to all its anagrams will be printed.
  Shortcut: al [word]

  > anagramLadders =short
  [ "thaw", "that", "what" ]
  ...
  [ "puts", "pups", "tups" ]
  Found 60 short word ladders in the list of 4-letter words.

  > anagramLadders =long
  [ "much", "muck", "mock", "cock", "cork", "corn", "coin", "chin", "thin", "this", "thus", "thug", "chug", "chum" ]
  ...
  [ "mane", "dane", "dune", "duns", "dues", "dyes", "eyes", "ewes", "ewer", "ever", "even", "oven", "omen", "amen" ]
  Found 26 long word ladders in the list of 4-letter words.

  > anagramLadders =reversed
  [ "deer", "deed", "reed" ]
  ...
  [ "diva", "dive", "dire", "dirt", "dart", "wart", "wait", "gait", "grit", "grid", "arid", "avid" ]
  Found 558 anagram ladders in the list of 4-letter words.

  > anagramLadders list
  [ "list", "lilt", "silt" ]
  [ "list", "lost", "loot", "soot", "slot", "slit" ]
  [ "slit", "slot", "soot", "soft", "sift", "silt" ]
  Found 3 anagram ladders in the list of 4-letter words.

  > anagramLadders
  [ "what,that,thaw" ]
  ...
  [ "mane", "dane", "dune", "duns", "dues", "dyes", "eyes", "ewes", "ewer", "ever", "even", "oven", "omen", "amen" ]
  Found 2329 anagram ladders in the list of 4-letter words.

* simpleLadders word [truthy]
  Prints a list of all the ladders starting with word and ending with
  a word where all the letters are different, or rearranged.

  If a second argument is provided (even the word 'false'), then the
  requirement that all letters be different or rearranged will be
  lifted, so more ladders will be returned
  Shortcut: sl

  > simpleLadders elks
  [ "elks", "elms", "alms", "arms", "army" ]
  Found 1 simple ladder in the list of 4-letter words.

  > simpleLadders elks 1
  [ "elks", "elms", "alms", "aims", "aids" ]
  ...
  [ "elks", "elms", "alms", "arms", "arts" ]
  Found 13 simple ladders in the list of 4-letter words.

  Note that all the unfiltered ladders in the example above, the letter "s" is still in last place.

* starters
  (Eventually) prints a map of words with the number of ladders that
  they can create. The map is sorted 
  > starters
  WARNING: THE starter COMMAND CAN TAKE SEVERAL MINUTES TO RUN
  DO YOU REALLY WANT TO PROCEED (Y/N): y

  Number of ladders found for each starting word: {
    bark: 841,
    ...
    axle: 1
  }
  A total of 15960 ladders of at least 4 words were found
`)
}


function h() {
  console.log(`Wordify commands:
* exit
* help
* h
* load <integer>
* load word1 ... wordN
* anagrams
* anagrams <word>
* reversed
* palindromes
* neighbours [word | column count]
* ladders <word1> <word2>
* anagramLadders
* anagramLadders =short
* anagramLadders =long
* anagramLadders =reversed
* anagramLadders <word>
* simpleLadders <word> [allow_partially_changed_words]
* starters
`)
}



// // SMOKE TEST //
// help()
// h
// load(4)
// printAnagrams("spot")
// printReversed()
// printPalindromes()
// printNeighbours()
// printLadders("make", "done")
// printAnagramLadders("=long")
// printAnagramLadders("=reversed")
// printSimpleLadders("clue")
// printGoodStarters(true)



// ERROR CHECKING AND FEEDBACK //

function _wordListNotLoaded(command) {
  if (!charCount) {
    console.log(`Unable to execute the command "${command}". Please use the "load" command first.`)
    return true
  }
}


function _printArray(array){
  if (array.length) {
    console.log('[ "' + array.join('", "') + '" ]')
  } else {
    console.log([])
  }
}


function _printArrayLength(length, type) {
  const count = length === 1
              ? `1 ${type}`
              : `${length} ${type}s`
  console.log(`Found ${count} in the list of ${charCount}-letter words.`)
}



// COMMANDS // COMMANDS // COMMANDS // COMMANDS // COMMANDS //

function load(input, ...wordList) {
  let letterCount

  const wordCount = wordList.length
  if (wordCount) {
    wordList.unshift(input)
    letterCount = input.length

  } else {
    // Read a word list in from the appropriate JSON file
    letterCount = parseInt(input, 10)

    if (isNaN(letterCount)) {
      return console.log(
        "load requires a number as the first argument (received: %s)",
        letterCount
      )
    }

    if (letterCount < 2 || letterCount > 16) {
      return console.log(
        `load requires a number between 2 and 16 as the first argument (received: ${letterCount})`
      )
    }

    const fileName = `./word_lists/${letterCount}-letter-words.json`
    wordList = require(fileName)
  }

  const result = setWordList(wordList)

  if (isNaN(result)) {
    // Result is an error string
    console.log(result)
    if (charCount) {
      console.log(
        `A list of words of ${charCount} letters is currently loaded.`
      )
    }
  } else {
    console.log(`Loaded ${result} ${letterCount}-letter words`)
    charCount = letterCount
  }
}


function printAnagrams(word) {
  if (_wordListNotLoaded("anagrams")) {
    return
  }

  if (word && word.length !== charCount) {
    return console.log(
      'If you provide a word for "anagrams", it must be %d letters long (received: "%s").',
      charCount,
      word
    )
  }

  const anagrams = findAnagrams(word)
  if (word) {
    _printArray(anagrams)
  } else {
    anagrams.forEach(_printArray)
    _printArrayLength(anagrams.length, "anagram")
  }
}


function printReversed() {
  if (_wordListNotLoaded("reversed")) {
    return
  }

  const reversed = findReversedWords()
  reversed.forEach(_printArray)
  _printArrayLength(reversed.length, "reversed pair")
}


function printPalindromes() {
  if (_wordListNotLoaded("palindromes")) {
    return
  }

  const palindromes = findPalindromes()
  _printArray(palindromes)
  _printArrayLength(palindromes.length, "palindrome")
}


function printNeighbours(word = 4) {
  if (_wordListNotLoaded("neighbours")) {
    return
  }

  let columns

  if (word) {
    if (!isNaN(word)) {
      columns = parseInt(word, 10)
      word = ""

    } else if (word.length !== charCount) {
      return console.log(
        'You must provide a %d-letter word for neighbours (received "%s").',
        charCount,
        word
      )
    }
  }  
 
  const neighbours = findNeighbours(word)

  if (word) {
    _printArray(neighbours)
    _printArrayLength(neighbours.length, "neighbour")

  } else {
    // There may be over a thousand entries. Arrange them in columns
    // so that the Terminal window doesn't clip the beginning.
    const length = neighbours.length
    const output = neighbours.reduce(( string, neighbour, index ) => {
      string += '"' + neighbour + '",'
      if ((index+1) % columns) {
        string += " "
      } else {
        string += "\n  "
      }
      return string
    }, "Words with at least 1 neighbour:\n[ ")

    console.log(output.slice(0, -2) + "]"
    )
    console.log(`Found ${length} words with neighbours`)
  }
}


function printLadders(start, end) {
  if (_wordListNotLoaded("ladders")) {
    return true
  }

  if (!start || !end) {
    if (start) {
      start = `"${start}"`
    }

    return console.log(
      "ladder requires two words (received: %s and %s).",
      start,
      end
    )
  }

  if (start.length !== charCount || end.length !== charCount) {
    return console.log(
      'ladder requires two words of length %d (received "%s" and "%s").',
      charCount,
      start,
      end
    )
  }

  const ladders = findLadders(start, end)
  const length = ladders.length
  if (length) {
    ladders.forEach( ladder => {
      _printArray(ladder)
    })
  }
  _printArrayLength(length, "word ladder")
}


function printAnagramLadders(wanted) {
  if (_wordListNotLoaded("ladders")) {
    return true
  }

  let nested = true
  if (wanted) {
    if ( wanted === "=reversed"
      || wanted === "=simple"
      || wanted === "=short"
      || wanted === "=long"
      ) {
      nested = (wanted === "=reversed")

    } else if (wanted.length !== charCount) {
      return console.log(
`If you provide an argument for anagramLadders it must be one of the following:
* a word of length ${charCount}
* =long
* =short
* =reversed
(Received: "${wanted}")`
      )
    }
  }

  const ladderSet = findAnagramLadders(wanted)
  if (nested) {
    ladderSet.forEach( ladders => ladders.forEach(_printArray))
    length = ladderSet.reduce(( total, ladders ) => (
      total + ladders.length
    ), 0)
    _printArrayLength(length, "anagram ladder")

  } else {
    ladderSet.forEach(_printArray)
    let type
    if (wanted[0] === "=") {
      type = wanted.substring(1) + " word ladder"
    } else {
      type = "word ladder" 
    }
     
    _printArrayLength(ladderSet.length, type)
  }
}


function printSimpleLadders(word, all) {
  if (_wordListNotLoaded("simpleLadders")) {
    return true
  }

  if (!word) {
    return console.log(`simpleLadders requires a seed word`)
  }

  if (word.length !== charCount) {
    return console.log(
      `simpleLadders requires a %d-letter seed word (received: %s).`,
      charCount,
      word
    )
  }

  const ladders = findSimpleLadders(word, !all)

  let total = 0
  ladders.forEach(ladderSet => {
    ladderSet.forEach(ladder => {
      total += 1
      _printArray(ladder)
    })
  })
  _printArrayLength(total, "simple ladder" )
}


function printGoodStarters(showNoWarning) {
  if (_wordListNotLoaded("starters")) {
    return true
  }

  if (!showNoWarning) {
    console.log(
      'WARNING: THE starter COMMAND CAN TAKE TENS OF MINUTES TO RUN'
    )
    const input = prompt("DO YOU REALLY WANT TO PROCEED (Y/N): ")
    if (input === null) {
      // User pressed ^C
      process.exit(0)
    }
    if (input.toLowerCase() !== "y") {
      return
    }
  }

  console.log('Press ^C to quit the app if it runs for too long')
  const { ranking, count } = findGoodStarters()

  output = Object.entries(ranking)
                 .reduce((string, [word, count], index) => {
    if (count < 10) {
      count = "    " + count
    } else if (count < 100) {
      count = "   " + count
    } else if (count < 1000) {
      count = "  " + count
    } else if (count < 10000) {
      count = " " + count
    }

    if (index % 5) {
      string += " "
    } else {
      string += "\n  "
    }
    string += word + ": " + count + ","

    return string
  }, "Number of ladders found for each starting word: {")

  console.log(
   output.slice(0, -2) + "\n}"
  )
  console.log(
    "A total of %d ladders of at least %d words were found",
    count,
    charCount + 1
  )
}


// WHILE LOOP // WHILE LOOP // WHILE LOOP // WHILE LOOP // WHILE LOOP //
while (true) {
  const input = prompt("> ")
  if (input === null) {
    // User pressed ^C
    return
  }

  // Be lenient about case
  const [command, ...rest] = input.split(" ")
                                  .map(word => word.toLowerCase())
  
  switch (command) {
    case "exit":
      return
    case "help":
      help()
      break
    case "h":
      h()
      break
    case "load":
    case "ld":
      load(...rest)
      break
    case "anagrams":
    case "a":
      printAnagrams(...rest)
      break
    case "reversed":
    case "r":
      printReversed()
      break
    case "palindromes":
    case "p":
      printPalindromes()
      break
    case "neighbours":
    case "n":
      printNeighbours(...rest)
      break
    case "ladders":
    case "l":
      printLadders(...rest)
      break
    case "anagramladders":
    case "al":
        printAnagramLadders(...rest)
      break
    case "simpleladders":
    case "sl":
      printSimpleLadders(...rest)
      break
    case "starters":
    case "s":
      printGoodStarters(...rest)
      break

    default:
      console.log(`Unknown command: ${command}`)
  }
}