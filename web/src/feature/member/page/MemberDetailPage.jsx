import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../../utils/api";
import { ChevronLeft } from "lucide-react";
import MemberDetailForm from "../component/MemberDetailForm";
import EvaluationSection from "../component/evaluation/EvaluationSection";

const MemberDetailPage = () => {
  const { id } = useParams();

  const [rawMember, setRawMember] = useState({});

  const fetchMemberById = async () => {
    const { success, data } = await apiClient.get(`/api/members/${id}`);
    console.log(data)

    if (success) {
      const m = data?.member;

      setRawMember({
        id: m?._id,
        accountId: m?.accountId?._id,
        avatar: m?.accountId?.avatar?.path || "",
        username: m?.accountId?.username || "",
        email: m?.accountId?.email || "",
        phoneNumber: m?.accountId?.phoneNumber || "",
        fullName: m?.fullName || "",
        gender: m?.gender || "",
        dateOfBirth: m?.dateOfBirth || "",
        hometown: m?.hometown || "",
        address: m?.address || "",
        ethnicity: m?.ethnicity || "",
        religion: m?.religion || "",
        education: m?.education || "",
        qualification: m?.qualification || "",
        politicalTheory: m?.politicalTheory || "",
        memberCode: m?.memberCode || "",
        joinedAt: m?.joinedAt || "",
        position: m?.position || "",
        chapterId: m?.chapterId?._id || "",
        chapterName: m?.chapterId?.name || "",
      });
    }
  };

  useEffect(() => {
    fetchMemberById();
    console.log(rawMember)
  }, [rawMember.id]);

  return (
    <div className="p-6 flex flex-col gap-6">
      <Link
        to={-1}
        className="active:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center"
      >
        <ChevronLeft />
      </Link>

      <MemberDetailForm data={rawMember} />
      
      <EvaluationSection memberId={rawMember.id}/>
    </div>
  );
};

export default MemberDetailPage;
