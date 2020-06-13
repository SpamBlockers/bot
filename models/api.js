const mongoose = require(`mongoose`);

const apiTokenSchema = new mongoose.Schema(
    {
        token_id: {
            type: Number,
            unique: true,
            required: true,
        },
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
            // When granted admin rights, revoke your current key and creat a new one.
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
