import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.userSlice)

  if (!isLoggedIn) return <Navigate to="/sign-in" />
  return children
}

export default RequireAuth
