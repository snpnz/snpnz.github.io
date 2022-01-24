/**
 * Возвращает дату в SQL формате
 * @param {Date} jsDate
 * @returns {string}
 */
export function getSQLDate(jsDate: Date) {
    const timeOffset = new Date().getTimezoneOffset();
    return new Date(jsDate.getTime() - (timeOffset * 60000))
        .toISOString()
        .substr(0, 19)
        .replace('T', ' ');
}

/**
 * Возвращает дату для использования в datetime-local инпуте
 * @param {Date} jsDate
 * @returns {string}
 */
export function getInputDate(jsDate: Date) {
    const timeOffset = new Date().getTimezoneOffset();
    return new Date(jsDate.getTime() - (timeOffset * 60000))
        .toISOString()
        .substr(0, 16);
}

const months = ['янв','фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

/**
 * Возвращает человекочитаемую дату
 * @param {Date} jsDate
 * @returns {string}
 */
 export function getHumanDate(jsDate: Date) {
    const d = new Date();
    const lDade = jsDate.toLocaleDateString();
    const lTime = jsDate.toLocaleTimeString().substring(0, 5);
    if (d.toLocaleDateString() === lDade) {
        return lTime;
    }

    if (d.getFullYear() === jsDate.getFullYear()) {
        return `${jsDate.getDate()}\u2009${months[jsDate.getMonth()]}\u2009в\u2009${lTime}`;
    }

    return jsDate.toLocaleDateString();
}