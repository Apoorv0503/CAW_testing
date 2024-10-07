//mock these two functions using jest.fn()

export const fetchUserData = async (userId) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id: userId, name: "John Doe", email: "john@example.com" };
  };
  
  export const updateUserEmail = async (userId, newEmail) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  };
  