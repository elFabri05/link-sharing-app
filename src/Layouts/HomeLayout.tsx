import { Outlet } from "react-router-dom";
import './HomeLayout.css';
import LargeLogo from '../assets/logo-devlinks-large.svg';

const HomeLayout: React.FC = () => {

    return(
        <div className='home-layout'>
            <img src={LargeLogo} alt="Devlinks large logo" />
            <Outlet />
        </div>
    );
}

export default HomeLayout;