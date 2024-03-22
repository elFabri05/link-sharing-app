import { useState, useEffect } from "react";
import { useForm, Controller , SubmitHandler} from 'react-hook-form';
import Select, { components , OptionProps } from 'react-select';
import { v4 as uuidv4 } from 'uuid'; 
import "./Settings.css";
import options from "./options";

import ilustrationEmpty from "../../assets/illustration-empty.svg";
import dragAndDrop from "../../assets/icon-drag-and-drop.svg";
import LinkIcon from "../../assets/icon-link.svg";

interface MyFormData {
    [key: `platform${string}` | `link${string}`]: string;
  }
  
  interface PlatformLink {
    id: string;
    platform: string;
    link: string;
  }
  
  interface DataItem {
    $each?: PlatformLink[];
  }
  
  interface Option {
    value: string;
    label: JSX.Element;
  }
  
  function Links() {
    const [addNewLink, setAddNewLink] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<PlatformLink[]>([]);
    const [savedLinks, setSavedLinks] = useState<boolean>(false);
  
    const { control, handleSubmit, register, reset } = useForm<MyFormData>();
  
    useEffect(() => {
        const fetchLinks = async () => {
          try {
            const response = await fetch('http://localhost:3300/links-settings', {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
              });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const linksArray = data.reduce((acc: PlatformLink[], item: DataItem) => {
                if (item.$each && Array.isArray(item.$each)) {
                acc = acc.concat(item.$each);
                }
                return acc;
            }, [] as PlatformLink[]);
            console.log(linksArray)
            setSelectedOptions(linksArray);
            setAddNewLink(true);
          } catch (error) {
            console.error('Error fetching links:', error);
          }
        };
        fetchLinks();
      }, [] );

      useEffect(() => {
        const formData: MyFormData = selectedOptions.reduce((acc, { id, platform, link }) => {
            acc[`platform${id}`] = platform;
            acc[`link${id}`] = link;
            return acc;
          }, {} as MyFormData);
        
          reset(formData);
        }, [selectedOptions, reset]);

        const onSubmit: SubmitHandler<MyFormData> = async (data) => {
        const newLinks: PlatformLink[] = selectedOptions.map((link) => ({
            id: link.id,
            platform: data[`platform${link.id}`],
            link: data[`link${link.id}`],
            }));
        try {
            const response = await fetch('http://localhost:3300/links-settings', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newLinks }),
            });
        
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
        
            const responseData = await response.json();
            console.log('Login successful:', responseData);
            setSavedLinks(true);
        } catch (error) {
            console.error('Failed to login:', error);
        }
        };

    const addLink = (): void => { 
        setSelectedOptions((prev) => [
            ...prev,
            { id: uuidv4(), platform: '', link: ''  },
        ]);
        setSavedLinks(false);
        setAddNewLink(true);   
    };

    const removeLink = (linkId: string): void => {
        setSelectedOptions(prev => prev.filter(link => link.id !== linkId));

        if (selectedOptions.length === 0){
            setAddNewLink(false);
        }
        setSavedLinks(false);
    };

    const CustomOption: React.FC<OptionProps<Option, false>> = (props) => {
    return (
        <components.Option {...props}>
            {props.data.label};
        </components.Option>
        );
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
                        <div key={index}>   
                            <div>
                                <span><img src={dragAndDrop} alt="Drag and drop Icon" /> Link # {index + 1}</span>
                                <button type="button" onClick={() => removeLink(link.id)}>Remove</button>
                            </div>
                            <label htmlFor={`dropdown${link.id}`}>Platform</label>
                            <Controller
                                name={`platform${link.id}`}
                                control={control}
                                defaultValue={link.platform}
                                render={({ field }) => (
                                <Select 
                                    {...field} 
                                    placeholder="Select platform" 
                                    components={{ Option: CustomOption }}
                                    options={options} 
                                    value={options.find(option => option.value === field.value)}
                                    onChange={(option) => field.onChange(option?.value)}
                                />
                                )}
                            />
                            <label htmlFor={`link${link.id}`}>Link</label>
                            <br />
                            <input 
                                {...register(`link${link.id}`)}
                                defaultValue={link.link}
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
                    <button type="submit" className="bg-button">Save</button>
                    {savedLinks && <p>Your links have been saved</p>}
                    </form>
                    )
            }
            </div>
        </div>
    );
}

export default Links;