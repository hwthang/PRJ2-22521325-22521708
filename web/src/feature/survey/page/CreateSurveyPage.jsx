import { ChevronLeft, Plus, Save, LayoutGrid } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateMetaDataSection from "../component/CreateMetaDataSection";
import CreateQuestionSection from "../component/CreateQuestionSection";
import apiClient, { base_url } from "../../../utils/api";

const CreateSurveyPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== META DATA ===== */
  const [surveyMeta, setSurveyMeta] = useState({
    chapterId: "",
    name: "",
    startedAt: "",
    endedAt: "",
  });

  /* ===== QUESTIONS ===== */
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      type: "text",
      question: "",
      options: [],
    },
  ]);

  /* ===== QUESTION HANDLERS ===== */
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type: "text",
        question: "",
        options: [],
      },
    ]);
  };

  const handleDeleteQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (id, data) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...data } : q))
    );
  };

  /* ===== CREATE SURVEY FLOW ===== */
  const handleCreateSurvey = async () => {
    try {
      setIsSubmitting(true);

      /* 1️⃣ CREATE SURVEY */
      const surveyRes = await fetch(`${base_url}/api/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId: JSON.parse(await localStorage.getItem("my_account"))
            .chapter._id,
          name: surveyMeta.name,
          startedAt: surveyMeta.startedAt,
          endedAt: surveyMeta.endedAt,
        }),
      });

      if (!surveyRes.ok) throw new Error("Tạo survey thất bại");

      const surveyJson = await surveyRes.json();
      console.log(surveyJson);
      const surveyId = surveyJson?.data?.survey?._id;

      if (!surveyId) throw new Error("Không lấy được surveyId");

      /* 2️⃣ CREATE QUESTIONS (SEQUENTIAL) */
      for (const q of questions) {
        const questionRes = await fetch(`${base_url}/api/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            surveyId,
            type: q.type,
            question: q.question,
            options: q.options ?? [],
          }),
        });

        if (!questionRes.ok) {
          throw new Error("Tạo câu hỏi thất bại");
        }
      }

      /* 3️⃣ SUCCESS */
      alert("🎉 Tạo khảo sát thành công");

      // reset
      setSurveyMeta({
        chapterId: "",
        name: "",
        startedAt: "",
        endedAt: "",
      });

      setQuestions([
        {
          id: Date.now(),
          type: "text",
          question: "",
          options: [],
        },
      ]);

      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra khi tạo khảo sát");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 relative">
      <Link
        to={-1}
        className="active:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center"
      >
        <ChevronLeft />
      </Link>
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-row items-center justify-end sticky top-10">
        <button
          onClick={handleCreateSurvey}
          disabled={isSubmitting}
          className=" w-fit flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold"
        >
          {isSubmitting ? (
            "Đang tạo..."
          ) : (
            <>
              <Save size={18} />
              Tạo khảo sát
            </>
          )}
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-4xl mx-auto px-6 flex flex-col gap-10">
        <CreateMetaDataSection value={surveyMeta} onChange={setSurveyMeta} />

        <div className="flex flex-col gap-8">
          {questions.map((q, index) => (
            <CreateQuestionSection
              key={q.id}
              index={index + 1}
              value={q}
              isDeletable={questions.length > 1}
              onChange={(data) => handleUpdateQuestion(q.id, data)}
              onDelete={() => handleDeleteQuestion(q.id)}
            />
          ))}
        </div>

        <button
          onClick={handleAddQuestion}
          className="w-full py-10 border-2 border-dashed rounded-2xl text-slate-400 hover:border-blue-400 hover:bg-blue-50 transition"
        >
          <Plus className="mx-auto mb-2" size={32} />
          <span className="font-bold text-blue-900">Thêm câu hỏi</span>
        </button>
      </div>
    </div>
  );
};

export default CreateSurveyPage;
