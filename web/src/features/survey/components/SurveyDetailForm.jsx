import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TextQuestion from "./TextQuestion";

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
      question: "Gợi ý cải thiện các hoạt động chi đoàn",
      options: [],
    },
  ],
};

const SurveyDetailForm = () => {
  const [form, setForm] = useState({
    title: MOCK_SURVEY.title,
    startDate: MOCK_SURVEY.startDate,
    endDate: MOCK_SURVEY.endDate,
  });

  const [questions, setQuestions] = useState(MOCK_SURVEY.questions);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        type: "single",
        question: "",
        options: [""],
      },
    ]);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (id, key, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const handleOptionChange = (id, index, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q
      )
    );
  };

  const handleAddOption = (id) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleSave = () => {
    console.log({ form, questions });
    alert("Khảo sát đã được lưu!");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col gap-6">
      {/* Thông tin chung */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Thông tin khảo sát
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Tên khảo sát</label>
            <input
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nhập tên khảo sát..."
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Thời gian kết thúc</label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div>
        <div className="flex items-center justify-between border-b pb-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Danh sách câu hỏi</h3>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus size={18} /> Thêm câu hỏi
          </button>
        </div>

        {questions.length === 0 && (
          <p className="text-gray-500 italic">Chưa có câu hỏi nào.</p>
        )}

        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-4 border rounded-xl shadow-sm bg-gray-50 relative"
            >
              <button
                onClick={() => handleRemoveQuestion(q.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex flex-col gap-2">
                <input
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, "question", e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <select
                  value={q.type}
                  onChange={(e) => handleQuestionChange(q.id, "type", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="single">Chọn 1 đáp án</option>
                  <option value="multiple">Chọn nhiều đáp án</option>
                  <option value="text">Tự luận</option>
                </select>
              </div>

              {q.type !== "text" && (
                <div className="mt-3 flex flex-col gap-2">
                  {q.options.map((opt, index) => (
                    <input
                      key={index}
                      value={opt}
                      onChange={(e) => handleOptionChange(q.id, index, e.target.value)}
                      placeholder={`Lựa chọn ${index + 1}`}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  ))}
                  <button
                    onClick={() => handleAddOption(q.id)}
                    className="text-blue-500 text-sm hover:underline w-fit"
                  >
                    + Thêm lựa chọn
                  </button>
                </div>
              )}

              <div className="mt-4">
                {q.type === "single" && (
                  <SingleChoiceQuestion
                    question={q.question || "(Câu hỏi mẫu)"}
                    options={q.options.filter((o) => o.trim() !== "")}
                    value={null}
                    onChange={() => {}}
                  />
                )}
                {q.type === "multiple" && (
                  <MultipleChoiceQuestion
                    question={q.question || "(Câu hỏi mẫu)"}
                    options={q.options.filter((o) => o.trim() !== "")}
                    value={[]}
                    onChange={() => {}}
                  />
                )}
                {q.type === "text" && (
                  <TextQuestion
                    question={q.question || "(Câu hỏi mẫu)"}
                    value={""}
                    onChange={() => {}}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Lưu khảo sát
        </button>
      </div>
    </div>
  );
};

export default SurveyDetailForm;
