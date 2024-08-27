import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/CategoryPage.css";
import WithLayoutComponent from "../hocs/WithLayoutComponent"; // Optional, keep if needed
import Table from "../components/Table";
import CustomButton from "../components/Button";
import searchbar from "../components/searchbar";
import Action from "../components/Action";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories",
          {
            params: {
              page: currentPage,
              size: 10, // Set the page size as needed
            },
          }
        );
        setCategories(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAllot = (id) => {
    console.log(`Allot Action for category ID: ${id}`);
    // Add logic for allotting
  };

  const handleEdit = (id) => {
    console.log(`Edit Action for category ID: ${id}`);
    // Add logic for editing
  };

  const handleDelete = (id) => {
    console.log(`Delete Action for category ID: ${id}`);
    // Add logic for deletion
  };

  // Updated columns definition with "S.No." field
  const columns = [
    
    { Header: "Name", accessor: "name" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Action
          onAllot={() => handleAllot(row.original.id)}
          onEdit={() => handleEdit(row.original.id)}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ];

  return (
    <div className="category-page">
      <div className="category-heading">
        <h1>Category List</h1>
        <searchbar />
        <CustomButton
          name="Add Category"
          onClick={() => handleOpenModal("add")}
          className="add"
        />
      </div>
      <div className="table-container">
        <Table columns={columns} data={categories} />
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

export const CategorywithLayout = WithLayoutComponent(CategoryPage);