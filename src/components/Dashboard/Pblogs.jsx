import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import SideBar from "./SideBar";

const Pblogs = () => {
  const navigate = useNavigate();
  const [userBlogs, setUserBlogs] = useState([]);
  const [profileData, setProfileData] = useState(null);

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
                      <img
                        src={blog.file}
                        alt="Cover"
                        className="h-max w-full object-contain rounded-md"
                      />
                    )}
                    <div className="pb-2 mb-2">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-black group-hover:text-gray-600">
                        <span className="" />
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="rounded-full text-xs bg-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100">
                      {blog.tags}
                    </div>
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
