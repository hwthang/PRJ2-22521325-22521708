import { useState } from "react";

const useForm = (init) => {
  const [form, setForm] = useState(init || {}); // nên khởi tạo {} thay vì null

  const handleChangeFieldInForm = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getFieldInForm = (name) => form[name];

  const resetForm = () => setForm(init || {});

  return {
    form,
    setForm,
    handleChangeFieldInForm,
    getFieldInForm,
    resetForm,
  };
};

export default useForm;
