"use client";

import React, { useEffect, useState } from "react";
import SessionItem, { ISessionDocument } from "./SessionItem";
import { deleteSessionById, getSessions } from "@/lib/api";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

const Sessions = () => {
  const [sessions, setSessions] = useState<ISessionDocument[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await getSessions();
        setSessions(data.sessions);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);


  const [onlineItems, offlineItems] = sessions
    .reduce(
      (
        acc: [ISessionDocument[], ISessionDocument[]],
        item: ISessionDocument
      ) => {
        if (item.isOnline) {
          acc[0].push(item);
        } else {
          acc[1].push(item);
        }
        return acc;
      },
      [[], []]
    )
    .map((array) => {
      const wonItemIndex = array.findIndex((item) => item.won);
      if (wonItemIndex !== -1) {
        const [wonItem] = array.splice(wonItemIndex, 1);
        array.unshift(wonItem);
      }
      return array;
    });

  const delelteSession = async (id: string) => {
    try {
      const { data } = await deleteSessionById(id);
      setSessions((prev) => prev.filter((i) => i._id !== id));
      toast({
        variant: "default",
        title: data.message,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: error.response?.data.message,
        });
      }
    }
  };

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
              <ul className="mb-2 flex flex-col gap-2">
                {onlineItems.map((item, i) => (
                  <li key={i}>
                    <SessionItem
                      session={item}
                      sessionDelete={delelteSession}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h5 className="text-base font-semibold">Other sessions</h5>
              <ul className="mt-4 flex flex-col gap-2">
                {offlineItems.map((item, i) => (
                  <li key={i}>
                    <SessionItem
                      session={item}
                      sessionDelete={delelteSession}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
