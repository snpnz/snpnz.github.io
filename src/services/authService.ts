const client_id = '73436';
const client_secret = 'ba9fb913d81fc6941fe0d6e96011de332fff2697';
const lsTokenKey = 'snpnz_token';
const lsUserKey = 'snpnz_user';

export function getAuthLink() {
    const data = {
        client_id,
        redirect_uri: window.location.origin + '/oauth/?redir='+window.location.origin+'/login',
        response_type: 'code',
        approval_prompt : 'auto',
        scope: 'activity:read',
    };

    const searchParams = new URLSearchParams();
    Object.entries(data).forEach(([key, val]) => searchParams.append(key, val))

    return `https://www.strava.com/oauth/authorize?${searchParams.toString()}`;
}

export async function getAuthTokenAsync() {
    const lsTokenDataStr = localStorage.getItem(lsTokenKey);

    if (lsTokenDataStr && lsTokenDataStr.length) {
        const tData = JSON.parse(lsTokenDataStr);
        if (tData.expires_at && tData.expires_at * 1000 > Date.now()) {
            return tData.access_token;
        }

        if (tData.refresh_token) {

                const result = await fetch("https://www.strava.com/api/v3/oauth/token", {
                    body: new URLSearchParams({
                        client_id,
                        client_secret,
                        refresh_token: tData.refresh_token,
                        grant_type: 'refresh_token'
                    }).toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST"
                }).then(res => res.json());
                localStorage.setItem(lsTokenKey, JSON.stringify(result));

                return result.access_token;
        }

        throw new Error('no token');
    } else {
        throw new Error('no stored token data');
    }
}

export async function setAuthTokenByCodeAsync(code:string) {
        const result = await fetch("https://www.strava.com/api/v3/oauth/token", {
            body: new URLSearchParams({
                client_id,
                client_secret,
                code,
                grant_type: 'authorization_code'
            }).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        }).then(res => res.json());

        console.log({result})
        const { athlete, ...tokenData } = result;

        localStorage.setItem(lsUserKey, JSON.stringify(athlete));
        localStorage.setItem(lsTokenKey, JSON.stringify(tokenData));

        return result.access_token;
}

export async function unAuthorizeAsync(){
    const access_token = '';
        await fetch(
            `https://www.strava.com/oauth/deauthorize?${new URLSearchParams({ access_token }).toString()}`,
            { method: "POST" }
        ).then(res => res.json());
        localStorage.clear();

        return Promise.resolve({ success: true });
}

export function getUser() {
    return JSON.parse(localStorage.getItem(lsUserKey) as string);
}