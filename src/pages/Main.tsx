import Form from "../components/Form";
import ChatInstance from "../ui/ChatInstance";

function Main() {
  return (
    <main className="h-screen relative">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4">
          <ChatInstance />
        </div>

        <div className="sticky bottom-0 z-10">
          <Form />
        </div>
      </div>
    </main>
  );
}

export default Main;
