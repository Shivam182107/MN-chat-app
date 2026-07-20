import {
  BsChatSquareTextFill,
} from "react-icons/bs";
import { MdGroup, MdOutlineGroupAdd, MdCall } from "react-icons/md";

const HomeSkeleton = () => {
  return (
    <div className="flex w-full h-full">
      

      {/* Chat List */}
      <div className="md:w-[410px] flex-shrink-0 w-full bg-[#161717] text-white border-r border-black flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-3xl font-medium">Chats</h1>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#2E2F2F] rounded skeleton"></div>
            <div className="w-5 h-5 bg-[#2E2F2F] rounded skeleton"></div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 px-4">
          <div className="bg-[#2E2F2F] w-full h-11 rounded-full skeleton"></div>
        </div>

        {/* Chat List Skeleton */}
        <div className="flex-1 overflow-hidden px-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="p-3 flex items-center gap-3 rounded"
            >
              <div className="w-12 h-12 rounded-full skeleton"></div>

              <div className="flex-1">
                <div className="h-4 w-32 skeleton rounded mb-2"></div>
                <div className="h-3 w-48 skeleton rounded"></div>
              </div>

              <div className="h-3 w-10 skeleton rounded"></div>
            </div>
          ))}
        </div>

        {/* Mobile Bottom Nav */}
       <div className="md:hidden
                        bg-[#1D1F1F] flex items-center py-4
                        absolute bottom-0 w-full h-24 justify-evenly z-10
                        ">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="size-7 rounded-full skeleton shrink-0" />
          ))}
        </div>
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex flex-1 bg-[#101111] items-center justify-center">
        <div className="text-3xl lg:text-5xl font-medium text-[#2E2F2F] skeleton rounded"></div>
      </div>
    </div>
  );
};

export default HomeSkeleton;