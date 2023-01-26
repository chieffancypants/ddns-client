let ip = ''

export default function getIP () {
    if (ip) return Promise.resolve(ip)

    return fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(r => {
            ip = r.ip
            return ip
        })
}
