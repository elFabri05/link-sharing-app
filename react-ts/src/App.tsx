// import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import './App.css'

import Login from './Components/Home/Login'
import CreateAccount from './Components/Home/CreateAccount'
import Links from './Components/Settings/Links'
import Profile from './Components/Settings/Profile'

function App() {

  // const router = createBrowserRouter(createRoutesFromElements(
  //   <Route path="/">
  //       <Route element={<Login />} />
  //   </Route>
  // ))
  {/* <RouterProvider router={router}/> */}

  return (
    <>
      <BrowserRouter>
         <Links /> 
      
      </BrowserRouter>
    </>
  )
}

export default App
