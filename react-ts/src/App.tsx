import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import './App.css';

import HomeLayout from './Layouts/HomeLayout'; 
import Login from './Components/Home/Login';
import CreateAccount from './Components/Home/CreateAccount';
import SettingsLayout from './Layouts/SettingsLayout';
import Links from './Components/Settings/Links';
import ProfileSettings from './Components/Settings/ProfileSettings';
import Profile from './Components/Profile/Profile';

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Login />} />
        <Route path="create-account" element={<CreateAccount />} />
      </Route>
      <Route path="/links-settings" element={<SettingsLayout />}>
        <Route index element={<Links />}/>
      </Route>
      <Route path="/profile-settings" element={<SettingsLayout />}>
        <Route index element={<ProfileSettings />}/>
      </Route>
      <Route path="/profile" element={<Profile />}/>
    </>
  ))

  return (
    <RouterProvider router={router}/> 
  )
}

export default App
