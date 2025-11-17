import React from "react";
import CustomInput from "../../chapter/shared/CustomInput";
import { ArrowDownWideNarrow, RotateCcw, Search } from "lucide-react";
import CustomBox from "../../chapter/shared/CustomBox";
import { BiAddToQueue } from "react-icons/bi";
import { Link } from "react-router-dom";
import { STATUS_MAP } from "../../../utils/map";
import MemberSearchBar from "../component/MemberSearchBar";
import MemberItem from "../component/MemberItem";

function MemberListView() {
  return (
    <div>
    <MemberSearchBar/>
     <div className="grid gap-4 md:gap-6 px-6 md:px-10 pb-10 max-w-6xl mx-auto">
      <Link to={'/members/1'}> <MemberItem/></Link>
       
      </div>
    </div>
  );
}

export default MemberListView;
