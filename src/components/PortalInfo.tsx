import { useState } from "react";

function readableTime(n: number) {
  let s = String(n);
  if (s.length === 1) {
    s = "0" + s;
  }
  return s;
}

export default function PortalInfo() {
  const [time, setTime] = useState(new Date());

  setTimeout(() => {
    setTime(new Date());
  }, 500);
  return (
    <div className="flex text-neutral-200 items-center justify-end px-4 h-full text-xs">
      {readableTime(time.getHours())}:{readableTime(time.getMinutes())}
    </div>
  );
}
