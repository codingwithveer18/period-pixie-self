import React from "react";
import MapComponent from "./MapComponent";
import SideBar from "./SideBar";
function Hospital() {
  return (
    <>
      <SideBar />
      <div className="w-full my-4">
        <MapComponent />
      </div>
    </>
  );
}
export default Hospital;
