const options = {
    headers: {
        Accept: 'application/json',
        'cache-control': 'no-cache',
        Authorization: localStorage.getItem('snpzn-auth'),
    },
    credentials: 'include', // include, *same-origin, omit
    mode: 'cors'
};

/**
 * Выполняет GET запрос к серверу
 * @param url
 * @param data
 * @param opts
 * @returns {Promise<any>}
 */
export function get(url: string, data: { [key: string]: string } | null = null, opts = {}) {
    let fullUrl = url;
    const query = new URLSearchParams();
    if (data) {
        Object.entries(data).forEach(([k, v]) => {
            query.append(k, v);
        })
    }

    const qstr = query.toString();

    if (qstr?.length) {
        fullUrl += `?${qstr}`;
    }

    // @ts-ignore
    return fetch(fullUrl, { ...options, ...opts }).then(res => res.json());
}

/**
 * Выполняет POST запрос к серверу
 * @param {string} url адрес
 * @param data
 * @param opts
 * @returns {Promise<any>}
 */
export function post<T>(url: string, data?: { [key: string]: string } | T, opts = {}) {
    const fullUrl = url;
    let body;
    if (data) {
        body = JSON.stringify(data);
    }
    // @ts-ignore
    return fetch(fullUrl, { ...options, ...opts, method: 'POST', body}).then(res => res.json());
}
