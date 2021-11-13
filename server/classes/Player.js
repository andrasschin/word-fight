class Player {
    constructor(id) {
        this.id = id;
        this.score = 0;
        this.answers = [];
        this.isNextWordReady = false;
    }

    toObject() {
        return {
            id: this.id,
            score: this.score,
            answers: this.answers
        }
    }
}

module.exports = Player;