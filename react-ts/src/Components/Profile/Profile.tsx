import { useEffect, useState } from 'react'
// import 'Profile.css'
import { Link } from 'react-router-dom'
import iconUploadImg from '../../assets/icon-upload-image.svg'
// import iconCodePen from '../../assets/icon-codepen.svg'
// import iconCodeWars from '../../assets/icon-codewars.svg'
// import iconDevto from '../../assets/icon-devto.svg'
// import iconFacebook from '../../assets/icon-facebook.svg'
// import iconFrontendMentor from '../../assets/icon-frontend-mentor.svg'
// import iconFreeCodeCamp from '../../assets/icon-freecodecamp.svg'
// import iconGitHub from '../../assets/icon-github.svg'
// import iconGitLab from '../../assets/icon-gitlab.svg'
// import iconHashNode from '../../assets/icon-hashnode.svg'
// import iconLinkedin from '../../assets/icon-linkedin.svg'
// import iconStackOverFlow from '../../assets/icon-stack-overflow.svg'
// import iconTwitch from '../../assets/icon-twitch.svg'
// import iconTwitter from '../../assets/icon-twitter.svg'
// import iconYoutube from '../../assets/icon-youtube.svg'

interface PlatformLink {
    id: string;
    platform: string;
    link: string;
  }

  interface LinksItem {
    $each: PlatformLink[];
  }
  
  interface User {
    links?: PlatformLink[];
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    profileEmail?: string; // Assuming this can be optional
  }

function Profile(){

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
          const allLinks = userData.links.reduce((acc: PlatformLink[], item: LinksItem) => {
            if (item.$each) {
              acc = acc.concat(item.$each);
            }
            return acc;
          }, []);
          
          const userWithAggregatedLinks = {
            ...userData,
            links: allLinks,
          };
          
          setUser(userWithAggregatedLinks);
        } 
        catch (error) {
          setError("Data couldn't be reached or user is not authenticated.");
          console.log("data couldn't be reached");
        }
      };
      fetchUserProfile();
    }, []);

    console.log(user)
    return(
        <div>
            <header>
                <Link to="/links-settings">
                    <button>Back to editor</button> 
                </Link>
                <Link to="">
                    <button>Share Link</button>
                </Link>
            </header>
            {error ? <p>{error}</p> : null}
            {user ? (
              <div>
                <img src={user.profilePicture || iconUploadImg} alt="Profile" />
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
                <h4>{user.profileEmail || 'No email provided'}</h4>
                <div>
                  {user?.links?.map((link, index) => (
                    <div key={index}>
                      <div>{link.platform}</div>
                      <div>{link.link}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p>Loading...</p>}
        </div>
    )
}

export default Profile