/**
 * Retrive an object from local storage.
 * @param  string key
 * @return mixed
 */
export function lsGet<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (!item) {
        return null;
    }

    return JSON.parse(item);
}

/**
 * Save some value to local storage.
 * @param string key
 * @param mixed value
 */
export function lsSet<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove element from local storage.
 * @param string key
 */
export function lsRemove(key: string) {
    localStorage.removeItem(key);
}
