import { Link } from 'react-router-dom'
import { useForm, SubmitHandler } from "react-hook-form"
import './Home.css'
import emailIcon from '../../assets/icon-email.svg'
import passwordIcon from '../../assets/icon-password.svg'

type Props = {
  propFunc: () => void
}

type Inputs = {
  emailAddress: string
  createPassword: string
  confirmPassword: string
}

export default function CreateAccount({ propFunc}: Props){
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

    return(
        <div>
            <div>
            <h3>Create account</h3>
            <p>Let's get you started sharing your links</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="emailAdress">Email adress</label>
                <br />
                <input 
                {...register('emailAddress', { required: 'Email is required', 
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
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
                {errors.emailAddress && <p>{errors.emailAddress.message}</p>}
                <br />
                <label htmlFor="password">Create password</label>
                <br />
                <input 
                {...register('createPassword', { required: 'Password is required', 
                minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                type="password"
                id='createPassword'
                name='createPassword'
                placeholder='At least 8 characters' 
                style={{
                    backgroundImage : `url(${passwordIcon})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '.5rem .9rem',
                    paddingLeft: '30px',
                  }}
                  />
                {errors.createPassword && <p>{errors.createPassword.message}</p>}
                <br />
                <label htmlFor="confirmPassword">Confirm password</label>
                <br />
                <input 
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                type="password"
                id='confirmPassword'
                name='confirmPassword'
                placeholder='At least 8 characters' 
                style={{
                    backgroundImage : `url(${passwordIcon})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '.5rem .9rem',
                    paddingLeft: '30px',
                  }}
                  />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </form>
            <p>Password must contain at least 8 characters</p>
            <Link to="/">
                <button type="submit" onClick={propFunc} className='bg-button'>Create new account</button>
            </Link>
            <div className='baseline'>
              <p>Already have an account?</p>
              <button onClick={propFunc} className='s-button' >Login</button>
            </div>
        </div>
    </div>
    )
}