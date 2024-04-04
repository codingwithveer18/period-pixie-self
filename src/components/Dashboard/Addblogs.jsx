import { useState, useRef, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { firestore, storage, auth } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { PhotoIcon } from "@heroicons/react/24/solid";
import SideBar from "./SideBar";
import { IoReturnUpBack } from "react-icons/io5";

export default function Addblogs() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [formObject, setFormObject] = useState({
    title: "",
    description: "",
    tags: [],
    date: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserEmail(user.email);
          const u = query(
            collection(firestore, "user"),
            where("email", "==", user.email)
          );
          const userDocs = await getDocs(u);
          let userName = "User";
          userDocs.forEach((doc) => {
            userName = doc.data().name;
          });
          setUserName(userName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (file) {
        const storageRef = ref(storage, file.name);
        const snapshot = await uploadBytes(storageRef, file);
        toast.success("File uploaded successfully");
        const downloadURL = await getDownloadURL(storageRef);
        setFileURL(downloadURL);
        // Update formObject with the file URL, user input, and default values
        const updatedFormObject = {
          ...formObject,
          file: downloadURL,
          username: userName,
          name: userName,
          email: userEmail,
        };

        // Add updatedFormObject to Firestore
        const docRef = await addDoc(
          collection(firestore, "blogs"),
          updatedFormObject
        );

        // Reset file and fileURL states
        setFile(null);
        setFileURL("");
      } else {
        // Update formObject with user input and default values
        const updatedFormObject = {
          ...formObject,
          username: userName,
          name: userName,
          email: userEmail,
        };

        // Add updatedFormObject to Firestore
        const docRef = await addDoc(
          collection(firestore, "blogs"),
          updatedFormObject
        );
      }

      // Reset formObject to initial values or empty strings
      setFormObject({
        title: "",
        description: "",
        tags: [],
        date: "",
      });

      toast.success("Data added to Firestore successfully!");
    } catch (error) {
      toast.error("Error adding data to Firestore:", error.message);
    }
  };

  const handleFileUpload = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileURL(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Split the input value by commas, trim each tag, and store them as an array
    const tagsArray = value.split(",").map((tag) => tag.trim());
    // Update formObject with the array of tags
    setFormObject((prevFormObject) => ({
      ...prevFormObject,
      [name]: tagsArray,
    }));
  };

  return (
    <>
      <SideBar />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-12 m-10 max-sm:m-4">
            <div className="border-b border-gray-900/10 pb-6">
              <div className=" border-b border-gray-900/10 pb-6 flex ">
                <div className="flex content-center flex-wrap mr-6 rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <a href="/pblogs">
                    <IoReturnUpBack size={20} />
                  </a>
                </div>
                <div className="">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Add your Blogs
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        defaultValue={userName}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="title"
                        value={formObject.title} // Bind value to state variable
                        onChange={handleInputChange} // Handle changes
                        className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter the Title.."
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
                      onChange={handleInputChange}
                      value={formObject.description} // Bind value to state variable
                      required
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    {fileURL ? (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setFileURL("");
                          }}
                          className="absolute top-0 right-0 p-1.5 bg-white rounded-full text-gray-500 hover:text-red-500 focus:outline-none"
                        >
                          <span className="sr-only">Remove photo</span>
                          <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <img
                          src={fileURL}
                          alt="Cover"
                          className="max-h-96 max-w-full mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="cover-photo"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="cover-photo"
                              name="file"
                              type="file"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                handleFileUpload(file);
                              }}
                              value={formObject.file}
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Other Relevant Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={userName}
                      readOnly
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={userEmail}
                      readOnly
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Date
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      autoComplete="date"
                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={handleInputChange}
                      value={formObject.date}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tags
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="Use , to add multiple tags"
                      type="text"
                      name="tags"
                      id="tags"
                      autoComplete="tags"
                      className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={handleInputChange}
                      value={
                        Array.isArray(formObject.tags)
                          ? formObject.tags.join(", ")
                          : formObject.tags
                      } // Check if tags is an array before calling join
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="m-6 flex items-center justify-center gap-x-6 sm:mb-10 ">
            <button
              type="button"
              className="text-md font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
