function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 
                    shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] 
                      opacity-50"></div>
        <div className="container mx-auto px-6 py-5 relative">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center
                       tracking-tight drop-shadow-sm">
            Restaurant Order Management
          </h1>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r 
                        from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>
    </header>
  )
}

export default Header
