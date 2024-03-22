import { useEffect , useState} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import "./Settings.css";

interface UserProfileData {
  firstName?: string;
  lastName?: string;
  profileEmail?: string;
}

interface UserProfileForm {
  profilePicture: FileList;
  firstName: string;
  lastName: string;
  email: string;
}

function Profile(){

  const [profile, setProfile] = useState<UserProfileData>({
    firstName: 'First Name',
    lastName: 'Last Name',
    profileEmail: 'Your email address',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3300/profile-settings', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UserProfileData = await response.json();
        const filteredData = Object.entries(data).reduce<UserProfileData>((acc, [key, value]) => {
          if (value !== "") {
            const validKey = key as keyof UserProfileData;
            if (validKey) {
              acc[validKey] = value;
            }
          }
          return acc;
        }, {
          firstName: undefined,
          lastName: undefined,
          profileEmail: undefined
        });

        setProfile(prevProfile => ({ ...prevProfile, ...filteredData }));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<UserProfileForm>();

  const uploadImage: FileList | null = watch('profilePicture');

  const onSubmit: SubmitHandler<UserProfileForm> = async (data) => {
    if (data.profilePicture && data.profilePicture.length > 0) {
      const formData = new FormData();
      formData.append('profilePicture', data.profilePicture[0]);
  
      try {
        const response = await fetch('http://localhost:3300/profile-settings', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
  
        if (!response.ok) throw new Error('Network response was not ok');
        console.log('Profile picture upload successful:', await response.json());
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        return; 
      }
    }
  
    const userDetails = { firstName: data.firstName, lastName: data.lastName, email: data.email };
    try {
      const response = await fetch('http://localhost:3300/profile-settings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
      console.log('User details update successful:', await response.json());
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

return(
    <div>
      <h3>Profile Details</h3>
      <p>Add your details to create a personal touch to your profile.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {uploadImage ? <p>Profile picture uploaded</p> : ""}
          {errors.profilePicture && <span className='error'>This field is required</span>}
          <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
        <label htmlFor="firstName">First Name*</label>
        <br />
        <input 
          {...register("firstName", { required: true })}
          type="text" 
          id="firstName"
          placeholder={profile.firstName}
        />
        <br />
        {errors.firstName && <span className='error'>This field is required</span>}
        <br />
        <label htmlFor="lastName">Last Name*</label>
        <br />
        <input 
          {...register("lastName", { required: true })}
          type="text" 
          id="lastName"
          placeholder={profile.lastName}
        />
        <br />
        {errors.lastName && <span className='error'>This field is required</span>}
        <br />
        <label htmlFor="email">Email</label>
        <br />
        <input 
          {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
          type="email" 
          id="email"
          placeholder={profile.profileEmail}
        />
        {errors.email && <span className='error'>Invalid email address</span>}
        <br />
        <p>* mandatory fields.</p>
        <input type="submit" value="Save" className="bg-button"/>
      </form>
    </div>
  );
}

export default Profile