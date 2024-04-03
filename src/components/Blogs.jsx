import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

function Blogs() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user blogs
        const blogsQuery = query(collection(firestore, "blogs"));
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogs = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserBlogs(blogs);

        // Fetch user profiles
        const usersQuery = query(collection(firestore, "user"));
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
        setProfileData(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderTags = (tags) => {
    return tags.map((tag, index) => (
      <div
        key={index}
        className="rounded-full text-xs bg-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
      >
        {tag}
      </div>
    ));
  };

  const getProfilePhoto = (userId) => {
    const profile = profileData[userId];
    return (
      profile?.photoURL ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    );
  };

  return (
    <div className="bg-white py-12 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 sm:grid-cols-2 sm:justify-center">
          {userBlogs.map((blog) => (
            <article
              key={blog.id}
              className="flex max-w-xl flex-col items-start justify-between bg-gradient-to-r from-slate-100 to-slate-200 px-4 pb-4 rounded-lg drop-shadow-lg "
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
                  src={getProfilePhoto(blog.userId)}
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
  );
}

export default Blogs;
