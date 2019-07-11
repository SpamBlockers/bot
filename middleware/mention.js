const escapeHtml = require(`@youtwitface/escape-html`);

module.exports = (user, addId) => {
    let { first_name = ``, last_name = ``, id } = user;

    if (!first_name && !last_name) {
        first_name = `Deleted`;
        last_name = `Account`;
    }

    const fullName = `${first_name} ${last_name}`.trim();
    let text = `<a href="tg://user?id=${id}">${escapeHtml(fullName)}</a>`;

    if (addId) {
        text += ` (<code>${id}</code>)`;
    }

    return text;
};
