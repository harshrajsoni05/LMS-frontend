import { useState, useEffect } from "react";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../api/CategoryServices"; // Adjust the import path as needed
import CustomButton from "../components/button";
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
function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit' or 'add'
  const [currentData, setCurrentData] = useState({
    name: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const getCategories = async () => {
    try {
      const data = await fetchCategories(currentPage, pageSize, debouncedSearchTerm.trim());
      setCategories(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [currentPage, debouncedSearchTerm]);

  const handleAddCategory = async (newCategory) => {
    try {
      const categoryToCreate = {
        name: newCategory.name,
        description: newCategory.description,
      };
  
      await addCategory(categoryToCreate);
      getCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add category:", error.message);
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      const categoryToUpdate = {
        id: currentData.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
      };

      await updateCategory(currentData.id, categoryToUpdate);
      getCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Failed to delete the category", error);
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
      name: "",
      description: "",
    });
  };

  const handleSubmitModal = (data) => {
    if (modalType === "add") {
      handleAddCategory(data);
    } else if (modalType === "edit") {
      handleEditCategory(data);
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
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

      {/* <Tooltip message="Delete">
        <img
          src={DeleteIcon}
          alt="Delete"
          className="action-icon"
          onClick={() => handleDelete(rowData.id)}
        />
      </Tooltip> */}
    </div>
  );

  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Category List</h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          <CustomButton
            name="Add Category"
            onClick={() => handleOpenModal("add")}
            className="add"
          />
        </div>

        <div className="table-container">
          <Table data={categories} columns={columns} currentPage={currentPage} pageSize={pageSize}  />
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
          heading={modalType === "edit" ? "Edit Category" : "Add Category"}
          fields={[
            {
              name: "name",
              type: "text",
              placeholder: "Category Name",
              required: true,
              defaultValue: currentData.name,
            },
            {
              name: "description",
              type: "textarea",
              placeholder: "Description",
              required: false,
              defaultValue: currentData.description,
            },
          ]}
          
          onSubmit={handleSubmitModal}
          defaultValues={currentData} // Pass currentData as defaultValues
        />
      </CustomModal>
    </>
  );
}

export const CategorywithLayout = WithLayoutComponent(CategoryPage);
export default useDebouncedValue;