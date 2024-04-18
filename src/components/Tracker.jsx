import React, { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import html2pdf from "html2pdf.js";

function Tracker() {
  const [formData, setFormData] = useState({
    cycleLength: "",
    flowDuration: "",
    lastPeriodStart: "",
  });

  const [calendarData, setCalendarData] = useState([]);

  const calendarContainerRef = useRef(null);

  const handleTrack = (e) => {
    e.preventDefault();

    const { cycleLength, flowDuration, lastPeriodStart } = formData;
    const cycleDates = calculateMenstrualCycleDates(
      parseInt(cycleLength),
      parseInt(flowDuration),
      new Date(lastPeriodStart)
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

    for (let i = 0; i < 3; i++) {
      const cycleStartDate = new Date(currentDate);
      const cycleEndDate = new Date(currentDate);
      cycleEndDate.setDate(cycleEndDate.getDate() + flowDuration - 1);

      cycleDates.push({
        start: cycleStartDate,
        end: cycleEndDate,
      });

      currentDate.setDate(currentDate.getDate() + cycleLength);
    }

    return cycleDates;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const downloadPDF = () => {
    const calendarElement = calendarContainerRef.current;

    html2pdf()
      .from(calendarElement)
      .set({
        margin: 1,
        filename: "menstrual_cycle_calendar.pdf",
        orientation: "landscape",
        width: 1200, // Adjust the width to accommodate three months
      })
      .save();
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
          {/* Download PDF button */}
          {calendarData.length > 0 && (
            <div className="text-center my-8">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
                onClick={downloadPDF}
              >
                Download Calendar as PDF
              </button>
            </div>
          )}
          {/* Render menstrual cycle calendar */}
          <div className="mt-6" ref={calendarContainerRef}>
            <h3 className=" text-center mt-4 text-2xl font-bold leading-6 text-gray-900">
              Menstrual Cycle Calendar
            </h3>
            <p className="text-center my-4 text-lg italic font-medium leading-6 text-gray-900">
              Menstruation estimation for the next 3 months
            </p>
            {/* Render the calendar */}
            <div className="calendar-container">
              <div className="calendar-month">
                <Calendar
                  className="w-full"
                  showNeighboringMonth={false}
                  showFixedNumberOfWeeks={true}
                  tileClassName={({ date }) =>
                    calendarData.some(
                      (cycle) => date >= cycle.start && date <= cycle.end
                    )
                      ? "menstruation-day"
                      : null
                  }
                  tileContent={({ date }) => {
                    if (
                      calendarData.some(
                        (cycle) => date >= cycle.start && date <= cycle.end
                      )
                    ) {
                      return <div className="menstruation-dot">🔴</div>;
                    }
                  }}
                  minDetail="month"
                  maxDetail="month"
                  minDate={new Date()}
                  maxDate={
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 2,
                      1
                    )
                  }
                  defaultActiveStartDate={
                    formData.lastPeriodStart instanceof Date &&
                    !isNaN(formData.lastPeriodStart)
                      ? formData.lastPeriodStart
                      : new Date()
                  }
                  onChange={(date) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      lastPeriodStart: date,
                    }))
                  }
                  showNavigation={true}
                />
              </div>
              <div className="calendar-month">
                {/* Render another Calendar component for the next month */}
                {/* Similar settings as above */}
              </div>
              <div className="calendar-month">
                {/* Render another Calendar component for the next month */}
                {/* Similar settings as above */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tracker;
