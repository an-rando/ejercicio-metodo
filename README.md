# Ejercicio Práctico: Sistema de Gestión de Inventario

## 🎯 Objetivo

Completar una serie de operaciones con la API REST del sistema de gestión de inventario, entendiendo la estructura del código y las validaciones implementadas.

## 📋 Descripción del Sistema

El sistema permite gestionar bodegas y productos. Cada bodega tiene una capacidad limitada y contiene productos. Las operaciones están protegidas por autenticación JWT, por lo que es necesario registrarse e iniciar sesión antes de realizar operaciones.

## 🚀 Operaciones

Debes completar las siguientes operaciones en orden:

1. **Registro de usuario**: Crear una cuenta nueva en el sistema
2. **Inicio de sesión**: Obtener el token JWT para autenticación
3. **Creación de bodega**: Registrar una bodega nueva
4. **Actualización de bodega**: Modificar datos de la bodega creada
5. **Creación de productos**: Añadir dos productos diferentes a la bodega
6. **Eliminación de producto**: Eliminar uno de los productos creados
7. **Consulta de producto**: Verificar los datos del producto restante

## ⚠️ Importante

- Los identificadores (IDs) de bodegas y productos se generan automáticamente con un formato específico.
- Debes entender y utilizar correctamente estos IDs para las operaciones.
- Hay validaciones específicas en el código que deberás investigar para realizar las operaciones con éxito.
- **No se proporcionan instrucciones detalladas intencionalmente** - parte del desafío es entender cómo funciona el sistema a través del código.

## 📊 Entrega

Debes presentar un documento que incluya:

1. Capturas de pantalla o código de todas las peticiones realizadas (con los datos enviados)
2. Capturas de pantalla o texto de todas las respuestas recibidas
3. Breve explicación de los desafíos encontrados y cómo los resolviste

## 💡 Pistas

- Examina atentamente los archivos de validación para entender requisitos específicos
- Presta atención a los mensajes de error, te darán pistas sobre lo que está fallando
- Guarda todos los IDs generados ya que los necesitarás para operaciones posteriores
- Para operaciones con autenticación, recuerda incluir el token JWT en el header `Authorization: Bearer {tu_token_jwt}`
