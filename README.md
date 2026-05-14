# Calculadora

Calculadora web con modo oscuro (noche) y modo claro (día), construida con Next.js 15, TypeScript y Tailwind CSS.

## Características

- ✅ Operaciones básicas: suma, resta, multiplicación, división
- ✅ Porcentaje y cambio de signo
- ✅ Borrado carácter a carácter (backspace)
- ✅ Historial de expresión en pantalla
- ✅ **Toggle día/noche** con transiciones suaves
- ✅ Diseño responsivo inspirado en iOS

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000/calculadora](http://localhost:3000/calculadora)

## Producción

```bash
npm run build
npm start
```

O con PM2:

```bash
pm2 start ecosystem.config.js
```

## Tema oscuro / claro

El botón en la esquina superior derecha de la calculadora alterna entre **Modo Día** ☀️ y **Modo Noche** 🌙. El estado se mantiene en React state (no persiste entre recargas por diseño minimalista).
