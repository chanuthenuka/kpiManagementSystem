import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Outlet } from "react-router-dom";

//dashboard
import Body from "./components/Body/Body";
import NavbarPos from "./components/Dash/Navbar/NavbarPos";
import FirstPage from "./components/Dash/FirstPage/FirstPage";

//auth
import Login from "../src/page/Auth/Login/Login";
import ForgotPassowrd from "./page/Auth/Password/ForgotPassowrd";

// HR
import View_rating from "./page/ManagementDash/HR/ViewRating/View_rating";
import Manage_KPIs from "./page/ManagementDash/HR/ManageKPI/ManageKPI";
import Manage_KRAs from "./page/ManagementDash/HR/ManageKRA/ManageKRA";
import ManageCompetenice from "./page/ManagementDash/HR/ManageCompetencie/Manage_Competencie";
import Manage_EMP from "./page/ManagementDash/HR/ManageEmployee/ManageEmployee";
import Report from "./page/ManagementDash/HR/Report/Report";

//HOD
import HOD_EMP from "./page/ManagementDash/HOD/PerformanceRatings/PerformanceRatings";
import HOD_RatingApprovals from "./page/ManagementDash/HOD/RatingApprovals/RatingApproval";
import HOD_KPIChanges from "./page/ManagementDash/HOD/RequestKPIChanges/KPIChanges";
import AssignManager from "./page/ManagementDash/HOD/AssignManager/AssignManager";

//Manager
import Manager_EMP from "./page/ManagementDash/Manager/Performance/Performance";

//Employee
import EMP_EMP from "./page/ManagementDash/EMP/Employee/Employee";
import OnRatings from "./page/ManagementDash/EMP/OnRating/Onratings";

//Extra
import ManageDepartment from "./page/ManagementDash/HR/ManageDepartment/ManageDepartment";
import Ratemangers from "./page/ManagementDash/HOD/Ratemanagers/Ratemangers";
import HodRatingApprovals from "./page/ManagementDash/HOD/HodRatingApprovals/HodRatingApprovals";

//hr_emp
import View_All_ratings from "./page/ManagementDash/HR_Emp/View_All_ratings";

//hr_manager
import Hr_rating from "./page/ManagementDash/HR_Manager/Hr_rating";
import PendingRequest from "./page/ManagementDash/HR/ManageKPI/PendingRequestPopup";
import View_All_rating2 from "./page/ManagementDash/HR_Emp/View_All_rating2";
import PerformanceCard from "./page/ManagementDash/Manager/Performance/PerformanceCard";
import KPIQuarterly from "./page/ManagementDash/Manager/Rating/KPIQuarterly";

// Layout for other pages (Navbar only)
const MainLayout = () => (
  <>    
    <Body />
    <Outlet />
  </>
);

const HRLayout = () => (
  <>
    <NavbarPos />
    <Outlet />
  </>
);
const HODLayout = () => (
  <>
    <NavbarPos />
    <Outlet />
  </>
);
const ManagerLayout = () => (
  <>
    <NavbarPos />
    <Outlet />
  </>
);
const EmpLayout = () => (
  <>
    <NavbarPos />
    <Outlet />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page Layout */}

        {/* Other pages with Navbar only */}
        <Route path="/" element={<MainLayout />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/fgtpassword" element={<ForgotPassowrd />}></Route>


        <Route element={<HRLayout />}>
          <Route path="/view-rating" element={<Manager_EMP />} />
          <Route
            path="/view_rating_card/:employeeId"
            element={<PerformanceCard />}
          />
          <Route path="/manage-kpi" element={<Manage_KPIs />} />
          <Route path="/manage-kra" element={<Manage_KRAs />} />
          <Route path="/manage-competenice" element={<ManageCompetenice />} />
          <Route path="/Manage-emp" element={<Manage_EMP />} />
          <Route path="/report" element={<Report />} />
          <Route path="/manage-department" element={<ManageDepartment />} />
          <Route path="/hr-emp-rating" element={<Hr_rating />} />
        </Route>

        <Route element={<HODLayout />}>
          <Route path="/hod-emp" element={<HOD_EMP />} />
          <Route path="/hod-ratingApproval" element={<HOD_RatingApprovals />} />
          <Route path="/hod-kpichanges" element={<HOD_KPIChanges />} />
          <Route path="/assign-Manager" element={<AssignManager />} />
          <Route path="/rate-manger" element={<Ratemangers />} />
          <Route path="/rating-app" element={<HodRatingApprovals />} />
          <Route path="/view-all-ratings" element={<View_All_ratings />} />
          <Route
            path="/view-all-ratings-two/:id"
            element={<View_All_rating2 />}
          />
        </Route>

        <Route element={<ManagerLayout />}>
          <Route path="/manager-emp" element={<View_rating />} />
        </Route>

        <Route element={<EmpLayout />}>
          <Route path="/emp-emp" element={<EMP_EMP />} />
          <Route path="/on-rate" element={<OnRatings />} />
          <Route path="/first-page" element={<FirstPage />} />

          {/*new one*/}
          <Route path="/pending-request" element={<PendingRequest />} />
          <Route path="/qartly/:id" element={<KPIQuarterly/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
