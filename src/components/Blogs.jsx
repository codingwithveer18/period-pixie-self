import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore, auth } from "../firebase";

function Blogs() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const q = query(collection(firestore, "blogs"));
        const querySnapshot = await getDocs(q);

        const blogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserBlogs(blogs);

        const u = query(collection(firestore, "user"));
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
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserBlogs();
  }, []);
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
              className="flex max-w-xl flex-col items-start justify-between bg-gradient-to-r from-slate-50 to-slate-100 px-4 pb-4 rounded-lg drop-shadow-md "
            >
              <div className="relative">
                {blog.file && (
                  <div className="h-40 flex justify-center items-center">
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
  );
}

export default Blogs;
