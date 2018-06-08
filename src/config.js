var config = {}

config.host = process.env.HOST || "https://lunch-decider-options.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "o0gcoiePr4Jt5xti4VtSXcRGz73P4V0uXFXHMZLdwImNb3pBA3DVDWndhZfj3iEGyPQT2KBcT3iPgNtV70ZXkw==";

config.database = {
    "id": "LunchOptions"
};

config.collection = {
    "id": "Items"
};
module.exports = config;