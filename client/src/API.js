
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'https://leaflet-map-app.herokuapp.com/api/v1/messages'

export function getMessages() {
    return fetch(API_URL)
        .then(res => res.json())
        .then(messages => {
            const haveSeenLocation = {};
            return messages = messages.reduce((all, message) => {
                const key = `${message.latitude.toFixed(3)}${message.longitude.toFixed(3)}`;                
                if (haveSeenLocation[key]) {
                    haveSeenLocation[key].otherMessages = haveSeenLocation[key].otherMessages || [];
                    haveSeenLocation[key].otherMessages.push(message);
                  } else {
                    haveSeenLocation[key] = message;
                    all.push(message);
                  }
                  return all;
            }, []);
        }).catch(err => console.log(err));
}

export const getLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat  = position.coords.latitude
            const lng = position.coords.longitude;
            resolve({lat,lng})
        },
        () => {
            console.log("Permission not given. Hacking their location");
            resolve(fetch(`https://json.geoiplookup.io/`)
            .then(res => res.json())
            .then(res => {
                return {lat: res.latitude, lng: res.longitude}
            })
            .catch(err => {
                console.log(err);
                reject(err)
            }))
        })
    })
    
}

export const sendMessage = (message) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(message)
    })
    .then(res => res.json())
}