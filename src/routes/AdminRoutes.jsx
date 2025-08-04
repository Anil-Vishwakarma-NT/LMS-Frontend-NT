import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminRoutes = ({ children }) => {
    const navigate = useNavigate()
    const auth = useSelector((state) => state.auth)
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        console.log("AUTH IN ADMIN ROUTE before check ", auth)

        if (auth && auth.accessToken) {
            try {
                if (auth.roles.includes("ADMIN")) {
                    console.log("AUTH IN ADMIN ROUTES", auth);
                    setIsVerified(true)
                } else {
                    console.log("AUTH WHEN not verified", auth);
                    console.log("ADMIN ROLE NOT VERIFIED");
                    navigate('/')
                }
            } catch (error) {
                console.log(error)
                console.log("Not verified")
                setIsVerified(false)
            }
        }
    }, [auth])
    return isVerified ? children : <div></div>
}

export default AdminRoutes