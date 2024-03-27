import { useState } from "react";
import { push, set } from "firebase/database";
import { contactformDB } from "../firebase";
import { toast } from "react-toastify";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";

function Contact() {
  const [alertVisible, setAlertVisible] = useState(false);

  function submitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fname = formData.get("first-name");
    const lname = formData.get("last-name");
    const phonenumber = formData.get("phone-number");
    const email = formData.get("email");
    const message = formData.get("message");
    savemessages(fname, lname, phonenumber, email, message);
    try {
      setAlertVisible(toast.success("Sent Successfully"));
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      e.target.reset();
    } catch (error) {
      toast.error("Not Sent");
    }
  }

  const savemessages = (fname, lname, phonenumber, email, message) => {
    // Push a new child location with a unique key
    const newContactform = push(contactformDB);

    // Set the data for the new child location
    set(newContactform, {
      fname: fname,
      lname: lname,
      phonenumber: phonenumber,
      email: email,
      message: message,
    });
  };
  return (
    <>
      <div className="grid grid-flow-row md:grid-flow-col">
        <div className="  bg-white px-4  sm:pt-10 lg:px-8 -z-10">
          <div
            className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            aria-hidden="true"
          >
            <div
              className="relative left-1/2 -z-20 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <div className=" flex flex-col gap-4 pt-10 isolate sm:pt-10 mx-auto lg:mx-0 px-4 z-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Contact Now
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Learn how to grow your business with our expert advice.
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d112011.86459512373!2d77.2734976!3d28.6785536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1711183442273!5m2!1sen!2sin"
              className="w-full h-1/2"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center	">
                <MdOutlineHomeWork size={30} />
                <p className="pl-5 text-m sm:text-lg ">
                  545 Mavis Island Chicago, IL 99191
                </p>
              </div>
              <div className="flex">
                <IoCallOutline size={30} />
                <p className="pl-5 text-m sm:text-lg ">+1 (555) 234-5678</p>
              </div>
              <div className="flex">
                <CiMail size={30} />
                <p className="pl-5 text-m sm:text-lg ">hello@example.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="isolate bg-white px-6 sm:pt-10 lg:px-8 z-0   ">
          <form
            id="contact-form"
            onSubmit={submitForm}
            className={`mx-auto mt-6 max-w-xl sm:mt-2`}
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Phone number
                </label>
                <div className="relative mt-2.5">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      className="h-full rounded-md border-0 bg-transparent bg-none py-0 px-3 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>IND</option>
                      <option>CA</option>
                      <option>EU</option>
                      <option>US</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    name="phone-number"
                    id="phone-number"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
                    defaultValue={""}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onSubmit={() => submitForm}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
