# Cómo desplegar este proyecto en tu dominio

Este repo es el **frontend** de tu app de Base44. El backend (usuarios,
base de datos, pagos con Stripe, funciones, cursos, meditaciones, tienda)
sigue viviendo en Base44 — este código solo se conecta a él mediante
variables de entorno.

App ID de este proyecto: `6a4f1101572ca9dba6c7642f`

## 1. Subir el código a GitHub

Desde la carpeta del proyecto, en tu computadora:

```bash
git init
git add .
git commit -m "Primer commit - export desde Base44"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

(Antes creá el repositorio vacío en GitHub desde github.com/new, sin
README ni .gitignore, para que no choque con los archivos que ya trae
este proyecto).

## 2. Conectar el repo en tu plataforma de hosting

1. Click en **"Connect GitHub"**
2. Autorizá el acceso y elegí el repositorio que acabás de crear
3. Configuración del build:
   - **Install command:** `npm install`
   - **Build command:** `npm run build`
   - **Output / publish directory:** `dist`

## 3. Variables de entorno (paso crítico)

En la sección de "Environment Variables" de tu plataforma de hosting,
agregá:

| Variable | Valor |
|---|---|
| `VITE_BASE44_APP_ID` | `6a4f1101572ca9dba6c7642f` |
| `VITE_BASE44_APP_BASE_URL` | la URL real de esta app publicada en Base44 |

Sin esto, el sitio va a compilar y verse bien, pero el login, la base de
datos y los pagos no van a funcionar.

## 4. Chequeo (ver mensaje anterior)

1. Build en verde ("Success")
2. El sitio carga visualmente
3. Login / registro funciona → confirma que las variables están bien
4. Checkout de Stripe funciona (probar en modo test)

## 5. Dominio

Recién cuando la URL temporal funciona 100%, conectás tu dominio propio
en la misma plataforma.

## Importante

- Mantené tu app de Base44 **publicada y activa**.
- Los pagos de Stripe están implementados como funciones de backend en
  Base44 (`base44/functions/stripe-checkout`, `stripe-webhook`), no en
  este código.
- Si tenés OTRO proyecto de Base44 exportado con un App ID distinto
  (por ejemplo uno llamado "Lejju Soul" con ID
  `6a4c7d96b4694d4f3f3b6914`), no lo mezcles con este — son apps y
  bases de datos completamente separadas.
