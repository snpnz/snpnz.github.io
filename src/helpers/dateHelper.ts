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
