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
        isRevoked: {
            type: Boolean,
        },
        hasSudoRights: {
            type: Boolean,
        },
    },
    { timestamps: true },
);

const ApiToken = mongoose.model(`ApiToken`, apiTokenSchema);
module.exports = ApiToken;
