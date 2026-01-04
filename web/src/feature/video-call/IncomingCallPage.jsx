import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base_url } from "../../utils/api";

const IncomingCallPage = () => {
  const [searchParams] = useSearchParams();
  const [fromUser, setFromUser] = useState();
  const fetchFromUser = async () => {
    const res = await fetch(
      `${base_url}/api/accounts/${searchParams.get("from")}`
    );
    const json = await res.json();
    console.log(json);
  };
  useEffect(() => {
    fetchFromUser();
  }, []);

  return <div>IncomingCallPage</div>;
};

export default IncomingCallPage;
