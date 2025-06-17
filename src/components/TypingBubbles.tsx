function TypingBubbles() {
  return (
    <div className="flex justify-start px-4">
      <div className="flex items-center space-x-1 p-2 bg-gray-200 rounded-lg max-w-fit animate-pulse">
        <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce" />
      </div>
    </div>
  );
}

export default TypingBubbles;
