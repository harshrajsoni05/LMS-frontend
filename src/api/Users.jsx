import axiosInstance from "./axiosInstance";

const API_BASE_URL = "/users";

const fetchUsers = async (page = 0, pagesize = 10, search = "") => {
  try {
    const trimmedSearchTerm = search.trim(); // Trim the search term
    const response = await axiosInstance.get(`${API_BASE_URL}`, {

      params: {
        page: page,
        size: pagesize,
        search: trimmedSearchTerm, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Users:", error);
    throw error;
  }
};


const RegisterUser = async (UserData) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, UserData);
    return response.data;
  } catch (error) {
    console.error("Error adding Issuance:", error);
    throw error;
  }
};

const updateUser = async (id, UserData) => {
  try {
    const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, UserData);
    return response.data;
  } catch (error) {
    console.error("Error updating UserData:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting User:", error);
    throw error;
  }
};

// This function isn't needed based on the provided URLs, but if needed in future, it can be added similarly to books.

export { fetchUsers, RegisterUser, updateUser, deleteUser };
