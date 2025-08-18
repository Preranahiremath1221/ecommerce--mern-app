import React from 'react'
import {assets} from '../assets/assets'
import tokenManager from '../utils/tokenManager'

const Navbar = ({handleLogout}) => {
  const handleLogoutClick = () => {
    // Clear tokens from storage
    tokenManager.clearTokens();
    // Clear any other stored admin data
    localStorage.removeItem('adminUser');
    // Call the parent handler
    handleLogout();
  };

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img src={assets.logo} className='w-[max(10%,80px)]' alt="" />
      <button onClick={handleLogoutClick} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>
        Logout
      </button>
    </div>
  )
}

export default Navbar
