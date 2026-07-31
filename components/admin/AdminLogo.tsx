import React from "react";
import Image from "next/image";

export default function AdminLogo() {
  return (
    <Image
      src="/assets/logo/kj-favicon-transparent.png"
      alt="Kerala Jewellers"
      width={28}
      height={28}
      style={{ borderRadius: "50%" }}
      priority
    />
  );
}
