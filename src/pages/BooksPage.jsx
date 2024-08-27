import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/CategoryPage.css";
import WithLayoutComponent from "../hocs/WithLayoutComponent";
import Table from "../components/Table";
import searchbar from "../components/searchbar";
import CustomModal from "../components/Modal";
import Action from "../components/Action";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";
import CustomButton from "../components/Button";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit', 'add', or 'assign'
  const [currentData, setCurrentData] = useState({
    title: "",
    author: "",
    quantity: "",
    userId: "", // for allotting books to a user
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async (page = 0, size = 10) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/books?page=${page}&size=${size}`
        );

        setBooks(response.data.content); // Extract the content (books) from the paginated response
        setTotalPages(response.data.totalPages); // Keep track of the total number of pages
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks(currentPage); // Pass the current page to the fetch function
  }, [currentPage]);

  const handleOpenModal = (type, data = {}) => {
    setModalType(type);
    setCurrentData({
      title: data?.title || "",
      author: data?.author || "",
      quantity: data?.quantity || "",
      userId: "", // Reset userId when opening the modal
      id: data?.id || undefined, // Include the ID if it exists
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (modalType === "edit") {
        await axios.put(
          `http://localhost:8080/api/books/${currentData.id}`,
          currentData
        );
      } else if (modalType === "add") {
        await axios.post("http://localhost:8080/api/books", currentData);
      } else if (modalType === "assign") {
        // Handle assigning a book to a user
        await axios.post(
          `http://localhost:8080/api/issuances`,
          {
            bookId: currentData.id,
            userId: currentData.userId,
          }
        );
      }
      // Refresh the books list after submit
      const response = await axios.get(
        `http://localhost:8080/api/books?page=${currentPage}&size=10`
      );
      setBooks(response.data.content);
      setTotalPages(response.data.totalPages); // Update total pages after the change
      handleCloseModal(); // Close the modal after submit
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid ID for deletion:", id);
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`);
      // Refresh the books list after delete
      const response = await axios.get(
        `http://localhost:8080/api/books?page=${currentPage}&size=10`
      );
      setBooks(response.data.content);
      setTotalPages(response.data.totalPages); // Update total pages after the change
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage); // Update the current page
    }
  };

  const columns = [
    { Header: "Title", accessor: "title" },
    { Header: "Author", accessor: "author" },
    { Header: "Quantity", accessor: "quantity" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Action
          onAllot={() => handleOpenModal("assign", row.original)} // Assign a book to a user
          onEdit={() => handleOpenModal("edit", row.original)} // Edit the book details
          onDelete={() => handleDelete(row.original.id)} // Delete the book
        />
      ),
    },
  ];

  return (
    <div className="books-page">
      <div className="category-heading">
        <h1>Books List</h1>
        <searchbar />
        <CustomButton
          name="Add Book"
          onClick={() => handleOpenModal("add")}
          className="add"
        />
      </div>
      <div className="table-container">
        <Table columns={columns} data={books} />
      </div>
      <div className="pagination-controls">
        <img
          src={back}
          alt="back"
          className={`icon ${currentPage === 0 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <img
          src={next}
          alt="next"
          className={`icon ${
            currentPage >= totalPages - 1 ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={
          modalType === "edit"
            ? "Edit Book"
            : modalType === "assign"
            ? "Assign Book to User"
            : "Add New Book"
        }
        submitText="Save"
        cancelText="Cancel"
      >
        {modalType === "assign" ? (
          <>
            <label>
              User ID:
              <input
                type="text"
                name="userId"
                value={currentData.userId}
                onChange={(e) =>
                  setCurrentData({ ...currentData, userId: e.target.value })
                }
              />
            </label>
          </>
        ) : (
          <>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={currentData.title}
                onChange={(e) =>
                  setCurrentData({ ...currentData, title: e.target.value })
                }
              />
            </label>
            <label>
              Author:
              <input
                type="text"
                name="author"
                value={currentData.author}
                onChange={(e) =>
                  setCurrentData({ ...currentData, author: e.target.value })
                }
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={currentData.quantity}
                onChange={(e) =>
                  setCurrentData({ ...currentData, quantity: e.target.value })
                }
              />
            </label>
          </>
        )}
      </CustomModal>
    </div>
  );
}

export const BookswithLayout = WithLayoutComponent(BooksPage);
