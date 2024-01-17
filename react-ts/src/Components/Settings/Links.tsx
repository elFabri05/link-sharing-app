import {useState} from "react"
import { Link } from "react-router-dom"
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import "./Settings.css"
import options from "./options"

import ilustrationEmpty from "../../assets/illustration-empty.svg"
import dragAndDrop from "../../assets/icon-drag-and-drop.svg"
import LinkIcon from "../../assets/icon-link.svg"

 function Links(){
    const [ addNewLink, setAddNewLink ] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])

    const { control, handleSubmit, register } = useForm()

    interface MyFormData {
        [key: string]: string
      }

    const onSubmit = (data: MyFormData) => console.log(data)

        const addedLink = (): void => {
        setAddNewLink(true)
        const newNumber = selectedOptions.length + 1
        setSelectedOptions([...selectedOptions, newNumber])
    }

    const removeLink = (linkIndex: number): void => {
        const updatedLinks = selectedOptions.filter((_, index) => index !== linkIndex)
        setSelectedOptions(updatedLinks)

        if (updatedLinks.length === 0){
            setAddNewLink(false)
        }
    }

    return(
        <div className="links-background">
            <div className="links-container">
                <h3>Costumize your links</h3>
                <p>Add/Edit/Remove links below and then share all your profiles with the world!</p>
                <button className="bg-inverted-button" onClick={addedLink}>+ Add new link</button>
                {!addNewLink ? (
                    <div>
                        <img src={ilustrationEmpty} alt="Ilustration empty" />
                        <h3>Let's get you started</h3>
                        <p>Use the "Add new link" button to get started. 
                            Once you have more than one link, you can reorder and edit them. 
                            We're here to help you share your profiles with everyone!</p>
                    </div>
                    )    :   (
                    <form onSubmit={handleSubmit(onSubmit)}>
                    {selectedOptions.map((num, index) => (
                        <div key={index}>
                        <div>
                            <span><img src={dragAndDrop} alt="Drag and drop Icon" /> Link # {num}</span>
                            <button onClick={() => removeLink(index)}>Remove</button>
                        </div>
                        <label htmlFor={"dropdown" + index}>Platform</label>
                        <Controller
                            name={"platform" + index}
                            control={control}
                            render={({ field }) => (
                            <Select 
                                {...field} 
                                options={options} 
                                placeholder="Select platform" 
                            />
                            )}
                        />
                        <label htmlFor={"link" + index}>Link</label>
                        <br />
                        <input 
                            {...register("link" + index)}
                            type="text" 
                            id={"link" + index}
                            placeholder='e.g. https://www.github.com/example' 
                            style={{
                            backgroundImage : `url(${LinkIcon})`,
                            backgroundRepeat: 'no-repeat',
                            paddingLeft: '30px',
                            }}
                        />
                        </div>
                    ))}
                    </form>
                    )
            }
                <Link to=""><button className="bg-button">Save</button></Link>
            </div>
        </div>
    )
}

export default Links