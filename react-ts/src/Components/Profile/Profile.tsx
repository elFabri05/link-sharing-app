import { useEffect, useState } from 'react'
import 'Profile.css'
import { Link } from 'react-router-dom'

function Profile(){


    return(
        <div>
            <header>
                <Link to="">
                    <button>Back to editor</button> 
                </Link>
                <Link to="">
                    <button>Share Link</button>
                </Link>
            </header>
            <img src="" alt="" />
            <h1>Name*</h1>
            <h4>emailProfile*</h4>
            <div>platforms*</div>
        </div>
    )
}

export default Profile