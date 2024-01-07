import { Link } from 'react-router-dom'
import './Home.css'
import emailIcon from '../../assets/icon-email.svg'
import passwordIcon from '../../assets/icon-password.svg'

type Props = {
    propFunc: () => void
  }
const Login = ({ propFunc }: Props) => {

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
                    backgroundPosition: '.5rem .9rem',
                    paddingLeft: '30px',
                  }}
                  />
                <br />
                <label htmlFor="password">Password</label>
                <br />
                <input 
                type="text"
                id='password'
                name='password'
                placeholder='Enter your password' 
                style={{
                    backgroundImage : `url(${passwordIcon})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '.5rem .9rem',
                    paddingLeft: '30px',
                  }}
                  />
            </form>
            <Link to="/settings"><button className='bg-button'>Login</button></Link>
            <div className='baseline'>
              <p>Don't you have an account?</p>
              <button onClick={propFunc} className='s-button'>Create account</button>
            </div>
        </div>
    )
}

export default Login