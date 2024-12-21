class Word {
  static hintRatio = 2 / 5;

  constructor(word, definition) {
    this.word = word;
    this.definition = definition;
  }

  getHint() {
    const hint = new Array(this.word.length).fill("_");
    const numberOfHintedLetters = Math.round(this.word.length * Word.hintRatio);

    for (let i = 0; i < numberOfHintedLetters; i++) {
      let idx = Math.floor(Math.random() * this.word.length);
      if (hint[idx] === "_") hint[idx] = this.word[idx];
      else i--;
    }
    return hint.join(" ");
  }
}

module.exports = Word;
