import LoadingIcon from "../icons/loading.svg";
import CloseIcon from "../icons/close.svg";
import { createRoot } from "react-dom/client";

export function Popover(props: {
  children: JSX.Element;
  content: JSX.Element;
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className={'popover'}>
      {props.children}
      {props.open && (
        <div className={"popover-content"}>
          <div className={"popover-mask"} onClick={props.onClose}></div>
          {props.content}
        </div>
      )}
    </div>
  );
}

export function Card(props: { children: JSX.Element[]; className?: string }) {
  return (
    <div className='card'>{props.children}</div>
  );
}

export function List(props: { children: JSX.Element[] | JSX.Element }) {
  return (
    <div className="bg-white rounded border shadow-sm">{props.children}</div>
  );
}

export function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingIcon />
    </div>
  );
}

interface ModalProps {
  title: string;
  children?: JSX.Element;
  actions?: JSX.Element[];
  onClose?: () => void;
}
export function Modal(props: ModalProps) {
  return (
    <div className={"modal-container"}>
      <div className={"modal-header"}>
        <div className={"modal-title"}>{props.title}</div>

        <div className={"modal-close-btn"} onClick={props.onClose}>
          <CloseIcon />
        </div>
      </div>

      <div className={"modal-content"}>{props.children}</div>

      <div className={"modal-footer"}>
        <div className={"modal-actions"}>
          {props.actions?.map((action, i) => (
            <div key={i} className={"modal-action"}>
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function showModal(props: ModalProps) {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    props.onClose?.();
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) {
      closeModal();
    }
  };

  root.render(<Modal {...props} onClose={closeModal}></Modal>);
}
