import Link from "next/link";
import React from "react";

const NotFount = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/home" className="underline">Return Home</Link>
    </div>
  );
};

export default NotFount;
