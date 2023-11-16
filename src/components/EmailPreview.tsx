import { type HTMLProps, type RefObject, useEffect, useRef } from "react";
import { isSafari } from "../lib/browser.ts";

type EmailFrameProps = {
  html: string;
  onClose: () => void;
} & HTMLProps<HTMLIFrameElement>;

function renderHTMLToIFrame(ref: RefObject<HTMLIFrameElement>, html: string) {
  if (!ref.current) {
    return;
  }

  const iframeDocument = ref.current.contentDocument;
  if (!iframeDocument) {
    return;
  }

  iframeDocument.body.innerHTML = html;
}

export function EmailPreview(props: EmailFrameProps) {
  const { html, onClose, ...defaultProps } = props;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isSafari() || !iframeRef.current) {
      return;
    }

    renderHTMLToIFrame(iframeRef, html);
  }, [html]);

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
      <div className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white sm:rounded-lg md:w-full min-h-[50vh] w-full min-w-0 max-w-[680px] overflow-hidden p-0">
        <iframe
          className="w-full h-full bg-white"
          ref={iframeRef}
          srcDoc={""}
          onLoad={(e) => {
            if (isSafari()) {
              return;
            }

            renderHTMLToIFrame(iframeRef, html);
          }}
        />
      </div>
    </>
  );
}
