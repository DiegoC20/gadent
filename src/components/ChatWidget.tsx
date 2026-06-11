function ChatWidget() {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg transition-transform hover:scale-105 hover:bg-blue-600"
      aria-label="Abrir chat"
    >
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    </button>
  )
}

export default ChatWidget
