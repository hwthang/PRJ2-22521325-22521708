import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AccountDetail from "../components/AccountDetail";
import CreateAccountForm from "../components/CreateAccountForm";

function CreateAcountView() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full relative z-10">
      <div className="h-fit w-full p-6 md:p-10 flex flex-col">
        <div className="bg-white p-4 rounded-lg flex gap-2 flex-col h-full">
          <div
            onClick={() => navigate(-1)}
            className="active:bg-gray-100 p-1 rounded-full h-10 w-10 flex justify-center items-center"
          >
            <FaChevronLeft size={26} />
          </div>
         <CreateAccountForm/>
        </div>
      </div>
    </div>
  );
}

export default CreateAcountView;
