import { Link } from 'react-router-dom'
import './Home.css'
import emailIcon from '../../assets/icon-email.svg'
import passwordIcon from '../../assets/icon-password.svg'

export default function CreateAccount(){

// type Props = {
//     propFunc: () => void
//     homeState: boolean
//   }
//   { propFunc, homeState }: Props

    return(
        <div>
            <div>
            <h3>Create account</h3>
            <p>Let's get you started sharing your links</p>
            <form>
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
                <label htmlFor="password">Create password</label>
                <br />
                <input 
                type="password"
                id='password'
                name='createPassword'
                placeholder='At least 8 characters' 
                style={{
                    backgroundImage : `url(${passwordIcon})`,
                    backgroundRepeat: 'no-repeat',
                    paddingLeft: '30px',
                  }}
                  />
                <br />
                <label htmlFor="password">Confirm password</label>
                <br />
                <input 
                type="password"
                id='password'
                name='confirmPassword'
                placeholder='At least 8 characters' 
                style={{
                    backgroundImage : `url(${passwordIcon})`,
                    backgroundRepeat: 'no-repeat',
                    paddingLeft: '30px',
                  }}
                  />
            </form>
            <p>Password must contain at least 8 characters</p>
            <Link to=""><button>Create new account</button></Link>
            <p>Already have an account?</p>
            <Link to="">Login</Link>
        </div>
    </div>
    )
}