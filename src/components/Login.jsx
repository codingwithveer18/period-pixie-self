import React, { useState } from "react";
import { auth, google, firestore } from "../firebase"; // Import firestore from Firebase
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { collection, getDocs, query, where } from "firebase/firestore"; // Import the query function

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch user data from Firestore based on email
      const q = query(
        collection(firestore, "user"),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(q);
      let displayName = "User"; // Default display name if not found
      querySnapshot.forEach((doc) => {
        displayName = doc.data().name; // Retrieve display name from Firestore
      });
      setUser(userCredential.user);
      toast.success(`Welcome ${displayName}`);
    } catch (error) {
      toast.error(`Error! ${error.message}`);
    }
  };

  const handleGoogle = async () => {
    try {
      // Sign in with Google Popup
      const result = await signInWithPopup(auth, google);

      // Store user's profile data in Firestore
      const userData = {
        email: result.user.email,
        displayName: result.user.displayName,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
      };

      // Add user data to Firestore collection "user"
      await addDoc(collection(firestore, "user"), userData);

      // Show success message
      toast.success(`Welcome ${result.user.displayName}`);

      // Set user state
      setUser(result.user);
    } catch (error) {
      toast.error("Error signing in with Google");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleLogin}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2 ">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="/signup"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
          <br />
          <div className="flex justify-center">
            <FcGoogle
              className="text-5xl cursor-pointer  bg-slate-200 hover:bg-slate-300  p-2 rounded-md"
              onClick={handleGoogle}
            />
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Create a New Account Now
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
