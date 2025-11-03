import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import EventDetailForm from "../components/EventDetailForm";
import EventAttendeeList from "../components/EventAttendeeList";

function EventDetailView() {
  return (
    <div className={`md:p-10 p-6 flex flex-col gap-6 relative z-0 `}>
      <div className="bg-white flex py-6 flex-col gap-6 shadow-md rounded-md">
        <div className="col-span-12">
          <Link
            to={"/events"}
            className="flex gap-2  px-4 items-center w-fit"
          >
            <ChevronLeft size={40} />
            <span className="font-bold text-2xl">Thông tin sự kiện</span>
          </Link>
        </div>
        <div className="mx-6 md:mx-10">
          <EventDetailForm eventId={1}/>
        </div>
      </div>
      <div className="bg-white flex p-6 flex-col gap-6 shadow-md rounded-md grid grid-cols-12">
        <div className="col-span-12">
          <div
            className="flex gap-2  px-4 items-center w-fit"
          >
            <span className="font-bold text-2xl">Danh sách người tham gia</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-3"> <EventAttendeeList /></div>
       
      </div>
    </div>
  );
}

export default EventDetailView;
