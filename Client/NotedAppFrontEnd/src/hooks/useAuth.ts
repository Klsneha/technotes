import { useSelector } from "react-redux";
import { selectCurrentToken } from "../Features/Auth/AuthSlice"; 
import { jwtDecode } from "jwt-decode";
import { Role } from "../types";

const useAuth = () => {
  const token: string = useSelector(selectCurrentToken);
  let isManager: boolean = false;
  let isAdmin: boolean = false;
  let status: string = "Employee";

  if (!!token) {
    const decodedToken = jwtDecode(token);
    const {userName, roles, id } = (decodedToken as any).userInfo;
    isManager = (roles as Role[]).includes(Role.MANAGER);
    isAdmin = (roles as Role[]).includes(Role.ADMIN);

    if (isManager) {
      status = "Manager";
    }

    if (isAdmin) {
      status = "Admin";
    }
    return { userName, roles, id, isManager, isAdmin, status};
  }

  return { userName: "", roles: [], id: "", isManager, isAdmin, status};
};

export default useAuth;