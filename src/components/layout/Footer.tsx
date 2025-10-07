import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-2xl font-black text-white">
                Movie<span className="text-red-500">Verse</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Tu destino definitivo para descubrir las mejores películas. 
              Explora tendencias, encuentra tus favoritas y mantente actualizado 
              con los últimos estrenos del cine.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Inicio</a></li>
              <li><a href="/trending" className="text-gray-400 hover:text-white transition-colors duration-200">Tendencias</a></li>
              <li><a href="/top-rated" className="text-gray-400 hover:text-white transition-colors duration-200">Mejor Valoradas</a></li>
              <li><a href="/upcoming" className="text-gray-400 hover:text-white transition-colors duration-200">Próximos Estrenos</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Términos de Uso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-gray-500 mb-4">
            Datos proporcionados por{' '}
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              The Movie Database (TMDB)
            </a>
          </p>
          <p className="text-gray-600 text-sm">
            © 2025 MovieVerse. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;