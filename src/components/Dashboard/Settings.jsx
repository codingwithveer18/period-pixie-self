import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { auth, firestore } from "../../firebase"; // Import storage from Firebase
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CgDanger } from "react-icons/cg";

const Settings = () => {
  const storage = getStorage();
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoURL, setProfilePicture] = useState(null); // State to hold selected profile picture
  const [previewImageUrl, setPreviewImageUrl] = useState(null); // State to hold selected profile picture
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
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
            const userData = querySnapshot.docs[0].data();
            setDisplayName(userData.name);
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
        const userDocRef = querySnapshot.docs[0].ref;

        await updateDoc(userDocRef, {
          name: displayName,
        });

        toast.success("Name updated successfully");
      } else {
        toast.error("No matching user document found");
        setError("No matching user document found");
      }
      setProfilePicture(null); // Reset profile picture field
      setPreviewImageUrl(null); // Reset preview image URL field
      setNewPassword(""); // Reset new password field
      setConfirmPassword(""); // Reset confirm password field
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
      setNewPassword(""); // Reset new password field
      setConfirmPassword(""); // Reset confirm password field
    } catch (error) {
      console.error("Error updating password", error);
      setError("Error updating password");
      toast.error("Error updating password");
    }
  };
  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setProfilePicture(selectedImage); // Set selected profile picture

      // Display preview of the selected image
      const imageUrl = URL.createObjectURL(selectedImage);
      setPreviewImageUrl(imageUrl); // State to hold preview image URL
    }
  };
  const handleUploadProfilePicture = async () => {
    try {
      const user = auth.currentUser;
      const userEmail = user.email;
      const q = query(
        collection(firestore, "user"),
        where("email", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;

        const storageRef = ref(storage, `emailprofilePictures/${user.uid}`); // Define storage reference for profile pictures
        await uploadBytes(storageRef, photoURL); // Upload profile picture to storage

        const profileURL = await getDownloadURL(storageRef); // Get URL of uploaded profile picture

        await updateDoc(userDocRef, {
          photoURL: profileURL, // Update user document with profile picture URL
        });

        toast.success("Profile picture updated successfully");
      } else {
        toast.error("No matching user document found");
        setError("No matching user document found");
      }
      setProfilePicture(null); // Reset profile picture field
      setPreviewImageUrl(null); // Reset preview image URL field
      setNewPassword(""); // Reset new password field
      setConfirmPassword(""); // Reset confirm password field
    } catch (error) {
      console.error("Error updating profile picture", error);
      toast.error("Error updating profile picture");
      setError("Error updating profile picture");
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
          const userDocRef = querySnapshot.docs[0].ref;

          await deleteDoc(userDocRef);
          await user.delete();

          toast.success("Account deleted successfully");

          navigate("/login");
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
      <div className="bg-white py-12 sm:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className=" border-b border-gray-900/10 pb-6 flex ">
            <div className="flex content-center flex-wrap mr-6 rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <a href="/profile">
                <IoReturnUpBack size={20} />
              </a>
            </div>
            <div className="">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Settings
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be irreversible, so be careful.
              </p>
            </div>
          </div>
          <div className=" mt-10 mx-auto grid grid-row  shadow-md rounded-lg p-6 bg-slate-50 sm:grid-cols-2 ">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className=" border-b border-gray-200 ">
              <div className=" mx-4 ">
                <div className="mb-4">
                  <label className="text-gray-600">Display Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-4 "
                  onClick={handleUpdateProfile}
                >
                  Update Profile Name
                </button>

                <div className="">
                  <div className="mb-4">
                    <label className="text-gray-600">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      className=" w-full"
                      onChange={handleProfilePictureChange} // Handle profile picture selection
                    />
                  </div>
                  {previewImageUrl && (
                    <div className="mb-4">
                      <label className="text-gray-600">Preview</label>
                      <img
                        src={previewImageUrl}
                        alt="Profile Preview"
                        className="mt-2 max-w-full h-auto"
                      />
                    </div>
                  )}
                  <button
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-4"
                    onClick={handleUploadProfilePicture} // Handle profile picture upload
                  >
                    Update Profile Picture
                  </button>
                </div>
              </div>
            </div>
            <div className=" md:border-l pl-4 border-b border-gray-200 max-md:mt-4">
              <div className="mb-4">
                <label className="text-gray-600">New Password</label>
                <input
                  type="password"
                  className="w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  className="w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-4"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
            <div className="my-4 ">
              <div className=" text-gray-600 font-medium ">
                Caution <CgDanger className="inline" size={20} color="red" />
              </div>
              <p className="text-gray-500 text-sm max-md:text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta,
                atque? Corrupti quibusdam iusto aliquid consequuntur
                exercitationem beatae cumque labore. Inventore nihil similique
                et mollitia.
              </p>
            </div>
            <div className="flex items-center mx-10">
              <button
                className=" w-full bg-red-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
