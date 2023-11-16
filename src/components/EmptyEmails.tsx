import { ExternalLink, Mailbox } from "lucide-react";

export function EmptyEmails() {
  return (
    <div className="mt-2 flex items-center  justify-center flex-col py-[50px] border rounded-md bg-white">
      <Mailbox size={64} className="text-gray-300" />
      <p className="mb-3 text-xl font-semibold">No emails found</p>
      <a
        href="#"
        className="flex gap-0.5 py-1.5 text-sm px-4 bg-gray-500 hover:bg-black text-white rounded-md"
      >
        Setup guide
        <ExternalLink
          size={16}
          className="inline-block ml-1 relative top-[1px]"
        />
      </a>
    </div>
  );
}
