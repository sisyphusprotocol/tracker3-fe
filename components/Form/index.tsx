import React, { memo, useState } from "react";
import style from "./style.module.css";

export type FormConfig = {
  name: string;
  label: string;
  type: FormType;
};

export type FormType =
  | "select"
  | "input"
  | "textarea"
  | "date"
  | "datetime-local";
export type FormProps = {
  config?: FormConfig[];
  data?: any;
  update?: React.Dispatch<React.SetStateAction<any>>;
  onClick?: any;
};

const Select = (props: {
  options: any[];
  value: any;
  onChange: (value: any) => void;
}) => {
  const { value, onChange } = props;
  const [show, setShow] = useState(false);
  return (
    <div className={style.select} onClick={() => setShow(!show)}>
      {value}
      <div
        className={style.optionsContainer}
        style={{ height: show ? `${props.options.length * 0.3}rem` : "0" }}
      >
        {props.options.map((item, index) => (
          <div
            className={style.options}
            onClick={() => onChange(item)}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const Form = (props: FormProps) => {
  const { data, update, config } = props;
  const getInput = (rowData: FormConfig) => {
    const { type } = rowData;
    if (type === "input") {
      return (
        <input
          type="text"
          onChange={(e) => update({ ...data, [rowData.name]: e.target.value })}
          value={data[rowData.name]}
        />
      );
    } else if (type === "date") {
      return (
        <input
          type="date"
          onChange={(e) => update({ ...data, [rowData.name]: e.target.value })}
          value={data[rowData.name]}
        />
      );
    } else if (type === "datetime-local") {
      return (
        <input
          type="datetime-local"
          onChange={(e) => update({ ...data, [rowData.name]: e.target.value })}
          value={data[rowData.name]}
        />
      );
    } else if (type === "textarea") {
      return (
        <textarea
          onChange={(e) => update({ ...data, [rowData.name]: e.target.value })}
          value={data[rowData.name]}
        />
      );
    } else if (type === "select") {
      return (
        <Select
          options={["0xA3F2ba60353b9af0A3524eE4a7C206D4335A9784"]}
          onChange={(value) => update({ ...data, [rowData.name]: value })}
          value={data[rowData.name]}
        />
      );
    }
  };
  return (
    <>
      {config?.map((item) => {
        return (
          <>
            <div className={style["title"]}>{item.label}</div>
            <div
              className={style["inputContainer"]}
              style={{ height: item.type === "textarea" ? ".7rem" : ".3rem" }}
            >
              {getInput(item)}
            </div>
          </>
        );
      })}
    </>
  );
};

export default memo(Form);
