import classNames from "classnames";
import * as React from "react";
import styles from "./index.module.css";
import ReactLoading from "react-loading";
interface IButton {
  className?: any;
  children?: React.ReactNode;
  onClick?: any;
  style?: any;
  loading?: boolean;
}

function Button(props: IButton) {
  const classes = classNames(styles.button, props.className);

  if (props.loading) {
    return (
      <div className={classes}>
        <ReactLoading type="bubbles" />
      </div>
    );
  }

  return (
    <div onClick={props.onClick} className={classes} style={props.style}>
      {props.children}
    </div>
  );
}

export default Button;
