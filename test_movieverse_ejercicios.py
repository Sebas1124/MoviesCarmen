"""
🎬 EJERCICIOS DE TESTING CON PLAYWRIGHT + PYTEST - MOVIEVERSE
==============================================================

Este archivo contiene ejercicios progresivos para aprender testing automatizado
con Playwright y pytest en tu proyecto MovieVerse.

INSTRUCCIONES:
1. Instalar dependencias: pip install playwright pytest
2. Instalar navegadores: playwright install
3. Ejecutar servidor: npm run dev (en otra terminal)
4. Ejecutar tests: pytest test_movieverse_ejercicios.py -v

NIVEL: PRINCIPIANTE → INTERMEDIO → AVANZADO
"""

import pytest
import re
from playwright.sync_api import Page, expect

# URL base del proyecto (ajustar según tu configuración)
BASE_URL = "http://localhost:5173"

# ============================================================================
# 🟢 EJERCICIOS BÁSICOS - NIVEL PRINCIPIANTE
# ============================================================================

def test_pagina_principal_carga_correctamente(page: Page):
    """
    EJERCICIO 1: Verificar que la página principal carga sin errores
    
    OBJETIVO: Aprender los conceptos básicos de navegación y verificación
    
    PASOS A REALIZAR:
    1. Navegar a la página principal
    2. Verificar que el título contiene "MovIA" 
    3. Verificar que el logo es visible
    4. Tomar captura de pantalla
    """
    
    # 1. Navegar a la página principal
    page.goto(BASE_URL)
    
    # 2. Verificar que el título de la página es correcto
    expect(page).to_have_title(re.compile("MovIA"))
    
    # 3. Buscar el logo por texto y verificar que es visible
    logo = page.get_by_text("MovIA")
    expect(logo).to_be_visible()
    
    # 4. Tomar captura para verificar visualmente
    page.screenshot(path="screenshots/homepage_loaded.png")


def test_hero_section_muestra_informacion_pelicula(page: Page):
    """
    EJERCICIO 2: Verificar que la sección hero muestra información de películas
    
    OBJETIVO: Aprender a esperar elementos que cargan dinámicamente
    
    PASOS A REALIZAR:
    1. Ir a la página principal
    2. Esperar a que cargue la sección hero
    3. Verificar que hay un título de película
    4. Verificar que hay una descripción
    5. Verificar que hay botones de acción
    """
    
    # 1. Navegar a homepage
    page.goto(BASE_URL)
    
    # 2. Esperar a que cargue contenido (las películas vienen de API)
    page.wait_for_timeout(3000)
    
    # 3. Verificar que hay un título principal visible (puede ser h1, h2, etc.)
    titulo_pelicula = page.locator("h1").first
    expect(titulo_pelicula).to_be_visible()
    expect(titulo_pelicula).not_to_be_empty()
    
    # 4. Verificar que hay descripción/overview de película
    descripcion = page.locator("p").first
    expect(descripcion).to_be_visible()
    
    # 5. Verificar botones de acción
    boton_info = page.get_by_text("Más información")
    expect(boton_info).to_be_visible()
    
    boton_trailer = page.get_by_text("Ver tráiler")
    expect(boton_trailer).to_be_visible()
    
    page.screenshot(path="screenshots/hero_section_loaded.png")


def test_navegacion_secciones_peliculas(page: Page):
    """
    EJERCICIO 3: Probar navegación entre diferentes secciones
    
    OBJETIVO: Aprender navegación y verificación de URLs
    
    PASOS A REALIZAR:
    1. Ir a homepage
    2. Click en "Tendencias" 
    3. Verificar que la URL cambió
    4. Verificar que se muestran películas
    5. Regresar a homepage usando el logo
    """
    
    # 1. Ir a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # 2. Click en link de Tendencias
    tendencias_link = page.get_by_text("Tendencias")
    tendencias_link.click()
    
    # 3. Esperar navegación y verificar URL
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(re.compile(".*trending.*"))
    
    # 4. Verificar que hay películas (buscar imágenes de posters)
    page.wait_for_timeout(3000)  # Esperar que carguen las películas
    peliculas = page.locator("img")
    expect(peliculas.first).to_be_visible()
    
    page.screenshot(path="screenshots/trending_page.png")
    
    # 5. Regresar a homepage clickeando el logo
    logo = page.get_by_text("MovIA").first
    logo.click()
    
    # Verificar que regresamos a la página principal
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(BASE_URL + "/")


def test_scroll_horizontal_peliculas(page: Page):
    """
    EJERCICIO 4: Probar scroll horizontal en carouseles de películas
    
    OBJETIVO: Aprender a interactuar con elementos scrolleables
    
    PASOS A REALIZAR:
    1. Ir a homepage
    2. Localizar una fila de películas
    3. Obtener posición inicial del scroll
    4. Hacer scroll hacia la derecha
    5. Verificar que la posición cambió
    """
    
    # 1. Ir a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(3000)
    
    # 2. Buscar contenedor de películas que sea scrolleable
    # Buscar por clase CSS o estructura HTML común
    carousel_peliculas = page.locator(".flex.gap-4").first
    expect(carousel_peliculas).to_be_visible()
    
    # 3. Obtener posición inicial del scroll
    posicion_inicial = carousel_peliculas.evaluate("el => el.scrollLeft")
    
    # 4. Hacer scroll hacia la derecha (300px)
    carousel_peliculas.evaluate("el => el.scrollLeft += 300")
    
    # Esperar que se complete la animación
    page.wait_for_timeout(1000)
    
    # 5. Verificar que el scroll cambió
    posicion_final = carousel_peliculas.evaluate("el => el.scrollLeft")
    assert posicion_final > posicion_inicial, "El carousel debería haber hecho scroll"
    
    page.screenshot(path="screenshots/carousel_scrolled.png")


# ============================================================================
# 🟡 EJERCICIOS INTERMEDIOS - NIVEL INTERMEDIO  
# ============================================================================

def test_busqueda_pelicula_exitosa(page: Page):
    """
    EJERCICIO 5: Probar funcionalidad de búsqueda con resultados
    
    OBJETIVO: Aprender a usar formularios y validar resultados dinámicos
    
    PASOS A REALIZAR:
    1. Ir a homepage
    2. Encontrar campo de búsqueda
    3. Buscar "Spider"
    4. Esperar resultados
    5. Verificar que aparecen películas relacionadas
    """
    
    # 1. Navegar a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # 2. Buscar campo de búsqueda (puede tener placeholder "Buscar...")
    campo_busqueda = page.locator('input[placeholder*="Buscar"]').or_(
        page.locator('input[type="search"]')
    )
    expect(campo_busqueda).to_be_visible()
    
    # 3. Escribir término de búsqueda
    campo_busqueda.fill("Spider")
    campo_busqueda.press("Enter")
    
    # 4. Esperar a que aparezcan resultados
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)
    
    # 5. Verificar que la URL cambió a página de búsqueda
    expect(page).to_have_url(re.compile(".*search.*"))
    
    # Verificar que hay resultados (imágenes de películas)
    resultados = page.locator("img")
    expect(resultados.first).to_be_visible()
    
    page.screenshot(path="screenshots/search_results_spider.png")


def test_busqueda_sin_resultados(page: Page):
    """
    EJERCICIO 6: Probar búsqueda que no devuelve resultados
    
    OBJETIVO: Aprender a manejar casos de error y estados vacíos
    
    PASOS A REALIZAR:
    1. Ir a homepage
    2. Buscar término inexistente
    3. Verificar mensaje de "no resultados"
    4. Verificar que no crashea la aplicación
    """
    
    # 1. Navegar a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # 2. Buscar campo y escribir término inexistente
    campo_busqueda = page.locator('input[placeholder*="Buscar"]').or_(
        page.locator('input[type="search"]')
    )
    
    termino_inexistente = "asdfghjklqwertyuiop123456789"
    campo_busqueda.fill(termino_inexistente)
    campo_busqueda.press("Enter")
    
    # 3. Esperar respuesta
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)
    
    # 4. Verificar mensaje de no resultados (puede estar en español)
    mensaje_vacio = page.get_by_text("No se encontraron").or_(
        page.get_by_text("No hay resultados").or_(
            page.get_by_text("Sin resultados")
        )
    )
    
    # Si no hay mensaje específico, verificar que no hay películas
    if not mensaje_vacio.is_visible():
        # Verificar que no hay tarjetas de películas
        peliculas = page.locator("img[alt*='poster']").or_(page.locator(".movie-card"))
        assert peliculas.count() == 0, "No debería haber películas para búsqueda inexistente"
    
    page.screenshot(path="screenshots/search_no_results.png")


def test_detalle_pelicula_completo(page: Page):
    """
    EJERCICIO 7: Navegar a detalles de película y verificar información
    
    OBJETIVO: Aprender navegación compleja y verificación de múltiples elementos
    
    PASOS A REALIZAR:
    1. Ir a homepage
    2. Click en primera película disponible
    3. Verificar que carga página de detalles
    4. Verificar elementos: título, imagen, descripción
    5. Verificar botón de trailer
    """
    
    # 1. Ir a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(3000)
    
    # 2. Buscar primera película clickeable (imagen o tarjeta)
    primera_pelicula = page.locator("img").first
    expect(primera_pelicula).to_be_visible()
    
    # Click en la película
    primera_pelicula.click()
    
    # 3. Esperar navegación a página de detalles
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    
    # Verificar que la URL contiene /movie/
    expect(page).to_have_url(re.compile(r".*\/movie\/\d+"))
    
    # 4. Verificar elementos de la página de detalles
    
    # Título de la película
    titulo = page.locator("h1").first
    expect(titulo).to_be_visible()
    expect(titulo).not_to_be_empty()
    
    # Imagen principal/backdrop
    imagen_principal = page.locator("img").first
    expect(imagen_principal).to_be_visible()
    
    # Descripción/sinopsis
    descripcion = page.locator("p").first
    expect(descripcion).to_be_visible()
    
    # 5. Verificar botón de trailer
    boton_trailer = page.get_by_text("Ver tráiler").or_(
        page.get_by_text("Trailer").or_(
            page.locator('button[title*="trailer"]')
        )
    )
    expect(boton_trailer).to_be_visible()
    
    page.screenshot(path="screenshots/movie_details.png")


def test_modal_trailer_funcionalidad(page: Page):
    """
    EJERCICIO 8: Probar apertura y cierre de modal de trailer
    
    OBJETIVO: Aprender a interactuar con modales y elementos dinámicos
    
    PASOS A REALIZAR:
    1. Ir a homepage
    2. Navegar a detalles de película
    3. Click en "Ver tráiler"
    4. Verificar que abre modal con video
    5. Cerrar modal
    """
    
    # 1-2. Ir a homepage y navegar a detalles
    page.goto(BASE_URL)
    page.wait_for_timeout(3000)
    
    primera_pelicula = page.locator("img").first
    primera_pelicula.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    
    # 3. Click en botón de trailer
    boton_trailer = page.get_by_text("Ver tráiler")
    expect(boton_trailer).to_be_visible()
    boton_trailer.click()
    
    # 4. Esperar que aparezca modal con video
    page.wait_for_timeout(2000)
    
    # Buscar iframe de YouTube o video
    iframe_video = page.locator('iframe[src*="youtube"]').or_(
        page.locator('video').or_(
            page.locator('.modal')
        )
    )
    expect(iframe_video).to_be_visible()
    
    page.screenshot(path="screenshots/trailer_modal_open.png")
    
    # 5. Cerrar modal (puede ser con ESC, click fuera, o botón X)
    page.keyboard.press("Escape")
    
    # Esperar que se cierre
    page.wait_for_timeout(1000)
    
    # Verificar que el modal desapareció
    expect(iframe_video).not_to_be_visible()
    
    page.screenshot(path="screenshots/trailer_modal_closed.png")


def test_responsive_mobile_basico(page: Page):
    """
    EJERCICIO 9: Probar diseño responsive básico
    
    OBJETIVO: Aprender a cambiar viewport y probar responsive design
    
    PASOS A REALIZAR:
    1. Cambiar viewport a móvil
    2. Navegar a homepage
    3. Verificar que elementos principales son visibles
    4. Verificar que no hay scroll horizontal
    """
    
    # 1. Cambiar viewport a tamaño móvil (iPhone)
    page.set_viewport_size({"width": 390, "height": 844})
    
    # 2. Navegar a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(3000)
    
    # 3. Verificar elementos principales
    
    # Logo debe ser visible
    logo = page.get_by_text("MovIA")
    expect(logo).to_be_visible()
    
    # Título principal debe ser visible
    titulo_principal = page.locator("h1").first
    expect(titulo_principal).to_be_visible()
    
    # Al menos una película debe ser visible
    peliculas = page.locator("img")
    expect(peliculas.first).to_be_visible()
    
    # 4. Verificar que no hay scroll horizontal
    ancho_body = page.evaluate("document.body.scrollWidth")
    ancho_viewport = 390
    
    # El contenido no debe ser más ancho que el viewport (+20px de tolerancia)
    assert ancho_body <= ancho_viewport + 20, f"Hay scroll horizontal: {ancho_body}px > {ancho_viewport}px"
    
    page.screenshot(path="screenshots/mobile_responsive.png")


# ============================================================================
# 🔴 EJERCICIOS AVANZADOS - NIVEL AVANZADO
# ============================================================================

def test_flujo_completo_descubrimiento_pelicula(page: Page):
    """
    EJERCICIO 10: Flujo end-to-end completo de descubrimiento
    
    OBJETIVO: Simular comportamiento real de usuario
    
    PASOS A REALIZAR:
    1. Llegar a homepage
    2. Explorar sección hero
    3. Navegar a tendencias
    4. Ver detalles de película
    5. Ver trailer
    6. Buscar película específica
    7. Regresar a explorar más
    """
    
    # 1. Llegar a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(3000)
    
    page.screenshot(path="screenshots/flujo_01_homepage.png")
    
    # 2. Explorar hero section - obtener título
    titulo_hero = page.locator("h1").first
    expect(titulo_hero).to_be_visible()
    nombre_pelicula_hero = titulo_hero.text_content()
    
    # Ver trailer desde hero si está disponible
    boton_trailer_hero = page.get_by_text("Ver tráiler").first
    if boton_trailer_hero.is_visible():
        boton_trailer_hero.click()
        page.wait_for_timeout(2000)
        
        # Verificar modal
        iframe = page.locator('iframe[src*="youtube"]')
        expect(iframe).to_be_visible()
        
        # Cerrar modal
        page.keyboard.press("Escape")
        page.wait_for_timeout(1000)
    
    page.screenshot(path="screenshots/flujo_02_hero_explored.png")
    
    # 3. Navegar a tendencias
    tendencias_link = page.get_by_text("Tendencias")
    tendencias_link.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    
    page.screenshot(path="screenshots/flujo_03_trending_page.png")
    
    # 4. Ver detalles de primera película en tendencias
    primera_trending = page.locator("img").first
    primera_trending.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    
    # Verificar página de detalles
    expect(page).to_have_url(re.compile(r".*\/movie\/\d+"))
    titulo_detalle = page.locator("h1").first
    expect(titulo_detalle).to_be_visible()
    
    page.screenshot(path="screenshots/flujo_04_movie_details.png")
    
    # 5. Ver trailer de esta película
    boton_trailer = page.get_by_text("Ver tráiler")
    if boton_trailer.is_visible():
        boton_trailer.click()
        page.wait_for_timeout(2000)
        page.keyboard.press("Escape")
    
    # 6. Buscar película específica
    # Regresar a homepage primero
    logo = page.get_by_text("MovIA")
    logo.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    
    # Buscar
    campo_busqueda = page.locator('input[placeholder*="Buscar"]')
    if campo_busqueda.is_visible():
        campo_busqueda.fill("Avengers")
        campo_busqueda.press("Enter")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)
        
        page.screenshot(path="screenshots/flujo_05_search_results.png")
    
    # 7. Regresar a explorar (homepage)
    logo.click()
    page.wait_for_load_state("networkidle")
    
    page.screenshot(path="screenshots/flujo_06_back_to_explore.png")


def test_rendimiento_carga_paginas(page: Page):
    """
    EJERCICIO 11: Probar rendimiento básico de carga
    
    OBJETIVO: Medir tiempos de carga y detectar problemas de rendimiento
    
    PASOS A REALIZAR:
    1. Medir tiempo de carga de homepage
    2. Medir tiempo de navegación entre páginas
    3. Verificar que no hay errores en consola
    4. Verificar tiempos aceptables
    """
    
    import time
    
    # 1. Medir carga de homepage
    inicio = time.time()
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    tiempo_homepage = time.time() - inicio
    
    print(f"Homepage cargó en {tiempo_homepage:.2f} segundos")
    
    # Verificar que carga en tiempo razonable (menos de 10 segundos)
    assert tiempo_homepage < 10.0, f"Homepage muy lenta: {tiempo_homepage:.2f}s"
    
    page.screenshot(path="screenshots/performance_homepage.png")
    
    # 2. Medir navegación a tendencias
    inicio_nav = time.time()
    tendencias_link = page.get_by_text("Tendencias")
    tendencias_link.click()
    page.wait_for_load_state("networkidle")
    tiempo_navegacion = time.time() - inicio_nav
    
    print(f"Navegación a Tendencias: {tiempo_navegacion:.2f} segundos")
    assert tiempo_navegacion < 5.0, f"Navegación muy lenta: {tiempo_navegacion:.2f}s"
    
    # 3. Verificar que no hay errores críticos en consola
    # (En casos reales, podrías capturar console.error)
    
    # 4. Medir carga de detalles de película
    page.wait_for_timeout(2000)
    primera_pelicula = page.locator("img").first
    
    inicio_detalle = time.time()
    primera_pelicula.click()
    page.wait_for_load_state("networkidle")
    tiempo_detalle = time.time() - inicio_detalle
    
    print(f"Detalles de película: {tiempo_detalle:.2f} segundos")
    assert tiempo_detalle < 3.0, f"Detalles muy lentos: {tiempo_detalle:.2f}s"
    
    page.screenshot(path="screenshots/performance_details.png")


def test_manejo_errores_api(page: Page):
    """
    EJERCICIO 12: Simular fallos de API y verificar manejo de errores
    
    OBJETIVO: Probar robustez de la aplicación ante fallos
    
    PASOS A REALIZAR:
    1. Interceptar requests de API
    2. Simular fallos de red
    3. Verificar que la app no crashea
    4. Verificar mensajes de error apropiados
    """
    
    # Contador para fallar algunas requests
    request_count = {"count": 0}
    
    def handle_route(route):
        request_count["count"] += 1
        
        # Fallar cada segunda request a la API de TMDB
        if "api.themoviedb.org" in route.request.url and request_count["count"] % 2 == 0:
            route.abort()
        else:
            route.continue_()
    
    # 1-2. Interceptar y simular fallos
    page.route("**/api.themoviedb.org/**", handle_route)
    
    # 3. Navegar con fallos simulados
    page.goto(BASE_URL)
    page.wait_for_timeout(5000)  # Dar tiempo para múltiples requests
    
    # Verificar que la página no crasheó completamente
    page_title = page.title()
    assert "Error" not in page_title, "La página no debería mostrar error en el título"
    
    # 4. Verificar que algo se muestra (aunque sea mensaje de error)
    content_loaded = (
        page.locator("h1").is_visible() or 
        page.get_by_text("Error").is_visible() or
        page.get_by_text("No disponible").is_visible()
    )
    
    assert content_loaded, "La aplicación debería mostrar algún contenido o mensaje de error"
    
    page.screenshot(path="screenshots/api_errors_handled.png")
    
    # Intentar navegar para verificar que sigue funcionando
    try:
        tendencias_link = page.get_by_text("Tendencias")
        if tendencias_link.is_visible():
            tendencias_link.click()
            page.wait_for_timeout(3000)
            
            page.screenshot(path="screenshots/navigation_after_errors.png")
    except:
        # Si la navegación falla, al menos verificar que no hay crash completo
        assert page.url is not None, "La página no debería estar completamente rota"


def test_multiples_dispositivos_simultaneos(page: Page):
    """
    EJERCICIO 13: Simular múltiples usuarios/dispositivos
    
    OBJETIVO: Verificar que la aplicación funciona con múltiples contextos
    
    PASOS A REALIZAR:
    1. Crear múltiples contextos de navegador
    2. Navegar simultáneamente desde diferentes "dispositivos"
    3. Verificar que no hay interferencias
    4. Probar diferentes viewport sizes
    """
    
    # Este ejercicio usa el contexto de navegador principal
    # En implementación real, crearías múltiples contextos
    
    # Simular diferentes dispositivos cambiando viewport
    dispositivos = [
        {"width": 390, "height": 844, "nombre": "iPhone"},
        {"width": 768, "height": 1024, "nombre": "iPad"},
        {"width": 1920, "height": 1080, "nombre": "Desktop"}
    ]
    
    for dispositivo in dispositivos:
        print(f"Probando en {dispositivo['nombre']}...")
        
        # Cambiar viewport
        page.set_viewport_size({
            "width": dispositivo["width"], 
            "height": dispositivo["height"]
        })
        
        # Navegar y verificar funcionalidad básica
        page.goto(BASE_URL)
        page.wait_for_timeout(3000)
        
        # Verificar elementos básicos
        logo = page.get_by_text("MovIA")
        expect(logo).to_be_visible()
        
        titulo = page.locator("h1").first
        expect(titulo).to_be_visible()
        
        # Verificar que no hay scroll horizontal en móvil/tablet
        if dispositivo["width"] <= 1024:
            ancho_body = page.evaluate("document.body.scrollWidth")
            assert ancho_body <= dispositivo["width"] + 20, f"Scroll horizontal en {dispositivo['nombre']}"
        
        page.screenshot(path=f"screenshots/device_{dispositivo['nombre'].lower()}.png")
        
        # Probar navegación básica
        tendencias = page.get_by_text("Tendencias")
        if tendencias.is_visible():
            tendencias.click()
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(2000)
            
            # Verificar que cargó contenido
            peliculas = page.locator("img")
            expect(peliculas.first).to_be_visible()


# ============================================================================
# 🎯 EJERCICIOS DE VALIDACIÓN ESPECÍFICA DEL PROYECTO
# ============================================================================

def test_integracion_tmdb_api_funcional(page: Page):
    """
    EJERCICIO 14: Verificar integración con TMDB API específicamente
    
    OBJETIVO: Validar que los datos vienen correctamente de la API real
    
    PASOS A REALIZAR:
    1. Capturar requests a TMDB
    2. Verificar que incluyen API key
    3. Verificar respuestas exitosas
    4. Verificar que datos se muestran correctamente
    """
    
    # Lista para capturar requests
    api_calls = []
    
    def handle_request(request):
        if "api.themoviedb.org" in request.url:
            api_calls.append({
                "url": request.url,
                "method": request.method
            })
    
    def handle_response(response):
        if "api.themoviedb.org" in response.url:
            assert response.status < 400, f"Error en API TMDB: {response.status} - {response.url}"
    
    # Capturar network traffic
    page.on("request", handle_request)
    page.on("response", handle_response)
    
    # Navegar y triggear API calls
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)
    
    # Verificar que se hicieron llamadas a TMDB
    assert len(api_calls) > 0, "No se detectaron llamadas a TMDB API"
    
    # Verificar que las llamadas incluyen API key
    for call in api_calls:
        assert "api_key=" in call["url"], f"Llamada sin API key: {call['url']}"
    
    # Verificar que se muestran datos (películas cargaron)
    peliculas = page.locator("img")
    assert peliculas.count() > 0, "No se cargaron películas de TMDB"
    
    page.screenshot(path="screenshots/tmdb_integration_working.png")


def test_todas_secciones_navegacion_funcionan(page: Page):
    """
    EJERCICIO 15: Verificar todas las secciones de navegación del proyecto
    
    OBJETIVO: Probar exhaustivamente todas las rutas de la aplicación
    
    PASOS A REALIZAR:
    1. Probar cada enlace de navegación
    2. Verificar que cada página carga
    3. Verificar contenido específico de cada sección
    """
    
    # Lista de secciones a probar (basado en tu proyecto)
    secciones = [
        {"texto": "Tendencias", "url_pattern": "trending", "contenido_esperado": "películas trending"},
        {"texto": "Mejor Valoradas", "url_pattern": "top-rated", "contenido_esperado": "películas top rated"},
        {"texto": "Próximos Estrenos", "url_pattern": "upcoming", "contenido_esperado": "películas próximas"},
        {"texto": "En Cines", "url_pattern": "now-playing", "contenido_esperado": "películas en cines"}
    ]
    
    for seccion in secciones:
        print(f"Probando sección: {seccion['texto']}")
        
        # Ir a homepage primero
        page.goto(BASE_URL)
        page.wait_for_timeout(2000)
        
        # Click en la sección
        link_seccion = page.get_by_text(seccion["texto"])
        expect(link_seccion).to_be_visible()
        link_seccion.click()
        
        # Verificar navegación
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)
        
        # Verificar URL
        current_url = page.url
        assert seccion["url_pattern"] in current_url, f"URL incorrecta para {seccion['texto']}: {current_url}"
        
        # Verificar que hay contenido (películas)
        peliculas = page.locator("img")
        assert peliculas.count() > 0, f"No hay películas en {seccion['texto']}"
        
        # Verificar título de la sección
        titulo_seccion = page.locator("h1, h2").first
        expect(titulo_seccion).to_be_visible()
        
        page.screenshot(path=f"screenshots/section_{seccion['url_pattern']}.png")


def test_funcionalidad_completa_tv_series(page: Page):
    """
    EJERCICIO 16: Probar funcionalidad específica de series de TV
    
    OBJETIVO: Validar características únicas de series vs películas
    
    PASOS A REALIZAR:
    1. Buscar sección de series
    2. Navegar a detalles de serie
    3. Verificar información específica de series (temporadas, episodios)
    """
    
    # 1. Ir a homepage y buscar series
    page.goto(BASE_URL)
    page.wait_for_timeout(3000)
    
    # Buscar sección de series en homepage o navegación
    series_section = page.get_by_text("Series").or_(
        page.get_by_text("TV").or_(
            page.get_by_text("📺")
        )
    )
    
    if series_section.is_visible():
        # Si hay navegación específica a series
        series_section.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)
        
        # Buscar primera serie
        primera_serie = page.locator("img").first
        primera_serie.click()
        
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)
        
        # Verificar que es página de serie (URL contiene /tv/)
        expect(page).to_have_url(re.compile(r".*\/tv\/\d+"))
        
        # Verificar elementos específicos de series
        titulo_serie = page.locator("h1")
        expect(titulo_serie).to_be_visible()
        
        # Buscar información de temporadas/episodios
        info_temporadas = page.get_by_text(re.compile(r"\d+.*temporada", re.IGNORECASE)).or_(
            page.get_by_text(re.compile(r"\d+.*episodio", re.IGNORECASE)).or_(
                page.get_by_text(re.compile("season", re.IGNORECASE))
            )
        )
        
        # Si hay info de temporadas, verificarla
        if info_temporadas.is_visible():
            expect(info_temporadas).to_be_visible()
        
        page.screenshot(path="screenshots/tv_series_details.png")
    else:
        # Si no hay sección específica, buscar series en homepage
        # Scroll hacia abajo para buscar sección de series
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(2000)
        
        # Buscar texto relacionado con series
        series_text = page.get_by_text("Series").or_(
            page.get_by_text("TV")
        )
        
        if series_text.is_visible():
            series_text.scroll_into_view_if_needed()
            
        page.screenshot(path="screenshots/tv_series_section_found.png")


# ============================================================================
# 🚀 INSTRUCCIONES PARA EJECUTAR LOS TESTS
# ============================================================================

"""
CÓMO EJECUTAR ESTOS TESTS:

1. PREPARACIÓN:
   - Tener el servidor de desarrollo corriendo: npm run dev
   - Instalar dependencias: pip install playwright pytest
   - Instalar navegadores: playwright install

2. EJECUTAR TESTS INDIVIDUALES:
   pytest test_movieverse_ejercicios.py::test_pagina_principal_carga_correctamente -v

3. EJECUTAR POR NIVEL:
   # Solo básicos
   pytest test_movieverse_ejercicios.py -k "test_pagina_principal or test_hero_section or test_navegacion or test_scroll" -v
   
   # Solo intermedios  
   pytest test_movieverse_ejercicios.py -k "test_busqueda or test_detalle or test_modal or test_responsive" -v
   
   # Solo avanzados
   pytest test_movieverse_ejercicios.py -k "test_flujo or test_rendimiento or test_errores or test_multiples" -v

4. EJECUTAR TODOS:
   pytest test_movieverse_ejercicios.py -v

5. GENERAR REPORTE HTML:
   pytest test_movieverse_ejercicios.py --html=report.html --self-contained-html

6. EJECUTAR CON CAPTURA DE PANTALLA EN CADA PASO:
   pytest test_movieverse_ejercicios.py --screenshot=on -v

CONSEJOS PARA PRINCIPIANTES:

- Empieza con los ejercicios básicos (1-4)
- Lee cada comentario explicativo
- Ejecuta un test a la vez al principio
- Revisa las capturas de pantalla generadas
- Modifica los tests para experimentar
- Pregunta si algo no está claro

¡Buena suerte aprendiendo testing automatizado! 🎬🧪
"""