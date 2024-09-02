import { useState, useEffect } from 'react';
import { fetchUsers, updateUser, deleteUser , RegisterUser} from '../api/Users'; // Adjust the import path as needed
import { fetchAllBooks, createIssuance } from '../api/BookServices'; // Adjust the import path as needed
import CustomModal from '../components/modal';
import Table from '../components/Table';
import Searchbar from '../components/Searchbar';
import Dynamicform from '../components/dynamicform';
import CustomButton from '../components/button';
import Tooltip from '../components/Tooltip';
import WithLayoutComponent from '../hocs/WithLayoutComponent';

import back from '../assets/images/go-back.png';
import next from '../assets/images/go-next.png';
import EditIcon from '../assets/images/editicon.png';
import DeleteIcon from '../assets/images/deleteicon.png';
import assign from '../assets/images/alloticon.png';

const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function UsersPage() {
  // State
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentData, setCurrentData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('issued');
  const [issuanceType, setIssuanceType] = useState('library');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  // Fetch Data
  const getUsers = async () => {
    try {
      const data = await fetchUsers(currentPage, pageSize, debouncedSearchTerm.trim());
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getBooks = async () => {
    try {
      const data = await fetchAllBooks();
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    getUsers();
    getBooks();
  }, [currentPage, debouncedSearchTerm]);

  // Handlers
  const handleEditUser = async (updatedUser) => {
    try {
      const userToUpdate = {
        id: currentData.id,
        name: updatedUser.name,
        email: updatedUser.email,
        number: updatedUser.number,
        role: updatedUser.role,
      };
      await updateUser(currentData.id, userToUpdate);
      getUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Failed to delete the user:', error);
      }
    }
  };

  const handleIssueBook = async () => {
    if (selectedBook) {
      const issuanceDetails = {
        user_id: currentData.id,
        book_id: selectedBook.id,
        issue_date: issueDate,
        return_date: returnDate,
        status: status,
        issuance_type: issuanceType,
      };
      try {
        await createIssuance(issuanceDetails);
        handleCloseModal();
      } catch (error) {
        console.error('Failed to create issuance:', error);
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
    setCurrentData({});
    setSelectedBook(null);
    setIssueDate('');
    setReturnDate('');
    setStatus('issued');
    setIssuanceType('library');
  };
  const handleRegister = async(userdata)=>{
    try{
      RegisterUser(userdata);
      getBooks();
    }
    catch(error){
      console.log(error);
    }
  }

  const handleSubmitModal = (data) => {
    if (modalType === 'edit') {
      handleEditUser(data);
    } else if (modalType === 'register') {
      console.log("User registered-> " + JSON.stringify(data))  
      handleRegister(data);
      getUsers();
      handleCloseModal();
    }
  };

  // Define Table Columns
  const columns = [
    { header: 'S No.', accessor: 'serialNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone No.', accessor: 'number' },
    {
      header: 'Actions',
      render: (rowData) => (
        <div className="actionicons">
          <Tooltip message="Assign Book">
            <img
              src={assign}
              alt="Assign Book"
              className="action-icon"
              onClick={() => handleOpenModal('assign', rowData)}
            />
          </Tooltip>
          <Tooltip message="Edit">
            <img
              src={EditIcon}
              alt="Edit"
              className="action-icon"
              onClick={() => handleOpenModal('edit', rowData)}
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
      ),
    },
  ];
const handleBookSelection = (e) => {
  const selectedBookId = e.target.value;
  const selectedBook = books.content.find(book => book.id === parseInt(selectedBookId, 10));
  setSelectedBook(selectedBook);
};

  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Users</h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          <CustomButton name="Register User" onClick={() => handleOpenModal('register')} className="add" />
        </div>

        <div className="table-container">
          <Table data={users} columns={columns} currentPage={currentPage} pageSize={pageSize}/>
        </div>

        <div className="pagination-controls">
          <img
            src={back}
            alt="Back"
            className={`icon ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={() => {
              if (currentPage > 0) handlePageChange(currentPage - 1);
            }}
          />
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <img
            src={next}
            alt="Next"
            className={`icon ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
            onClick={() => {
              if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
            }}
          />
        </div>
      </div>
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
  {modalType === 'assign' ? (
    <div>
      <h2>Assign Book</h2>

      <label htmlFor="bookSelect">Select Book</label>
      <select
        id="bookSelect"
        value={selectedBook?.id || ''}
        onChange={handleBookSelection}
      >
        <option value="" disabled>Select a book</option>
        {books.content

          .map(book => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
      </select>

      <Dynamicform
        heading="Assign Book"
        fields={[
          {
            name: 'issueDate',
            type: 'datetime-local',
            placeholder: 'Issue Date',
            required: true,
            defaultValue: issueDate,
            onChange: e => setIssueDate(e.target.value),
          },
          {
            name: 'returnDate',
            type: 'datetime-local',
            placeholder: 'Return Date',
            required: true,
            defaultValue: returnDate,
            onChange: e => setReturnDate(e.target.value),
          },
          {
            name: 'status',
            type: 'select',
            options: [
              { value: 'issued', label: 'Issued' },
              { value: 'returned', label: 'Returned' },
            ],
            placeholder: 'Status',
            defaultValue: status,
            onChange: e => setStatus(e.target.value),
          },
          {
            name: 'issuanceType',
            type: 'select',
            options: [
              { value: 'library', label: 'Library' },
              { value: 'in-house', label: 'In-House' },
            ],
            placeholder: 'Issuance Type',
            defaultValue: issuanceType,
            onChange: e => setIssuanceType(e.target.value),
          },
        ]}
        onSubmit={handleIssueBook}
      />
    </div>
  
        ) : modalType === 'edit' ? (
          <Dynamicform
            heading="Edit User"
            fields={[
              { name: 'name', type: 'text', placeholder: 'Name', defaultValue: currentData.name },
              { name: 'email', type: 'email', placeholder: 'Email', defaultValue: currentData.email },
              { name: 'number', type: 'text', placeholder: 'Number', defaultValue: currentData.number },
              {
                name: 'role',
                type: 'select',
                options: [
                  { value: 'ROLE_USER', label: 'User' },
                  { value: 'ROLE_ADMIN', label: 'Admin' },
                ],
                placeholder: 'Role',
              },
            ]}
            onSubmit={handleSubmitModal}
          />
        ) : modalType === 'register' ? (
          <Dynamicform
            heading="Register User"
            fields={[
              { name: 'name', type: 'text', placeholder: 'Name' },
              { name: 'email', type: 'email', placeholder: 'Email' },
              { name: 'number', type: 'text', placeholder: 'Number' },
              { name: 'password', type: 'password', placeholder: 'Password' },
              { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
              {
                name: 'role',
                type: 'select',
                options: [
                  { value: 'ROLE_USER', label: 'User' },
                  { value: 'ROLE_ADMIN', label: 'Admin' },
                ],
                placeholder: 'Role',
              },
            ]}
            onSubmit={handleSubmitModal}
          />
        ) : null}
      </CustomModal>
    </>
  );
}

export const UserwithLayout = WithLayoutComponent(UsersPage);
