const customError = require("./customError");
const {sprintf} = require("sprintf-js");

class unauthorizedError extends customError {
    constructor(message) {
        super('UnauthorizedError', 401, sprintf('%s.|.%s', 401, message));
    }
}

module.exports = unauthorizedError;
