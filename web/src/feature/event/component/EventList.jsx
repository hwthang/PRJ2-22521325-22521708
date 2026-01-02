import React from "react";
import EventItem from "./EventItem";
import { Link } from "react-router-dom";

const EventList = ({ events }) => {
  return (
    <div className="flex flex-col gap-6">
      {events.map((event, index) => (
        <Link key={index} to={'1'}>
          <EventItem event={event} />
        </Link>
      ))}
    </div>
  );
};

export default EventList;
