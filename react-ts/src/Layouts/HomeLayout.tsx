import LargeLogo from '../assets/logo-devlinks-large.svg'

import Login from '../Components/Home/Login.tsx'
import CreateAccount from '../Components/Home/CreateAccount.tsx'
import { useState } from 'react'

export default function HomeLayout(){
    const [toggleHome, setToggleHome] = useState(true)

    const setHome = (): void => {
        setToggleHome((toggleHome: boolean) => !toggleHome);
      }

    return(
        <div>
            <img src={LargeLogo} alt="Devlinks large logo" />
            <Login propFunc={setHome} homeState={toggleHome}/>
            <CreateAccount propFunc={setHome} homeState={toggleHome}/>
        </div>
    )
}