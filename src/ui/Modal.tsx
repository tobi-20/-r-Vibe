// Modal.tsx
import { Props } from "../utils/models";
import Overlay from "./Overlay";

function Modal({ children, onClose }: Props) {
  return (
    <Overlay onClose={onClose}>
      <div className="relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-xl w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </Overlay>
  );
}

export default Modal;
