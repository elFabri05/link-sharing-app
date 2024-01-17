import { Link } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import './Home.css'
import emailIcon from '../../assets/icon-email.svg'
import passwordIcon from '../../assets/icon-password.svg'

type Props = {
    propFunc: () => void
  }

type Inputs = {
  emailAddress: string
  password: string
}

const Login = ({ propFunc }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

    return(
        <div>
            <h3>Login</h3>
            <p>Add your details below to get back into the app</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="emailAdress">Email adress</label>
                <br /> 
                <input 
                {...register('emailAddress', { required: 'Email is required', 
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
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
                {errors.emailAddress && <p>{errors.emailAddress.message}</p>}
                <br />
                <label htmlFor="password">Password</label>
                <br />
                <input 
                {...register('password', { required: 'Password is required' })}
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
                {errors.password && <p>{errors.password.message}</p>}
            </form>
            <Link to="/settings">
                <button type="submit" className='bg-button'>Login</button>
            </Link>
            <div className='baseline'>
              <p>Don't you have an account?</p>
              <button onClick={propFunc} className='s-button'>Create account</button>
            </div>
        </div>
    )
}

export default Login