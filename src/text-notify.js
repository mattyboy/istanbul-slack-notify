require('colors');

class TextNotify {
    constructor() {
        this.emojis = {};
        this.emojis.fail = ["(︶︹︺)", "ʕノ•ᴥ•ʔノ ︵ ┻━┻", "ヽ(｀Д´)ﾉ", "┌ಠ_ಠ)┌∩┐", "╚(•⌂•)╝", "(┛◉Д◉)┛彡┻━┻"];
        this.emojis.pass = ["ᕕ(⌐■_■)ᕗ ♪♬", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "＼（＾○＾）人（＾○＾）／", "ヽ(^◇^*)/", "~=[,,_,,]:3"];
    }

    static getEmoji(emojis) {
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    /* eslint-disable no-console */
    printCoverage(data) {
        if (!data || !data.coverage) {
            throw new Error("coverage information missing");
        }
        if (data.coverage.success) {
            const emoji = TextNotify.getEmoji(this.emojis.pass);
            console.log("Total Coverage:".bold.green, `${data.coverage.project}%`.green,
                "\tRequired Coverage:".bold.green, `${data.coverage.threshold}%`.green);
            console.log("Coverage Check Passed".underline.bold.green, `\t${emoji}`.rainbow);
        } else {
            const emoji = TextNotify.getEmoji(this.emojis.fail);
            console.log("Total Coverage:".bold.yellow, `${data.coverage.project}%`.yellow,
                "\tRequired Coverage:".bold.yellow, `${data.coverage.threshold}%`.yellow);
            console.log("Coverage Check Failed".underline.bold.red, `\t${emoji}`.red);
        }
    }
    /* eslint-enable no-console */
}

module.exports = TextNotify;
