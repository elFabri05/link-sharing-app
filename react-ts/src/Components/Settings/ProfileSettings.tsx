import { useEffect , useState} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useMediaQuery from '../../Hooks/useMediaQuery';
import "./ProfileSettings.css";
import { platformColor } from "../../Utils/platformColor";
import phoneMockup from '../../assets/illustration-phone-mockup.svg'
import iconArrowRight from '../../assets/icon-arrow-right.svg';

interface LinkData {
  id: string;
  platform: string;
  link: string;
}

interface UserProfileData {
  firstName?: string;
  lastName?: string;
  profileEmail?: string;
  profilePicture?: string;
  links?: LinkData[];
}

interface UserProfileForm {
  profilePicture?: FileList;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const Profile: React.FC = () => {

  const [profile, setProfile] = useState<UserProfileData>({});
  const [savedProfileData, setSavedProfileData] = useState<boolean>(false);

  const { register, handleSubmit, setValue } = useForm<UserProfileForm>();

  const isTablet: boolean = useMediaQuery(767);
  const isDesktop: boolean = useMediaQuery(1340);

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
          throw new Error(`Error: ${response.status}`);
        }

        const data: UserProfileData = await response.json();
        setProfile(data);
        setValue('firstName', data.firstName);
        setValue('lastName', data.lastName);
        setValue('email', data.profileEmail);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUserProfile();
  }, [setValue]);

  const onSubmit: SubmitHandler<UserProfileForm> = async (data) => {
    if (data.profilePicture && data.profilePicture.length > 0) {
      const formData = new FormData();
      formData.append('profilePicture', data.profilePicture[0]);
      setValue('profilePicture', data.profilePicture);

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

    const userDetails = {
      firstName: data.firstName || profile.firstName,
      lastName: data.lastName || profile.lastName,
      email: data.email || profile.profileEmail,
    };
  
    try {
      const response = await fetch('http://localhost:3300/profile-settings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });
      setSavedProfileData(true);
      if (!response.ok) throw new Error('Network response was not ok');
      console.log('User details update successful:', await response.json());
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  const profileLinks = profile.links || [];
  
return(
  <div className='settings-wrapper'>
    {isDesktop && 
            <div className='phone-mockup-container'>
                {profileLinks.slice(0,5).map((link, index) => {
                  const { color, icon } = platformColor(link.platform);
                  const style : React.CSSProperties = {
                    backgroundColor: color,
                    position: 'absolute',
                    top: `${305 + 63 * index}px`,
                    left: '161px',
                    color: link.platform === 'FrontendMentor' ? '#333' : undefined,
                    border: link.platform === 'FrontendMentor' ? '1px solid #333' : undefined,
                  };
                  return(
                    <div key={index} className='link-mockup' style={style}>
                      <img src={icon} alt={link.platform} style={{filter: link.platform === 'FrontendMentor' ? undefined : 'brightness(0) invert(1)'}}/>
                      <div>{link.platform}</div>
                      <img src={iconArrowRight} alt="right arrow" style={{filter: link.platform === 'FrontendMentor' ? 'brightness(0) invert(0.1)' : undefined}}/>
                    </div>
                  );
                })}
                <img src={phoneMockup} alt="Phone mockup" className='phone-mockup'/>
            </div>}
    <div className='profile-settings-component'>
      <h3>Profile Details</h3>
      <p>Add your details to create a personal touch to your profile.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className='background-container profile-picture-container'>
              <h5>Profile picture</h5>
              <label htmlFor="image-upload">
                  <div className='img-upload-containter'
                      style={{
                        backgroundImage: profile.profilePicture ? `url(${profile.profilePicture})` : 'none',
                        backgroundSize: 'cover',  
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat',
                      }}
                  >
                      <input 
                        {...register("profilePicture")} 
                        id="image-upload"
                        type="file" 
                        className='img-upload'
                      />
                      <span className='upload-img-span'>
                          + Upload Image
                      </span>
                  </div>
              </label>
              <div className='profile-picture-text'>
                  <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
              </div>
          </div>
          <div className='background-container personal-data-container'>
            <div className="form-personal-data">
              <label htmlFor="firstName">First Name</label>
              {isTablet ? '' : <br /> }
              <input 
                {...register("firstName")}
                type="text" 
                id="firstName"
                placeholder='First Name'
                defaultValue={profile.firstName}
              />
            </div>
            <div className="form-personal-data">
              <label htmlFor="lastName">Last Name</label>
              {isTablet ? '' : <br /> }
              <input 
                {...register("lastName")}
                type="text" 
                id="lastName"
                placeholder='Last Name'
                defaultValue={profile.lastName}
              />
            </div>
            <div className="form-personal-data">
              <label htmlFor="email">Email</label>
              {isTablet ? '' : <br /> }
              <input 
                {...register("email", { pattern: /^\S+@\S+$/i })}
                type="email" 
                id="email"
                placeholder='Email'
                defaultValue={profile.profileEmail}
              />
            </div>
          </div>
          <div className='save-btn-container'>
            <input type="submit" value="Save" className="bg-button save-btn"/>
            {savedProfileData ? <p style={{color:'#633CFF'}} className='saved-data-p'>Your data has been saved</p> : ''}
          </div>
      </form>
    </div>
  </div>
  );
}

export default Profile;

