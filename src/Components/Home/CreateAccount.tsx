import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler} from "react-hook-form";
import './CreateAccount.css';
import emailIcon from '../../assets/icon-email.svg';
import passwordIcon from '../../assets/icon-password.svg';

type Inputs = {
  emailAddress: string,
  password: string,
  confirmPassword: string,
};

const CreateAccount: React.FC = () => {
  const [tryAgain, setTryAgain] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, watch, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const apiUrl = import.meta.env.PROD
      ? ''
      : import.meta.env.VITE_API_URL;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
      try {
        setTryAgain(false);
        setErrorMessage(null);

        const response = await fetch(`${apiUrl}create-account`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.status === 409) {
          setTryAgain(true);
          setErrorMessage('This email is already in use. Please try a different email.');
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        if (response.status === 201) {
          navigate('/');
        } else {
          setTryAgain(true);
          console.error('Failed to create user, please try again');
        }
      } catch (error) {
        console.error('Failed to create account:', error);
        setTryAgain(true);
        setErrorMessage('Failed to create account. Please try again.');
      }
  };

  const password = watch("password");

  return (
    <div className='create-account-component'>
      <h3>Create account</h3>
      <p>Let's get you started sharing your links</p>
      <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="emailAddress">Email address</label>
          <br />
          <input 
            {...register('emailAddress', { required: 'Email is required', 
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
            type="email"
            id="emailAddress"
            placeholder="example@yourmail.com"
            autoComplete="email"
            style={{
              backgroundImage : `url(${emailIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '.5rem .9rem',
              paddingLeft: '30px',
            }}
          />
          {errors.emailAddress && (
            <p className="error" style={{ margin: '0 0 -15px' }}>
              {errors.emailAddress.message}
            </p>
          )}
          <br />
          <label htmlFor="password">Create password</label>
          <br />
          <input 
            {...register('password', { required: 'Password is required', 
            minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
            type="password"
            id="password"
            name="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            style={{
              backgroundImage : `url(${passwordIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '.5rem .9rem',
              paddingLeft: '30px',
            }}
          />
          {errors.password && (
            <p className="error" style={{ margin: '0 0 -15px' }}>
              {errors.password.message}
            </p>
          )}
          <br />
          <label htmlFor="confirmPassword">Confirm password</label>
          <br />
          <input 
            {...register('confirmPassword', { 
              validate: value => value === password || "Passwords do not match"
            })}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            style={{
              backgroundImage : `url(${passwordIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '.5rem .9rem',
              paddingLeft: '30px',
            }}
          />
          {errors.confirmPassword && (
            <p className="error" style={{ margin: '0px' }}>
              {errors.confirmPassword.message}
            </p>
          )}
          <button type="submit" className="bg-button" style={{ marginTop: "1rem" }}>
            Create new account
          </button>
          {tryAgain && <p className="error">Something went wrong. Please try again.</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
      <div className='baseline'>
        <p>Already have an account?</p>
        <Link to="/">
          <button className='s-button'>Login</button>
        </Link>
      </div>
    </div>
  );
}

export default CreateAccount;