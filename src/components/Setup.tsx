import {
  type HTMLProps,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { isSafari } from "../lib/browser.ts";

type EmailFrameProps = {
  onClose: () => void;
} & HTMLProps<HTMLIFrameElement>;

export function Setup(props: EmailFrameProps) {
  const { onClose } = props;

  const [bounceUrl, setBounceUrl] = useState(
    localStorage.getItem("bounceUrl") || "",
  );
  const [complaintUrl, setComplaintUrl] = useState(
    localStorage.getItem("complaintUrl") || "",
  );
  const [deliveryUrl, setDeliveryUrl] = useState(
    localStorage.getItem("deliveryUrl") || "",
  );

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", keyDownListener);

    return () => {
      window.removeEventListener("keydown", keyDownListener);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-50 backdrop-blur-sm bg-gray-950/80"
        onClick={() => {
          onClose();
        }}
      />
      <div className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white sm:rounded-lg md:w-full w-full min-w-0 max-w-[680px] overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-gray-200">
          <h1 className="text-2xl mb-3 font-semibold">Setup Hooks</h1>

          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();

              localStorage.setItem("bounceUrl", bounceUrl);
              localStorage.setItem("complaintUrl", complaintUrl);
              localStorage.setItem("deliveryUrl", deliveryUrl);

              onClose();
            }}
          >
            <div>
              <label
                className="mb-1 text-sm text-gray-500 block"
                htmlFor="bounceUrl"
              >
                Bounce URL
              </label>
              <input
                type="url"
                required
                onChange={(e) => {
                  setBounceUrl(e.target.value);
                }}
                value={bounceUrl}
                className={"w-full p-1 border rounded-md"}
                placeholder="Bounce URL"
              />
            </div>
            <div>
              <label
                className="mb-1 text-sm text-gray-500 block"
                htmlFor="bounceUrl"
              >
                Complaint URL
              </label>
              <input
                type="url"
                required
                onChange={(e) => {
                  setComplaintUrl(e.target.value);
                }}
                value={complaintUrl}
                className={"w-full p-1 border rounded-md"}
                placeholder="Complaint URL"
              />
            </div>
            <div>
              <label
                className="mb-1 text-sm text-gray-500 block"
                htmlFor="bounceUrl"
              >
                Delivery URL
              </label>
              <input
                type="url"
                required
                onChange={(e) => {
                  setDeliveryUrl(e.target.value);
                }}
                value={deliveryUrl}
                className={"w-full p-1 border rounded-md"}
                placeholder="Delivery URL"
              />
            </div>
            <button
              type={"submit"}
              className="p-1.5 bg-black text-white rounded-md"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
