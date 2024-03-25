import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Tracker() {
  const [formData, setFormData] = useState({
    cycleLength: "",
    flowDuration: "",
    lastPeriodStart: "",
  });

  const [calendarData, setCalendarData] = useState([]);

  const handleTrack = (e) => {
    e.preventDefault();

    const { cycleLength, flowDuration, lastPeriodStart } = formData;
    const cycleDates = calculateMenstrualCycleDates(
      cycleLength,
      flowDuration,
      lastPeriodStart
    );
    setCalendarData(cycleDates);
  };

  const calculateMenstrualCycleDates = (
    cycleLength,
    flowDuration,
    lastPeriodStart
  ) => {
    const cycleDates = [];
    let currentDate = new Date(lastPeriodStart);
    const monthCount = 3;

    for (let i = 0; i < monthCount; i++) {
      const cycleEndDate = new Date(currentDate);
      cycleEndDate.setDate(currentDate.getDate() + parseInt(flowDuration));

      while (currentDate <= cycleEndDate) {
        cycleDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + parseInt(cycleLength) - 1);
      }

      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    }

    return cycleDates;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <div className="bg-white py-12 sm:py-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Track Your Cycle
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="isolate px-6 sm:pt-10 md:px-8 z-0 ">
          <form
            id="contact-form"
            className={`mt-6 max-w-full sm:mt-2`}
            onSubmit={handleTrack}
          >
            <div className="grid grid-cols-1 items-end gap-x-4 gap-y-2 md:grid-cols-2">
              <div>
                <label
                  htmlFor="cycleLength"
                  className="text-md font-semibold leading-6 text-gray-900"
                >
                  Average cycle length (in days):
                </label>
                <div className="mt-2.5">
                  <input
                    type="number"
                    name="cycleLength"
                    id="cycleLength"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.cycleLength}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="flowDuration"
                  className="text-md font-semibold leading-6 text-gray-900"
                >
                  Average duration of menstrual flow (in days):
                </label>
                <div className="mt-2.5">
                  <input
                    type="number"
                    name="flowDuration"
                    id="flowDuration"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.flowDuration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastPeriodStart"
                  className="text-md font-semibold leading-6 text-gray-900"
                >
                  First day of last menstrual period:
                </label>
                <div className="mt-2.5">
                  <input
                    type="date"
                    name="lastPeriodStart"
                    id="lastPeriodStart"
                    className="font-medium block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.lastPeriodStart}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-2.5">
                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-3.5 py-2 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Track Now
                </button>
              </div>
            </div>
          </form>
          {/* Render menstrual cycle calendar */}
          <div className="mt-6">
            <h3 className=" text-center mt-4 text-2xl font-bold leading-6 text-gray-900">
              Menstrual Cycle Calendar
            </h3>
            <p className="text-center my-4 text-lg italic font-medium leading-6 text-gray-900">
              Menstruation estimation for the next 3 months
            </p>
            {/* Render the calendar */}
            <div className="calendar-block">
              <Calendar
                className="w-full"
                showNeighboringMonth={false} // Only show current month
                showFixedNumberOfWeeks={true} // Show same number of weeks for each month
                tileClassName={({ date }) =>
                  calendarData.find(
                    (d) => d.toDateString() === date.toDateString()
                  )
                    ? "menstruation-day"
                    : null
                }
                tileContent={({ date }) => {
                  if (
                    calendarData.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                  ) {
                    return <div className="menstruation-dot">🔴</div>;
                  }
                }}
                calendarType="gregory" // Display calendar in US format
                minDetail="month" // Show month view by default
                maxDetail="month" // Maximum detail level
                defaultActiveStartDate={new Date()} // Set current month as default
                minDate={new Date()} // Allow only current date and future dates
                maxDate={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 2,
                    1
                  )
                } // Allow current month and next two months
                showNavigation={false} // Hide navigation buttons
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tracker;
