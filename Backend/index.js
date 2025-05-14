const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./config/passport")(passport);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

dotenv.config();

app.use(express.json());

//table routes
const CreateTableRoute = require("./routes/createAlterTables");
app.use("/tables", CreateTableRoute);

//employee routes
const EmployeeRoute = require("./routes/employees");
app.use("/api/employees", EmployeeRoute);

//manager-employee routes
const ManagerEmployeeRoute = require("./routes/managerEmployee");
app.use("/api/manager-employees", ManagerEmployeeRoute);

//role routes
const RoleRoute = require("./routes/role");
app.use("/api/roles", RoleRoute);

//role-permissions routes
const RolePermissionsRoute = require("./routes/rolePermissions");
app.use("/api/role-permissions", RolePermissionsRoute);

//kra routes
const KRARoute = require("./routes/kra");
app.use("/api/kra", KRARoute);

//kpi routes
const KPIRoute = require("./routes/kpi");
app.use("/api/kpi", KPIRoute);

//approve-kpi routes
const ApproveKpiRoute = require("./routes/approveKpi");
app.use("/api/approve-kpi", ApproveKpiRoute);

//kpi-ratings routes
const KPIRatingsRoute = require("./routes/kpiRatings");
app.use("/api/kpi-ratings", KPIRatingsRoute);

//department routes
const DepartmentRoute = require("./routes/departments");
app.use("/api/department", DepartmentRoute);

//permission routes
const PermissionRoute = require("./routes/permissions");
app.use("/api/permissions", PermissionRoute);

// competency routes
const CompetencyRoute = require("./routes/competency");
app.use("/api/competency", CompetencyRoute);

// competency-ratings routes
const CompetencyRatingsRoute = require("./routes/competencyRatings");
app.use("/api/competency-ratings", CompetencyRatingsRoute);

// Basic route
app.get("/", (req, res) => {
  res.json("Welcome to our application.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
