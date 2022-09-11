import moment from "moment";

export function tsToDate(ts: number) {
  moment.unix(ts);
}

export const weekMap = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thur",
  5: "Fri",
  6: "Sat",
};
