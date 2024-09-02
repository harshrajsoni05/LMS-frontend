import { useState, useEffect } from "react";
import { fetchIssuances, updateIssuance, deleteIssuance } from "../api/IssuanceServices"; // Adjust the import path as needed
import CustomModal from "../components/modal";
import Table from "../components/Table";
import Searchbar from "../components/Searchbar";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";
import WithLayoutComponent from "../hocs/WithLayoutComponent";
import Dynamicform from "../components/dynamicform";
import EditIcon from "../assets/images/editicon.png";
import DeleteIcon from "../assets/images/deleteicon.png";
import Tooltip from "../components/Tooltip";
import './styles/CategoryPage.css';

const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Cleanup on component unmount or value change
    };
  }, [value, delay]);

  return debouncedValue;
};

function IssuancesPage() {
  const [issuances, setIssuances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit'
  const [currentData, setCurrentData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const getIssuances = async () => {
    try {
      const data = await fetchIssuances(currentPage, pageSize, debouncedSearchTerm.trim());
      setIssuances(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching issuances:", error);
    }
  };

  useEffect(() => {
    getIssuances();
  }, [currentPage, debouncedSearchTerm]);

  const handleEditIssuance = async (updatedIssuance) => {
    try {
      const issuanceToUpdate = {
        id: currentData.id,
        user_id: updatedIssuance.user_id,
        book_id: updatedIssuance.book_id,
        issue_date: updatedIssuance.issue_date,
        return_date: updatedIssuance.return_date,
        status: updatedIssuance.status,
        issuance_type: updatedIssuance.issuance_type,
      };

      await updateIssuance(currentData.id, issuanceToUpdate);
      getIssuances();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update issuance:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Issuance?'))
    try {
      await deleteIssuance(id);
      setIssuances(issuances.filter((issuance) => issuance.id !== id));
    } catch (error) {
      console.error("Failed to delete the issuance:", error);
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
    setCurrentData({});
  };

  const handleSubmitModal = (data) => {
    if (modalType === "edit") {
      handleEditIssuance(data);
    }
  };

  const columns = [
    
    { header: "S No.", accessor: "serialNo" },
    { header: "Status", accessor: "status" },
    { header: "Issuance Type", accessor: "issuance_type" },
    { header: "Issue Date", accessor: "issue_date" },
    { header: "Return Date", accessor: "return_date" },
    { header: "User ID", accessor: "user_id" },
    { header: "Book ID", accessor: "book_id" },
    
    
    
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
    },
  ];

  const renderActions = (rowData) => (
    <div className="actionicons">
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
          onClick={() => handleDelete(rowData.id)}
        />
      </Tooltip>
    </div>
  );

  return (
    <>
      <div className="category-page">
      <div className="category-heading">
          <h1>Issuances </h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          
        </div>

        <div className="table-container">
          <Table data={issuances} columns={columns} currentPage={currentPage} pageSize={pageSize}/>
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
          heading="Edit Issuance"
          fields={[
            {
              name: "user_id",
              type: "text",
              placeholder: "User ID",
              required: true,
              defaultValue: currentData.user_id,
            },
            {
              name: "book_id",
              type: "text",
              placeholder: "Book ID",
              required: true,
              defaultValue: currentData.book_id,
            },
            {
              name: "issue_date",
              type: "date",
              placeholder: "Issue Date",
              required: true,
              defaultValue: currentData.issue_date,
            },
            {
              name: "return_date",
              type: "date",
              placeholder: "Return Date",
              required: false,
              defaultValue: currentData.return_date,
            },
            {
              name: "status",
              type: "select",
              placeholder: "Status",
              required: true,
              options: [
                { value: "Returned", label: "Returned" },
                { value: "Pending", label: "Pending" },
              ],
            },
            {
              name: "issuance_type",
              type: "select",
              placeholder: "Issuance Type",
              required: true,
              options: [
                { value: "In House", label: "In House" },
                { value: "Library", label: "Library" },
              ],
            },
          ]}
          onSubmit={handleSubmitModal}
          defaultValues={currentData} // Pass currentData as defaultValues
        />
      </CustomModal>
    </>
  );
}

export const IssuancewithLayout = WithLayoutComponent(IssuancesPage);
