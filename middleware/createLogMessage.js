const escapeHtml = require(`@youtwitface/escape-html`);

const titleCase = string => {
    return string
        .split(/(?=[A-Z])/)
        .map(x => `${x.slice(0, 1).toUpperCase()}${x.slice(1)}`)
        .join(` `);
};

const createLogMessage = ({ header, ...values }, indent = 0) => {
    if (header) {
        indent++;
    }

    return Object.keys(values).reduce(
        (logMessage, key, index) => {
            const value = values[key];

            if (value !== null) {
                if (index !== 0 || indent !== 0) {
                    logMessage += `\n`;
                }

                logMessage += ` `.repeat(indent * 4);
                logMessage += `<b>`;
                logMessage += titleCase(key).trim();

                if (typeof value === `object`) {
                    logMessage += `</b>`;
                    logMessage += createLogMessage(value, indent + 1);
                } else {
                    logMessage += `:</b> `;
                    logMessage += values[key];
                }
            }

            return logMessage;
        },
        header ? `<b>${escapeHtml(header)}</b>` : ``
    );
};

module.exports = createLogMessage;
