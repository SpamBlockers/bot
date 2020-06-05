const mongoose = require(`mongoose`);

const apiTokenSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            required: true,
            unique: true,
        },
        apiKey: {
            type: String,
            required: true,
        },
        isRevoked: Boolean,
        hasSudoRights: {
            type: Boolean,
            // Unless userId is included in admins.json
            // When removed from that file, it should change it to 'false'.
            default: false,
        },
        tokenGeneratedDate: {
            type: Date,
            default: Date.now,
        },
    },
);

const ApiToken = mongoose.model(`ApiToken`, apiTokenSchema);
module.exports = ApiToken;
