import { Link } from "react-router-dom"
import { useForm } from 'react-hook-form'
import "./Settings.css"
import uploadImage from "../../assets/icon-upload-image.svg"

interface ProfileForm {
    firstName: string
    lastName: string
    email: string
  }

export default function Profile(){

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data: ProfileForm) : void => {
        console.log(data)
      }

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
                 <form onSubmit={handleSubmit(onSubmit)}>
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

                <input type="submit" />
                </form>
                <p>* mandatory fields.</p>
            </div>
            <Link to=""><button className="bg-button">Save</button></Link>
        </div>
    )
}