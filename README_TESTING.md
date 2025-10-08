# 🎬 GUÍA DE TESTING AUTOMATIZADO - MOVIEVERSE

## 📋 Prerrequisitos

Antes de empezar, asegúrate de tener:

### 1. Dependencias instaladas
```bash
# Instalar pytest y playwright
pip install playwright pytest

# Instalar navegadores
playwright install
```

### 2. Servidor de desarrollo corriendo
```bash
# En una terminal separada, ejecutar:
npm run dev
# Debería estar corriendo en http://localhost:5173
```

### 3. Estructura de carpetas
```
moviesProject/
├── src/                          # Código fuente React
├── test_movieverse_ejercicios.py # Ejercicios de testing
├── pytest.ini                   # Configuración pytest
├── screenshots/                  # Capturas generadas (se crea automáticamente)
└── README_TESTING.md            # Esta guía
```

## 🚀 Empezando - Tutorial Paso a Paso

### PASO 1: Ejecutar tu primer test
```bash
# Ejecutar solo el primer ejercicio
pytest test_movieverse_ejercicios.py::test_pagina_principal_carga_correctamente -v
```

### PASO 2: Ver resultados
- El test debería pasar ✅
- Se creará una captura en `screenshots/homepage_loaded.png`
- Revisa la captura para ver qué capturó el test

### PASO 3: Ejecutar ejercicios básicos
```bash
# Ejecutar todos los ejercicios básicos (1-4)
pytest test_movieverse_ejercicios.py -k "pagina_principal or hero_section or navegacion or scroll" -v
```

## 📚 Estructura de Ejercicios

### 🟢 BÁSICOS (Ejercicios 1-4)
**Para principiantes absolutos**

1. **test_pagina_principal_carga_correctamente**
   - Aprende: `page.goto()`, `expect()`, `screenshot()`
   - Objetivo: Verificar que la página carga sin errores

2. **test_hero_section_muestra_informacion_pelicula**
   - Aprende: `page.locator()`, `wait_for_timeout()`, elementos dinámicos
   - Objetivo: Verificar contenido que carga desde API

3. **test_navegacion_secciones_peliculas**
   - Aprende: Clicks, navegación, verificación de URLs
   - Objetivo: Probar navegación entre páginas

4. **test_scroll_horizontal_peliculas**
   - Aprende: Interacción con JavaScript, scroll
   - Objetivo: Probar elementos interactivos

### 🟡 INTERMEDIOS (Ejercicios 5-9)
**Cuando ya domines los básicos**

5. **test_busqueda_pelicula_exitosa**
   - Aprende: Formularios, entrada de texto, resultados dinámicos
   
6. **test_busqueda_sin_resultados**
   - Aprende: Casos de error, manejo de estados vacíos
   
7. **test_detalle_pelicula_completo**
   - Aprende: Navegación compleja, múltiples verificaciones
   
8. **test_modal_trailer_funcionalidad**
   - Aprende: Modales, elementos que aparecen/desaparecen
   
9. **test_responsive_mobile_basico**
   - Aprende: Cambio de viewport, testing responsive

### 🔴 AVANZADOS (Ejercicios 10-16)
**Para cuando seas experto**

10. **test_flujo_completo_descubrimiento_pelicula**
    - Aprende: Flujos end-to-end, simulación de usuario real
    
11. **test_rendimiento_carga_paginas**
    - Aprende: Medición de tiempos, performance testing
    
12. **test_manejo_errores_api**
    - Aprende: Interceptación de requests, simulación de fallos
    
13-16. **Tests específicos del proyecto**
    - Integración TMDB API, todas las secciones, series TV

## 🎯 Comandos Útiles

### Ejecutar por niveles
```bash
# Solo básicos
pytest -k "pagina_principal or hero_section or navegacion or scroll" -v

# Solo intermedios
pytest -k "busqueda or detalle or modal or responsive" -v

# Solo avanzados
pytest -k "flujo or rendimiento or errores or multiples or tmdb or secciones or tv" -v
```

### Ejecutar tests específicos
```bash
# Un test específico
pytest test_movieverse_ejercicios.py::test_busqueda_pelicula_exitosa -v

# Varios tests
pytest test_movieverse_ejercicios.py::test_busqueda_pelicula_exitosa test_movieverse_ejercicios.py::test_busqueda_sin_resultados -v
```

### Opciones útiles
```bash
# Con más información de salida
pytest test_movieverse_ejercicios.py -v -s

# Parar en el primer error
pytest test_movieverse_ejercicios.py -x

# Generar reporte HTML
pytest test_movieverse_ejercicios.py --html=report.html --self-contained-html

# Ejecutar en modo lento (para ver qué pasa)
pytest test_movieverse_ejercicios.py --headed --slowmo=1000
```

## 🔧 Personalización y Experimentación

### Modificar un ejercicio básico

Ejemplo: Cambiar el test de navegación para probar otra sección:

```python
def test_mi_navegacion_personalizada(page: Page):
    # 1. Ir a homepage
    page.goto(BASE_URL)
    page.wait_for_timeout(2000)
    
    # 2. Click en "Mejor Valoradas" en lugar de "Tendencias"
    mejor_valoradas_link = page.get_by_text("Mejor Valoradas")
    mejor_valoradas_link.click()
    
    # 3. Verificar URL
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(re.compile(".*top-rated.*"))
    
    # 4. Tomar captura personalizada
    page.screenshot(path="screenshots/mi_test_personalizado.png")
```

### Crear tus propios tests

```python
def test_mi_funcionalidad_favorita(page: Page):
    """
    Descripción de qué quieres probar
    """
    # Tu código aquí
    page.goto(BASE_URL)
    # ... más código
```

## 🐛 Solución de Problemas Comunes

### Error: "Connection refused"
**Causa**: El servidor de desarrollo no está corriendo
**Solución**: 
```bash
npm run dev
# Esperar a que diga "Local: http://localhost:5173"
```

### Error: "Element not found" 
**Causa**: El elemento no existe o no ha cargado aún
**Soluciones**:
```python
# Esperar más tiempo
page.wait_for_timeout(5000)

# Esperar elemento específico
page.wait_for_selector("img")

# Usar or_ para múltiples opciones
elemento = page.get_by_text("Buscar").or_(page.locator('input[type="search"]'))
```

### Error: "Timeout waiting for..."
**Causa**: La página tarda mucho en cargar
**Soluciones**:
```python
# Aumentar timeout
expect(elemento).to_be_visible(timeout=15000)  # 15 segundos

# Verificar que la API está respondiendo
page.wait_for_load_state("networkidle")
```

### Tests fallan pero la aplicación funciona manual
**Posibles causas**:
1. El test es muy estricto (ajustar expectativas)
2. Datos de API cambian (usar verificaciones más flexibles)
3. Timing issues (agregar más waits)

## 💡 Consejos para Aprender

### Para Principiantes
1. **Empieza lento**: Ejecuta un test a la vez
2. **Lee cada línea**: Entiende qué hace cada comando
3. **Experimenta**: Cambia valores y ve qué pasa
4. **Usa screenshots**: Te ayudan a entender qué ve el test

### Progresión Recomendada
1. **Semana 1**: Ejercicios 1-4 (básicos)
2. **Semana 2**: Ejercicios 5-9 (intermedios)
3. **Semana 3**: Ejercicios 10-12 (avanzados)
4. **Semana 4**: Crear tus propios tests

### Debugging
```python
# Pausar ejecución para inspeccionar
page.pause()

# Imprimir texto para debug
print(f"URL actual: {page.url}")
print(f"Título: {page.title()}")

# Más screenshots para entender flujo
page.screenshot(path="screenshots/debug_step_1.png")
```

## 📈 Siguientes Pasos

Una vez domines estos ejercicios:

1. **CI/CD**: Integrar tests en GitHub Actions
2. **Page Object Model**: Organizar mejor el código de tests
3. **Data-driven testing**: Tests con múltiples datos
4. **Visual testing**: Comparar screenshots automáticamente
5. **API testing**: Probar endpoints directamente

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí, ya sabes testing automatizado con Playwright. 

¡Ahora puedes crear tests para cualquier aplicación web! 🚀

---

## 📞 Ayuda

Si algo no funciona o tienes dudas:

1. Revisa que el servidor esté corriendo
2. Verifica que las dependencias están instaladas
3. Mira las capturas de pantalla generadas
4. Lee los mensajes de error cuidadosamente
5. Experimenta con comandos más simples primero

**¡Happy Testing!** 🧪✨