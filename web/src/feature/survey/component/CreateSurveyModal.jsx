import React from 'react';
import CustomModal from "../../component/custom/CustomModal"; // Giả định bạn có component CustomModal
import EditSurveyForm from "./EditSurveyForm";
import { toast } from 'react-toastify';

const CreateSurveyModal = ({ open, onClose, onSubmit }) => {
    
    const handleCreate = async (payload) => {
        try {
            await onSubmit(payload);
            toast.success("Tạo khảo sát mới thành công!", { position: "top-right" });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi tạo khảo sát.";
            toast.error(errorMessage, { position: "top-right" });
        }
    }

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title="Tạo Khảo sát Mới"
        >
            <EditSurveyForm 
                // Không truyền 'survey' vào, form sẽ hoạt động ở chế độ tạo mới
                onSubmit={handleCreate}
            />
        </CustomModal>
    );
};

export default CreateSurveyModal;