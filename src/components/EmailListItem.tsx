import { ChevronDown, Eye } from "lucide-react";
import type { EmailType } from "../pages";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "../hooks/use-outside-click.ts";

type EmailListItemProps = {
  email: EmailType;
  onPreview: (email: EmailType) => void;
};

type AllowedActions =
  | "soft_bounce"
  | "hard_bounce"
  | "complaint"
  | "delivery"
  | "click";
export function EmailListItem(props: EmailListItemProps) {
  const { email, onPreview } = props;

  const optionsRef = useRef<HTMLDivElement>(null);

  const [urls, setUrls] =
    useState<Record<Exclude<AllowedActions, "click">, string>>();

  useOutsideClick(optionsRef, () => {
    setIsOptionsOpen(false);
  });

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    setUrls({
      soft_bounce: localStorage.getItem("bounceUrl")!,
      hard_bounce: localStorage.getItem("bounceUrl")!,
      complaint: localStorage.getItem("complaintUrl")!,
      delivery: localStorage.getItem("deliveryUrl")!,
    });
  }, []);

  async function handleAction(action: string) {
    const response = await fetch("/hooks", {
      method: "POST",
      body: JSON.stringify({
        id: email.id,
        action,
        urls,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const actions = [
    "soft_bounce",
    "hard_bounce",
    "complaint",
    "delivery",
    "click",
  ];

  return (
    <div className="border rounded-md relative bg-white">
      <div className="px-4 border-b py-2 flex flex-col gap-0.5">
        <div className="flex items-center">
          <span className="uppercase text-xs mr-2 text-gray-400 block w-[70px] relative top-[0.5px]">
            From
          </span>
          {email.from}
        </div>
        <div className="flex items-center">
          <span className="uppercase text-xs mr-2 text-gray-400 block w-[70px] relative top-[0.5px]">
            To
          </span>
          {email.to}
        </div>
      </div>
      <div className="px-4 py-2 text-black font-semibold">
        <div className="text-base flex items-center">
          <span className="uppercase text-xs mr-2 text-gray-400 block w-[70px] relative top-[0.5px]">
            Subject
          </span>
          <div className="flex justify-between items-center flex-grow">
            <button
              onClick={() => {
                onPreview(email);
              }}
              className="underline underline-offset-2"
            >
              {email.subject}
            </button>
            <div className="flex items-center gap-1">
              <div className={"relative"} ref={optionsRef}>
                <button
                  onClick={() => {
                    setIsOptionsOpen(!isOptionsOpen);
                  }}
                  className="flex items-center gap-1 font-normal text-xs py-1 px-2 bg-gray-500 rounded-md text-white hover:bg-black"
                >
                  <ChevronDown size={"13px"} />
                  Options
                </button>
                {isOptionsOpen && (
                  <div className="absolute top-0 right-0 bg-white border border-gray-200 rounded-md shadow-md z-[9999] w-[140px]">
                    <div className="flex items-start flex-col gap-1">
                      {actions.map((action) => {
                        return (
                          <button
                            key={action}
                            onClick={() => handleAction(action)}
                            className="capitalize w-full block text-left text-gray-600 hover:bg-gray-200 hover:text-black px-4 py-2"
                          >
                            {action.replace("_", " ")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  onPreview(email);
                }}
                className="flex items-center gap-1 font-normal text-xs py-1 px-2 bg-gray-500 rounded-md text-white hover:bg-black"
              >
                <Eye size={"13px"} />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <span className="absolute top-2 right-4 text-sm text-gray-400">
        {email.date.toLocaleString()}
      </span>
    </div>
  );
}
