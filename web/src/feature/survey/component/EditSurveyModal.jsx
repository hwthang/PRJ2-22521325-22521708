import React from 'react';
import CustomModal from "../../component/custom/CustomModal"; // Giả định bạn có component CustomModal
import EditSurveyForm from "./EditSurveyForm";
import { toast } from 'react-toastify';

const EditSurveyModal = ({ open, survey, onClose, onSubmit }) => {

    const handleEdit = async (payload) => {
        try {
            await onSubmit(payload);
            onClose(); // Đóng modal sau khi thành công
            toast.success("Cập nhật khảo sát thành công!", { position: "top-right" });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật khảo sát.";
            toast.error(errorMessage, { position: "top-right" });
        }
    }

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={`Chỉnh sửa: ${survey?.name || 'Khảo sát'}`}
        >
            <EditSurveyForm 
                survey={survey} // Truyền dữ liệu khảo sát để prefill form
                onSubmit={handleEdit}
            />
        </CustomModal>
    );
};

export default EditSurveyModal;