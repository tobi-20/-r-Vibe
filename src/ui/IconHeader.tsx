import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BsLayoutTextSidebar, BsPencilSquare } from "react-icons/bs";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { createConversation } from "../services/apiConversations";
import SearchBox from "./SearchBox";
import Modal from "./Modal";

interface IconHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function IconHeader({
  isCollapsed,
  setIsCollapsed,
  isOpen,
  setIsOpen,
}: IconHeaderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: handleCreateConversation, isPending } = useMutation({
    mutationFn: createConversation,
    onSuccess: (id: string) => {
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
    <div className="w-full">
      <div className="flex items-center justify-between h-12 px-2">
        {/* Left section - Toggle button */}
        <div className="flex items-center">
          <button
            className="p-2 rounded-lg hover:bg-[var(--color-hover-history)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <BsLayoutTextSidebar className="h-5 w-5 text-[var(--color-text-primary)]" />
          </button>
        </div>

        {/* Center section - Brand (when collapsed) */}
        {isCollapsed && (
          <div className="flex-1 flex justify-center">
            <button
              className="text-lg font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-text-accent)] transition-colors duration-200"
              onClick={handleBack}
              title="Go to home"
            >
              YC
            </button>
          </div>
        )}

        {/* Right section - Action buttons */}
        <div
          className={`flex items-center gap-2 ${isCollapsed ? "" : "flex-1 justify-end"}`}
        >
          {!isCollapsed && (
            <>
              <button
                className="p-2 rounded-lg hover:bg-[var(--color-hover-history)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Open search"
                title="Search conversations"
              >
                <HiMagnifyingGlass className="h-5 w-5 text-[var(--color-text-primary)]" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-[var(--color-hover-history)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleCreateConversation()}
                disabled={isPending}
                aria-label="Create new conversation"
                title="Start new conversation"
              >
                <BsPencilSquare className="h-5 w-5 text-[var(--color-text-primary)]" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Brand section (when expanded) */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-t border-[var(--color-border)]">
          <button
            className="text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-text-accent)] transition-colors duration-200 focus:outline-none focus:underline"
            onClick={handleBack}
            title="Go to home"
          >
            Ọ̀rọ̀Vibe
          </button>
        </div>
      )}

      {/* Search Modal */}
      {isOpen && !isCollapsed && (
        <Modal onClose={() => setIsOpen(false)}>
          <SearchBox />
        </Modal>
      )}
    </div>
  );
}

export default IconHeader;
