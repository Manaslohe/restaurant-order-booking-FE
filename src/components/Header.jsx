function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
        <div className="container mx-auto py-2 relative flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 sm:gap-2">
            <div className="flex-shrink-0">
              <img 
                src="/Picture1.png" 
                alt="Vishnuji Ki Rasoi Logo" 
                className="h-20 sm:h-24 md:h-28 w-auto shadow-lg header-logo"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white text-center tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] restaurant-title" 
                style={{ 
                  fontFamily: "'Edwardian Script ITC', cursive",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.5)",
                  letterSpacing: "0.05em",
                  fontWeight: "500"
                }}>
              Vishnuji Ki Rasoi
            </h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;
