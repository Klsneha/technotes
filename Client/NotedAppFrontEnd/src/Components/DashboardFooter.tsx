import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { JSX } from "react";
import useAuth  from "../hooks/useAuth";

export const DashboardFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
   const {
    userName,
    status
   } = useAuth();

  const goHomeClick = () => {
    return navigate("/dashboard");
  };

  let goHomeButton: JSX.Element = <></>;
  if (pathname !== "/dashboard") {
    goHomeButton =
      <button 
        className="dash-footer__button"
        onClick={goHomeClick}
        title="Home"
      >
        <FontAwesomeIcon icon={faUser} />
      </button>;
  }
  const content = (
    <footer className="dash-footer">
        {goHomeButton}
        <p>Current User: {userName}</p>
        <p>Status: {status} </p>
    </footer>
  )
  return content;
};
