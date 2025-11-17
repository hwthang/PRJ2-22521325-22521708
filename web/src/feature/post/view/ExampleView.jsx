import React from "react";
import Example from "../component/Example";
import useExample from "../hook/useExample";
import ExcelReader from "../../../core/components/ExcelReader";

function ExampleView() {
  const { example } = useExample();
  return (
    <div className="h-1000">
      <Example example={example} />
      <ExcelReader/>
    </div>
  );
}

export default ExampleView;
