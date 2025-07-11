# Pruebas E2E - Craftica Frontend

## Estado Actual de las Pruebas

### ✅ Pruebas Completadas y Funcionando

#### 1. **Autenticación** (`auth.cy.ts`)
- ✅ Login con credenciales reales
- ✅ Navegación desde login
- ✅ Manejo de errores de autenticación
- ✅ Logout y limpieza de sesión

#### 2. **Gestión de Tiendas** (`tiendas.cy.ts`)
- ✅ Lista de tiendas
- ✅ Creación de tiendas
- ✅ Navegación a detalles
- ✅ Validación de formularios
- ✅ Estados vacíos
- ⚠️ 2 pruebas comentadas (navegación y teclado)

#### 3. **Gestión de Productos** (`productos.cy.ts`)
- ✅ Lista de productos
- ✅ Creación de productos
- ✅ Búsqueda y filtros
- ✅ Navegación y validación
- ✅ Estados vacíos
- ⚠️ 3 pruebas comentadas (filtros de categoría)

#### 4. **Gestión de Publicaciones** (`publicaciones.cy.ts`)
- ✅ Lista de publicaciones
- ✅ Creación de publicaciones
- ✅ Navegación y validación
- ✅ Estados vacíos
- ⚠️ 2 pruebas comentadas (búsqueda y validación)

#### 5. **Búsqueda** (`busqueda.cy.ts`)
- ✅ Búsqueda de tiendas (formulario, envío, limpieza)
- ✅ Búsqueda de productos (tiempo real, filtros)
- ✅ Casos edge (caracteres especiales, espacios)
- ✅ Navegación desde resultados
- ✅ Paginación con búsqueda
- ⚠️ 1 prueba comentada (estado vacío de tiendas)

### 📊 Estadísticas Totales
- **Total de pruebas**: ~80 pruebas
- **Pruebas pasando**: ~70 pruebas
- **Pruebas comentadas**: ~10 pruebas
- **Tiempo de ejecución**: ~3-4 minutos

### 🔧 Pruebas Comentadas (Fallas Conocidas)

#### Tiendas
- Navegación con teclado (elementos no encontrados)
- Navegación con Enter (elementos no encontrados)

#### Productos
- Filtros de categoría (componentes Select personalizados)
- Validación de mensajes (no implementados en backend)

#### Publicaciones
- Búsqueda de publicaciones (no implementada en frontend)
- Validación de mensajes (no implementados en backend)

#### Búsqueda
- Estado vacío de tiendas (mensaje no aparece como esperado)

### 🎯 Próximos Pasos Sugeridos

#### 1. **Pruebas de Navegación Completa**
- Flujos de usuario completos (crear tienda → crear producto → crear publicación)
- Navegación entre secciones
- Breadcrumbs y navegación de regreso

#### 2. **Pruebas de Interacción Avanzada**
- Drag and drop para imágenes
- Selección múltiple
- Filtros avanzados
- Ordenamiento

#### 3. **Pruebas de Rendimiento**
- Tiempo de carga de páginas
- Tiempo de respuesta de búsquedas
- Optimización de imágenes

#### 4. **Pruebas de Accesibilidad**
- Navegación con teclado
- Lectores de pantalla
- Contraste de colores
- Etiquetas ARIA

#### 5. **Pruebas de Responsive**
- Diferentes tamaños de pantalla
- Orientación móvil
- Touch interactions

### 🚀 Comandos Útiles

```bash
# Ejecutar todas las pruebas E2E
npx cypress run

# Ejecutar pruebas específicas
npx cypress run --spec "cypress/e2e/auth.cy.ts"
npx cypress run --spec "cypress/e2e/tiendas.cy.ts"
npx cypress run --spec "cypress/e2e/productos.cy.ts"
npx cypress run --spec "cypress/e2e/publicaciones.cy.ts"
npx cypress run --spec "cypress/e2e/busqueda.cy.ts"

# Ejecutar en modo interactivo
npx cypress open

# Ejecutar con video
npx cypress run --record
```

### 📝 Notas Importantes

1. **Backend Vacío**: Las pruebas están diseñadas para funcionar con un backend vacío
2. **Credenciales Reales**: Se usan credenciales reales (test1@gmail.com) para login
3. **Estados Vacíos**: Las pruebas manejan correctamente los estados cuando no hay datos
4. **Componentes UI**: Algunas pruebas están comentadas debido a componentes UI personalizados
5. **Validaciones**: Algunas validaciones dependen del backend y están comentadas

### 🔄 Mantenimiento

- Revisar pruebas comentadas cuando se implementen las funcionalidades faltantes
- Actualizar selectores si cambia la UI
- Agregar nuevas pruebas para nuevas funcionalidades
- Mantener sincronización con cambios en el backend 