import React from 'react'
import {specialityData} from '../assets/assets.js'
import {Link} from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div id='speciality'>
        <h1>Find by Speciality</h1>
        <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free</p>
        <div>
            {specialityData.map((item, index) => {
                // item.speciality = "cardiology", then the URL generated will be /doctors/cardiology, and clicking the link will navigate to that route
                <Link to={'/doctors/${item.speciality}'}>

                
                </Link>
            })}

        </div>
    </div>
  )
}

export default SpecialityMenu