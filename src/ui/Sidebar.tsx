import { HiMagnifyingGlass } from "react-icons/hi2";
import { BsLayoutTextSidebar, BsPencilSquare } from "react-icons/bs";
import HeaderSide from "./HeaderSide";
import History from "./History";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";
import SearchBox from "./SearchBox";
import { createConversation } from "../services/apiConversations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SidebarProps } from "../utils/models";

function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: handleCreateConversation } = useMutation({
    mutationFn: createConversation,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("New conversation created");
      navigate(`/chat/${id}`);
    },
    onError: () => {
      toast.error("Failed to create conversation");
    },
  });

  function handleBack() {
    navigate("/");
  }

  return (
    <div
      className={`grid_span_1 overflow-hidden bg-[var(--color-bg-sidebar)] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* HeaderSide persists regardless of isCollapsed */}
      <HeaderSide>
        <div className="w-full h-auto flex items-center justify-between">
          <div className="px-4">
            <button
              className="h-auto w-auto"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle sidebar"
            >
              <BsLayoutTextSidebar className="h-5 w-5" />
            </button>
          </div>

          {/* Show icons only when not collapsed, but keep container for layout */}
          <div
            className={`flex items-center justify-around px-4 ${isCollapsed ? "hidden" : "flex"}`}
          >
            <button
              className="h-auto w-auto p-4 cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Open search"
            >
              <HiMagnifyingGlass className="h-5 w-5" />
            </button>
            <button
              className="cursor-pointer"
              onClick={() => handleCreateConversation()}
              aria-label="Create new conversation"
            >
              <BsPencilSquare className="h-5 w-5" />
            </button>
          </div>
        </div>
      </HeaderSide>

      {/* Collapsible content */}
      <div className={isCollapsed ? "hidden" : "block"}>
        <div>
          <button className="cursor-pointer" onClick={handleBack}>
            <h1 className="px-4 hover:bg-[var(--color-hover-history)] p-1 inline-block">
              Ọ̀rọ̀Vibe
            </h1>
          </button>
          {isOpen && (
            <Modal onClose={() => setIsOpen(false)}>
              <SearchBox />
            </Modal>
          )}
        </div>
        <div>
          <h1 className="px-4 text-xl">History</h1>
          <History />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
