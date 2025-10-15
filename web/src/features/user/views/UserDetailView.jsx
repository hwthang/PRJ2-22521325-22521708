import { FaChevronLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import UserDetail from "../components/UserDetail";

function UserDetailView() {
  const navigate = useNavigate()
  const id = useLocation().state

  return (
    <div className="h-full w-full relative z-10">
      <div className="h-fit w-full p-6 md:p-10 flex flex-col justify-center items-center">
        <div className="bg-white p-4 rounded-lg flex gap-2 flex-col h-full w-9/10">
          <div onClick={()=>navigate(-1)} className="active:bg-gray-100 p-1 rounded-full h-10 w-10 flex justify-center items-center">
            <FaChevronLeft size={26} />
          </div>
         <UserDetail id={id}/>
        </div>
      </div>
    </div>
  );
}

export default UserDetailView;
