function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-orange-800 via-orange-600 to-orange-700 shadow-xl relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M12%2018c-3.309%200-6-2.691-6-6s2.691-6%206-6%206%202.691%206%206-2.691%206-6%206zm0-2c2.206%200%204-1.794%204-4s-1.794-4-4-4-4%201.794-4%204%201.794%204%204%204z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        
        {/* Light rays animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="light-ray absolute -inset-10 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 rotate-12 transform-gpu"></div>
        </div>

        <div className="container mx-auto py-3 relative flex items-center justify-center px-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Logo container with glossy effect */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-60 blur-sm"></div>
              <div className="rounded-full bg-white/10 backdrop-blur-sm p-0.5 shadow-lg relative">
                <img 
                  src="/Picture1.png" 
                  alt="Vishnuji Ki Rasoi Logo" 
                  className="h-[60px] sm:h-[64px] md:h-[72px] w-auto object-contain rounded-full logo-animation"
                />
              </div>
            </div>
            
            {/* Restaurant name with improved typography */}
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-white text-center tracking-wide restaurant-title" 
                  style={{ 
                    fontFamily: "'Edwardian Script ITC', 'Segoe Script', cursive",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.2)",
                    letterSpacing: "0.05em",
                    fontWeight: "500"
                  }}>
                Vishnuji Ki Rasoi
              </h1>
              <p className="text-white/80 text-xs sm:text-sm tracking-wider text-center font-light">
                ORDER MANAGEMENT SYSTEM
              </p>
            </div>
          </div>
          
          {/* Connection status indicator */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs text-white/70 hidden sm:inline-block">Online</span>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
