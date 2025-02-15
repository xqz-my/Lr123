// Удалить из данной строки все повторения символов

import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`Type the string, please:\n`, theOldString => {
  let prevSymbol = null;
  let theNewString = "";

  for (const i in theOldString) {
    if (theOldString[i] != prevSymbol) {
      theNewString += theOldString[i];
      prevSymbol = theOldString[i];
    }
  }

  console.log(`The new string is: ${theNewString}`)
  rl.close();
});