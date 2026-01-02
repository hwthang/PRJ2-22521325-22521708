import EventList from "../component/EventList";
import EventSearchBar from "../component/EventSearchBar";
import { useEventList } from "../hook/useEventList";


const EventListView = () => {
  const {
    events,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    tagFilter,
    setTagFilter,
    sortOrder,
    setSortOrder,
  } = useEventList();

  return (
    <div className="p-6 md:p-10 flex flex-col gap-6 md:gap-10">
      {/* Search & Filter */}
      <div>
        <EventSearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedStatus={statusFilter}
          setSelectedStatus={setStatusFilter}
          selectedTags={tagFilter}
          setSelectedTags={setTagFilter}
        />
      </div>

      {/* List sự kiện đã lọc */}
      <div>
        <EventList events={events} />
      </div>
    </div>
  );
};

export default EventListView;
