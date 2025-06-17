import { HeaderProps } from "../utils/models";

function HeaderSide({ children }: HeaderProps) {
  return (
    <header className="p-0">
      <div className=" flex items-end justify-end">{children}</div>
    </header>
  );
}

export default HeaderSide;
