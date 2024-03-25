import { FaBlog } from "react-icons/fa";
import { MdMood } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { FaUserDoctor } from "react-icons/fa6";

function About() {
  const posts = [
    {
      id: 1,
      title: " Blogs on Health & Hygiene",
      description:
        "Menstrual hygiene is still not discussed openly and many of us feel shy to talk about it, So learn about it from out blogs. You can also contribute your blogs. Check out blogs for more.",
      imageUrl: (
        <FaBlog className="h-10 w-10 rounded-full bg-gray-200 p-2 mr-4 overflow-visible	" />
      ),
    },
    {
      id: 2,
      title: " Mood and Cycle tracker",
      description:
        " Cycle Tracker provides your 3 month predicted period cycle, So that you can prepare for your period earlier! We provide you a mood analysis and try to control your mood swings by diverting you to memes and jokes.",
      imageUrl: (
        <MdMood className="h-10 w-10 rounded-full bg-gray-200 p-2 mr-4 overflow-visible	" />
      ),
    },
    {
      id: 3,
      title: "Get Notified",
      description:
        " Sometimes we skip our meals , yoga classes or forget drinking water. Here our notifier will send you emails so that you get prior notifications about the them.",
      imageUrl: (
        <IoIosNotifications className="h-10 w-10 rounded-full bg-gray-200 p-2 mr-4 overflow-visible	" />
      ),
    },
    {
      id: 4,
      title: "Easy doctor's appointment",
      description:
        " We use google maps to get the gynaecologist's location incase of severe period pain or other problems. Select the nearest gynae location and book an appointment with a form.",
      imageUrl: (
        <FaUserDoctor className="h-10 w-10 rounded-full bg-gray-200 p-2 mr-4 overflow-visible	" />
      ),
    },
  ];

  return (
    <>
      <div className="bg-white py-20 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Helpful Services
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We are stand out as an integrated platform to provide healthcare
              solutions for deprived and helpless women around the world Our
              platform can be used in several cases and can impact lives of
              several young girls.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 border-t border-gray-200 pt-8 sm:mt-16 sm:pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex max-w-xl flex-col items-start justify-between"
              >
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 flex items-center	">
                    <span className="absolute inset-0" />
                    {post.imageUrl}
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.description}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4"></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
