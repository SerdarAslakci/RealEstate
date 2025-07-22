import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import {BrowserRouter as Router, Routes, Route}  from "react-router-dom"
import Home from './Home'
import Login from './Login'
import Register from './Register'
import ExploreHomes from './ExploreHomes'
import Profile from './Profile'
import HomeDetails from './HomeDetails'
import FavouriteHomes from './FavouriteHomes'
import MyAds from './MyAds'
import EditHome from './EditHome'
import AddHome from './AddHome'
import Conversation from './Conversation'

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/> 
        <Route path='/Login' element={<Login/>}/> 
        <Route path='/Register' element={<Register/>}/> 
        <Route path='/ExploreHomes' element = {<ExploreHomes/>}/>
        <Route path='/Home/:id' element = {<HomeDetails/>}/>
        <Route path='/Profile' element = {<Profile/>}/>
        <Route path='/Favourites' element = {<FavouriteHomes/>}/>
        <Route path='/MyAds' element = {<MyAds/>}/>
        <Route path='/EditHome/:id' element = {<EditHome/>}/>
        <Route path='/AddHome' element = {<AddHome/>}/>
        <Route path='/Conversation' element = {<Conversation/>}/>
      </Routes>
    </Router>
  )

}

export default App;