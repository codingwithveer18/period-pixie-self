import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { firestore, auth } from "../../firebase"; // Assuming you have initialized Firebase and exported the firestore instance
import { collection, query, getDocs, where } from "firebase/firestore";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userEmail = user.email;

          const q = query(
            collection(firestore, "user"),
            where("email", "==", userEmail)
          );
          const querySnapshot = await getDocs(q);

          const userData = [];
          querySnapshot.forEach((doc) => {
            // Extract the data from each document
            const data = doc.data();
            userData.push({
              id: doc.id,
              name: data.name, // Assuming the field in Firestore is named 'name'
              email: data.email, // Assuming the field in Firestore is named 'email'
              photoURL:
                data.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Fallback to a default profile picture if photoURL is not available
            });
          });

          setProfileData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <>
      <SideBar />
      <div className="w-full h-screen">
        <div className="flex flex-col flex-wrap basis-4/4 mx-8 ">
          <div className="mt-6">
            {profileData &&
              profileData.map((user) => (
                <div key={user.id}>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Display Picture
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.photoURL}
                        alt=""
                      />
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-100">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {user.name}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0  border-t border-gray-100">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {user.email}
                    </dd>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
