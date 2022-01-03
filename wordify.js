const prompt=require("prompt-sync")(),{setWordList:setWordList,findNeighbours:findNeighbours,findAnagrams:findAnagrams,findReversedWords:findReversedWords,findPalindromes:findPalindromes,findLadders:findLadders,findAnagramLadders:findAnagramLadders,findSimpleLadders:findSimpleLadders,findGoodStarters:findGoodStarters}=require("./wordr");let charCount=0;function help(){console.log('Wordify commands:\n* exit\n  Exits Wordify.\n\n* help\n  Prints this Help message, complete with examples.\n\n* h\n  Prints a concise help message with no examples.\n\n* load word1 word2 ... wordN\n  (where all words are the same length)\n  Loads that exact list of words\n\n  > load hips hops cops coos coop chop shop ship\n  Loaded 8 4-letter words\n\n* load N:\n  (where N is a number from 2 to 16)\n  Shortcut: ld N\n  Loads a list of words of N characters.\n\n  > load 4\n  Loaded 2022 4-letter words\n\n* anagrams [word]:\n  Prints a list of all anagrams, if no argument is given, or anagrams of the given word.\n  Shortcut: a [word]\n\n  > anagrams stop\n  [ "stop", "spot", "post", "tops", "pots", "opts" ]\n\n  > anagrams\n  [ "with", "whit" ]\n  ...\n  [ "toed", "dote" ]\n  Found 340 anagrams for 4-letter words.\n\n* reversed:\n  Prints a list of pairs of words that use the same letters in the reverse order.\n  Shortcut: r\n\n  > reversed\n  [ "said", "dias" ]\n  ...\n  [ "blub", "bulb" ]\n  Found 102 reversed pairs in the list of 4-letter words.\n\n* palindromes:\n  Prints a list of all words that read the same forwards and backwards.\n  Shortcut: p\n\n  > palindromes\n  [ "sees", "noon", "deed", "poop" ]\n  Found 4 palindromes in the list of 4-letter words.\n\n* neighbours [word or integer column count]\n  Prints an array of all words that differ from word by only one letter.\n  If an integer argument is provided, an array of all words that have\n  at least one neighbour will be shown, with integer defining the \n  number of columns. If no argument is given, 4 columns will be shown.\n  Shortcut: n [word | integer]\n\n  > neighbours word\n  [ "cord", "ford", "lord", "ward", "woad", "wold", "wood", "wore", "work", "worm", "worn" ]\n  Found 11 neighbours in the list of 4-letter words.\n\n  > neighbours 5\n  Words with at least 1 neighbour:\n  [ "able", "ably", "aces", "ache", "acid",\n  ...\n    "zips", "zone", "zoom", "zoos"]\n  Found 1964 words with neighbours\n\n* ladders word1 word2:\n  Prints a list of the shortest word ladders from word1 to word2.\n  Shortcut: l word1 word2\n\n  > ladders make done\n  [ "make", "mane", "dane", "done" ]\n  Found 1 word ladder in the list of 4-letter words.\n\n* anagramLadders [word]:\n  where word may be:\n  • "=short"\n  • "=long"\n  • "=reversed"\n  • any word with the right number of letters\n  • left blank\n  Prints a list of word ladders for pairs of anagrams for the current word set. Special cases for \'word\':\n  • "=short": prints the list of all the shortest ladders\n  • "=long": prints the list of all the longest ladders\n  • "=reversed": prints the list of all ladders for reversed word pairs\n  If \'word\' is absent, all anagram ladders will be printed, sorted from shortest to longest.\n  If \'word\' is any word in the currently loaded word list, then all the word ladders to all its anagrams will be printed.\n  Shortcut: al [word]\n\n  > anagramLadders =short\n  [ "thaw", "that", "what" ]\n  ...\n  [ "puts", "pups", "tups" ]\n  Found 60 short word ladders in the list of 4-letter words.\n\n  > anagramLadders =long\n  [ "much", "muck", "mock", "cock", "cork", "corn", "coin", "chin", "thin", "this", "thus", "thug", "chug", "chum" ]\n  ...\n  [ "mane", "dane", "dune", "duns", "dues", "dyes", "eyes", "ewes", "ewer", "ever", "even", "oven", "omen", "amen" ]\n  Found 26 long word ladders in the list of 4-letter words.\n\n  > anagramLadders =reversed\n  [ "deer", "deed", "reed" ]\n  ...\n  [ "diva", "dive", "dire", "dirt", "dart", "wart", "wait", "gait", "grit", "grid", "arid", "avid" ]\n  Found 558 anagram ladders in the list of 4-letter words.\n\n  > anagramLadders list\n  [ "list", "lilt", "silt" ]\n  [ "list", "lost", "loot", "soot", "slot", "slit" ]\n  [ "slit", "slot", "soot", "soft", "sift", "silt" ]\n  Found 3 anagram ladders in the list of 4-letter words.\n\n  > anagramLadders\n  [ "what,that,thaw" ]\n  ...\n  [ "mane", "dane", "dune", "duns", "dues", "dyes", "eyes", "ewes", "ewer", "ever", "even", "oven", "omen", "amen" ]\n  Found 2329 anagram ladders in the list of 4-letter words.\n\n* simpleLadders word [truthy]\n  Prints a list of all the ladders starting with word and ending with\n  a word where all the letters are different, or rearranged.\n\n  If a second argument is provided (even the word \'false\'), then the\n  requirement that all letters be different or rearranged will be\n  lifted, so more ladders will be returned\n  Shortcut: sl\n\n  > simpleLadders elks\n  [ "elks", "elms", "alms", "arms", "army" ]\n  Found 1 simple ladder in the list of 4-letter words.\n\n  > simpleLadders elks 1\n  [ "elks", "elms", "alms", "aims", "aids" ]\n  ...\n  [ "elks", "elms", "alms", "arms", "arts" ]\n  Found 13 simple ladders in the list of 4-letter words.\n\n  Note that all the unfiltered ladders in the example above, the letter "s" is still in last place.\n\n* starters\n  (Eventually) prints a map of words with the number of ladders that\n  they can create. The map is sorted by the number of non-trivial ladders that can be created starting from the given word.\n\n  > starters\n  WARNING: THE starter COMMAND CAN TAKE TENS OF MINUTES TO RUN\n  DO YOU REALLY WANT TO PROCEED (Y/N): y\n  Press ^C to quit the app if it runs for too long\n  Number of ladders found for each starting word: {\n    smug: 20350, stow: 19122, arab: 18286, knob: 17545, arty: 17298,\n    ...\n    shod:  6568, awry:  6559, shed:  6550, lose:  6510, whew:  6435,\n    phew:  6348, pots:  6270, raft:  6264, egos:     2, each:     1,\n    inca:     1, eddy:     1, edge:     \n  }\n  A total of 8442000 ladders of at least 5 words were found\n')}function h(){console.log("Wordify commands:\n* exit\n* help\n* h\n* load <integer>\n* load word1 ... wordN\n* anagrams\n* anagrams <word>\n* reversed\n* palindromes\n* neighbours [word | column count]\n* ladders <word1> <word2>\n* anagramLadders\n* anagramLadders =short\n* anagramLadders =long\n* anagramLadders =reversed\n* anagramLadders <word>\n* simpleLadders <word> [allow_partially_changed_words]\n* starters\n")}function _wordListNotLoaded(e){if(!charCount)return console.log(`Unable to execute the command "${e}". Please use the "load" command first.`),!0}function _printArray(e){e.length?console.log('[ "'+e.join('", "')+'" ]'):console.log([])}function _printArrayLength(e,r){const n=1===e?`1 ${r}`:`${e} ${r}s`;console.log(`Found ${n} in the list of ${charCount}-letter words.`)}function load(e,...r){let n;if(r.length)r.unshift(e),n=e.length;else{if(n=parseInt(e,10),isNaN(n))return console.log("load requires a number as the first argument (received: %s)",n);if(n<2||n>16)return console.log(`load requires a number between 2 and 16 as the first argument (received: ${n})`);const o=`./word_lists/${n}-letter-words.json`;try{r=require(o)}catch(e){switch(e.code){case"MODULE_NOT_FOUND":e="file not found";break;default:e="invalid JSON file"}return console.log(`Error loading the file ${o}: ${e}`)}}const o=setWordList(r);isNaN(o)?(console.log(o),charCount&&console.log(`A list of words of ${charCount} letters is currently loaded.`)):(console.log(`Loaded ${o} ${n}-letter words`),charCount=n)}function printAnagrams(e){if(_wordListNotLoaded("anagrams"))return;if(e&&e.length!==charCount)return console.log('If you provide a word for "anagrams", it must be %d letters long (received: "%s").',charCount,e);const r=findAnagrams(e);e?_printArray(r):(r.forEach(_printArray),_printArrayLength(r.length,"anagram"))}function printReversed(){if(_wordListNotLoaded("reversed"))return;const e=findReversedWords();e.forEach(_printArray),_printArrayLength(e.length,"reversed pair")}function printPalindromes(){if(_wordListNotLoaded("palindromes"))return;const e=findPalindromes();_printArray(e),_printArrayLength(e.length,"palindrome")}function printNeighbours(e=4){if(_wordListNotLoaded("neighbours"))return;let r;if(e)if(isNaN(e)){if(e.length!==charCount)return console.log('You must provide a %d-letter word for neighbours (received "%s").',charCount,e)}else r=parseInt(e,10),e="";const n=findNeighbours(e);if(e)_printArray(n),_printArrayLength(n.length,"neighbour");else{const e=n.length,o=n.reduce((e,n,o)=>(e+='"'+n+'",',e+=(o+1)%r?" ":"\n  "),"Words with at least 1 neighbour:\n[ ");console.log(o.slice(0,-2)+"]"),console.log(`Found ${e} words with neighbours`)}}function printLadders(e,r){if(_wordListNotLoaded("ladders"))return!0;if(!e||!r)return e&&(e=`"${e}"`),console.log("ladder requires two words (received: %s and %s).",e,r);if(e.length!==charCount||r.length!==charCount)return console.log('ladder requires two words of length %d (received "%s" and "%s").',charCount,e,r);const n=findLadders(e,r),o=n.length;o&&n.forEach(e=>{_printArray(e)}),_printArrayLength(o,"word ladder")}function printAnagramLadders(e){if(_wordListNotLoaded("ladders"))return!0;let r=!0;if(e)if("=reversed"===e||"=simple"===e||"=short"===e||"=long"===e)r="=reversed"===e;else if(e.length!==charCount)return console.log(`If you provide an argument for anagramLadders it must be one of the following:\n* a word of length ${charCount}\n* =long\n* =short\n* =reversed\n(Received: "${e}")`);const n=findAnagramLadders(e);if(r)n.forEach(e=>e.forEach(_printArray)),length=n.reduce((e,r)=>e+r.length,0),_printArrayLength(length,"anagram ladder");else{let r;n.forEach(_printArray),r="="===e[0]?e.substring(1)+" word ladder":"word ladder",_printArrayLength(n.length,r)}}function printSimpleLadders(e,r){if(_wordListNotLoaded("simpleLadders"))return!0;if(!e)return console.log("simpleLadders requires a seed word");if(e.length!==charCount)return console.log("simpleLadders requires a %d-letter seed word (received: %s).",charCount,e);const n=findSimpleLadders(e,!r);let o=0;n.forEach(e=>{e.forEach(e=>{o+=1,_printArray(e)})}),_printArrayLength(o,"simple ladder")}function printGoodStarters(e){if(_wordListNotLoaded("starters"))return!0;if(!e){console.log("WARNING: THE starter COMMAND CAN TAKE TENS OF MINUTES TO RUN");const e=prompt("DO YOU REALLY WANT TO PROCEED (Y/N): ");if(null===e&&process.exit(0),"y"!==e.toLowerCase())return}console.log("Press ^C to quit the app if it runs for too long");const{ranking:r,count:n}=findGoodStarters();output=Object.entries(r).reduce((e,[r,n],o)=>(n<10?n="    "+n:n<100?n="   "+n:n<1e3?n="  "+n:n<1e4&&(n=" "+n),e+=o%5?" ":"\n  ",e+=r+": "+n+","),"Number of ladders found for each starting word: {"),console.log(output.slice(0,-2)+"\n}"),console.log("A total of %d ladders of at least %d words were found",n,charCount+1)}for(;;){const e=prompt("> ");if(!e)return;const[r,...n]=e.split(" ").filter(e=>!!e).map(e=>e.toLowerCase().trim());switch(r){case"exit":return;case"help":help();break;case"h":h();break;case"load":case"ld":load(...n);break;case"anagrams":case"a":printAnagrams(...n);break;case"reversed":case"r":printReversed();break;case"palindromes":case"p":printPalindromes();break;case"neighbours":case"n":printNeighbours(...n);break;case"ladders":case"l":printLadders(...n);break;case"anagramladders":case"al":printAnagramLadders(...n);break;case"simpleladders":case"sl":printSimpleLadders(...n);break;case"starters":case"s":printGoodStarters(...n);break;default:console.log(`Unknown command: ${r}`)}}