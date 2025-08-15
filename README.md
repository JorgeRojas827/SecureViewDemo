# SecureView Demo

Una aplicación React Native que demuestra la implementación de vistas seguras para datos sensibles de tarjetas, siguiendo los principios de Clean Architecture y Domain-Driven Design.

## 🚀 Características

- **Gestión de Tarjetas**: Listado y visualización de tarjetas de crédito/débito
- **Vista Segura**: Integración con módulo nativo para mostrar datos sensibles de forma segura
- **Arquitectura Limpia**: Separación clara de responsabilidades entre capas
- **TypeScript**: Tipado estricto en toda la aplicación
- **Tests Completos**: Cobertura de tests del 85.88%
- **Performance Optimizada**: React.memo, useCallback, useMemo
- **Accesibilidad**: Labels y hints para screen readers

## 📱 Capturas de Pantalla

La aplicación muestra una lista de tarjetas con la opción de "Ver datos sensibles" que abre una vista segura nativa.

## 🏗️ Arquitectura

### Capa de Dominio (Domain Layer)

- **Entidades**: `Card`, `SecureCardData`, `SecureToken`
- **Casos de Uso**: `GetCardsUseCase`, `GenerateSecureTokenUseCase`, `ShowSecureCardUseCase`
- **Repositorios**: Interfaces abstractas para acceso a datos

### Capa de Infraestructura (Infrastructure Layer)

- **Servicios de Datos**: `CardDataService`, `SecureTokenService`, `SecurityLoggerService`
- **Implementaciones de Repositorios**: `CardRepositoryImpl`, `TokenRepositoryImpl`, `SecureCardBridgeImpl`

### Capa de Presentación (Presentation Layer)

- **Componentes**: `CardItem`, `CardsList`, `DashboardScreen`
- **Hooks**: `useCards`, `useSecureCardView`

## 🛠️ Tecnologías

- **React Native**: 0.81.0
- **TypeScript**: 5.8.3
- **Jest**: Framework de testing
- **React Native Testing Library**: Testing de componentes
- **Clean Architecture**: Patrón arquitectónico
- **Domain-Driven Design**: Diseño centrado en el dominio

## 📦 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd SecureViewDemo
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Instalar dependencias de iOS (solo macOS)**
   ```bash
   cd ios && pod install && cd ..
   ```

## 🚀 Ejecución

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Metro Bundler

```bash
npm start
```

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm run test:coverage
```

### Ejecutar tests en modo watch

```bash
npm run test:watch
```

## 📊 Cobertura de Tests

Actualmente tenemos una cobertura del **85.88%** con **116 tests pasando**:

- **Statements**: 85.88%
- **Branches**: 77.35%
- **Functions**: 83.67%
- **Lines**: 86.16%

### Distribución por Capas:

- **Presentación**: 100% coverage
- **Infraestructura**: 93.33% coverage
- **Dominio**: 33.33% coverage (interfaces)

## 🔧 Configuración del Proyecto

### Estructura de Archivos

```
src/
├── capabilities/
│   └── card-management/
│       ├── domain/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── use-cases/
│       ├── infrastructure/
│       │   ├── datasources/
│       │   └── repositories/
│       └── presentation/
│           ├── components/
│           ├── hooks/
│           └── screens/
└── shared/
    ├── constants/
    ├── types/
    ├── ui/
    └── utils/
```

### Scripts Disponibles

- `npm start`: Iniciar Metro bundler
- `npm run ios`: Ejecutar en iOS
- `npm run android`: Ejecutar en Android
- `npm test`: Ejecutar tests
- `npm run test:coverage`: Ejecutar tests con cobertura
- `npm run test:watch`: Ejecutar tests en modo watch
- `npm run lint`: Ejecutar ESLint
- `npm run lint:fix`: Corregir errores de ESLint automáticamente

## 🔒 Seguridad

La aplicación implementa múltiples capas de seguridad:

1. **Tokens Seguros**: Generación de tokens temporales para acceso a datos sensibles
2. **Vista Nativa Segura**: Integración con módulo nativo `fintech-secure-native`
3. **Logging de Seguridad**: Registro de todos los accesos a datos sensibles
4. **Validación de Acceso**: Verificación de permisos de usuario por tarjeta

## 🎯 Casos de Uso

### Ver Datos Sensibles de Tarjeta

1. El usuario selecciona una tarjeta de la lista
2. Presiona "Ver datos sensibles"
3. Se genera un token seguro
4. Se abre la vista nativa segura con los datos completos
5. Se registra el acceso en el log de seguridad

### Gestión de Estados

- **Loading**: Estados de carga individuales por tarjeta
- **Error**: Manejo robusto de errores con mensajes informativos
- **Empty State**: Estados vacíos cuando no hay tarjetas

## 🔧 Desarrollo

### Agregar Nueva Funcionalidad

1. Definir entidades en la capa de dominio
2. Crear casos de uso para la lógica de negocio
3. Implementar repositorios en la capa de infraestructura
4. Crear componentes en la capa de presentación
5. Agregar tests para todas las capas

### Convenciones de Código

- **TypeScript**: Tipado estricto obligatorio
- **Clean Architecture**: Respetar la separación de capas
- **SOLID Principles**: Aplicar principios SOLID
- **Testing**: Tests unitarios para toda la lógica de negocio

## 📈 Performance

### Optimizaciones Implementadas

- **React.memo**: Para componentes que no necesitan re-renderizarse
- **useCallback**: Para funciones que se pasan como props
- **useMemo**: Para cálculos costosos
- **FlatList**: Para listas largas con virtualización

### Métricas de Performance

- **Bundle Size**: Optimizado con tree shaking
- **Memory Usage**: Gestión eficiente de memoria
- **Startup Time**: Carga rápida de la aplicación

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Jorge Luis Rojas Poma** - _Desarrollo inicial_ - [GitHub](https://github.com/jorgeluisrojaspoma)

## 🙏 Agradecimientos

- React Native Community
- Clean Architecture por Uncle Bob
- Domain-Driven Design por Eric Evans
- Testing Library por Kent C. Dodds

## 📞 Contacto

Jorge Luis Rojas Poma - [LinkedIn](https://linkedin.com/in/jorgeluisrojaspoma)

Link del Proyecto: [https://github.com/jorgeluisrojaspoma/SecureViewDemo](https://github.com/jorgeluisrojaspoma/SecureViewDemo)
