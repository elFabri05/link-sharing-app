import gitHubIcon from "../../assets/icon-github.svg"
import gitLabIcon from "../../assets/icon-gitlab.svg"
import HashnodeIcon from "../../assets/icon-hashnode.svg"
import CodePenIcon from "../../assets/icon-codepen.svg"
import StackOverflowIcon from "../../assets/icon-stack-overflow.svg"
import TwitchIcon from "../../assets/icon-twitch.svg"
import YouTubeIcon from "../../assets/icon-youtube.svg"
import LinkedInIcon from "../../assets/icon-linkedin.svg"
import DevtoIcon from "../../assets/icon-devto.svg"
import CodeWarsIcon from "../../assets/icon-codewars.svg"
import freeCodeCampIcon from "../../assets/icon-freecodecamp.svg"
import FrontendMentorIcon from "../../assets/icon-frontend-mentor.svg"
import TwitterIcon from "../../assets/icon-twitter.svg"

interface Option {
    value: string;
    label: JSX.Element;
  } 

const options : Option[] = [
    {value: 'github', label: <div><img src={gitHubIcon} alt="GitHub Icon" /> GitHub</div>},
    {value:"GitLab", label: <div><img src={gitLabIcon} alt="GitLab Icon" /> GitLab</div>},
    {value:"Hashnode", label: <div><img src={HashnodeIcon} alt="Hashnode Icon" /> Hashnode</div>},
    {value:"CodePen", label: <div><img src={CodePenIcon} alt="CodePen Icon" /> CodePen</div>},
    {value:"CodeWars", label: <div><img src={CodeWarsIcon} alt="CodeWars Icon" /> CodeWars</div>},
    {value:"StackOverflow", label: <div><img src={StackOverflowIcon} alt="Stack Overflow Icon" /> Stack Overflow</div>},
    {value:"Twitch", label: <div><img src={TwitchIcon} alt="Twich Icon" /> Twitch</div>},
    {value:"YouTube", label: <div><img src={YouTubeIcon} alt="YouTube Icon" /> YouTube</div>},
    {value:"LinkedIn", label: <div><img src={LinkedInIcon} alt="LinkedIn Icon" /> LinkedIn</div>},
    {value:"Dev.to", label: <div><img src={DevtoIcon} alt="Devto Icon" /> Dev.to</div>},
    {value:"freeCodeCamp", label: <div><img src={freeCodeCampIcon} alt="freeCodeCamp Icon" /> freeCodeCamp</div>},
    {value:"FrontendMentor", label: <div><img src={FrontendMentorIcon} alt="FrontendMentor Icon" /> Frontend Mentor</div>},
    {value:"Twitter", label: <div><img src={TwitterIcon} alt="Twitter Icon" /> Twitter</div>},
  ]

  export default options