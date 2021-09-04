import React, { Suspense, lazy } from "react";
import { Spin } from "antd";
import { Router } from "@reach/router";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";

const WaitingComponent = ({ Component, ...props }) => (
  <Suspense fallback={<Spin />}>
    <Component {...props} />
  </Suspense>
);

const Admin = lazy(() => import("./views/admin"));
const Dashboard = lazy(() => import("./views/admin/dashboard"));
const Scan = lazy(() => import("./views/admin/scan"));
const Session = lazy(() => import("./views/admin/session"));
const SessionRegistration = lazy(() =>
  import("./views/admin/session/Registration")
);
const Department = lazy(() => import("./views/admin/department"));
const School = lazy(() => import("./views/admin/school"));
const User = lazy(() => import("./views/admin/user"));
const Tool = lazy(() => import("./views/admin/tool"));
const Login = lazy(() => import("./views/admin/login"));

const Registration = lazy(() => import("./views/Registration"));

const Checkin = lazy(() => import("./views/admin/checkin"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Spin />}>
        <Router>
          <WaitingComponent Component={Login} path="/" />
          <WaitingComponent
            Component={Registration}
            path="/session/:id/registration"
          />
          <WaitingComponent Component={Login} path="/login" />
          <WaitingComponent Component={Admin} path="dashboard">
            <WaitingComponent Component={Dashboard} path="/" />
            <WaitingComponent Component={Checkin} path="/check-in" />
            {/* <WaitingComponent Component={Scan} path="/scan" /> */}
            <WaitingComponent Component={Session} path="/session" />
            <WaitingComponent
              Component={SessionRegistration}
              path="/session/:id/registrations"
            />
            <WaitingComponent Component={Department} path="/department" />
            <WaitingComponent Component={School} path="/school" />
            <WaitingComponent Component={User} path="/user" />
            <WaitingComponent Component={Tool} path="/tool" />
          </WaitingComponent>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
