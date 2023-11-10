# Word Search: a command-prompt app

Can you create an app that calculates the relationships between words?

For example:

* Find the anagrams of the word "stars":
    
    arts, rats, star, tsar

* Find palindromes - words that read the same forwards and backwards:
    
    civic, level, madam, radar, refer, sexes, tenet

* Find words that give other words in reverse:
  
    abut, tuba; ... evil, live; ... tort, trot

* Find word ladders — lists of words that differ by just one letter:

    word, lord, lore, lose, lost, list

* Find word ladders where the last word is the reverse of the first:

    dial, deal, dead, lead, lend, land, laid

 * Find word ladders where each letter changes exactly once:

    goat, boat, beat, belt, bell

---
## Demo

This repository contains two minified scripts: `wordify.js` and `wordr.js`.

If you run `node wordify`, you can see a demo of an app like the one you can make in this project.

In the Command Prompt, type `help` to see a complete description of the available commands:

```node
> help
Wordify commands:
* exit
  Exits Wordify.

* help
  Prints this Help message, complete with examples.

* h
  Prints a concise help message with no examples.

<SNIP>
```
Test each of the commands (and also test what happens if you type non-existant commands), to see what output is printed in the Terminal window.

You have already met all but two of the JavaScript techniques that you will need to write a similar app. The `index.js` and `word_search.js` scripts already handle the two unfamiliar techniques for you. These new techniques are also explained below.

---

## Word Lists

This repository contains a directory named `word_lists`. This directory contains 15 files with names like `2-letter-words.json` to `16-letter-words.json`. The words in each list are chosen from [the most frequently used words in a corpus based on Project Gutenberg](https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists#Top_English_words_lists). You can use these word lists, or you can [find lists of words in another language](https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists) and use those words instead.

---
## A Terminal-based App

With the help of a couple of simple new concepts, you can create an interactive app that runs in a Terminal window.

1. [**`require`**](#require)
   This Node function allows you to read data from one file to use in another.
2. [**The `prompt-sync` module:**](#prompt-sync)
   This allows you to read a line of text from the Terminal into your a script that is running in Node.js

 <br>

### ***`require`***

The `require` function is built in to Node.js. It takes a path to a JS or JSON file as its argument, and returns an object.

Your can find the official documentation [here](https://nodejs.org/en/knowledge/getting-started/what-is-require/).

<br>

#### ***`require` with a JavaScript file***
For JavaScript files, `require` reads the file, executes it, and then returns a `module.exports` object. By default, this will be an empty object: `{}`. However, if the JS file includes a line such as...

`module.exports = { my: "exported", object: 0 }`

... or any other object, then that is the object that will be returned.

Example:
`demo.js`
```javascript
module.exports = function () { console.log("exported function" )}
```

`index.js`
```javascript
const demo = require('./demo')
demo()
```

In the Terminal:
```node
node index
exported function
```

<br>

#### ***`require` with a JSON file***

For JSON files, the object defined in the file will be returned instead. For example:

`wordlist.json`:
```json
[
  "chop",
  "coop",
  "coot",
  "cost",
  "post",
  "shop",
  "stop"
]

```

`index.js`
```javascript
const wordlist = require('./wordlist')
console.log("wordlist:", wordlist)
```

In the Terminal:
```node
node index
wordlist: [
  'chop', 'coop',
  'coot', 'cost',
  'post', 'shop',
  'stop'
]
```

<br>

### ***`prompt-sync`***

The `prompt-sync` module allows you to create an interactive dialog with the user of your app. For example:

`index.js`
```javascript
const prompt = require('prompt-sync')()

while (true){
  const input = prompt("> ") // returns the string typed by the user

  const [command, arg] = input.split(" ")
  switch (command) {
    case "load":
      console.log(`Loaded 2022 ${arg}-letter words`) // or something more useful
      break // remain inside the while loop
    case "exit":
      return // exit the while loop
  }
}
```

In the Terminal:
```node
$ node index
> load 4
Loaded 2022 4-letter words
> exit
$
```

![animated illustration of prompt-sync](img/load.gif)

#### ***Installing `prompt-sync`***
To use the `prompt-sync` module in your project, you need to:
1. Open a Terminal pane
2. `cd` to your project director
3. Run the command `npm install promp-sync`

This will create three new entries in your project directory:
* package.json
* package-lock.json
* node_modules/

Once you have done this, you will be able to use the command...

   `const prompt = require('prompt-sync')()`

Note that the `prompt-sync` module returns a higher-order function, and that you need to call that function in order to obtain a function that you can use to read the user's input.

## Tasks
1. [Install the `prompt-sync` module](#installing-prompt-sync)
2. [Create an `index.js` file which uses `prompt-sync` to create a Command Prompt interface](#prompt-sync). 
3. [If the user types `exit`, or presses `^C` (Ctrl-C, for "Cancel") the app should exit](#exit-the-app-gracefully)
4. [Use `require` to load one of the wordlists from the `word_lists/` directory](#load-a-word-list)
5. [Create a `word_search.js` file to store the word list, and all the functions that you are about to write. Use `require` to make the features of the `word_search.js` file available in `index.js`](#word_search.js)
6. [Handle user input errors](#handle-user-errors)
7. [Create a `findAnagrams` function in `word_search.js.](#findAnagrams)
8. [Provide a case in Command Prompt loop that will call the `findAnagrams` function and display the output](#the-anagrams-command)
9. [Create commands to print out reversed words and palindromes](#the-reversed-and-palindromes-commands)
10. [Create a `ladders` command and a `findLadders` function that prints out word ladders, like "this", "thin", "than", "that"](#the-ladders-command)
11. [Create commands and function that print out ladders that start and end with anagrams or reversed words](#anagram-and-reversed-word-ladders).
12. [Create your own extensions of the app](#other-tricks-with-words)

---
### ***Exit the app gracefully***

If you use the `return` command from inside the `while () {...}` loop, the app will exit. You can add an explicit case in your `switch` statement that will execute the `return` command.

But what if the user presses `^C`? In this case, the `prompt-sync` module returns the value `null`, and not a string. This is likely to make Node throw an error before it quits.

You can check if the value returned by your `prompt()` call is a string, and if not, execute the `return` command to exit the app gracefully.

---
### ***Load a word list***

You can use code like the following to read in the contents of a JSON file:

```javascript
const count = 4
const wordlist = require(`./word_lists/${count}-letter.words.json`)
```

* How will you ask the user for the value of `count`, so that you know which file to load?
* How can you check whether the file was correctly loaded, and that it contains a list of words of the right length?

---
### ***`word_search.js`***

One of the precepts of writing good code is to use break it up into small pieces, where each piece does one thing, and does it very well.

You can use the `index.js` file to run the Command Prompt interface, and a second file (let's call it `word_search.js`) to deal with all the intricacies of working with the words in a chosen word list.

Create a file called `word_search.js` and leave it empty for now.

In your `index.js` file, add the following lines:

```javascript
const exported = require('./word_search')
console.log(exported)
```
Now run `node index`. You should see the following output in the Terminal window:

```javascript
{}
```

Suppose you want to have a `setWordList` function inside your `word_search.js` file. You could add the following code:

```javascript
let wordList

function setWordList(words) {
  if (!Array.isArray(words)) {
    return "words is not an array"
  }
  
  wordList = words

  return wordList.length
}


module.exports = {
  setWordList
}
```

Now, in `index.js` you can replace the `exported` lines above with the following:

```javascript
const { setWordList } = require('./word_search')
```

The function `setWordList` from `word_search.js` will now be accessible to your `index.js` script.

Your entire `index.js` script could look something like this:

`index.js`
```javascript
const prompt = require('prompt-sync')()
const { setWordList } = require('./word_search')


while (true){
  const input = prompt("> ") // returns the string typed by the user

  if (!input) {
    return
  }

  const [command, ...rest] = input.split(" ")
  switch (command) {
    case "load":
      load(...rest)
      break // remain inside the while loop
    case "exit":
      return // exit the while loop
  }
}


function load(count) {
  words = require(`./word_lists/${count}-letter-words.json`)
  const result = setWordList(words)

  if (isNaN(result)) {
    return console.log(result)
  }

  console.log(`Loaded list of ${result} ${count}-letter words`)
}
```
Now, if the user types (say) `load 4` into the Command Prompt, they might see something like this:

```node
> load 4
Loaded list of 2022 4-letter words
```

---
### ***Handle user errors***

Suppose the user types an invalid command, like `load4`, `load four` or `load 40`. Your simple app will crash.

Can you imagine all the errors that a user could make, and write defensive code? You can use `console.log()` to print a helpful message to the Terminal window, instead of executing a non-existant command or a valid command with an invalid argument.

---
### ***Handle system errors***

The `word_list/` directory contains three files which will cause problems if you try to load them. 

* `17-letter-words.json` contains an array of words of different lengths
* `18-letter-words.json` contains an object, not an array
* `19-letter-words.json` contains a string which is invalid JSON
* `20-letter-words.json` does not even exist

How can you handle the errors that attempting to load each of these files will cause? (And yes, in this case, the simplest is to insist that the value of `count` in the `load` function is between 2 and 16, but your code should be robust enough to handle any potential input.)

---
### ***`findAnagrams`***

Now that you can load a word list into your `word_search` module, can you add a `findAnagrams` function, and export it so that `index.js` can use it?

How can you tell if two words are anagrams?

Would it make sense to calculate anagrams every time that `findAnagrams` is called, or would it be better to run the calculations once and cache the results?

How can you store the results so that `findAnagrams("this")` will return all anagrams of "this"? (And don't be too disappointed: the word lists do not contain any taboo words : )

While you are working in the `word_search.js` file, your `index.js` file could look something like this (plus, of course, your `while` loop, and all the defensive error-checking code that you added during the last two steps):

```javascript
const { 
  setWordList,
  findAnagrams
} = require('./word_search')

// <<< Temporary smoke tests
load(4)
console.log(findAnagrams("this"))
// tests >>>

function load(count) {
  words = require(`./word_lists/${count}-letter-words.json`)
  const result = setWordList(words)
}
```
This means that you can see if `findAnagrams` is working at all, just by running `node index`. And it also means that you can place breakpoints in either `index.js` or `word_search.js` and then use the Debugger to test where you code is not doing what you expect it to.

***NOTE:*  the Debugger will not support calls using `prompt-sync`, so you will need to be able to run it without making such calls.**

---
### ***The `anagrams` command***

When you are satisfied that the `findAnagrams` function is working correctly, you can create a `case` in the `switch` statement inside the `while` loop to allow the user to get the anagrams of any given word. It could work something like this:

```node
> anagrams this
[ "hits", "this" ]
```

#### Defensive coding

* What should happen if the user does not type a word after `anagrams`?
* What if the user types a word with the wrong number of letters?
* What if the user types the right number of letters but they do not form a known word?

---
### ***The `reversed` and `palindromes` commands***

Reversed pairs, like 'doom' and 'mood', 'lager' and 'regal', and 'drawer' and 'reward' are special kinds of anagrams. But would using your lists of anagrams actually be the best way to find them?

Palindromes, like 'eye', 'noon' and 'level' words which, when reversed, read exactly the same way.

Can you add `findReversed` and `findPalindromes` functions to your `word_search.js` script?

Can you create `case`s in the `switch` statement in the `while` loop that will cause these functions to be called when the user types in the associated commond, and which print out the associated lists of words?


---
### ***The `ladders` command***

OK. Now that you are warmed up, let's move to a different level of complexity.

Imagine a `ladders` case for your `while` loop `switch` statement, that will produce a result like this:

```node
> ladders fail pass
[ "fail", "fall", "pall", "pals", "pass" ]
[ "fail", "pail", "pall", "pals", "pass" ]
```

The `ladders` command should print out _all_ the shortest paths from one word to another, changing just one letter at a time. Some ladders can be very long. Here's one that takes 14 steps to reach an anagram of the first word:

```node
ladders chum much
[ "chum", "chug", "thug", "thus", "this", "thin", "chin", "coin", "corn", "cork", "cock", "mock", "muck", "much" ]
```

You will need to write a `findLadders` function in the `word_search.js` file. There are many ways to do this, but the calculations will be long and costly in CPU usage. A lot of different false routes might need to be explored before the shortest path can be found. 

Below you will find three different techniques. They are all _breadth first_. That is, they all:

* Generate a list of all possible second words in the ladder
* Use that list of second words to generate a list of all possible third words
* Keep track of words that have already been met, so they are not treated a second time
* Continue to create a wider and wider list of words at each subsequent level...
* ...until the target word is reached.
* Eliminate all the potential paths that did not reach the target word so soon.

1. ***Just in time***
   
   Iterate through each letter position in the first word, iterating through all the other letters in the alphabet to replace the current letter at that position, checking if the new string is included in the current word list. If so, add the new word to a list of candidates for the next rung.

   Then iterate through all the candidates for the next rung in the same way, to create a new list of candidates for the following rung. If any of the candidates is the target word, finish the current loop (just in case there are more paths of the same length to the target word), eliminating any paths which haven't reached the target word yet.

   Advantages:
   * Only words that are potentially part of the solution will be treated.
   * Memory requirements are low

   Disadvantages:
   * The same calculations on the same words may need to be repeated on a subsequent `findLadders` call, which is inefficient.

2. ***Pre-processing***

   Inside the `setWordList` function, you can do some pre-processing. For each word in the list, find its nearest neighbours: the other words in the list that differ by just one letter.

   When `findLadders` is called, you can use the known neighbours of the first word to define the possibilities for the second rung of the ladder, then use the known neighbours of the possible words in the second rung to define the possibilities for the third rung, and so on. As soon as one of the possibilities for the next rung is the target word, you can stop looking for further rungs... but there may be other ways to reach the target word in the same number of steps, following one of the paths that you have already calculated.

   Advantages:
   * Calls to `findLadders` will run faster with pre-processing. This is good if you plan to make many such calls.

   Disadvantages: 
   * Pre-processing will take time when a word list is loaded, regardless of how many times `findLadders` is called.
   * Pre-processing will treat all words, even those that will never be used later
   * The pre-processed 'neighbours' arrays will require a significant amount of RAM space

3. ***Memoization***

   [Memoization](https://en.wikipedia.org/wiki/Memoization) is a hybrid technique. It does not require pre-processing. Instead, the first time a 'neighbours' array is created using the Just In Time technique, the results are stored (or 'remembered') for later use. Complete ladders can also be stored; a future call to `findLadders` may be able to make use of slices of previously calculated ladders.

   In the beginning, the technique will run more slowly than the Just In Time technique, because of the need for creating the store of results. Later calls may become progressively faster, as they make use of the stored data. However, calls to `findLadders` will never quite achieve the speeds of the Pre-processing technique, because the code must include checks to see if the appropriate data is already stored, while the Pre-processing technique can skip these checks.

### ***Anagram and reversed-word ladders***

Now you have a `ladders` command to print out ladders that lead from one given word to another.

Can you create an `anagramLadders` command that allows the user to input just one word, and that will output a list of ladders from that word to all its anagrams?

What output should be printed if the user types `anagramLadders` on its own, with no seed word?

Can you allow the user to input non-word arguments such as `=reversed`, `=short` or `=long` that will print out just a selection of all the possible anagram ladders for the current word list:

* `=reversed`: just ladders where the end word is the start word, reversed
* `=short`: just the shortest ladders from one anagram to another
* `=long`: just the longest ladders from one anagram to another

---
### ***Other tricks with words***

If you have completed all the above tasks and are still feeling inspired, can you take on some even more complex challenges?

* Can you provide shortcuts for the commands? For example, instead of typing `palindromes`, you could also type just `p`.

* Can you make it unnecessary to use the `load` command? For example, the command `ladders less more` would automatically load the 4-letter word list, if it isn't already loaded, while `ladders small large` would automatically load the 5-letter wordlist.

* If the `load` command is no longer necessary, how would you deal with commands like `reversed`, when you want to load a word list for a different number of letters?

* Can you create [word squares](https://en.wikipedia.org/wiki/Word_square)?

* Using multiple word lists, can you create games like [Ghost](https://en.wikipedia.org/wiki/Ghost_(game)) or [Add a letter](https://www.quora.com/What-nine-letter-word-in-English-still-remains-a-word-each-time-you-take-away-a-letter)?

* Again, using multiple word lists, can you create some simple [crossword puzzle](https://en.wikipedia.org/wiki/Crossword) solution grids?
