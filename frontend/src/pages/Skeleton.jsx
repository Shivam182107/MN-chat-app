

const Skeleton = () => {
  return (
    <div className="h-[100dvh] flex flex-col bg-[#F7F5F3]">
      {/* Navbar */}
      <div className="h-16 bg-black flex items-center justify-between px-6">
        <div className="h-6 w-32 skeleton rounded"></div>

        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full skeleton shrink-0"></div>
          <div className="h-5 w-16 skeleton rounded"></div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 bg-[#1D1F1F] flex flex-col items-center justify-evenly py-5 shrink-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="size-8 rounded-full skeleton shrink-0"
            />
          ))}
        </div>

        {/* Chat List */}
        <div className="w-[410px] bg-[#161717] border-r border-[#252525] px-4 py-4 shrink-0">
          <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-28 skeleton rounded"></div>

            <div className="flex gap-3">
              <div className="size-6 rounded-full skeleton shrink-0"></div>
              <div className="size-6 rounded-full skeleton shrink-0"></div>
            </div>
          </div>

          {/* Search */}
          <div className="h-11 rounded-full skeleton mb-6"></div>

          {/* Chat Users */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-6">
              <div className="size-14 rounded-full skeleton shrink-0"></div>

              <div className="flex-1">
                <div className="h-4 w-28 skeleton mb-2 rounded"></div>
                <div className="h-3 w-40 skeleton rounded"></div>
              </div>

              <div className="h-3 w-12 skeleton rounded"></div>
            </div>
          ))}
        </div>

        {/* Message Area */}
        <div className="flex-1 bg-[#101111] p-6 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full skeleton shrink-0"></div>

              <div>
                <div className="h-4 w-32 skeleton mb-2 rounded"></div>
                <div className="h-3 w-16 skeleton rounded"></div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-8 rounded-full skeleton shrink-0"></div>
              <div className="size-8 rounded-full skeleton shrink-0"></div>
              <div className="size-8 rounded-full skeleton shrink-0"></div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5">
            <div className="h-12 w-56 rounded-xl skeleton"></div>

            <div className="h-12 w-72 rounded-xl skeleton ml-auto"></div>

            <div className="h-12 w-44 rounded-xl skeleton"></div>

            <div className="h-12 w-64 rounded-xl skeleton ml-auto"></div>

            <div className="h-12 w-52 rounded-xl skeleton"></div>

            <div className="h-12 w-80 rounded-xl skeleton ml-auto"></div>
          </div>

          {/* Input */}
          <div className="h-14 rounded-full skeleton mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;