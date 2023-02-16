const client_id = '1';
const lsTokenKey = 'snpnz_token';
const lsUserKey = 'snpnz_user';

export function getAuthLink(inviteCode?: string) {
    const data = {
        client_id,
        redirect_uri: `${window.location.origin}/oauth/?redir=${window.location.origin}/login${inviteCode ? `&invite=${inviteCode}` : ''}`,
    };

    const searchParams = new URLSearchParams();
    Object.entries(data).forEach(([key, val]) => searchParams.append(key, val))

    return `https://pohodnik.tk/login?${searchParams.toString()}`;
}

export async function getAuthTokenAsync() {
    const lsTokenDataStr = localStorage.getItem(lsTokenKey);

    if (lsTokenDataStr && lsTokenDataStr.length) {
        const tData = JSON.parse(lsTokenDataStr);
        if (tData.expires_at && tData.expires_at * 1000 > Date.now()) {
            return tData.access_token;
        }

        throw new Error('no token');
    } else {
        throw new Error('no stored token data');
    }
}

export async function setAuthTokenByCodeAsync(code:string) {

}

export async function unAuthorizeAsync(){
        localStorage.clear();

        return Promise.resolve({ success: true });
}

export function getUser() {
    return JSON.parse(localStorage.getItem(lsUserKey) as string);
}
