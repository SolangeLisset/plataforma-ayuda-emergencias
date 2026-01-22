🎯 Propósito Principal
Conectar de forma rápida y eficiente a personas afectadas por desastres con voluntarios dispuestos a ayudar, priorizando la velocidad y la baja fricción en momentos de crisis.

🌟 Funcionalidades Clave

1. Para el Afectado (Solicitar Ayuda):

Acceso Público (Sin Login): No se requiere registro para pedir ayuda. Se utiliza un "Modo Invitado" que pide nombre y teléfono.
Formulario Específico: Categorías claras (Alimentos, Agua, Mascotas, etc.) y ubicación precisa (Región/Comuna).
Gestión de Mascotas: Opción especial para reportar mascotas perdidas, encontradas o reunificadas.
Subida de Fotos: Posibilidad de adjuntar imágenes para dar contexto a la necesidad.

2. Para el Voluntario (Ofrecer Ayuda):

Muro de Necesidades: Lista filtrable por categoría y región.
Mapa Interactivo: Visualización geoespacial de todos los casos en Ñuble, Biobío y Araucanía. Clusterización para evitar saturación visual.
Acción Directa: Botones grandes para conectar vía WhatsApp o compartir la ficha en redes sociales.
Sistema de Ofertas: Registro transparente de cuántas personas han ofrecido ayuda a cada caso.

3. Para la Administración (Control y Seguridad):

Panel de Administración: Vista protegida para gestionar el contenido.
Moderación: Capacidad para verificar ("check azul"), completar o eliminar solicitudes.
Auditoría: Registro de qué administrador verificó cada caso.
Anti-fraude: Limitación de tasa (rate-limiting) para prevenir spam masivo.

4. Interfaz de Emergencia (UI/UX):

Home Estructurado («Mobile First»): Secciones claras de lectura rápida.
Botón SOS: Acceso inmediato a teléfonos de emergencia (131, 132, 133).
Resumen de Situación: Bloque destacado con estado actual de la emergencia.
Albergues: Lista desplegable con direcciones de recintos de apoyo.
Disclaimer: Advertencias claras sobre el carácter referencial de la plataforma.
🛠️ Aspectos Técnicos
Open Source: Licencia MIT, listo para colaboración en GitHub.
Stack Moderno: React + Vite (Frontend), Node.js + Express (Backend), PostgreSQL + Sequelize (Datos).
Configurable: Archivo 
disaster-config.json
 centralizado para adaptar regiones y categorías fácilmente.
El sistema está 100% operativo localmente con los cambios recientes de acceso público y actualización de regiones.