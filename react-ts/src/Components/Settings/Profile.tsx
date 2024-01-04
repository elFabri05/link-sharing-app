import { Link } from "react-router-dom"
import "./Settings.css"
import uploadImage from "../../assets/icon-upload-image.svg"

export default function Profile(){

    return(
        <div>
            <h3>Profile Details</h3>
            <p>Add your details to create a personal touch to your profile.</p>
            <div>
                <h5>Profile picture</h5>
                <button>
                    <img src={uploadImage} alt="Upload Image" />
                    <br />
                    + Upload Image
                </button>
                <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
            </div>
            <div>
                <form action="">
                    <label htmlFor="firstName">First Name*</label>
                    <br />
                    <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"/>
                    <br />
                    <label htmlFor="firstName">Last Name*</label>
                    <br />
                    <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"/>
                    <br />
                    <label htmlFor="firstName">Email</label>
                    <br />
                    <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="Your email adress"/>
                </form>
                <p>* mandatory fields.</p>
            </div>
            <Link to=""><button>Save</button></Link>
        </div>
    )
}