import React from 'react'
import ParticlesBg from 'particles-bg';
/* import Clarifai from 'clarifai'*/
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'

import 'tachyons';
import './App.css';

/* var BACKEND_URL = 'http://localhost:3001';*/
var BACKEND_URL = 'https://qiao-mu-face-recognize-backend.onrender.com';


window.process = {
  env: {
    NODE_ENV: 'development'
  }
}


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    email: '',
    id: '',
    name: '',
    entries: 0,
    joined: '',
  },
}

/* const app = new Clarifai.App({
  apiKey: CLARIFAI_KEY,
});

 */

let config = {
  num: [3, 7],
  rps: 0.1,
  radius: [5, 40],
  life: [1.5, 3],
  v: [2, 3],
  tha: [-40, 40],
  // body: "./img/icon.png", // Whether to render pictures
  // rotate: [0, 20],
  alpha: [0.6, 0],
  scale: [1, 0.1],
  position: "center", // all or center or {x:1,y:1,width:100,height:100}
  color: ["random", "#ff0000"],
  cross: "dead", // cross or bround
  random: 15,  // or null,
  g: 5,    // gravity
  // f: [2, -1], // force
  onParticleUpdate: (ctx, particle) => {
    ctx.beginPath();
    ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
    ctx.closePath();
  }
};




class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        email: '',
        id: '',
        name: '',
        entries: 0,
        joined: '',
      },
    }
  }

  loadUser = (data) => {
    /*     console.log('loaduser', data)*/
    this.setState({
      user: {
        email: data.email,
        id: data.id,
        name: data.name,
        entries: data.entries,
        joined: data.joined,
      }
    })
  }



  componentDidMount() {  //connect with backend 
    fetch(BACKEND_URL)  //root route
      .then(response => response.json())
      .then(data => console.log(data))
  }




  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    /*     console.log(width, height)*/
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }


  displayFaceBox = (box) => {
    /*     console.log(box)*/
    this.setState({ box: box })
  }



  onInputChange = (event) => {
    /*     console.log(event.target.value) */
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    /*     console.log('click'); */
    this.setState({ imageUrl: this.state.input })
    /* app.models
      .predict(
        'f76196b43bbd45c99b4f3cd8e8b40a8a',
        // THE JPG
        /* "https://samples.clarifai.com/face-det.jpg" 
        this.state.input) */

    fetch(BACKEND_URL + '/imageurl',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(BACKEND_URL + '/image',
            {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(/* { user: { entries: count } } */
                Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)

        }

        this.displayFaceBox(this.calculateFaceLocation(response))
      }
        /* console.log(response);*/
        /* console.log(response.outputs[0].data.regions[0].region_info.bounding_box) */
      )
      .catch(err => console.log(err));
    /*         function (err) {
              console.log(err)
            } */

  }



  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }



  render() {
    return (
      <div className="App">
        <ParticlesBg type="circle" config={config} bg={true} />

        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />

        {this.state.route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
          : (this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)

        }
      </div>
    );
  }
}

export default App;
