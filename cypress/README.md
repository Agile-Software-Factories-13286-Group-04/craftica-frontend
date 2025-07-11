# Tests E2E con Cypress

Este directorio contiene los tests end-to-end (E2E) para la aplicación Craftica usando Cypress.

## 🚀 Configuración

### Prerrequisitos

1. **Node.js** 16+ 
2. **Aplicación corriendo** en `http://localhost:3000`

### Instalación

```bash
# Instalar dependencias
npm install

# Verificar que Cypress está instalado
npx cypress --version
```

## 🧪 Ejecutar Tests

### Tests E2E con interfaz gráfica
```bash
npm run cypress:open
```

### Tests E2E en modo headless
```bash
npm run cypress:run
```

### Tests E2E específicos
```bash
# Ejecutar solo tests de tiendas
npx cypress run --spec "cypress/e2e/tiendas.cy.ts"

# Ejecutar tests básicos
npx cypress run --spec "cypress/e2e/basic.cy.ts"
```

## 📁 Estructura

```
cypress/
├── e2e/
│   ├── basic.cy.ts        # Tests básicos de verificación
│   └── tiendas.cy.ts      # Tests para lista de tiendas
├── fixtures/              # Datos de prueba
├── support/
│   ├── commands.ts        # Comandos personalizados
│   └── e2e.ts            # Configuración global
└── README.md              # Esta documentación
```

## 🎯 Tests Disponibles

### Básicos (`basic.cy.ts`)
- ✅ Verificar que Cypress funciona
- ✅ Navegación a páginas externas
- ✅ Navegación a la aplicación

### Tiendas (`tiendas.cy.ts`)
- ✅ Carga de página de tiendas
- ✅ Visualización de lista de tiendas
- ✅ Filtrado por ciudad
- ✅ Navegación a detalles de tienda
- ✅ Botón de crear nueva tienda
- ✅ Navegación al formulario de crear
- ✅ Autenticación y redirecciones
- ✅ Responsive design (móvil, tablet, desktop)
- ✅ Loading states
- ✅ Manejo de errores
- ✅ Paginación

## 🔧 Configuración

### Variables de Entorno

```bash
# URL base de la aplicación
CYPRESS_BASE_URL=http://localhost:3000

# Timeout para tests (ms)
CYPRESS_DEFAULT_COMMAND_TIMEOUT=10000
```

### Comandos Personalizados

```typescript
// Login automático
cy.login('user@example.com', 'password');

// Obtener elementos por data-testid
cy.getByTestId('tienda-card');

// Simular usuario autenticado
cy.mockAuthenticatedUser();

// Limpiar autenticación
cy.clearAuth();
```

## 🐛 Troubleshooting

### Error: No se puede conectar a localhost:3000
1. Verificar que la aplicación está corriendo
2. Ejecutar `npm run dev` en otra terminal
3. Verificar que el puerto 3000 está libre

### Error: Elemento no encontrado
1. Verificar que la aplicación está cargada
2. Revisar selectores CSS en los tests
3. Agregar `data-testid` a elementos críticos

### Error: Timeout
1. Aumentar timeout en `cypress.config.ts`
2. Verificar conexión a internet
3. Revisar logs del servidor

## 📸 Screenshots y Videos

Los tests automáticamente toman screenshots en caso de error:
- Ubicación: `cypress/screenshots/`
- Formato: PNG
- Videos: `cypress/videos/` (deshabilitado por defecto)

## 🔄 CI/CD

Para ejecutar en CI/CD:

```yaml
# GitHub Actions
- name: Run E2E Tests
  run: |
    npm run build
    npm run start &
    sleep 10
    npm run cypress:run
```

## 📝 Agregar Nuevos Tests

1. Crear archivo `{feature}.cy.ts` en `cypress/e2e/`
2. Usar comandos personalizados cuando sea posible
3. Seguir patrón de `describe` e `it`

```typescript
describe('Mi Feature', () => {
  beforeEach(() => {
    cy.visit('/mi-pagina');
  });

  it('debería hacer algo', () => {
    cy.get('[data-testid="mi-elemento"]').should('exist');
  });
});
```

## 🎨 Mejores Prácticas

1. **Usar data-testid** para elementos críticos
2. **Usar comandos personalizados** para código reutilizable
3. **Limpiar estado** entre tests
4. **Hacer screenshots** en errores
5. **Tests independientes** que no dependan entre sí
6. **Usar beforeEach** para setup común

## 📊 Reportes

Los tests generan reportes en:
- Consola: Resultados detallados
- Screenshots: Imágenes de errores
- Videos: Grabaciones de tests (opcional)

---

**¡Happy Testing! 🧪✨** 