import React, { useState } from "react";
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion";
import SingleChoiceQuestion from "../components/SingleChoiceQuestion";
import TextQuestion from "../components/TextQuestion";


const MOCK_SURVEY = {
  title: "Khảo sát hoạt động chi đoàn ABC",
  startDate: "2025-11-01T08:00",
  endDate: "2025-11-07T18:00",
  questions: [
    {
      id: 1,
      type: "single",
      question: "Bạn có tham gia sự kiện cuối tuần vừa rồi không?",
      options: ["Có", "Không"],
    },
    {
      id: 2,
      type: "multiple",
      question: "Những hoạt động nào bạn quan tâm?",
      options: ["Hoạt động văn hóa", "Thể thao", "Tình nguyện", "Khác"],
    },
    {
      id: 3,
      type: "text",
      question: "Góp ý cải thiện hoạt động chi đoàn?",
      options: [],
    },
  ],
};

const DoSurveyPage = () => {
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    console.log("Kết quả khảo sát:", answers);
    alert("Cảm ơn bạn đã hoàn thành khảo sát!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col gap-6 mt-6">
      {/* Header Survey */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-blue-600">{MOCK_SURVEY.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Từ {new Date(MOCK_SURVEY.startDate).toLocaleString()} <br />
          đến {new Date(MOCK_SURVEY.endDate).toLocaleString()}
        </p>
      </div>

      {/* Render Questions */}
      <div className="flex flex-col gap-6">
        {MOCK_SURVEY.questions.map((q, index) => (
          <div key={q.id} className="p-4 bg-gray-50 rounded-xl border shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">
              {index + 1}. {q.question}
            </p>

            {q.type === "single" && (
              <SingleChoiceQuestion
                question=""
                options={q.options}
                value={answers[q.id] || null}
                onChange={(val) => handleAnswerChange(q.id, val)}
              />
            )}

            {q.type === "multiple" && (
              <MultipleChoiceQuestion
                question=""
                options={q.options}
                value={answers[q.id] || []}
                onChange={(val) => handleAnswerChange(q.id, val)}
              />
            )}

            {q.type === "text" && (
              <TextQuestion
                question=""
                value={answers[q.id] || ""}
                onChange={(val) => handleAnswerChange(q.id, val)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Gửi bài khảo sát
        </button>
      </div>
    </div>
  );
};

export default DoSurveyPage;
