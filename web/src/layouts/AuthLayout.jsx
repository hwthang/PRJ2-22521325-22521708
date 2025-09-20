import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen max-w-screen flex flex-col md:flex-row">
      <div className="flex-1 min-w-[50vw] bg-gray-300"></div>
      <div className="flex-1 flex w-full p-10 md:pt-10 md:px-20 border justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
