const Skeleton = () => {
  return (
    <div className="h-[100dvh] flex flex-col bg-[#F7F5F3]">

      {/* Navbar */}
      <div className="h-16 bg-black flex items-center justify-between px-6 shrink-0">
        <div className="h-6 w-32 skeleton rounded"></div>
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full skeleton shrink-0"></div>
          <div className="h-5 w-16 skeleton rounded"></div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── SIDEBAR ──*/}
        <div className="md:w-16 md:h-full md:flex-col md:relative md:justify-evenly
                        bg-[#1D1F1F] flex items-center py-4
                        absolute bottom-0 w-full h-24 justify-evenly z-10
                        md:static md:h-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="size-7 rounded-full skeleton shrink-0" />
          ))}
        </div>

        {/* ── CHAT LIST ──*/}
        <div className="md:w-[410px] w-full bg-[#161717] border-r border-[#252525]
                        flex flex-col shrink-0">

          {/* Header */}
          <div className="flex justify-between items-center py-4 px-4">
            <div className="h-9 w-28 skeleton rounded"></div>
            <div className="flex gap-3">
              <div className="size-6 rounded-full skeleton shrink-0"></div>
              <div className="size-6 rounded-full skeleton shrink-0"></div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 mb-4">
            <div className="h-11 rounded-full skeleton"></div>
          </div>

          {/* Chat user rows */}
          <div className="flex-1 overflow-hidden px-4 pb-28 md:pb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 mb-6">
                <div className="size-14 rounded-full skeleton shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-28 skeleton rounded mb-2"></div>
                  <div className="h-3 w-40 skeleton rounded"></div>
                </div>
                <div className="h-3 w-12 skeleton rounded md:block hidden"></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MESSAGE AREA ── Desktop only */}
        <div className="hidden md:flex flex-1 bg-[#101111] p-6 flex-col">

          {/* Chat header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full skeleton shrink-0"></div>
              <div>
                <div className="h-4 w-32 skeleton rounded mb-2"></div>
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