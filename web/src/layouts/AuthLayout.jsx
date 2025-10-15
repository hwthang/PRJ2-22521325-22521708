import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative">
      <div className="max-w-screen min-h-screen h-full flex items-center justify-center overflow-y-auto  py-10">
        <div className="w-3/4 max-w-120 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
