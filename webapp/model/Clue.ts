export default class Clue {

    constructor(
        public readonly id: number,
        public readonly answer: string,
        public readonly hints: string[],
        public readonly category = "",
        public readonly synonyms: string[] = []
    ) {}

}