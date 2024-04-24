import { useState, useEffect } from "react";
import { useForm, Controller , useFieldArray, SubmitHandler, FieldValues } from 'react-hook-form';
import Select, { components , OptionProps , StylesConfig , GroupBase} from 'react-select';
import { v4 as uuidv4 } from 'uuid'; 
import useMediaQuery from '../../Hooks/useMediaQuery';
import "./Links.css";
import options from "./options";
import { platformColor } from "../../Utils/platformColor";

import ilustrationEmpty from "../../assets/illustration-empty.svg";
import dragAndDrop from "../../assets/icon-drag-and-drop.svg";
import LinkIcon from "../../assets/icon-link.svg";
import phoneMockup from '../../assets/illustration-phone-mockup.svg';
import iconArrowRight from '../../assets/icon-arrow-right.svg';

interface PlatformLink {
    id: string;
    platform: string;
    link: string;
  }

interface FormValues {
  links: Array<{
    id: string;
    platform: string;
    link: string;
  }>;
}

const Links: React.FC = () => {
    const [addNewLink, setAddNewLink] = useState<boolean>(false);
    const [savedLinks, setSavedLinks] = useState<boolean>(false);

    const isDesktop: boolean = useMediaQuery(1340);

    const { control, handleSubmit, register, reset, formState: { errors }} = useForm<FormValues>({
      defaultValues: {
        links: []
      }
    });

    const { fields, append, update, remove } = useFieldArray({
      control,
      name: "links"
    });

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
              
              const linksArray: PlatformLink[] = await response.json();
              reset({ links: linksArray });
              if(linksArray.length > 0){
                setAddNewLink(true);
              }
            } catch (error) {
              console.error('Error fetching links:', error);
            }
          };  
          fetchLinks();
      }, [reset]);

      const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log("Form submission data:", data);
      try {
          const response = await fetch('http://localhost:3300/links-settings', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newLinks: data.links }),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
      
          const responseData = await response.json();
          fields.forEach((field, index) => {
            update(index, { ...field, ...responseData[index] });
          });
          setSavedLinks(true);
          
      } catch (error) {
          console.error('Failed to submit data:', error);
      }
    };

    const addLink = (): void => { 
        append({ id: uuidv4(), platform: '', link: '' })
        setSavedLinks(false);
        setAddNewLink(true);   
    };

    const removeLink = (index: number): void => {
        remove(index);
        if (fields.length - 1 === 0) {
          setAddNewLink(false);
      }
        setSavedLinks(false);
    };

    const CustomOption: React.FC<OptionProps<FieldValues, false, GroupBase<FieldValues>>> = (props) => {
      return (
        <components.Option {...props}>
          {props.data.label}
        </components.Option>
      );
    };

    const customStyles: StylesConfig<FieldValues, false> = {
      control: (provided) => ({
        ...provided,
        height: '48px',
        minHeight: '48px',
      }),
      valueContainer: (provided) => ({
        ...provided,
        height: '48px',
      }),
    };

    return(
        <div className='settings-wrapper'>
            {isDesktop && 
            <div className='phone-mockup-container'>
              {fields.slice(0,5).map((field, index) => {
                const { color, icon } = platformColor(field.platform);
                const style : React.CSSProperties = {
                  backgroundColor: color,
                  position: 'absolute',
                  top: `${305 + 63 * index}px`,
                  left: '161px',
                  color: field.platform === 'FrontendMentor' ? '#333' : undefined,
                  border: field.platform === 'FrontendMentor' ? '1px solid #333' : undefined,
                };
                return(
                  <div key={index} className='link-mockup' style={style}>
                    <img src={icon} alt={field.platform} 
                        style={{filter: field.platform === 'FrontendMentor' ? undefined : 'brightness(0) invert(1)'}}/>
                    <div>{field.platform}</div>
                    <img src={iconArrowRight} alt="right arrow" 
                        style={{filter: field.platform === 'FrontendMentor' ? 'brightness(0) invert(0.1)' : undefined}}/>
                  </div>
                )
              })}
              <img src={phoneMockup} alt="Phone mockup" className='phone-mockup'/>
            </div>}
            <div className="links-component">
                <h3>Costumize your links</h3>
                <p>Add/Edit/Remove links below and then share all your profiles with the world!</p>
                <button className="bg-inverted-button link-btn" onClick={addLink} >+ Add new link</button>
                {!addNewLink ? (
                    <div className="started-links">
                        <img src={ilustrationEmpty} alt="Ilustration empty" />
                        <h3>Let's get you started</h3>
                        <p>Use the "Add new link" button to get started. 
                            Once you have more than one link, you can reorder and edit them. 
                            We're here to help you share your profiles with everyone!</p>
                    </div>
                    )    :   (
                    <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field, index) => (
                        <div key={field.id} className="link">   
                            <div className="link-header">
                                <span><img src={dragAndDrop} alt="Drag and drop Icon" /> Link # {index + 1}</span>
                                <button type="button" className="remove-btn" onClick={() => removeLink(index)}>Remove</button>
                            </div>
                            <label htmlFor={`dropdown${field.id}`}>Platform</label>
                            <Controller
                                name={`links.${index}.platform`}
                                control={control}
                                defaultValue={field.platform}
                                rules={{ required: 'Platform selection is required' }}
                                render={({ field }) => (
                                  <Select 
                                    {...field}
                                    placeholder="Select platform" 
                                    components={{ Option: CustomOption }}
                                    options={options}
                                    styles={customStyles}
                                    value={options.find(option => option.value === field.value)}
                                    onChange={(option) => field.onChange(option?.value)}
                                  />
                                )}
                            />
                            {errors.links && errors.links[index]?.platform && (
                              <p className='error' style={{margin:'0 0 -5px'}}>{errors.links[index]?.platform?.message}</p>
                            )}
                            <label htmlFor={`link${field.id}`}>Link</label>
                            <br />
                            <input 
                                {...register(`links.${index}.link`, {
                                  required: 'This field is required',
                                  pattern: {
                                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 
                                    message: 'Enter a valid URL'
                                  }
                                })}
                                defaultValue={field.link}
                                type="text" 
                                id={`link-${field.id}`}
                                placeholder='e.g. https://www.github.com/example' 
                                style={{
                                backgroundImage : `url(${LinkIcon})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPositionX: '.5rem',
                                backgroundPositionY: 'center',
                                paddingLeft: '30px',
                              }}
                            />
                            {errors.links && errors.links[index]?.link && (
                              <p className='error' style={{margin:'0 0 -15px'}}>{errors.links[index]?.link?.message}</p>
                            )}
                          </div>
                    ))}
                    <div className='links-save-btn-container'>
                        <button type="submit" className="bg-button links-save-btn">Save</button>
                        {savedLinks && <p style={{color:'#633CFF'}}>Your links have been saved</p>}
                    </div>
                    </form>
                    )
                }
            </div>
        </div>
    ); 
}

export default Links;