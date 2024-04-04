import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import SideBar from "./SideBar";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { MdDeleteOutline } from "react-icons/md";

const Pblogs = () => {
  const navigate = useNavigate();
  const [userBlogs, setUserBlogs] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [open, setOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userEmail = user.email;

          const q = query(
            collection(firestore, "blogs"),
            where("email", "==", userEmail)
          );
          const querySnapshot = await getDocs(q);

          const blogs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserBlogs(blogs);

          const u = query(
            collection(firestore, "user"),
            where("email", "==", userEmail)
          );
          const userpro = await getDocs(u);

          const userData = [];
          userpro.forEach((doc) => {
            const data = doc.data();
            userData.push({
              id: doc.id,
              photoURL:
                data.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Fallback to a default profile picture
            });
          });
          setProfileData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserBlogs();
  }, []);

  const handleBlog = () => {
    navigate("/pblogs/addblogs");
  };

  const handleDeleteConfirmation = (blogId) => {
    setOpen(true);
    setBlogToDelete(blogId);
  };

  const handleDeleteBlog = async () => {
    try {
      await deleteDoc(doc(firestore, "blogs", blogToDelete));
      setUserBlogs(userBlogs.filter((blog) => blog.id !== blogToDelete));
      setOpen(false);
    } catch (error) {
      console.error("Error deleting blog", error);
    }
  };

  return (
    <>
      <SideBar />
      <div>
        <div className="bg-white py-12 sm:py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col justify-between sm:flex-row ">
              <div className=" max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Your Blogs
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Learn how to grow your business with your expert advice.
                </p>
              </div>
              <button
                className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-5 p-3"
                onClick={handleBlog}
              >
                ADD BLOG
              </button>
            </div>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 sm:grid-cols-2 sm:justify-center">
              {userBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="flex max-w-xl flex-col items-start justify-between bg-gradient-to-r from-slate-100 to-slate-200 px-4 pb-4 rounded-lg drop-shadow-md "
                >
                  <div className="relative">
                    {blog.file && (
                      <div className="h-40 flex justify-center items-center pt-4">
                        <div className="max-w-full max-h-full overflow-hidden">
                          <img
                            src={blog.file}
                            alt="Cover"
                            className="object-contain w-full h-full rounded-md"
                          />
                        </div>
                      </div>
                    )}
                    <div className="pb-2 mb-2">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-black group-hover:text-gray-600">
                        <span className="" />
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    {Array.isArray(blog.tags) &&
                      blog.tags.map((tag) => (
                        <div
                          key={tag}
                          className="rounded-full text-xs bg-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
                        >
                          {tag}
                        </div>
                      ))}

                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime={blog.date} className="text-black">
                        {blog.date}
                      </time>
                    </div>
                  </div>
                  <p className=" text-lg mt-2 line-clamp-3 leading-6 text-gray-600">
                    {blog.description}
                  </p>
                  <div className=" mt-8 flex items-center gap-x-4">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={profileData?.[0]?.photoURL}
                      alt=""
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        <span className="" />
                        {blog.username}
                      </p>
                      <p className="text-gray-600">{blog.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteConfirmation(blog.id)}
                    className="absolute bottom-0 right-0 m-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
                  >
                    <MdDeleteOutline className="text-xl" />
                  </button>
                  <Transition.Root show={open} as={Fragment}>
                    <Dialog
                      as="div"
                      className="fixed inset-0 z-10 overflow-y-auto"
                      initialFocus={cancelButtonRef}
                      onClose={setOpen}
                    >
                      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                          className="hidden sm:inline-block sm:align-middle sm:h-screen"
                          aria-hidden="true"
                        >
                          &#8203;
                        </span>
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <ExclamationCircleIcon
                                  className="h-6 w-6 text-red-600"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="mt-3 text-center sm:mt-5">
                                <Dialog.Title
                                  as="h3"
                                  className="text-lg leading-6 font-medium text-gray-900"
                                >
                                  Delete Blog
                                </Dialog.Title>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this blog?
                                    This action cannot be undone.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                              <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                onClick={handleDeleteBlog}
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                onClick={() => setOpen(false)}
                                ref={cancelButtonRef}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </Transition.Child>
                      </div>
                    </Dialog>
                  </Transition.Root>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pblogs;
