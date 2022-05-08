import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Header from "components/Header";
import Home from "pages/Home";
import Projects from "pages/Projects";
import Installs from "pages/Installs";
import Login from "pages/Login";
import Register from "pages/Register";
import ProjectDetails from "pages/ProjectDetails";
import Experiments from "pages/Experiments";
import Datasets from "pages/Datasets";
import Alerts from "components/Alerts";

import { AuthProvider, RequireAuth } from "components/Auth";

function App() {
  return (
    <AuthProvider>
      <div className="container-fluid p-0 h-100 bg-white">
        <Header />

        <div className="container mt-5 pb-5 ">
          <Alerts />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/projects"
              element={
                <RequireAuth>
                  <Projects />
                </RequireAuth>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <RequireAuth>
                  <ProjectDetails />
                </RequireAuth>
              }
            />
            <Route
              path="/installs"
              element={
                <RequireAuth>
                  <Installs />
                </RequireAuth>
              }
            />
            <Route
              path="/experiments"
              element={
                <RequireAuth>
                  <Experiments />
                </RequireAuth>
              }
            />
            <Route
              path="/datasets"
              element={
                <RequireAuth>
                  <Datasets />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
