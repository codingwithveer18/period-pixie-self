import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import SideBar from "./SideBar";

const Pblogs = () => {
  const navigate = useNavigate();
  const [userBlogs, setUserBlogs] = useState([]);

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
        }
      } catch (error) {
        console.error("Error fetching user blogs:", error);
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
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {userBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="flex max-w-xl flex-col items-start justify-between"
                >
                  <div className="relative">
                    {blog.file && (
                      <img
                        src={blog.file}
                        alt="Cover"
                        className="h-50 w-full object-cover rounded-md"
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end px-4 pb-4 bg-gradient-to-t from-black to-transparent">
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime={blog.date} className="text-white">
                          {blog.date}
                        </time>
                        <div className="relative  rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                          {blog.tags}
                        </div>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600">
                        <span className="absolute inset-0" />
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                  <div className="group relative">
                    <p className=" text-lg mt-5 line-clamp-3 leading-6 text-gray-600">
                      {blog.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <img
                      // src={blog.author.profilePic}
                      alt={blog.name}
                      className="h-10 w-10 rounded-full bg-gray-50"
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        <span className="absolute inset-0" />
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
