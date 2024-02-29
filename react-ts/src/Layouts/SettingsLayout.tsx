import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./SettingsLayout.css";

import smallLogo from "../assets/logo-devlinks-small.svg";
import iconLink from "../assets/icon-link.svg";
import iconDetail from "../assets/icon-profile-details-header.svg";
import iconPreview from "../assets/icon-preview-header.svg";

function SettingsLayout(){

    const [activeTab, setActiveTab] = useState<string>("links-settings");

    const toggleActiveTab = () : void => {
        if (activeTab === "links-settings"){
            setActiveTab("personal-details");
        }
        else if (activeTab === "personal-details"){
            setActiveTab("links-settings");
        }
    };

    return(
        <div>
            <div className="settings-layout">
                <Link to="/">
                    <img src={smallLogo} 
                    alt="Devlinks small logo" 
                    className="dev-links"/>
                    </Link>
                <Link to="/links-settings">
                    <div className={`tab-container ${activeTab === "links-settings" ? "active-tab" : ""}`}>
                        <img src={iconLink} 
                        alt="Links settings Icon" 
                        className="settings-icon"
                        onClick={toggleActiveTab}/>
                    </div>
                </Link>
                <Link to="/profile-settings">
                    <div className={`tab-container ${activeTab === "personal-details" ? "active-tab" : ""}`}>
                        <img src={iconDetail} 
                        alt="Personal details Icon" 
                        className="settings-icon"
                        onClick={toggleActiveTab}/>
                    </div>
                </Link>
                <Link to="">
                    <img src={iconPreview} 
                    alt="Preview Icon" 
                    className="preview-icon"/>
                </Link>
            </div>
            <Outlet/>
        </div>
    );
}

export default SettingsLayout;