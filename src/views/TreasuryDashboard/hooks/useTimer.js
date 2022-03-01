import { useState, useEffect } from "react";

function sec2str(secs) {
  const hours = Math.floor(secs / 3600);
  const minuts = Math.floor(secs / 60) % 60;
  const sec = secs % 60;
  return `${hours.toString().padStart(2, "0")}:${minuts.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
}

export function useTimer(secs) {
  const [value, setValue] = useState(secs);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value == 0) setValue(1800);
      else setValue(value - 1);
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });
  return sec2str(value);
}
