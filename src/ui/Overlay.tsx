import { Props } from "../utils/models";

function Overlay({ children, onClose }: Props) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-screen backdrop-blur-3xl z-50 flex items-center justify-center"
      onClick={onClose} // Click outside to close
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export default Overlay;
