import Image from "next/image";
import arrow from "./arrow.svg";
export function BackSpace() {
  return (
    <div
      onClick={() => {
        window.history.back();
      }}
      className="relative w-2 h-2 overflow-hidden"
    >
      <Image sizes="fill" src={arrow} alt="" />
    </div>
  );
}
