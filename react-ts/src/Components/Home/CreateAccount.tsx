import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import './Home.css';
import emailIcon from '../../assets/icon-email.svg';
import passwordIcon from '../../assets/icon-password.svg';


type Inputs = {
  emailAddress: string
  createPassword: string
  confirmPassword: string
};

function CreateAccount(){
  
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
        const response = await fetch('http://localhost:3300/create-account', {
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
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const createPassword = watch("createPassword");

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
                {...register("confirmPassword", { 
                  validate: value => value === createPassword || "Passwords do not match"
                })}
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
            <p>Password must contain at least 8 characters</p>
            <input type="submit" className='bg-button' value='Create new account' />
            </form>
            <div className='baseline'>
              <p>Already have an account?</p>
            <Link to="/">
              <button className='s-button' >Login</button>
            </Link>
            </div>
        </div>
    </div>
    );
}

export default CreateAccount;