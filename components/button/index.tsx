import classNames from "classnames";
import * as React from "react";
import styles from "./index.module.css";
interface IButton {
  className?: any;
  children?: React.ReactNode;
  onClick?: any;
  style?: any;
}

function Button(props: IButton) {
  const classes = classNames(styles.button, props.className);
  return (
    <div onClick={props.onClick} className={classes} style={props.style}>
      {props.children}
    </div>
  );
}

export default Button;
