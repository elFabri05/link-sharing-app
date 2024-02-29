import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import './Home.css';
import emailIcon from '../../assets/icon-email.svg';
import passwordIcon from '../../assets/icon-password.svg';

type Inputs = {
  emailAddress: string,
  password: string,
};

function Login(){
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    try {
        const response = await fetch('http://localhost:3300/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log('Login successful:', responseData);
      navigate('/links-settings');
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

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
                <input type="submit" value='Login' className='bg-button' />
            </form>
            <div className='baseline'>
              <p>Don't you have an account?</p>
            <Link to="/create-account">
              <button className='s-button'>Create account</button>
            </Link>
            </div>
        </div>
    );
}

export default Login;