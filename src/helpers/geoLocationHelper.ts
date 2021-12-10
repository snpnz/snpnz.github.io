export function getCurrentGeoLocationAsync(): Promise<[lat: number, lon: number]> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        }

        navigator.permissions.query({name:'geolocation'}).then(function(result) {
            if (result.state === 'denied') {
                reject(new Error('Нужно дать разрешение доступа к геопозиции'));
            }
        });

        navigator.geolocation.getCurrentPosition((position) => {
            resolve([position.coords.latitude, position.coords.longitude])
        }, () => {
            reject(new Error(('Unable to retrieve your location')));
        });
    })
}