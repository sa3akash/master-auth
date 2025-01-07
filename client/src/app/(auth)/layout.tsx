import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-[450px] mx-auto h-auto ">{children}</div>
      </div>
    </div>
  );
}
