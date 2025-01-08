import React from "react";
import SessionItem from "./SessionItem";

const Sessions = () => {
  return (
    <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5">
      <div className="rounded-[10px] p-6">
        <h3 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1">
          Sessions
        </h3>
        <p className="mb-6 max-w-xl text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Sessions are the devices you are using or that have used your Squeezy
          These are the sessions where your account is currently logged in. You
          can log out of each session.
        </p>

        <div className="rounded-t-xl max-w-xl">
          <div>
            <h5 className="text-base font-semibold">Current active session</h5>
            <p className="mb-6 text-sm text-[#0007149f] dark:text-gray-100">
              You’re logged into this Squeezy account on this device and are
              currently using it.
            </p>
          </div>
          <div className="w-full">
            <div className="w-full py-2 border-b pb-5">
              <SessionItem
                id=""
                deviceName="Windows"
                date="22 hours ago"
                isCurrent={true}
              />
            </div>
            <div className="mt-4">
              <h5 className="text-base font-semibold">Other sessions</h5>
              <ul className="mt-4">
                <li>
                  <SessionItem id="" deviceName="Android" date="22 hours ago" />
                </li>
                <li>
                  <SessionItem id="" deviceName="Android" date="22 hours ago" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;