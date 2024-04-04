import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { auth, firestore } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Settings = () => {
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userEmail = user.email;
          const q = query(
            collection(firestore, "user"), // Adjust collection name to "user"
            where("email", "==", userEmail)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data(); // Get the first document's data
            setDisplayName(userData.name); // Update to access name property
          }
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Error fetching user data");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      const userEmail = user.email;
      const q = query(
        collection(firestore, "user"),
        where("email", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the reference to the first document in the query snapshot
        const userDocRef = querySnapshot.docs[0].ref;

        // Update the document data
        await updateDoc(userDocRef, {
          name: displayName,
        });

        toast.success("Profile updated successfully");
      } else {
        toast.error("No matching user document found");
        setError("No matching user document found");
      }
    } catch (error) {
      toast.error("Error updating profile", error);
      setError("Error updating profile");
    }
  };
  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      const userEmail = user.email;
      const q = query(
        collection(firestore, "user"),
        where("email", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the reference to the first document in the query snapshot
        const userDocRef = querySnapshot.docs[0].ref;

        // Update the document data with the new password
        await updateDoc(userDocRef, {
          password: newPassword,
        });

        toast.success("Password updated successfully");
      } else {
        toast.error("No matching user document found");
        setError("No matching user document found");
      }
    } catch (error) {
      console.error("Error updating password", error);
      setError("Error updating password");
      toast.error("Error updating password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userEmail = user.email;
        const q = query(
          collection(firestore, "user"),
          where("email", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the reference to the first document in the query snapshot
          const userDocRef = querySnapshot.docs[0].ref;

          // Delete the user document from Firestore
          await deleteDoc(userDocRef);

          // Delete the user account
          await user.delete();

          // Display success message
          toast.success("Account deleted successfully");

          // Redirect to login page after account deletion
          return (
            <Link to="/login" className="text-gray-600 mt-2 block text-sm">
              Go to Login
            </Link>
          );
        } else {
          toast.error("No matching user document found");
          setError("No matching user document found");
        }
      } else {
        toast.error("No user found");
      }
    } catch (error) {
      console.error("Error deleting account", error);
      toast.error("Error deleting account");
      setError(error.message);
    }
  };

  return (
    <>
      <SideBar />
      <div className="flex flex-col items-center  min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full mt-24">
          <h2 className="text-2xl font-semibold mb-4">Settings</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="text-gray-600">Display Name</label>
            <input
              type="text"
              className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-4"
            onClick={handleUpdateProfile}
          >
            Update Profile
          </button>
          <div className="mb-4">
            <label className="text-gray-600">New Password</label>
            <input
              type="password"
              className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Confirm Password</label>
            <input
              type="password"
              className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-4"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
          <div className="border-t border-gray-200 ">
            <button
              className=" block bg-red-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-red-700"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
            {/* Link to navigate to the login page */}
            <Link to="/login" className="text-gray-600 mt-2 block text-sm">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
