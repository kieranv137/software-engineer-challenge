class customError extends Error {
    constructor(name, code, message) {
        super(message);
        this.name = name;
        this.code = code;
    }
}

module.exports = customError;
