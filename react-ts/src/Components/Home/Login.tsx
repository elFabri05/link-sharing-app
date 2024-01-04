import { Link } from 'react-router-dom'
import './Home.css'
import emailIcon from '../../assets/icon-email.svg'
import passwordIcon from '../../assets/icon-password.svg'

// type Props = {
//     propFunc: () => void
//     homeState: boolean
//   }
//   { propFunc, homeState }: Props
const Login = () => {

    

    return(
        <div>
            <h3>Login</h3>
            <p>Add your details below to get back into the app</p>
            <form >
                <label htmlFor="emailAdress">Email adress</label>
                <br /> 
                <input 
                type="email"
                id='emailAdress'
                name='emailAdress'
                placeholder='e.g. alex@gmail.com' 
                style={{
                    backgroundImage : `url(${emailIcon})`,
                    backgroundRepeat: 'no-repeat',
                    paddingLeft: '30px',
                  }}
                  />
                <br />
                <label htmlFor="password">Password</label>
                backgroundPosition: '10px 10px',
    <br />
                <input 
                type="text"
                id='password'
                name='password'
                placeholder='Enter your password' 
                style={{
                    backgroundImage : `url(${passwordIcon})`,
                    backgroundRepeat: 'no-repeat',
                    paddingLeft: '30px',
                  }}
                  />
            </form>
            <Link to=""><button>Login</button></Link>
            <p>Don't you have an account?</p>
            <Link to="">Create account</Link>
        </div>
    )
}

export default Login