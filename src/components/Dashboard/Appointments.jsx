import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase";
import SideBar from "./SideBar";
import { collection, query, where, getDocs } from "firebase/firestore";
import { MdOutlineFileDownload } from "react-icons/md";
import html2pdf from "html2pdf.js";

export const Appointments = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [appointments, setAppointments] = useState([]);

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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsQuery = query(
          collection(firestore, "appointment"),
          where("email", "==", userEmail)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const fetchedAppointments = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date,
          email: doc.data().email,
          fname: doc.data().fname,
          lname: doc.data().lname,
          person: doc.data().person,
          phoneNumber: doc.data().phoneNumber,
          time: doc.data().time,
        }));
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [userEmail]);

  const handleDownloadPDF = (appointment) => {
    const appointmentElement = document.getElementById(
      `appointment-${appointment.id}`
    );

    // Customize the appointment layout
    const appointmentHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #0a79df; border-radius: 8px; max-width: 400px; margin: 0 auto; margin-top:20px;">
    <div style="background-color: #0a79df; color: #fff; text-align: center; padding: 10px 0; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1 style="margin: 0;">PIXIE CARE</h1>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <p>Appointment Details</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <p><strong>Date:</strong> ${appointment.date}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p><strong>Doctor:</strong> ${appointment.person}</p>
      <p><strong>Name:</strong> ${appointment.fname} ${appointment.lname}</p>
      <p><strong>Email:</strong> ${appointment.email}</p>
      <p><strong>Phone Number:</strong> ${appointment.phoneNumber}</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #666;">
      <p>Powered by Period Pixie</p>
    </div>
  </div>
  
    `;

    // Convert HTML to PDF
    html2pdf()
      .from(appointmentHTML)
      .save(`${appointment.fname}_${appointment.lname}_appointment.pdf`);
  };

  return (
    <>
      <SideBar />
      <div className="bg-white py-12 sm:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col justify-between sm:flex-row ">
            <div className=" max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Your Appointments,{" "}
                <span className="font-bold text-purple-700">{userName}</span>
              </h2>
              <p className="mt-4 mb-2 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse,
                natus!
              </p>
            </div>
          </div>
          <div
            id="appointments"
            className="grid mx-auto gap-x-8 gap-y-16 border-t border-gray-200 pt-10 "
          >
            <ul
              role="list"
              className="grid w-full md:grid-cols-3 max-sm:grid-cols-1 sm:pt-8 md:mx-0 md:max-w-none *:justify-center"
            >
              {appointments.map((appointment, index) => (
                <li key={index} className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <div
                      id={`appointment-${appointment.id}`}
                      className="min-w-0 flex-auto border p-4 w-full"
                    >
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        Date: {appointment.date}
                      </p>
                      <p className="mt-1 truncate text-md leading-5 text-gray-500">
                        Email: {appointment.email}
                      </p>
                      <p className="mt-1 truncate text-md leading-5 text-gray-500">
                        Name: {appointment.fname} {appointment.lname}
                      </p>
                      <p className="mt-1 truncate text-md leading-5 text-gray-500">
                        Doctor: {appointment.person}
                      </p>
                      <p className="mt-1 truncate text-md leading-5 text-gray-500">
                        Phone Number: {appointment.phoneNumber}
                      </p>
                      <p className="mt-1 truncate text-md leading-5 text-gray-500">
                        Time: {appointment.time}
                      </p>
                      <p className="mt-2">
                        <button
                          onClick={() => handleDownloadPDF(appointment)}
                          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-2 rounded"
                        >
                          <MdOutlineFileDownload size={20} />
                        </button>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
