import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import useMediaQuery from '../Hooks/useMediaQuery';
import './SettingsLayout.css'

import smallLogo from "../assets/logo-devlinks-small.svg";
import iconLink from "../assets/icon-link.svg";
import iconDetail from "../assets/icon-profile-details-header.svg";
import iconPreview from "../assets/icon-preview-header.svg";
import largeLogo from "../assets/logo-devlinks-large.svg";

const SettingsLayout: React.FC = () => {
    const [activeTab, setActiveTab] = useState<boolean>(true);

    const isTablet: boolean = useMediaQuery(767)

    const toggleLinkSettings = () : void => {
            setActiveTab(true);
    };

    const toggleProfileSettings = () : void => {
        setActiveTab(false);
};

    return(
        <div className="settings-layout-component">
            <div className="settings-layout">
                <Link to="/" >
                    <img src={isTablet ? largeLogo : smallLogo} 
                    alt="Devlinks logo" 
                    className="dev-links"/>
                </Link>
                <Link to="/links-settings" onClick={toggleLinkSettings} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={`tab-default ${activeTab? "active-tab" : ""}`}>
                        <img src={iconLink} 
                        alt="Links settings Icon" 
                        className="settings-icon"
                        />
                        {isTablet ? <span>Links</span> : ""}
                    </div>
                </Link>
                <Link to="/profile-settings" onClick={toggleProfileSettings} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={`tab-default ${!activeTab ? "active-tab" : ""}`}>
                        <img src={iconDetail} 
                        alt="Personal details Icon" 
                        className="settings-icon"
                        />
                        {isTablet ? <span>Profile Details</span> : ""}
                    </div>
                </Link>
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="preview">
                        {isTablet ?
                            <span>Preview</span>
                                :
                            <img src={iconPreview} 
                            alt="Preview Icon" 
                            className="preview-icon"/>
                        }
                    </div>
                </Link>
            </div>
            <div className="settings-outlet-wrapper">
                <Outlet/>
            </div>
        </div>
    );
}

export default SettingsLayout;