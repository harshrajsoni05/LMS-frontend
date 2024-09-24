import { useState, useEffect } from "react";
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../api/BookServices";
import { fetchAllCategories } from '../api/CategoryServices';
import { addIssuance } from "../api/IssuanceServices";
import CustomButton from "../components/button";
import CustomModal from "../components/modal";
import Table from "../components/Table";
import Searchbar from "../components/Searchbar";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";
import WithLayoutComponent from "../hocs/WithLayoutComponent";
import useDebouncedValue from "./CategoryPage";
import Tooltip from "../components/Tooltip";
import EditIcon from "../assets/images/editicon.png";
import DeleteIcon from "../assets/images/deleteicon.png";
import AssignUser from "../assets/images/alloticon.png";
import Dynamicform from "../components/dynamicform";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit' or 'add'
  const [currentData, setCurrentData] = useState({
    title: "",
    author: "",
    quantity: "",
    category_id: "",
    userId: ""
    
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('issued');
  const [issuanceType, setIssuanceType] = useState('library');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const handleIssueBook = async () => {
    if (selectedBook && issueDate  && status && issuanceType) {
      const issuanceDetails = {
        user_id: currentData.id,
        book_id: selectedBook.id,
        issue_date: issueDate,
        return_date: returnDate || "",
        status: "Issued",
        issuance_type: issuanceType,
      };
      
      console.log("issuanceDetails->>>>>" ,issuanceDetails)
      try {
        await addIssuance(issuanceDetails);
        handleCloseModal(); // Close the modal on success
      } catch (error) {
        console.error('Failed to create issuance:', error);
      }
    } else {
      console.error('All fields are required to create an issuance');
    }
  };

  const getBooks = async () => {
    try {
      const data = await fetchBooks(
        currentPage,
        pageSize,
        debouncedSearchTerm.trim()
      );
      setBooks(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    getBooks();
  }, [currentPage, debouncedSearchTerm]);

  const getCategories = async () => {
    try {
      const data = await fetchAllCategories();
      console.log(data);
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);



  const handleAddBook = async (newBook) => {
    try {
      if (!newBook.category_id) {
        throw new Error("Category ID is missing or invalid");
      }
  
      const bookToCreate = {
        title: newBook.title,
        author: newBook.author,
        category_id: parseInt(newBook.category_id, 10),
        quantity: parseInt(newBook.quantity, 10),
      };
  
      await addBook(bookToCreate);
      getBooks();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add book:", error.message);
    }
  };

  const handleEditBook = async (updatedBook) => {
    try {
      const bookToUpdate = {
        id: currentData.id,
        title: updatedBook.title,
        author: updatedBook.author,
        category_id: parseInt(updatedBook.category_id, 10),
        quantity: parseInt(updatedBook.quantity, 10),
      };

      await updateBook(currentData.id,bookToUpdate);
      getBooks();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleDelete = async (rowData) => {
    const id = rowData.id;
    if (window.confirm('Are you sure you want to delete this Book?')){
    try {
      await deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Failed to delete the book", error);
    }
  }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (type, rowData = {}) => {
    setModalType(type);
    setCurrentData(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentData({
      title: "",
      author: "",
      quantity: "",
      category_id: "",
      userId: "",
      imageurl:""
    });
  };

  const handleSubmitModal = (data) => {
    if (modalType === "add") {
      handleAddBook(data);
    } else if (modalType === "edit") {
      handleEditBook(data);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "Category", render: (rowData) => rowData.category.name },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
    },
  ];

  const renderActions = (rowData) => (
    <div className="actionicons" >
      <Tooltip message="Assign">
        <img
          src={AssignUser}
          alt="Assign User"
          style={{ paddingLeft: '0' }}
          className="action-icon"
          onClick={() => console.log("Assigning user", rowData)}
        />
      </Tooltip>

      <Tooltip message="Edit">
        <img
          src={EditIcon}
          alt="Edit"
          className="action-icon"
          onClick={() => handleOpenModal("edit", rowData)}
        />
      </Tooltip>

      <Tooltip message="Delete">
        <img
          src={DeleteIcon}
          alt="Delete"
          className="action-icon"
          onClick={() => handleDelete(rowData)}
        />
      </Tooltip>
    </div>
  );

  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Books List</h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          <CustomButton
            name="Add Book"
            onClick={() => handleOpenModal("add")}
            className="add"
          />
        </div>

        <div className="table-container">
          <Table data={books} columns={columns} />
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

      
  <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
  <Dynamicform
    heading={modalType === "edit" ? "Edit Book" : "Add Book"}
    fields={[
      {
        name: "category_id",
        type: "select",
        placeholder: "Select Category",
        required: true,
        options: categories.map((category) => ({
          value: category.id,
          label: category.name,
        })),
        defaultValue: currentData.category_id,
      },
      {
        name: "title",
        type: "text",
        placeholder: "Book Title",
        required: true,
        defaultValue: currentData.title,
      },
      {
        name: "author",
        type: "text",
        placeholder: "Author Name",
        required: true,
        defaultValue: currentData.author,
      },
      {
        name: "quantity",
        type: "number",
        placeholder: "Enter Quantity",
        required: true,
        defaultValue: currentData.quantity,
      },{
      name: "image url",
      type: "text",
      placeholder: "Enter image url",
      required: true,
      defaultValue: currentData.imageurl,
    }
    ]}
    onSubmit={handleSubmitModal}
    defaultValues={currentData} // Pass currentData as defaultValues
  />
</CustomModal>
    </>
  );
}

export const BookswithLayout = WithLayoutComponent(BooksPage);
