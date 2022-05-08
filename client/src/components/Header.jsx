import { useNavigate, Link } from "react-router-dom";
import useAuth from "hooks/useAuth";
const Header = () => {
  let auth = useAuth();
  let navigate = useNavigate();
  return (
    <header className="d-flex flex-wrap justify-content-center py-3 bg-primary">
      <div className="container">
        <ul className=" nav nav-pills justify-content-end ">
          <li className="nav-item">
            <Link to="/home" className="nav-link active">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className="nav-link text-white">
              Proyectos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/datasets" className="nav-link text-white">
              Datasets
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/experiments" className="nav-link text-white">
              Experimentos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/installs" className="nav-link text-white">
              Instalaciones
            </Link>
          </li>
          <li className="nav-item">
            <Link
              onClick={() => {
                localStorage.removeItem("token");
                auth.signout(() => navigate("/login"));
              }}
              to="/login"
              className="nav-link text-white"
            >
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
