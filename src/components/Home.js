import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../utils/helper";
import { Button } from "../utils/helper";
import { Input } from "../utils/helper";
import { AlertCircle, CheckCircle } from "lucide-react";

// Simulated API calls
const fetchUserData = async (userId) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id: userId, name: "John Doe", email: "john@example.com" };
};

const updateUserEmail = async (userId, newEmail) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserData(userId);
        setUser(userData);
        setNewEmail(userData.email);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleEmailUpdate = async () => {
    try {
      setUpdateStatus("pending");
      await updateUserEmail(userId, newEmail);
      setUser({ ...user, email: newEmail });
      setUpdateStatus("success");
    } catch (err) {
      setUpdateStatus("error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle data-testid="main_heading">User Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Current Email:</strong> {user.email}
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              value={newEmail}
              onChange={handleEmailChange}
              placeholder="New email address"
            />
            <Button
              onClick={handleEmailUpdate}
              disabled={updateStatus === "pending"}
            >
              Update Email
            </Button>
          </div>
          {updateStatus === "success" && (
            <div className="flex items-center text-green-500">
              <CheckCircle className="mr-2" size={16} />
              Email updated successfully
            </div>
          )}
          {updateStatus === "error" && (
            <div className="flex items-center text-red-500">
              <AlertCircle className="mr-2" size={16} />
              Failed to update email
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;
