#!/usr/bin/env python3
"""
🎬 SETUP AUTOMÁTICO PARA TESTING MOVIEVERSE
==========================================

Este script configura automáticamente todo lo necesario para ejecutar
los tests de Playwright en tu proyecto MovieVerse.

Uso: python setup_testing.py
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Ejecuta un comando y muestra el resultado"""
    print(f"\n📦 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completado")
        if result.stdout:
            print(f"   Salida: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}")
        print(f"   Error: {e.stderr}")
        return False

def check_node_server():
    """Verifica si el servidor de desarrollo está corriendo"""
    try:
        import requests
        response = requests.get("http://localhost:5173", timeout=5)
        return response.status_code == 200
    except:
        return False

def create_screenshots_dir():
    """Crea el directorio para screenshots"""
    screenshots_dir = Path("screenshots")
    screenshots_dir.mkdir(exist_ok=True)
    print(f"✅ Directorio {screenshots_dir} creado/verificado")

def main():
    print("🎬 CONFIGURACIÓN AUTOMÁTICA DE TESTING MOVIEVERSE")
    print("=" * 50)
    
    # Verificar que estamos en el directorio correcto
    if not Path("package.json").exists():
        print("❌ Error: No se encontró package.json")
        print("   Asegúrate de estar en el directorio del proyecto MovieVerse")
        sys.exit(1)
    
    print("✅ Directorio del proyecto verificado")
    
    # Crear directorio de screenshots
    create_screenshots_dir()
    
    # Instalar dependencias Python
    python_deps = [
        "pip install playwright",
        "pip install pytest", 
        "pip install requests"  # Para verificar servidor
    ]
    
    for dep in python_deps:
        run_command(dep, f"Instalando {dep.split()[-1]}")
    
    # Instalar navegadores de Playwright
    run_command("playwright install", "Instalando navegadores de Playwright")
    
    # Verificar servidor de desarrollo
    print("\n🌐 Verificando servidor de desarrollo...")
    if check_node_server():
        print("✅ Servidor de desarrollo corriendo en http://localhost:5173")
    else:
        print("⚠️  Servidor de desarrollo no detectado")
        print("   Ejecuta 'npm run dev' en otra terminal antes de correr tests")
    
    # Ejecutar test de prueba
    print("\n🧪 Ejecutando test de verificación...")
    if run_command(
        "pytest test_movieverse_ejercicios.py::test_pagina_principal_carga_correctamente -v", 
        "Test de verificación"
    ):
        print("\n🎉 ¡CONFIGURACIÓN COMPLETADA!")
        print("\nPróximos pasos:")
        print("1. Si el servidor no está corriendo: npm run dev")
        print("2. Ejecutar tests básicos: pytest -k 'pagina_principal or hero_section' -v")
        print("3. Ver capturas generadas en: screenshots/")
        print("4. Leer la guía completa: README_TESTING.md")
    else:
        print("\n⚠️  El test de verificación falló")
        print("Posibles causas:")
        print("- El servidor de desarrollo no está corriendo")
        print("- Hay algún error en la configuración")
        print("- Revisa README_TESTING.md para troubleshooting")

if __name__ == "__main__":
    main()