import React, { memo, useState } from "react";
import style from "./style.module.css";
import Form, { FormConfig } from "../../components/Form";
import Detail from "../../components/Detail";

// eslint-disable-next-line react/display-name
const index = memo(() => {
  const [metadata, setMetadata] = useState({
    name: "",
    desc: "",
    days: "",
    token: "",
    amount: "",
    mode: "",
  });
  const formConfig: FormConfig[] = [
    {
      type: "input",
      name: "name",
      label: "Name",
    },
    {
      type: "textarea",
      name: "desc",
      label: "Description",
    },
    {
      type: "input",
      name: "days",
      label: "Days(everyday)",
    },
    {
      type: "select",
      name: "token",
      label: "Token",
    },
    {
      type: "input",
      name: "amount",
      label: "Staking amount",
    },
    {
      type: "select",
      name: "mode",
      label: "Mode",
    },
  ];
  return (
    <div className={style.bg}>
      <div className={style.outer}>
        {/* <Form config={formConfig} data={metadata} update={setMetadata} /> */}
      </div>
    </div>
  );
});

export default index;
