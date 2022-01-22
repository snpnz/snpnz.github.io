/**
 * Числительные
 * @param {number} number кол-во
 * @param {Array<string>} titles ['секунда', 'секунды', 'секунд']
 * @returns {string}
 * @example declOfNum(5, ['секунда', 'секунды', 'секунд']); // returns 'секунд'
 */
export function declOfNum(num: number, titles: string[]) {

    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5]];
}

export function formatDistance(d: number) {
    if (!(d > 0)) { return '0'; }
    return d > 1000 ? `${(d / 1000).toFixed(2)}\u202fкм` : `${(d).toFixed()}\u2009м`;
}