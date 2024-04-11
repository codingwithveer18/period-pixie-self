// Import useState, useEffect, and other necessary dependencies
import React, { useState, useEffect } from "react";
// Import necessary components and functions
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Dialog, Popover } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import {
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";

// Define the Header component
function Header() {
  // Define state variables
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  // Fetch user profile data from Firestore
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;

          const q = query(
            collection(firestore, "user"),
            where("email", "==", userEmail)
          );
          const querySnapshot = await getDocs(q);

          const userData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            userData.push({
              id: doc.id,
              photoURL:
                data.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Fallback to a default profile picture
            });
          });

          setProfileData(userData);

          // Add listener for changes to the user's profile document
          // Inside the useEffect for fetching profile data
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const newData = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              newData.push({
                id: doc.id,
                photoURL: data.photoURL,
              });
            });
            setProfileData(newData);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Check if user is logged in and set up authentication listener
  // Check if user is logged in and set up authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        try {
          const userEmail = user.email;

          const q = query(
            collection(firestore, "user"),
            where("email", "==", userEmail)
          );
          const querySnapshot = await getDocs(q);

          const userData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            userData.push({
              id: doc.id,
              photoURL:
                data.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Fallback to a default profile picture
            });
          });

          setProfileData(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle sign out functionality
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Define navigation handlers for various menu items
  const handleSetting = () => {
    navigate("/settings");
  };
  const handleProfile = () => {
    navigate("/profile");
  };
  const handleAccount = () => {
    navigate("/account");
  };
  const handleItemClick = (itemName) => {
    switch (itemName) {
      case "Account":
        handleAccount();
        break;
      case "Settings":
        handleSetting();
        break;
      case "Sign out":
        handleSignOut();
        break;
      case "Your Profile":
        handleProfile();
        break;
      default:
        break;
    }
  };

  // Define user navigation links
  const userNavigation = [
    { name: "Account", href: "/account" },
    { name: "Your Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
    { name: "Sign out", href: "/login" },
  ];

  // Utility function to handle CSS classes
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // State variable for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render the header component
  return (
    <>
      <header className="bg-gradient-to-r from-red-900/75 to-pink-900 sticky z-50">
        {/* Navigation bar */}
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-8 lg:px-8"
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <img
              className="h-20 w-auto"
              src="https://storage.googleapis.com/project-hackdata/Period%20Pixie-white-text.png"
              alt="Logo"
            />
          </div>
          {/* Mobile menu button */}
          <div className="flex lg:hidden ">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          {/* Desktop menu */}
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            {/* Navigation links */}
            <a href="/" className="text-m font-semibold leading-6 text-white">
              Home
            </a>
            <a
              href="/about"
              className="text-m font-semibold leading-6 text-white"
            >
              About
            </a>
            <a
              href="/appointment"
              className="text-m font-semibold leading-6 text-white"
            >
              Book Now
            </a>
            <a
              href="/tracker"
              className="text-m font-semibold leading-6 text-white"
            >
              Tracker
            </a>
            <a
              href="/contact"
              className="text-m font-semibold leading-6 text-white"
            >
              Contact
            </a>
            <a
              href="/blogs"
              className="text-m font-semibold leading-6 text-white"
            >
              Blogs
            </a>
          </Popover.Group>
          {/* User actions */}
          {user ? (
            <>
              <div className=" ml-4  hidden md:ml-6 lg:flex lg:flex-1 lg:justify-end ">
                {/* Notifications */}
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={
                          profileData && profileData.length > 0
                            ? profileData[0].photoURL
                            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        }
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  {/* User dropdown menu */}
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <button
                              onClick={() => handleItemClick(item.name)}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {item.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </>
          ) : (
            // Display login/signup links if user is not logged in
            <>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a
                  href="/login"
                  className="text-m font-semibold leading-6 text-white px-2"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
                <a
                  href="/signup"
                  className="text-m font-semibold leading-6 text-white px-2"
                >
                  Sign up <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </>
          )}
        </nav>
        {/* Mobile menu */}
        <Dialog
          as="div"
          className="lg:hidden transition-all	"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10 transition-all	" />
          <Dialog.Panel className="fixed inset-y-20 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-all h-full ">
            <div className="flex items-center justify-between transition-all	">
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 transition-all	"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="grid grid-cols-2 gap-2 py-6 max-sm:grid-cols-1">
                  {/* Mobile navigation links */}
                  <a
                    href="/"
                    className="-mx-3 block rounded-lg px-3 py-1 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Home
                  </a>
                  <a
                    href="/about"
                    className="-mx-3 block rounded-lg px-3 py-1 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    About
                  </a>
                  <a
                    href="/appointment"
                    className="-mx-3 block rounded-lg px-3 py-1 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Book Now
                  </a>
                  <a
                    href="/tracker"
                    className="-mx-3 block rounded-lg px-3 py-1 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Tracker
                  </a>
                  <a
                    href="/contact"
                    className="-mx-3 block rounded-lg px-3 py-1 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Contact
                  </a>
                  <a
                    href="/blogs"
                    className="-mx-3 block rounded-lg px-3 py-1 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Blogs
                  </a>
                </div>
                {user ? (
                  <>
                    <div className="py-6 flex justify-end ">
                      {/* User dropdown menu */}
                      <Menu as="div" className="relative ml-3 z-auto">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <img
                              className="h-8 w-8 rounded-full"
                              src={
                                profileData && profileData.length > 0
                                  ? profileData[0].photoURL
                                  : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              }
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        {/* User dropdown menu items */}
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            className="absolute top-0 right-10  mt-1 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleItemClick(item.name)}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      " w-full text-left px-4 py-1 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-6">
                      {/* Login and signup links */}
                      <a
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Log in <span aria-hidden="true">&rarr;</span>
                      </a>
                      <a
                        href="/signup"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Sign up <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
}

export default Header;
