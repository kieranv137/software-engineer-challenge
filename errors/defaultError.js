const customError = require("./customError");
const {sprintf} = require("sprintf-js");

class defaultError extends customError {
    constructor(message) {
        super('defaultError', 200, sprintf('%s.|.%s', 200, message));
    }
}

module.exports = defaultError;
