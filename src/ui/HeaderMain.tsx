import { HeaderProps } from "../utils/models";

function HeaderMain({ children }: HeaderProps) {
  return (
    <header className="p-0">
      <div className=" flex items-end justify-end p-4">{children}</div>
    </header>
  );
}

export default HeaderMain;
