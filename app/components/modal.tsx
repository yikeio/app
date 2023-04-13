import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  show: boolean;
  children: ReactNode;
  noPadding?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  onClose,
  show = false,
  children,
  size = "md",
  noPadding = false,
}: ModalProps) {
  let panelClassNames =
    "inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl -mt-20";
  if (!noPadding) {
    panelClassNames = panelClassNames + " p-6";
  }

  if (size === "sm") {
    panelClassNames = panelClassNames + " max-w-sm";
  } else if (size === "md") {
    panelClassNames = panelClassNames + " max-w-xl";
  } else if (size === "lg") {
    panelClassNames = panelClassNames + " max-w-2xl";
  } else if (size === "xl") {
    panelClassNames = panelClassNames + " max-w-4xl";
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity- scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity- scale-95"
          >
            <div className={panelClassNames}>{children}</div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
