// Удалить из данной строки все повторения символов

import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function removeSiblings(theOldString) {
  let encountered = new Set();
  let theNewString = "";

  for (const i in theOldString) {
    if (!encountered.has(theOldString[i])) {
      theNewString += theOldString[i];
      encountered.add(theOldString[i]);
    }
  }
  return theNewString;
}

const alphabet = "A a B b C c D d E e F f G g H h I i J j K k L l M m N n O o" 
  + "P p Q q R r S s T t U u V v W w X x Y y Z z this line is not going to"
  + " appear on the screen"

console.log(`the alphabet is:\n${removeSiblings(alphabet)}`)

rl.question(`Type the string, please:\n`, theOldString => {
  const theNewString = removeSiblings(theOldString);
  console.log(`The new string is: ${theNewString}`)
  rl.close();
});