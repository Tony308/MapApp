import React, {Component} from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import joi from 'joi';

import MessageCard from './MessageCard';
import {getMessages, getLocation, sendMessage} from './API'; 
import './App.css';

const myIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Google_Maps_pin.svg',
    iconSize: [20, 35],
    iconAnchor: [10, 35],
    popupAnchor: [0, -35],
});

const otherLocales = L.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -40],
});

const schema = joi.object({
    name: joi.string().alphanum().min(1).max(100).required(),
    message: joi.string().min(1).max(500).required()
});

class App extends Component {
    state = {
        location: {
            lat: 51.505,
            lng: -0.09,
        },
        userMessage: {
            name: '',
            message: ''
        },
        hasUser20: false,
        zoom: 2,
        showMessageForm: false,
        sendingMessage: false,
        sentMessage: false,
        messages: []
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState(prevState => ({
            userMessage: {
                ...prevState.userMessage,
                [name]: value,
            }
        }))
    }

    formIsValid = () => {
        const userMessage = {
            name: this.state.userMessage.name,
            message: this.state.userMessage.message
        };
        
        const result = schema.validate(userMessage);
        return !result.error && this.state.hasUser20;
    }

    formSubmitted = (e) => {
        e.preventDefault();
        if (this.formIsValid()) {
            this.setState({
                sendingMessage: true
            });

            const message = {
                name: this.state.userMessage.name,
                message: this.state.userMessage.message,
                latitude: this.state.location.lat,
                longitude: this.state.location.lng
            }

            sendMessage(message)
            .then(res => {
                this.setState({
                    sendingMessage: false,
                    sentMessage: true
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    sendingMessage: false,
                    sentMessage: false
                }) 
            })
        }
    }

    componentDidMount = () => {
        
        getLocation()
        .then(location => {
            this.setState({
            location,
            hasUser20: true,
            zoom: 9
            })
        })

        getMessages()
        .then((messages) => {
            this.setState({
                messages
            });
        });   
    }

    render() {
        const position = [this.state.location.lat, this.state.location.lng]

        return (
            <div className="map">
                <Map className="map" center={position} zoom={this.state.zoom}>
                    <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.hasUser20 ? 
                        <Marker 
                        position={position} 
                        icon={myIcon}>
                        
                            <Popup>
                                You're currently here.
                            </Popup>
                        </Marker>
                        :
                        null
                    }
                    {
                        this.state.messages.map((messages, x) => {
                            return <Marker 
                                position={[messages.latitude, messages.longitude]} 
                                icon={otherLocales} 
                                key={x}>
                                <Popup>
                                    <p><b>latitude: {messages.latitude}, longitude: {messages.longitude}</b></p>
                                    <p><b>{messages.name}</b>: {messages.message}</p>
                                    {
                                        messages.otherMessages ? messages.otherMessages.map((message, x) => {
                                            return <p key={x} ><b>{messages.name}</b>: {messages.message}</p>
                                        })
                                        : 
                                        ''
                                    }
                                </Popup>
                            </Marker>
                         })
                    }
                </Map>                
                <MessageCard 
                    sendingMessage={this.state.sendingMessage}
                    sentMessage={this.state.sentMessage}
                    hasUser20={this.state.hasUser20}
                    formSubmitted={this.formSubmitted}
                    handleChange={this.handleChange}
                    formIsValid={this.formIsValid}
                />
            </div>
            );
        }
    }
    
    export default App;