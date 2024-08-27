import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/CategoryPage.css";
import WithLayoutComponent from "../hocs/WithLayoutComponent";
import Table from "../components/Table";
import CustomButton from "../components/Button";
import searchbar from "../components/searchbar";
import CustomModal from "../components/modal";
import action from "../components/action";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";

function IssuancePage() {
  const [issuances, setIssuances] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit' or 'add'
  const [currentData, setCurrentData] = useState({
    user_id: "",
    book_id: "",
    issue_date: "",
    return_date: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [totalPages, setTotalPages] = useState(0); // Total pages state

  useEffect(() => {
    const fetchIssuances = async (page = 0, size = 10) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/issuances?page=${page}&size=${size}`
        );
        setIssuances(response.data.content); // Extract the content (issuances) from the paginated response
        setTotalPages(response.data.totalPages); // Keep track of the total number of pages
      } catch (error) {
        console.error("Error fetching issuances:", error);
      }
    };

    fetchIssuances(currentPage); // Pass the current page to the fetch function
  }, [currentPage]);

  const handleOpenModal = (type, data) => {
    setModalType(type);
    setCurrentData(
      data || {
        user_id: "",
        book_id: "",
        issue_date: "",
        return_date: "",
        status: "",
      }
    ); // Populate currentData with the selected issuance's data
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (modalType === "edit") {
        await axios.put(
          `http://localhost:8080/api/issuances/${currentData.id}`,
          currentData
        );
      } else {
        await axios.post("http://localhost:8080/api/issuances", currentData);
      }

      // Refresh the issuances list after submit
      const response = await axios.get(
        `http://localhost:8080/api/issuances?page=${currentPage}&size=10`
      );
      setIssuances(response.data.content);
      setTotalPages(response.data.totalPages); // Update total pages after the change
      handleCloseModal(); // Close the modal after submit
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/issuances/${id}`);
      // Refresh the issuances list after delete
      const response = await axios.get(
        `http://localhost:8080/api/issuances?page=${currentPage}&size=10`
      );
      setIssuances(response.data.content);
      setTotalPages(response.data.totalPages); // Update total pages after the change
    } catch (error) {
      console.error("Error deleting issuance:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage); // Update the current page
    }
  };

  const columns = [
    
    { Header: "User ID", accessor: "user_id" },
    { Header: "Book ID", accessor: "book_id" },
    { Header: "Issue Date", accessor: "issue_date" },
    { Header: "Return Date", accessor: "return_date" },
    { Header: "Status", accessor: "status" },
    {
      Header: "actions",
      Cell: ({ row }) => (
        <action
          onAllot={() => handleOpenModal("edit", row.original)} // Pass the row's data to the modal
          onEdit={() => handleOpenModal("edit", row.original)} // Pass the row's data to the modal
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
      id: "actions", // Add a unique id for the column
    },
  ];

  return (
    <div className="category-page">
      <div className="category-heading">
        <h1>Issuance List</h1>
        <searchbar />
        <CustomButton
          name="New Issuance"
          onClick={() => handleOpenModal("add")}
          className="add"
        />
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          data={issuances}
          style={{ overflow: "scroll" }}
        />
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
      <CustomModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={modalType === "edit" ? "Edit Issuance" : "Add New Issuance"}
        submitText="Save"
        cancelText="Cancel"
      >
        <label>
          User ID:
          <input
            type="text"
            name="user_id"
            value={currentData.user_id}
            onChange={(e) =>
              setCurrentData({ ...currentData, user_id: e.target.value })
            }
          />
        </label>
        <label>
          Book ID:
          <input
            type="text"
            name="book_id"
            value={currentData.book_id}
            onChange={(e) =>
              setCurrentData({ ...currentData, book_id: e.target.value })
            }
          />
        </label>
        <label>
          Issue Date:
          <input
            type="date"
            name="issue_date"
            value={currentData.issue_date}
            onChange={(e) =>
              setCurrentData({ ...currentData, issue_date: e.target.value })
            }
          />
        </label>
        <label>
          Return Date:
          <input
            type="date"
            name="return_date"
            value={currentData.return_date}
            onChange={(e) =>
              setCurrentData({ ...currentData, return_date: e.target.value })
            }
          />
        </label>
        <label>
          Status:
          <input
            type="text"
            name="status"
            value={currentData.status}
            onChange={(e) =>
              setCurrentData({ ...currentData, status: e.target.value })
            }
          />
        </label>
      </CustomModal>
    </div>
  );
}

export const IssuancewithLayout = WithLayoutComponent(IssuancePage);
