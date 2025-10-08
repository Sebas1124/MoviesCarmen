"""
🎬 EJEMPLOS RÁPIDOS - MOVIEVERSE TESTING
=======================================

Estos son ejemplos súper simples para que entiendas los conceptos básicos
antes de pasar a los ejercicios completos.

Ejecuta: pytest ejemplos_rapidos.py::nombre_del_test -v
"""

import pytest
from playwright.sync_api import Page, expect
import re

BASE_URL = "http://localhost:5173"

def test_ejemplo_01_abrir_pagina(page: Page):
    """
    EJEMPLO MÁS SIMPLE: Solo abrir la página
    
    Esto hace:
    1. Abre el navegador
    2. Va a tu aplicación MovieVerse  
    3. Toma una foto
    """
    page.goto(BASE_URL)
    page.screenshot(path="screenshots/ejemplo_01.png")
    print("✅ ¡Página abierta y capturada!")


def test_ejemplo_02_buscar_texto(page: Page):
    """
    EJEMPLO: Buscar si existe un texto en la página
    
    Esto busca la palabra "MovIA" en cualquier parte de la página
    """
    page.goto(BASE_URL)
    
    # Buscar el texto "MovIA"
    logo = page.get_by_text("MovIA")
    expect(logo).to_be_visible()
    
    print("✅ ¡Encontré el logo MovIA!")
    page.screenshot(path="screenshots/ejemplo_02.png")


def test_ejemplo_03_click_simple(page: Page):
    """
    EJEMPLO: Hacer click en algo
    
    Esto busca un enlace y hace click en él
    """
    page.goto(BASE_URL)
    
    # Esperar un momento para que cargue
    page.wait_for_timeout(2000)
    
    # Buscar enlace "Tendencias" y hacer click
    tendencias = page.get_by_text("Tendencias")
    
    if tendencias.is_visible():
        tendencias.click()
        print("✅ ¡Hice click en Tendencias!")
    else:
        print("⚠️ No encontré el enlace Tendencias")
    
    page.screenshot(path="screenshots/ejemplo_03.png")


def test_ejemplo_04_esperar_elementos(page: Page):
    """
    EJEMPLO: Esperar a que aparezcan cosas
    
    Las aplicaciones modernas cargan contenido dinámicamente.
    Este ejemplo muestra cómo esperar.
    """
    page.goto(BASE_URL)
    
    print("Esperando que carguen las películas...")
    
    # Esperar 3 segundos (tiempo fijo)
    page.wait_for_timeout(3000)
    
    # Buscar si hay imágenes (que serían posters de películas)
    imagenes = page.locator("img")
    
    if imagenes.count() > 0:
        print(f"✅ ¡Encontré {imagenes.count()} imágenes!")
    else:
        print("⚠️ No encontré imágenes aún")
    
    page.screenshot(path="screenshots/ejemplo_04.png")


def test_ejemplo_05_llenar_formulario(page: Page):
    """
    EJEMPLO: Escribir en un campo de búsqueda
    
    Muestra cómo escribir texto en campos de entrada
    """
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # Buscar campo de búsqueda (puede tener placeholder "Buscar...")
    campo_busqueda = page.locator('input[placeholder*="Buscar"]')
    
    if campo_busqueda.is_visible():
        # Escribir en el campo
        campo_busqueda.fill("Spider-Man")
        print("✅ Escribí 'Spider-Man' en la búsqueda")
        
        # Presionar Enter
        campo_busqueda.press("Enter")
        print("✅ Presioné Enter")
        
        # Esperar resultados
        page.wait_for_timeout(2000)
    else:
        print("⚠️ No encontré campo de búsqueda")
    
    page.screenshot(path="screenshots/ejemplo_05.png")


def test_ejemplo_06_verificar_url(page: Page):
    """
    EJEMPLO: Verificar que navegamos a la página correcta
    
    Muestra cómo verificar URLs después de navegar
    """
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # Click en Tendencias
    tendencias = page.get_by_text("Tendencias")
    
    if tendencias.is_visible():
        tendencias.click()
        page.wait_for_load_state("networkidle")
        
        # Verificar que la URL cambió
        url_actual = page.url
        print(f"URL actual: {url_actual}")
        
        if "trending" in url_actual:
            print("✅ ¡Navegué a la página de tendencias!")
        else:
            print("⚠️ No estoy en la página esperada")
    
    page.screenshot(path="screenshots/ejemplo_06.png")


def test_ejemplo_07_contar_elementos(page: Page):
    """
    EJEMPLO: Contar cuántos elementos hay
    
    Útil para verificar que se cargó contenido
    """
    page.goto(BASE_URL)
    page.wait_for_timeout(3000)
    
    # Contar todas las imágenes
    imagenes = page.locator("img")
    cantidad = imagenes.count()
    
    print(f"Encontré {cantidad} imágenes en la página")
    
    # Verificar que hay al menos una imagen
    assert cantidad > 0, "Debería haber al menos una imagen"
    
    print("✅ ¡Hay imágenes cargadas!")
    page.screenshot(path="screenshots/ejemplo_07.png")


def test_ejemplo_08_multiples_formas_buscar(page: Page):
    """
    EJEMPLO: Diferentes formas de buscar elementos
    
    Playwright ofrece muchas maneras de encontrar elementos
    """
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # Forma 1: Por texto exacto
    logo1 = page.get_by_text("MovIA")
    
    # Forma 2: Por selector CSS 
    logo2 = page.locator("text=MovIA")
    
    # Forma 3: Combinado con or_
    logo3 = page.get_by_text("MovIA").or_(page.locator(".logo"))
    
    # Verificar que al menos una forma funciona
    if logo1.is_visible():
        print("✅ Encontré logo con get_by_text")
    elif logo2.is_visible():
        print("✅ Encontré logo con locator")
    elif logo3.is_visible():
        print("✅ Encontré logo con combinación")
    else:
        print("⚠️ No encontré el logo con ningún método")
    
    page.screenshot(path="screenshots/ejemplo_08.png")


def test_ejemplo_09_manejo_errores_simple(page: Page):
    """
    EJEMPLO: Qué hacer cuando algo no se encuentra
    
    No todos los elementos siempre están presentes
    """
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # Intentar buscar algo que puede no existir
    boton_inexistente = page.get_by_text("Botón Que No Existe")
    
    if boton_inexistente.is_visible():
        print("El botón existe")
        boton_inexistente.click()
    else:
        print("✅ El botón no existe, pero no pasa nada")
    
    # Buscar algo que sí debería existir
    titulo = page.locator("h1").first
    
    if titulo.is_visible():
        texto_titulo = titulo.text_content()
        print(f"✅ Encontré título: {texto_titulo}")
    else:
        print("⚠️ No encontré ningún título h1")
    
    page.screenshot(path="screenshots/ejemplo_09.png")


def test_ejemplo_10_flujo_basico_completo(page: Page):
    """
    EJEMPLO: Un flujo simple pero completo
    
    Combina varios conceptos básicos en una secuencia lógica
    """
    print("🎬 Iniciando flujo completo de ejemplo...")
    
    # 1. Ir a la página
    page.goto(BASE_URL)
    print("1. ✅ Página cargada")
    
    # 2. Esperar contenido
    page.wait_for_timeout(3000)
    print("2. ✅ Esperé que cargue el contenido")
    
    # 3. Verificar que hay un título
    titulo = page.locator("h1").first
    expect(titulo).to_be_visible()
    titulo_texto = titulo.text_content()
    print(f"3. ✅ Título encontrado: {titulo_texto}")
    
    # 4. Verificar que hay imágenes (películas)
    imagenes = page.locator("img")
    cantidad_imagenes = imagenes.count()
    assert cantidad_imagenes > 0, "Debería haber imágenes"
    print(f"4. ✅ {cantidad_imagenes} imágenes encontradas")
    
    # 5. Intentar navegar
    tendencias = page.get_by_text("Tendencias")
    if tendencias.is_visible():
        tendencias.click()
        page.wait_for_load_state("networkidle")
        print("5. ✅ Navegué a Tendencias")
    else:
        print("5. ⚠️ No encontré enlace Tendencias")
    
    # 6. Captura final
    page.screenshot(path="screenshots/ejemplo_10_flujo_completo.png")
    print("6. ✅ Captura tomada")
    
    print("🎉 ¡Flujo completo exitoso!")


# Instrucciones para usar estos ejemplos:
"""
CÓMO USAR ESTOS EJEMPLOS:

1. PREPARACIÓN:
   - Tener servidor corriendo: npm run dev
   - Instalar: pip install playwright pytest

2. EJECUTAR UN EJEMPLO:
   pytest ejemplos_rapidos.py::test_ejemplo_01_abrir_pagina -v

3. EJECUTAR VARIOS:
   pytest ejemplos_rapidos.py::test_ejemplo_01_abrir_pagina ejemplos_rapidos.py::test_ejemplo_02_buscar_texto -v

4. EJECUTAR TODOS LOS EJEMPLOS:
   pytest ejemplos_rapidos.py -v

5. VER LAS CAPTURAS:
   - Se guardan en screenshots/ejemplo_XX.png
   - Ábrelas para ver qué capturó cada test

PROGRESIÓN RECOMENDADA:
- Ejemplos 1-3: Conceptos básicos
- Ejemplos 4-6: Interacción 
- Ejemplos 7-9: Técnicas útiles
- Ejemplo 10: Flujo completo

¡Después de estos ejemplos, estarás listo para los ejercicios completos! 🚀
"""