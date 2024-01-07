import { Link } from 'react-router-dom'
import './Home.css'
import emailIcon from '../../assets/icon-email.svg'
import passwordIcon from '../../assets/icon-password.svg'

type Props = {
  propFunc: () => void
}

export default function CreateAccount({ propFunc}: Props){


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
                placeholder='example@yourmail.com' 
                style={{
                    backgroundImage : `url(${emailIcon})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '.5rem .9rem',
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
                    backgroundPosition: '.5rem .9rem',
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
                    backgroundPosition: '.5rem .9rem',
                    paddingLeft: '30px',
                  }}
                  />
            </form>
            <p>Password must contain at least 8 characters</p>
            <Link to="/"><button onClick={propFunc} className='bg-button'>Create new account</button></Link>
            <div className='baseline'>
              <p>Already have an account?</p>
              <button onClick={propFunc} className='s-button'>Login</button>
            </div>
        </div>
    </div>
    )
}