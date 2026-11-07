# EGP Luces — Stage Mapper 3D

Editor visual 3D de escenarios para EGP Luces, independiente de la operación EGP Bridge / Logic.

## Uso

Abrir `index.html` o https://danieldelgado29.github.io/egp-luces-stage-mapper/ desde Mac, iPhone o cualquier navegador compatible.

- Configuración: plantillas, local, medidas aproximadas en pasos (55 cm) o metros, músicos y sus instrumentos, luces y trusses.
- Escenario 3D: colocar y orientar visualmente los elementos.
- Shows guardados: almacenamiento local en cada navegador; exportar/importar JSON para transportar shows entre dispositivos.
- Iniciar un escenario nuevo crea un dúo (cantante y guitarra). El menú de músicos contiene 2, 3, 4, 5 y Custom (6 a 30).
- Cada músico admite un rol o instrumento personalizado y nombre individual.

**Advertencia:** Este editor no transmite señal DMX y no verifica la seguridad estructural de los montajes. La detección y calibración de luces son futuras etapas.

## Publicación

Se conserva cada versión íntegra bajo `versions/`, y `index.html` siempre corresponde a la versión pública más reciente después de aprobar y probar los cambios. No modificar componentes del sistema EGP Bridge de producción.

## V0.5 (iPhone)
- Selector de luces por nombre, modo tactil que da prioridad a las luminarias sobre los trusses.
- Ajuste de posicion individual con arrastre y flechas. Zoom con dos dedos.
- Sin salida DMX real. Las claves de guardado de shows siguen iguales.
