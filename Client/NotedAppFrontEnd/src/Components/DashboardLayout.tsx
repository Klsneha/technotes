import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardFooter } from "./DashboardFooter";

export const DashboardLayout: React.FC<{ }> = () => {
  return (
    <>
      <DashboardHeader />
      <div className="dash-container">
        <Outlet/>
      </div>
      <DashboardFooter />
    </>
  );
}