
import iconCodePen from '/assets/icon-codepen.svg';
import iconCodeWars from '/assets/icon-codewars.svg';
import iconDevto from '/assets/icon-devto.svg';
import iconFacebook from '/assets/icon-facebook.svg';
import iconFrontendMentor from '/assets/icon-frontend-mentor.svg';
import iconFreeCodeCamp from '/assets/icon-freecodecamp.svg';
import iconGitHub from '/assets/icon-github.svg';
import iconGitLab from '/assets/icon-gitlab.svg';
import iconHashNode from '/assets/icon-hashnode.svg';
import iconLinkedin from '/assets/icon-linkedin.svg';
import iconStackOverFlow from '/assets/icon-stack-overflow.svg';
import iconTwitch from '/assets/icon-twitch.svg';
import iconTwitter from '/assets/icon-twitter.svg';
import iconYoutube from '/assets/icon-youtube.svg';

interface PlatformStyle {
    color: string;
    icon: string;
  }

export function platformColor(platform: string):PlatformStyle {
    switch (platform) {
      case 'CodePen':
        return { color: '#333333', icon: iconCodePen };
      case 'CodeWars':
        return { color: '#8A1A50', icon: iconCodeWars };
      case 'Dev.to':
        return { color: '#333333', icon: iconDevto };
      case 'Github':
        return { color: '#1A1A1A', icon: iconGitHub };
      case "GitLab":
        return { color: '#EB4925', icon: iconGitLab };
      case "Hashnode":
        return { color: '#0330D1', icon: iconHashNode };
      case 'StackOverflow':
        return { color: '#EC7100', icon: iconStackOverFlow };
      case 'Twitch':
        return { color: '#EE3FC8', icon: iconTwitch };
      case 'YouTube':
        return { color: '#EE3939', icon: iconYoutube };
      case 'LinkedIn':
        return { color: '#2D68FF', icon: iconLinkedin };
      case 'freeCodeCamp':
        return { color: '#302267', icon: iconFreeCodeCamp };
      case 'FrontendMentor':
        return { color: '#FFFFFF', icon: iconFrontendMentor };
      case 'Twitter':
        return { color: '#43B7E9', icon: iconTwitter };
      case 'Facebook':
        return { color: '#2442AC', icon: iconFacebook };
      default:
        return { color: 'transparent', icon: '' };
    }
  }