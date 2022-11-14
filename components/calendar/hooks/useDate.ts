import { useState,useMemo } from "react";
import { monthDays } from "../constant";
export default function useDate() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // month
  const desc = () => {
    let newMonth = month - 1;
    newMonth = newMonth === 0 ? 12 : newMonth;
    setMonth(newMonth);
  };

  // month
  const inc = () => {
    let newMonth = month + 1;
    newMonth = newMonth === 13 ? 1 : newMonth;
    setMonth(newMonth);
  };

  // month
  const date = useMemo(()=>{
    const year = new Date().getFullYear()
    // 
    let firstDay = new Date(`${month} 01 ${year}`).getDay() //   
    // 
    const monthDaysCount = monthDays(year)[month-1]

    // 1-7
    // 7 1 2 3 4 5 6
    const date = [
      // ["", "", "", "", "", "", 1],
      // [2, 3, 4, 5, 6, 7, 8],
      // [9, 10, 11, 12, 13, 14, 15],
      // [16, 17, 18, 19, 20, 21, 22],
      // [23, 24, 25, 26, 27, 28, 29],
      // [30, 31, "", "", "", "", ""],
    ]
    let cache = []
    for(let i = 1 ; i <= monthDaysCount ; i++){
      cache.push(i)
      // push
      if(firstDay === 6) {
        date.push(cache)
        cache = []
      }
      firstDay = firstDay % 7 + 1
    }
    // cache
    if(cache.length) date.push(cache)
    // 
    while(date[0].length !== 7){
      date[0].unshift('')
    }
    // 
    while(date[date.length-1].length !== 7){
      date[date.length-1].push('')
    }
    return date
  },[month]);
  return {
    date,
    month,
    inc,
    desc,
  };
}
