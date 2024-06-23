import { useState } from 'react';

function readableTime(n: number) {
  let s = String(n);
  if (s.length === 1) {
    s = '0' + s;
  }
  return s;
}

export default function PortalInfo() {
  const [time, setTime] = useState(new Date());

  setTimeout(() => {
    setTime(new Date());
  }, 500);
  return (
    <div className="flex h-full items-center justify-end px-4 text-xs text-foreground">
      {readableTime(time.getHours())}:{readableTime(time.getMinutes())}
    </div>
  );
}
