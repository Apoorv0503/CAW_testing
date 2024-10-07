import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../components/Home";
import { fetchUserData, updateUserEmail } from "../utils/api"; // Mock API calls
import {mockUserId,mockUserData} from "../mocks/UserMock";
import '@testing-library/jest-dom';
import { act } from "react";

// Mock API calls, utilized api.js file to get the component's functions
jest.mock("../utils/api", () => ({
  fetchUserData: jest.fn(),
  updateUserEmail: jest.fn(),
}));


describe("Home Component", () => {

  beforeEach(() => {
    //before running any test case, called fetchUserData with mocked data in utils
    fetchUserData.mockResolvedValue(mockUserData);
  });


  it("renders loading state initially", async () => {
    //since this rendering is going to affect the states, hence using act() to avoid race condition
    await act(async () => {
      render(<Home userId={mockUserId} />);
    });

// Used queryByText for asynchronous behavior and expect loading text to not be there after loading of actual data
//used regex for better text matching
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });


  it("renders user details after loading", async () => {
    await act(async () => {
        render(<Home userId={mockUserId} />);
      });
    

    // Assert that the user data is rendered correctly
    await waitFor(() => {
        // screen.debug();  //to see the DOM rendered
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  

  it("renders error message if data loading fails", async () => {
    //mocked one failure case
    fetchUserData.mockRejectedValueOnce(new Error("API error"));
    
     await act(async () => {
    render(<Home userId={mockUserId} />);
  });
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load user data/i)).toBeInTheDocument();
    });
  });


  it("input box allows email change", async () => {
    await act(async () => {
        render(<Home userId={mockUserId} />);
      });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText(/New email address/i);

    //avoided userEvent.type() to avaoid complexity
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    expect(emailInput.value).toBe("newemail@example.com");
  });


  it("shows success message after successful email update", async () => {
    //mocked one success case
    updateUserEmail.mockResolvedValueOnce({ success: true });
    
    await act(async () => {
        render(<Home userId={mockUserId} />);
      });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText(/New email address/i);
    const updateButton = screen.getByRole("button", { name: /Update Email/i });

    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    fireEvent.click(updateButton);

    //used regex for better chances of text matching
    await waitFor(() => {
      expect(screen.getByText(/Email updated successfully/i)).toBeInTheDocument();
    });
  });

  it("shows error message if email update fails", async () => {

    //mocked one failure case
    updateUserEmail.mockRejectedValueOnce(new Error("Update failed"));
    
    await act(async () => {
        render(<Home userId={mockUserId} />);
      });
    
    //waiting for asynchronous changes to be applied, then we will assert
    await waitFor(() => {
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText(/New email address/i);
    const updateButton = screen.getByRole("button", { name: /Update Email/i });

    //fired the relevent events vefore assertion
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to update email/i)).toBeInTheDocument();
    });
  });
});
