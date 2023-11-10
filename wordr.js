/**
 * wordr.js
 * 
 * A module containing functions for working with arrays of words
 * of the same length. In particular, it finds:
 * 
 * • anagrams
 * • pairs of words whose letters are in the reverse order
 * • palindromes
 * • word ladders: lists of words which change by one letter at a time
 */


// The following variables are set when setWordList is called
let charCount     // number of chars in all words in wordlist
let neighbours    // map of arrays of words that differ by one letter
let anagrams      // map of arrays of anagrams
let reversedWords // nested array of reversed words (subset of anagrams)
let palindromes   // array of palindromes



//// PUBLIC FUNCTIONS //// PUBLIC FUNCTIONS //// PUBLIC FUNCTIONS ////

/**setWordList
 * 
 * Resets the module variables (see above) with entries from the new
 * word array. Must be called successfully before any other public
 * function can be called.
 * 
 * @param {String[]} words 
 * @returns          a string error message or the integer length of
 *                   words if it was a valid array of words of equal
 *                   length
 */
function setWordList(words) {
  // Check that all entries are words of the same length
  const isInvalid = _wordListIsInvalid(words)
  if (isInvalid) {
    // isInvalid is an string describing the error
    return isInvalid
  }

  // If we get here, all the items is the words array are strings with
  // the same length
  charCount = words[0].length

  _setNeighbours(words)
  _setAnagrams(words)
  _setReversedAWordsAndPalindromes(words)

  return words.length
}


/**
 * @param {String} word 
 * @returns        an array of anagrams of the input word
 */
function findAnagrams(word) {
  if (word) {
    // Return anagrams of just this one word
    const key = [...word].sort().join('')
    return anagrams[key] || []
  }

  // Return just the values, not the alphabetically scrambled keys
  return Object.values(anagrams)
}


function findPalindromes() {
  // Return clone so stored array cannot be altered from outside
  return [...palindromes]
}


function findReversedWords() {
  // Return clone so stored array cannot be altered from outside
  return [...reversedWords]
}


/** findNeighbours
 * 
 * @param {String} may be a word
 * @returns        If a word is given, returns an array of words which
 *                 differ by just one letter.
 *                 If no word is given,  returns an array of words
 *                 which have at least one such neighbour.
 */
function findNeighbours(word) {
  if (!word) {
    // Provide an array of words that do have neighbours
    return Object.keys(neighbours)
  }

  return neighbours[word] || []
}


/** findLadders
 * 
 * @param {String} end 
 * @param {String} start 
 * @returns        an array of arrays of the shortest word ladders
 *                 which begin with start and finish with end. 
 */
function findLadders(start, end) {
  if (!neighbours || !neighbours[start] || !neighbours[end]) {
    // There can be no path to or from a word without neighbours
    return []
  }

  // Start at the end and work backwards, because accessing array[0] is
  // faster than accessing the last entry in an array 
  let ladders = [[end]]
  const treated = new Set()
  let done = false

  while (!done) {
    // Collect all the new words that are accessible this time
    const visited = new Set()
  
    // Start at the end. Replace each current path with longer ones.
    const maxIndex = ladders.length
    for ( let ii = 0; ii < maxIndex; ii += 1) {
      const rung = ladders.shift()
      // ["whet"]
      const next = neighbours[rung[0]]
      // [ 'what', 'when', 'whew', 'whey', 'whit' ]
      next.forEach( word => {
        if (!treated.has(word)) {
          // No shorter ladder contains word yet: a new candidate.
          ladders.push([word, ...rung])
  
          if (word === start) {
            // We've completed one of the shortest ladders...
            // but there may be more of the same length
            done = true
  
            // Note that we don't need to update visited any more
            // because another iteration won't be needed
          } else {
            visited.add(word)
          }
        }

        return true
      })
    }
  
    if (!done) {
      // Get ready for the next iteration... if there can be one.
      if (visited.size) {
        // Update the list of words that have a shortest path
        visited.forEach(treated.add, treated)
  
      } else {
        // No new steps were found. There's no path between the words.
        ladders.length = 0
        done = true
      }
    }
  }

  // Remove all ladders that did not reach the start word
  ladders = ladders.filter( ladder => ladder[0] === start )

  return ladders
}


/** findAnagramLadders
 * 
 * @param {String} wanted may one of the following:
 *                 • "=short"
 *                 • "=long"
 *                 • "=reversed"
 *                 • any word with the right number of letters
 *                 • left blank
 * @returns        an array of ladder arrays, whose content depends on
 *                 the value of wanted:
 *                 • "=short":    all the shortest ladders
 *                 • "=long":     all the longest ladders
 *                 • "=reversed": all ladders for reversed word pairs
 *                 • <word> :     all the ladders to all its anagrams 
 *                 • ~falsy~:     all anagram ladders sorted from
 *                                shortest to longest.
 */
function findAnagramLadders(wanted) {
  let all = []
  let longest = []
  let shortest = []

  let getAll = true
  let getShort
  let getLong
  let anagrams

  if (wanted === "=reversed") {
    anagrams = findReversedWords()
    wanted = ""

  } else {
    if (typeof wanted === "string" || Array.isArray(wanted)) {
      getShort = wanted.includes("=short")
      getLong  = wanted.includes("=long")

      if (getShort || getLong) {
        wanted = ""
        getAll = false
      }
    }

    anagrams = findAnagrams(wanted)
  }

  if (anagrams && anagrams.length) {
    let anagramPairs = []

    if (wanted) {
      // anagrams is a simple list of words with the same letters
      anagrams.forEach( word => {
        if ( wanted !== word ) {
          anagramPairs.push([ wanted, word ])
        }
      })

    } else {
      // anagrams is a nested list of anagram lists
      anagrams.forEach( words => {
        const length = words.length
        if (length === 2) {
          anagramPairs.push(words)

        } else {
          // Create all the possible combinations
          for ( let ii = 0; ii < length; ii += 1 ) {
            for ( let jj = ii + 1; jj < length; jj += 1 ) {
              anagramPairs.push([words[ii], words[jj]])
            }
          }   
        }
      })
    }

    let maxCount = 0
    let minCount = 999
    anagramPairs.forEach(([ word1, word2 ]) => {
      const ladders = findLadders(word1, word2)
      const length = ladders.length && ladders[0].length

      if (getAll) {
        if (length) {
          all.push(ladders)
        }
      } else {

        if (length) {
          if (getShort) {
            if (minCount > length) {
              minCount = length
              shortest.length  = 0
            }

            if (minCount === length) {
              shortest.push(...ladders)
            }
          }

          if (getLong) {
            if (maxCount < length) {
              maxCount = length
              longest.length  = 0
            }

            if (maxCount === length) {
              longest.push(...ladders)
            }
          }
        }
      }
    })
  }

  if (getLong) {
    if (getShort) {
      return { 
        shortest,
        longest
      }
    } else {
      return longest
    }
  } else if (getShort) {
    return shortest

  } else {
    all.sort((a, b) => a[0].length - b[0].length)
    return all
  }
}


/** findSimpleLadders
 * 
 * @param {String}  seed is the word that will start each output ladder
 * @param {Boolean} filtered 
 * @returns         an array of ladder arrays, starting with seed.
 *                  If filtered is truthy, the last word in each ladder
 *                  will have a different letter in each place, from
 *                  the seed.
 *                  If filtered is falsy, the letters in some places 
 *                  may have changed more than once, and letters in
 *                  other places may not have changed at all.
 */
function findSimpleLadders(seed, filtered) {
  let seeds = [seed]
  const endPoints = []
  // Don't let any word be treated twice, so ladders keep changing
  let treated = []

  // Replace seeds with an array of words at the limit of what can
  // be reached
  let count = charCount
  while (count--) {
    seeds.forEach( seed => {  
      const neighbourArray = neighbours[seed]
      if (neighbourArray) {
        neighbourArray.forEach( neighbour => {
          if (treated.indexOf(neighbour) < 0) {
            // This word could not have been reached earlier
            treated.push(neighbour)
            endPoints.push(neighbour)
          }
        })
    }})

    seeds = [...endPoints]
    endPoints.length = 0
  }

  if (filtered)
    seeds = seeds.filter( word => (
    // Remove any words where any letters in the same place are the same
    [...word].every(( char, index ) => seed[index] !== char)
  ))

  return seeds.map( word => (
    // Replace the word with an array of ladders to the word
    findLadders(seed, word)
  ))
}


// // Using new Set() is about twice as fast
// function findSimpleLadders(seed, filtered) {
//   let seeds = new Set([seed])
//   let treated = new Set()
//   const endPoints = new Set()

//   let count = charCount
//   while (count--) {
//     seeds.forEach( seed => {  
//       const neighbourArray = neighbours[seed]
//       if (neighbourArray) {
//         neighbourArray.forEach( neighbour => {
//           if (!treated.has(neighbour)) {
//             treated.add(neighbour)
//             endPoints.add(neighbour)
//           }
//         })
//     }})
//
//     seeds = new Set(endPoints)
//     endPoints.clear()
//   }
//
//   seeds = Array.from(seeds)
//   if (filtered)
//     seeds = seeds.filter( word => (
//     [...word].every(( char, index ) => seed[index] !== char)
//   ))
//
//   return seeds.map( word => (
//     findLadders(seed, word)
//   ))
// }


/** findGoodStarters
 * Gives information on which words give the most ladders. It is a
 * CPU-intensive function and may take an hour or more to complete,
 * as millions of ladders may need to be calculated.
 * 
 * @returns an object with the format: { <word>: <ladder count>, ...}
 *          where <ladder count> is the number of ladders whose length
 *          is charCount + 1 or greater. In other words, short ladders
 *          where some letters must still be in their original
 *          positions are ignored.
 *          The keys of the object are sorted so that the most fecund
 *          words appear first.
 */
function findGoodStarters() {
  let all = {}   // { <unordered word>: <interger count> }
  let count = 0  // total number of ladders found
  const minLength = charCount + 1

  const starters = Object.keys(neighbours)
  
  var total = starters.length
  for ( let ii = 0; ii < total; ii += 1 ) {
    const starter = starters[ii]

    // Find all ladders that start with starter & end with a later word
    for (let jj = ii + 1; jj < total; jj += 1 ) {
      ladders = findLadders(starter, starters[jj])
      const found = ladders.length
      if (found) {
        length = ladders[0].length
        if (length < minLength) {
          // ignore short ladders where start and end too similar
        } else {
          count += found
          // Update the score for the starter word
          all[starter] = (all[starter] || 0) + found

          // Reverse the ladder and increment the score for the end word
          ladders.forEach( ladder => {
            const ender = ladder.pop()
            all[ender] = (all[ender] || 0) + 1
          })
        }
      }
    }
  }

  let ranking = Object.keys(all).sort((a, b) => (
    all[b] - all[a]
  ))

  ranking = ranking.reduce(( ranked, word ) => {
    ranked[word] = all[word]
    return ranked
  }, {})


  return { ranking, count }
}



// PRIVATE FUNCTIONS // PRIVATE FUNCTIONS // PRIVATE FUNCTIONS //

/** _setAnagrams
 * 
 * Sets the variable anagrams to an object with a key whose letters
 * are in alphabetical order, and a value containing anagrams of these
 * letters, sorted alphabetically:
 * 
 * { 
 * "act": ...,
 * "acr": [ "arc", "car" ],
 * ...,
 * "otw": ...
 * }
 * 
 * @param {String[]} words 
 */
function _setAnagrams(words) {
  anagrams = {}

  words.forEach( word => {
    // Create a key of the component letters in alphabetical order
    const key = [...word].sort().join('')
    // Add the word to the array (newly created) for this key
    ;(anagrams[key] || (anagrams[key] = [])).push(word)
  })

  // Optional: arrange anagram arrays internally in alphabetical order
  anagrams = Object.entries(anagrams).reduce((ordered, [key, words]) => {
    if (words.length > 1) { // Ignore words with no anagrams
      ordered[key] = words.sort()
    }

    return ordered
  }, {})

  // Optional: arrange the arrays alphabetically by their first entry
  anagrams = Object.keys(anagrams)
   .sort((a, b ) => anagrams[a][0].localeCompare(anagrams[b][0]))
   .reduce(( ordered, key ) => {
     ordered[key] = anagrams[key]

     return ordered
   }, {})
}


/** _setReversedAWordsAndPalindromes
 * 
 * Sets the reversedWords and palindromes variables
 * 
 * reversedWords has the format [ [ "item", "meti" ], ... ]
 * palindromes has the format: [ "abba", ... ]
 * 
 * @param {String[]} words 
 */
function _setReversedAWordsAndPalindromes(words) {
  reversedWords = []
  palindromes = []

  words = [...words]
  words.forEach(( word, index ) => {
    const reverse = [...word].reverse().join('')
    const later = words.indexOf(reverse)
    if (later > -1 ) {
      if (later === index) {
        palindromes.push(word)
        
      } else {
        reversedWords.push([ word, reverse ].sort())

        // We don't need to treat the reversed word again
        words.splice(later, 1)
      }
    }
  })

  // Optional: sort arrays alphabetically (by first word)
  reversedWords.sort((a, b )=> a[0].localeCompare(b[0]))
  palindromes.sort()
}


/** _isNeighbour
 * @param {string} word1 
 * @param {string} word2 
 * @returns        true if there is only one letter difference
 *                 between the two words, false if not
 */
 function _isNeighbour(word1, word2) {
  let unmatched = 0
  const total = word1.length
  for ( let ii = 0; ii < total; ii += 1 ) {
    if (word1[ii] !== word2[ii]) {
      if (unmatched++) {
        return false
      }
    } // else both words have the same letter here
  }

  return true // assuming that word1 !== word2
}


/** _setNeighbours
 * For each word, find all other words that differ by only one letter.
 *
 * @param {array} words: an array of words of the same length
 * @returns an object with the format:
 *
 *   { ...
 *   , "root": ["boot", "coot", "foot", ... "roof", "rook", "room"]
 *   , ...
 *   }
 */
function _setNeighbours(words) {
  neighbours = {}

  const total = words.length
  for ( let ii = 0; ii < total; ii += 1 ) {
    const word1 = words[ii]

    for ( let jj = ii + 1; jj < total; jj += 1 ) {
      const word2 = words[jj]

      if (_isNeighbour(word1, word2)) {
        // Add each neighbour to the other's list
        ;(neighbours[word1] || (neighbours[word1] = [])).push(word2)
        ;(neighbours[word2] || (neighbours[word2] = [])).push(word1)
      }
    } 
  }

  // Optional: sort neighbour lists alphabetically
  neighbours = Object.keys(neighbours)
                     .sort()
                     .reduce(( ordered, word ) => {
                       ordered[word] = neighbours[word].sort()

                       return ordered
                     }, {})
}


/** _wordListIsInvalid
 * 
 * @param {String[]} words 
 * @returns          an error string if words is not an array of words
 *                   that are all of the same length, or
 *                   the number of items in the words array
 */
function _wordListIsInvalid(words) {
  if (!Array.isArray(words)) {
    const type = typeof words
    return `setWordList ERROR: expected an array, received <${type}>`
  }

  const firstWord = words[0]
  if (typeof firstWord !== "string") {
    return `setWordList ERROR: first word is not a string`
  }

  const length = firstWord.length
  const isAllStringsOfSameLength = words.every( word => (
    typeof word === "string" && word.length === length
  ))
  if (!isAllStringsOfSameLength) {
    return `setWordList ERROR: all entries must be words of the same length (${length} letters expected)`
  }

  return false
}


// Export public functions

module.exports = { 
  setWordList,
  findNeighbours,
  findAnagrams,
  findReversedWords,
  findPalindromes,
  findLadders,
  findAnagramLadders,
  findSimpleLadders,
  findGoodStarters
}