# Plataforma de Ayuda y Emergencias

Esta plataforma es una iniciativa de código abierto (open source) nacida en el contexto de la emergencia por incendios forestales en Chile. Su propósito es funcionar como un puente digital solidario que facilite el acceso a información centralizada y la coordinación de ayuda entre ciudadanos.

##  Objetivo y Alcance

El objetivo principal es reducir la fricción en la entrega de ayuda y la búsqueda de información durante momentos críticos. La plataforma permite:
- **Centralizar necesidades:** Las personas afectadas pueden publicar qué necesitan (enseres, herramientas, apoyo).
- **Visibilizar la ayuda:** Voluntarios pueden ver en un mapa o lista dónde se requiere apoyo urgente.
- **Informar:** Proveer datos de contacto de emergencia, albergues y centros de acopio de manera clara y accesible.

Este proyecto prioriza la simplicidad, la accesibilidad (mobile-first) y el uso responsable de la información.

## ⚠️ Contexto de Uso y Responsabilidad (Disclaimer)

Esta plataforma es una herramienta de apoyo ciudadano y **NO reemplaza ni constituye un canal oficial de comunicación**.

Para emergencias vitales, evacuaciones o denuncias, utilice siempre los canales de las autoridades:
- **131**: SAMU (Ambulancia)
- **132**: Bomberos
- **133**: Carabineros
- **CONAF / SENAPRED**: Para información oficial sobre el estado del siniestro.

**Nota sobre la información:** Los datos presentados aquí son referenciales y alimentados por la comunidad. Aunque existen mecanismos de verificación, la situación en terreno puede cambiar rápidamente. Recomendamos siempre confirmar la información antes de movilizarse.

## 🛠️ Tecnologías Utilizadas

El proyecto está construido sobre un stack moderno y eficiente, pensado para ser desplegado con facilidad:

- **Frontend:** React + Vite (Interfaz de usuario rápida y reactiva).
- **Estilos:** Tailwind CSS (Diseño limpio y adaptable).
- **Mapas:** Leaflet / React-Leaflet (Visualización geoespacial ligera).
- **Backend:** Node.js + Express (API RESTful).
- **Base de Datos:** PostgreSQL (Persistencia robusta de datos).

## 🤝 Cómo Contribuir

Este es un proyecto de software libre y cívico. Creemos en el poder de la colaboración. Si eres desarrollador/a, diseñador/a o tienes ideas para mejorar la plataforma:

1.  Revisa los [Issues](https://github.com/SolangeLisset/plataforma-ayuda-emergencias/issues) abiertos para ver dónde puedes ayudar.
2.  Haz un Fork del repositorio.
3.  Crea una rama con tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
4.  Envía un Pull Request describiendo tus cambios.

Toda contribución que mejore la usabilidad, seguridad o eficiencia de la plataforma es bienvenida.

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/SolangeLisset/plataforma-ayuda-emergencias.git

# 2. Configurar Backend
cd backend
npm install
# (Configurar .env según ejemplo)
npm run dev

# 3. Configurar Frontend
cd frontend
npm install
npm run dev
npm run dev
```

## 🔐 Variables de Entorno

Este proyecto utiliza variables de entorno para su configuración.

- El repositorio incluye un archivo `.env.example`
- Debes crear tu propio archivo `.env` basado en ese ejemplo
- **Nunca subas tu archivo `.env` al repositorio**

Ejemplo:
```bash
cp .env.example .env
```

## 📊 Estado del Proyecto

**Estado:** Activo / En Desarrollo / Mantenimiento.

El código base se encuentra estable para sus funciones principales (registro de necesidades, mapa interactivo, filtros y panel administrativo básico). Se continúa trabajando en mejoras de UX y validación de datos.

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Eres libre de usar, modificar y distribuir este software, siempre manteniendo la atribución original.

## 👩‍💻 Créditos y Autoría

Esta plataforma fue desarrollada con ❤️ y compromiso social por **Solange Lisset**.

Aunque el proyecto es de código abierto, la autoría original se mantiene conforme a la licencia MIT.

---
*La tecnología al servicio de las personas.*
