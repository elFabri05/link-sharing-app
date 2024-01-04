import {useState} from "react"
import { Link } from "react-router-dom"
import Select from 'react-select'
import "./Settings.css"

import ilustrationEmpty from "../../assets/illustration-empty.svg"
import dragAndDrop from "../../assets/icon-drag-and-drop.svg"
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
import LinkIcon from "../../assets/icon-link.svg"



 function Links(){
    const [ addNewLink, setAddNewLink ] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])

    

    const addedLink = () => {
        setAddNewLink(true)
        const newNumber = selectedOptions.length + 1
        setSelectedOptions([...selectedOptions, newNumber])
    }

    const removeLink = (linkIndex : number) => {
        const updatedLinks = selectedOptions
            .filter((_, index) => index !== linkIndex)
            .map((_, index) => index + 1); // Adjust the numbers after removing
        setSelectedOptions(updatedLinks);

        if (updatedLinks.length === 0){
            setAddNewLink(false)
        }
    };

   

    const options = [
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
      ]


    return(
        <div>
            <h3>Costumize your links</h3>
            <p>Add/Edit/Remove links below and then share all your profiles with the world!</p>
            <button onClick={addedLink}>+ Add new link</button>
            {!addNewLink ? (
                <div>
                    <img src={ilustrationEmpty} alt="Ilustration empty" />
                    <h3>Let's get you started</h3>
                    <p>Use the "Add new link" button to get started. 
                        Once you have more than one link, you can reorder and edit them. 
                        We're here to help you share your profiles with everyone!</p>
                </div>
                )    : (

                selectedOptions.map((num, index) => {
                    return(
                        <div key ={index}>
                            <div>
                                <span><img src={dragAndDrop} alt="Drag and drop Icon" /> Link # {num}</span>
                                <button onClick={() => removeLink(index)}>Remove</button>
                            </div>
                            <form action="">
                                <label htmlFor="dropdown">Platform</label>
                                <Select options={options} id="dropdown"/>
                                <label htmlFor="link">Link</label>
                                <br />
                                <input 
                                    type="text" 
                                    id="link"
                                    name='link'
                                    placeholder='e.g. https://www.github.com/example' 
                                    style={{
                                        backgroundImage : `url(${LinkIcon})`,
                                        backgroundRepeat: 'no-repeat',
                                        paddingLeft: '30px',
                                    }}
                                    />
                            </form>
                        </div>
                    )
                })
            
                )
        }
            <Link to=""><button>Save</button></Link>
        </div>
    )
}

export default Links