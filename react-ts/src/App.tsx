import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
// import { BrowserRouter } from 'react-router-dom'
import './App.css'

// import Login from './Components/Home/Login'
// import CreateAccount from './Components/Home/CreateAccount'
// import Links from './Components/Home/Links'
// import Profile from './Components/Settings/Profile'

import HomeLayout from './Layouts/HomeLayout'
import SettingsLayout from './Layouts/SettingsLayout'

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={<HomeLayout />} />
      <Route path="/settings" element={<SettingsLayout />} />
    </>
  ))

  return (
    <RouterProvider router={router}/> 
  )
}

export default App

{/* <BrowserRouter>
   <SettingsLayout /> 
</BrowserRouter> */}