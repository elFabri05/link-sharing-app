import { useForm, SubmitHandler } from 'react-hook-form';
import "./Settings.css";
import uploadImage from "../../assets/icon-upload-image.svg";

interface ProfileForm {
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: File,
  }

export default function Profile(){

    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors } 
    } = useForm<ProfileForm>();

    const uploadImage: File | null = watch('profilePicture');

    const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
        try {
            const response = await fetch('http://localhost:3300/porfile-settings', {
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

    return(
      <div>
      <h3>Profile Details</h3>
      <p>Add your details to create a personal touch to your profile.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h5>Profile picture</h5>
          <label htmlFor="image-upload">
            <div className='img-upload-containter'>
              <input 
                {...register("profilePicture", { required: true })} 
                id="image-upload" 
                type="file" 
                className='img-upload'
              />
                <br />
                + Upload Image
            </div>
          </label>
          {errors.profilePicture && <span>This field is required</span>}
          <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
        </div>

        <label htmlFor="firstName">First Name*</label>
        <br />
        <input 
          {...register("firstName", { required: true })}
          type="text" 
          id="firstName"
          placeholder="First Name"
        />
        {errors.firstName && <span>This field is required</span>}
        <br />

        <label htmlFor="lastName">Last Name*</label>
        <br />
        <input 
          {...register("lastName", { required: true })}
          type="text" 
          id="lastName"
          placeholder="Last Name"
        />
        {errors.lastName && <span>This field is required</span>}
        <br />

        <label htmlFor="email">Email</label>
        <br />
        <input 
          {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
          type="email" 
          id="email"
          placeholder="Your email address"
        />
        {errors.email && <span>Invalid email address</span>}
        <br />

        <p>* mandatory fields.</p>
        <input type="submit" value="Save" className="bg-button"/>
      </form>
    </div>
  );
}