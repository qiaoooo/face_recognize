import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';


const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt >
        <div className='Tilt pa3'
          style={{ height: '150px', width: '150px', backgroundColor: 'darkgreen' }}
        >
          <img style={{ paddingTop: '3px' }} src={brain} alt="logo" />
        </div>
      </Tilt>

    </div>
  )
}


export default Logo