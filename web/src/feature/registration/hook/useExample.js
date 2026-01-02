import React, { useEffect, useState } from "react";
import ExampleService from "../service/ExampleService";

export default function useExample() {
  const [example, setExample] = useState("");
  const fetchExample = async function name(params) {
    const res = await ExampleService.hello();
    setExample(res.message);
  };
  useEffect(() => {
    fetchExample();
  }, []);

  return { example };
}
