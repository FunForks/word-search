const fs = require('fs')
const path = require('path')
const allWords = require('./all_words.json')


const lists = []


allWords.forEach( word => {
  const length = word.length
  const wordList = (lists[length] || (lists[length] = []))
  wordList.push(word)
})


const total = lists.reduce((total, list, index) => {
  const length = list.length
  if (list.length > 1) {
    console.log(index, list.length)

    const fileName = `${index}-letter-words.json`
    const file = path.join(__dirname, fileName)
    const data = JSON.stringify(list, null, "  ")
    fs.writeFileSync(file, data)
  }

  return total + length
}, 0)

console.log("total:", total)