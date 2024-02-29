import {useState} from "react";
import { Link } from "react-router-dom";
import { useForm, Controller , SubmitHandler} from 'react-hook-form';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid'; 
import "./Settings.css";
import options from "./options";

import ilustrationEmpty from "../../assets/illustration-empty.svg";
import dragAndDrop from "../../assets/icon-drag-and-drop.svg";
import LinkIcon from "../../assets/icon-link.svg";

interface MyFormData {
    [key: string]: string
  }

interface Link {
id: string;
}

function Links(){
const [addNewLink, setAddNewLink] = useState<boolean>(false);
const [selectedOptions, setSelectedOptions] = useState<Link[]>([]);

const { control, handleSubmit, register } = useForm();


    const onSubmit: SubmitHandler<MyFormData> = async (data) => {
    try {
        const response = await fetch('http://localhost:3300/links-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
    
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
    
        const responseData = await response.json();
        console.log('Login successful:', responseData);
    } catch (error) {
        console.error('Failed to login:', error);
    }
    };

    const addLink = (): void => { 
        setAddNewLink(true);   
        const newLink : Link = {
        id: uuidv4(),
        };
        setSelectedOptions(prev => [...prev, newLink]);
};

const removeLink = (linkId: string): void => {
    setSelectedOptions(prev => prev.filter(link => link.id !== linkId));

    if (selectedOptions.length === 0){
        setAddNewLink(false)
    }
};

return(
    <div className="links-background">
        <div className="links-container">
            <h3>Costumize your links</h3>
            <p>Add/Edit/Remove links below and then share all your profiles with the world!</p>
            <button className="bg-inverted-button" onClick={addLink}>+ Add new link</button>
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
                {selectedOptions.map((link, index) => (
                    <div key={link.id}>
                        <div>
                            <span><img src={dragAndDrop} alt="Drag and drop Icon" /> Link # {index + 1}</span>
                            <button type="button" onClick={() => removeLink(link.id)}>Remove</button>
                        </div>
                        <label htmlFor={`dropdown${link.id}`}>Platform</label>
                        <Controller
                            name={`platform${link.id}`}
                            control={control}
                            render={({ field }) => (
                            <Select 
                                {...field} 
                                options={options} 
                                placeholder="Select platform" 
                            />
                            )}
                        />
                        <label htmlFor={`link${link.id}`}>Link</label>
                        <br />
                        <input 
                            {...register(`link${link.id}`)}
                            type="text" 
                            id={`link-${link.id}`}
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
);
}

export default Links;