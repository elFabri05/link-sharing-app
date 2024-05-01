import { useEffect, useState } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
import { platformColor } from '../../Utils/platformColor';
import iconUploadImg from '/assets/icon-upload-image.svg';
import iconArrowRight from '/assets/icon-arrow-right.svg';

interface PlatformLink {
    id: string;
    platform: string;
    link: string;
  }
  
interface User {
  links?: PlatformLink[];
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  profileEmail?: string;
}

const Profile: React.FC = () => {

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch('http://localhost:3300/profile', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const userData = await response.json();
          
          setUser(userData);
        } 
        catch (error) {
          setError("Data couldn't be reached or user is not authenticated.");
        }
      };
      fetchUserProfile();
    }, []);
 
    const renderName = () => {
      if (user) {
        const { firstName, lastName } = user;
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        } else if (firstName) {
          return firstName;
        } else if (lastName) {
          return lastName;
        }
      }
      return "User";
    };

    return(
        <div className='profile-component'>
            <header className='profile-header'>
                <Link to="/links-settings">
                    <button className='bg-inverted-button' style={{width:'160px'}}>Back to editor</button> 
                </Link>
                <Link to="">
                    <button className='bg-button' style={{width:'160px'}}>Share Link</button>
                </Link>
            </header>
            {user ? (
              <div className='profile-data-container'>
                <div className='circular-container'>
                  {user.profilePicture ?
                    <img src={user.profilePicture} alt="Profile" className='profile-picture'/>
                    :
                    <img src={iconUploadImg} alt="icon-upload-img" className='profile-picture' style={{width:'50%', transform:'translate(50%,50%)'}}/>
                  }
                </div>
                <h1>{renderName()}</h1>
                <h4 className='profile-email'>{user.profileEmail || 'No email provided'}</h4>
                <div className='platform-containter'>
                  {user.links?.map((link, index) => {
                    const { color, icon } = platformColor(link.platform);
                    return (
                      <div key={index} className='platform' style={{ backgroundColor: color,
                            border: link.platform === 'FrontendMentor' ? '1px solid #333' : undefined}}  >
                        <img src={icon} alt={link.platform} 
                           style={{filter: link.platform === 'FrontendMentor' ? 'brightness(0) invert(0)' : undefined }}/>
                        <a href={link.link}
                            style={{color: link.platform === 'FrontendMentor' ? '#333' : undefined}}>{link.platform}</a>
                        <img src={iconArrowRight} alt="right arrow" 
                            style={{filter: link.platform === 'FrontendMentor' ? 'brightness(0) invert(0.1)' : undefined}}/>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : <p style={{color: '#633CFF', marginLeft:'2rem', fontSize:'1.5rem', fontWeight:'600'}}>Loading...</p>}
            {error && (<div style={{color: 'red'}}>{error}</div>)}
        </div>
    );
};

export default Profile;