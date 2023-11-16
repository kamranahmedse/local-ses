import { Eye } from "lucide-react";
import type {EmailType} from "../pages";

type EmailListItemProps = {
  email: EmailType;
};
export function EmailListItem(props: EmailListItemProps) {
  const { email } = props;

  return (
    <div
      className="border rounded-md overflow-hidden relative bg-white"
    >
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
            <button className="underline underline-offset-2">
              {email.subject}
            </button>
            <button className="flex items-center gap-1 font-normal text-xs py-1 px-2 bg-gray-500 rounded-md text-white hover:bg-black">
              <Eye size={"13px"} />
              Preview
            </button>
          </div>
        </div>
      </div>

      <span className="absolute top-2 right-4 text-sm text-gray-400">
        {email.date.toLocaleString()}
      </span>
    </div>
  );
}
