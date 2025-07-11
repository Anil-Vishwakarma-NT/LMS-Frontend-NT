import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const UserRoutes = ({children}) => {
  const navigate = useNavigate()
    const auth = useSelector((state) => state.auth)
    const [isVerified, setIsVerified] = useState(false)
    useEffect(() => {
      if (auth && auth.accessToken){
          try{
              if(auth.roles.includes("EMPLOYEE")){
                  setIsVerified(true)
              } else {
                navigate('/')
              }
          } catch(error){
              console.log(error)
              setIsVerified(false)
          }
      }
  }, [auth])

  return isVerified ? children : <div></div>
}

export default UserRoutes