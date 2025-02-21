export function TopBar() {
  return (
    <div className="bg-black text-white py-2 px-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <p className="text-sm text-center flex-1">
          Nordy Club members earn 3X the points on beauty!
        </p>
        <button className="hidden md:flex items-center gap-2 text-sm border border-white/20 px-4 py-1.5 rounded hover:bg-white/10">
          <img src="/IN.gif" alt="India" className="w-4 h-4 rounded-full" />
          <span>India</span>
        </button>
      </div>
    </div>
  )
} 