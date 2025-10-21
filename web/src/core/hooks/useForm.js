import { useState } from "react";

const useForm = () => {
  const [form, setForm] = useState({}); // nên khởi tạo {} thay vì null

  const handleChangeFieldInForm = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getFieldInForm = (name) => form[name];

  const resetForm = () => setForm({})

  return {
    form,
    handleChangeFieldInForm,
    getFieldInForm,
    resetForm
  };
};

export default useForm;

