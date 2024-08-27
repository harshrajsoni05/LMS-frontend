import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/CategoryPage.css"; // You can create or reuse a CSS file
import WithLayoutComponent from "../hocs/WithLayoutComponent"; 
import Table from "../components/Table";
import CustomButton from "../components/Button";
import searchbar from "../components/searchbar";
import Action from "../components/Action";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users", {
          params: {
            page: currentPage,
            size: 10, // Set the page size as needed
          },
        });
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit action for user ID: ${id}`);
    // Add logic for editing
  };

  const handleDelete = (id) => {
    console.log(`Delete action for user ID: ${id}`);
    // Add logic for deletion
  };

  // Columns definition for the User table
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Number", accessor: "number" },
    { Header: "Role", accessor: "role" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Action
          onEdit={() => handleEdit(row.original.id)}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ];

  return (
    <div className="category-page">
      <div className="category-heading">
        <h1>User List</h1>
        <searchbar />
        <CustomButton
          name="Add User"
          onClick={() => console.log("Open Add User Modal")}
          className="add"
        />
      </div>
      <div className="table-container">
        <Table columns={columns} data={users} />
      </div>

      <div className="pagination-controls">
        <img
          src={back}
          alt="back"
          className={`icon ${currentPage === 0 ? "disabled" : ""}`}
          onClick={() => {
            if (currentPage > 0) handlePageChange(currentPage - 1);
          }}
        />
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <img
          src={next}
          alt="next"
          className={`icon ${currentPage >= totalPages - 1 ? "disabled" : ""}`}
          onClick={() => {
            if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
          }}
        />
      </div>
    </div>
  );
}

export const UserwithLayout = WithLayoutComponent(UserPage);
