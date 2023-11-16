import type { EmailType } from "../pages";
import { emails } from "../pages";
import { EmptyEmails } from "./EmptyEmails.tsx";
import { Eye, Mail, PlusIcon, Search, Trash2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateSendingRate } from "../lib/email.ts";
import { StatBadge } from "./StatBadge.tsx";
import { EmailListItem } from "./EmailListItem.tsx";

type EmailListProps = {
  emails: EmailType[];
};

const MAX_SHOW_COUNT = 10;

export function EmailList(props: EmailListProps) {
  const { emails: defaultEmails } = props;
  const [emails, setEmails] = useState(defaultEmails);
  const [search, setSearch] = useState("");
  const [showCount, setShowCount] = useState(MAX_SHOW_COUNT);

  async function refreshEmails() {
    const response = await fetch("/emails");
    const newEmails = await response.json();

    if (JSON.stringify(newEmails) !== JSON.stringify(emails)) {
      setEmails(
        newEmails.map((email: EmailType) => {
          return {
            ...email,
            date: new Date(email.date),
          };
        }),
      );
    }
  }

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshEmails().then(() => null);
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const matchedEmails = emails
    .filter((email) => {
      return (
        !search ||
        email.from.includes(search) ||
        email.to.includes(search) ||
        email.subject.includes(search) ||
        email.text.includes(search)
      );
    })
    .sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });

  const sendingRate = calculateSendingRate(emails);
  return (
    <>
      <div className="relative">
        <Search
          size={"18px"}
          className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400"
        />
        <input
          type="text"
          className="border rounded-md py-2 pl-9 w-full focus:outline-0 focus:shadow-none"
          placeholder="Type to search .."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {matchedEmails.length > 0 && (
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <StatBadge
              icon={<Zap size={"13px"} />}
              label={"Max Send Rate"}
              value={`${sendingRate.maxRate}/sec`}
            />
            <StatBadge
              icon={<Mail size={"13px"} />}
              label={"Total"}
              value={`${emails.length} emails`}
            />
          </div>
          <div className="flex items-center text-sm gap-2">
            {search && (
              <span className="text-gray-400">
                {matchedEmails.length} matches
              </span>
            )}
            <button
              onClick={() => {
                if (
                  confirm("This will clear all the trap history. Are you sure?")
                ) {
                  fetch("/emails", {
                    method: "DELETE",
                  }).then(() => {
                    setShowCount(MAX_SHOW_COUNT);
                    setEmails([]);
                  });
                }
              }}
              className="flex border border-red-600 bg-red-50 items-center gap-1 font-normal text-xs py-1 px-2 rounded-full text-red-500 hover:bg-red-600 hover:border-red-600 hover:text-white"
            >
              <Trash2 size={"13px"} />
              Clear History
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-3">
        {matchedEmails.length === 0 && <EmptyEmails />}
        {matchedEmails.slice(0, showCount).map((email: EmailType, counter) => (
          <EmailListItem email={email} key={counter} />
        ))}
        {matchedEmails.length > showCount && (
          <button
            onClick={() => setShowCount(showCount + MAX_SHOW_COUNT)}
            className="bg-gray-700 w-full p-2 rounded-md text-white font-medium hover:bg-gray-900"
          >
            + Show More
          </button>
        )}
      </div>
    </>
  );
}
