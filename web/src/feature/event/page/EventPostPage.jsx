import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import EventService from "../service/EventService";

import EventSidebar from "../component/EventSideBar";
import EventDetail from "../component/EventDetail";

const EventPostPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const eventIdFromQuery = searchParams.get("id");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE CHO FILTER (Dựa trên component mẫu của bạn) ---
  const [searchText, setSearchText] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [interaction, setInteraction] = useState({
    isLiked: false,
    likeCount: 0,
  });

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const res = await EventService.fetchAllEventForMember();
        console.log(res);
        setEvents(res || []);

        if (res?.length > 0) {
          const id = new URLSearchParams(window.location.search).get("id");
          const found = res.find((e) => e._id === id) || res[0];
          setSelectedEvent(found);
          setInteraction({
            isLiked: !!found.isLiked,
            likeCount: found.postId?.likes ?? 0,
          });
        }
      } catch (error) {
        toast.error("Không thể tải danh sách sự kiện");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);
  const handleLike = async () => {
    if (!selectedEvent?.postId?._id) return;

    const postId = selectedEvent.postId._id;
    const prevLiked = interaction.isLiked;

    // ✅ Optimistic update (UI phản hồi ngay)
    setInteraction((prev) => ({
      isLiked: !prev.isLiked,
      likeCount: prev.likeCount + (prevLiked ? -1 : 1),
    }));

    try {
      // 🔥 Call API đúng theo service
      if (prevLiked) {
        await EventService.unlikeEvent(postId);
      } else {
        await EventService.likeEvent(postId);
      }

      // ✅ Sync selectedEvent
      setSelectedEvent((prev) => ({
        ...prev,
        isLiked: !prevLiked,
        postId: {
          ...prev.postId,
          likes: (prev.postId?.likes || 0) + (prevLiked ? -1 : 1),
        },
      }));

      // ✅ Sync list events
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === selectedEvent._id
            ? {
                ...ev,
                isLiked: !prevLiked,
                postId: {
                  ...ev.postId,
                  likes: (ev.postId?.likes || 0) + (prevLiked ? -1 : 1),
                },
              }
            : ev
        )
      );
    } catch (error) {
      // ❌ Rollback nếu lỗi
      setInteraction((prev) => ({
        isLiked: prevLiked,
        likeCount: prev.likeCount + (prevLiked ? 1 : -1),
      }));

      toast.error("Không thể thực hiện thao tác Like");
    }
  };

  // --- LOGIC LỌC SỰ KIỆN (Dùng useMemo để tối ưu) ---
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // 1. Lọc theo Search Text (Tên hoặc Địa điểm)
      if (searchText) {
        const text = searchText.toLowerCase();
        const matchesName = e.name?.toLowerCase().includes(text);
        const matchesVenue = e.venue?.toLowerCase().includes(text);
        if (!matchesName && !matchesVenue) return false;
      }

      // 2. Lọc theo Topics (Tags)
      // Giả sử backend trả về mảng tag strings trong e.tags hoặc e.topics
      if (selectedTopics.length > 0) {
        const eventTags = e.tags || []; // Ví dụ: ["volunteer", "technology"]
        if (!eventTags.some((tag) => selectedTopics.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  }, [events, searchText, selectedTopics]);

  // Đồng bộ hóa khi chọn từ sidebar hoặc URL
  useEffect(() => {
    if (events.length > 0 && eventIdFromQuery) {
      const found = events.find((e) => e._id === eventIdFromQuery);
      if (found) {
        setSelectedEvent(found);
        console.log(12);
        console.log(found);
        setInteraction({
          isLiked: !!found.isLiked,
          likeCount: found.postId?.likes ?? 0,
        });
      }
    }
  }, [eventIdFromQuery, events]);

  const handleSelectEvent = (event) => {
    navigate({ pathname: location.pathname, search: `?id=${event._id}` });
  };

  const handleRegister = async (eventId) => {
    try {
      await EventService.registerEvent(eventId);
      toast.success("Đăng ký thành công!");
      setSelectedEvent((prev) => ({ ...prev, hadRegistered: true }));
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId ? { ...ev, hadRegistered: true } : ev
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <EventSidebar
        events={filteredEvents} // Truyền danh sách đã lọc
        selectedId={selectedEvent?._id}
        onSelect={handleSelectEvent}
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 flex justify-center bg-slate-50/50">
        {selectedEvent ? (
          <EventDetail
            event={selectedEvent}
            interaction={interaction}
            onLike={handleLike} // ✅ dùng logic mới
            onRegister={handleRegister}
            commentOpen={commentOpen}
            setCommentOpen={setCommentOpen}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 opacity-50 h-full">
            <ShieldCheck size={100} strokeWidth={1} />
            <p className="font-bold uppercase text-xs">
              Không tìm thấy sự kiện phù hợp
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EventPostPage;
