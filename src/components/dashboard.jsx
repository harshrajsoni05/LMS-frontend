import  { useState, useEffect } from "react";
import "./styles/dashboard.css"; // Import CSS for styling

import books from "../assets/images/books.png";
import categories from "../assets/images/categories.png";
import democracy from "../assets/images/democracy.png";
import userss from "../assets/images/userss.png";
import withLayout from "../hocs/WithLayoutComponent";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({
    booksCount: 0,
    categoriesCount: 0,
    issuancesCount: 0,
    usersCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/dashboard/counts"
        );
        setData({
          booksCount: response.data.booksCount,
          categoriesCount: response.data.categoriesCount,
          issuancesCount: response.data.issuancesCount,
          usersCount: response.data.usersCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-dashboard">
      <div className="dashboard">
        <div className="dashboard-card">
          <img src={books} alt="Books" />
          <h2>Total Books</h2>
          <p>{data.booksCount}</p>
        </div>
        <div className="dashboard-card">
          <img src={userss} alt="Users" />
          <h2>Total Users</h2>
          <p>{data.usersCount}</p>
        </div>
        <div className="dashboard-card">
          <img src={categories} alt="Categories" />
          <h2>Categories</h2>
          <p>{data.categoriesCount}</p>
        </div>
        <div className="dashboard-card">
          <img src={democracy} alt="Issued Books" />
          <h2>Issued Books</h2>
          <p>{data.issuancesCount}</p>
        </div>
      </div>
    </div>
  );
};

export const DashboardwithLayout = withLayout(Dashboard);
