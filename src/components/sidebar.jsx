import { NavLink } from "react-router-dom";
import CustomButton from "./Button";
import "./styles/Sidebar.css";

import book from "../assets/images/book.png";
import category from "../assets/images/category.png";
import listcheck from "../assets/images/listcheck.png";
import useradd from "../assets/images/useradd.png";
import dash from "../assets/images/dash.png";
import historyIcon from "../assets/images/category.png";  // Replace with correct icon path
import profileIcon from "../assets/images/category.png";  // Replace with correct icon path

const Sidebar = ({ role }) => {
  const handleClick = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="container">
      <div className="sidebar-menu">
        <ul className="menu-list">
          {/* Common items for admin role */}
          {role === "admin" && (
            <>
              <li className="menu-item">
                <img src={dash} alt="Dashboard" />
                <NavLink
                  to="/dashboard-"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={book} alt="Books" />
                <NavLink
                  to="/books-"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Books
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={category} alt="Category" />
                <NavLink
                  to="/category-"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Category
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={listcheck} alt="Issuance" />
                <NavLink
                  to="/issuance-"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Issuance
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={useradd} alt="Users" />
                <NavLink
                  to="/user-"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Users
                </NavLink>
              </li>
            </>
          )}
          
          {/* Items for user role */}
          {role === "user" && (
            <>
              <li className="menu-item">
                <img src={historyIcon} alt="History" />
                <NavLink
                  to="/history"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  History
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={profileIcon} alt="Profile" />
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Profile
                </NavLink>
              </li>
            </>
          )}
        </ul>
        <div className="btn-center">
          <CustomButton
            name={"Logout"}
            className={"logout-btn"}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
