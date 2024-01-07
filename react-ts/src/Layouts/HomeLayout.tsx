import { useState } from 'react'
import Login from '../Components/Home/Login.tsx'
import CreateAccount from '../Components/Home/CreateAccount.tsx'
import './HomeLayout.css'
import LargeLogo from '../assets/logo-devlinks-large.svg'

 function HomeLayout(){
    const [toggleHome, setToggleHome] = useState(true)

    const setHome = (): void => {
        setToggleHome((toggleHome: boolean) => !toggleHome);
      }

    return(
        <div className='home-layout'>
            <img src={LargeLogo} alt="Devlinks large logo" />
            { toggleHome ? (
                <Login propFunc={setHome}/> 
              )  : (
                <CreateAccount propFunc={setHome}/>
            )}
        </div>
    )
}

export default HomeLayout