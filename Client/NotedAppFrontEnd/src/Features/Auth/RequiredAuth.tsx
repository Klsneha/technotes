import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { Role } from "../../types"

interface Props {
    allowedRoles: string[];
}
const RequireAuth = (props: Props) => {
    const location = useLocation()
    const { roles } = useAuth()

    const content = 
      (roles as Role[]).some(role => props.allowedRoles.includes(role))
          ? <Outlet />
          : <Navigate to="/login" state={{ from: location }} replace />
    ;

    return content
};
export default RequireAuth;