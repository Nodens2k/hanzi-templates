# hanzi-templates

[Read this page in English](./README_en.md)

Generador de plantillas imprimibles para practicar la escritura de hanzis (caracteres chinos).

Herramienta de ayuda para los estudiantes de chino.

Disponible en https://nodens2k.github.io/hanzi-templates/hanzi.html

## Uso

Elegir el tamaño deseado de los caracteres de la plantilla. Las opciones son: 10mm y 17mm.

Escribir el contenido de la plantilla, o elegir entre las disponibles más abajo.

Pulsar el botón Actualizar para refrescar el contenido de la plantilla. El botón "Copiar Enlace" permite copiar una URL con el contenido
de la plantilla que puede ser compartido.

Una vez que la plantilla está lista, usar la función de impresión del navegador. Actualmente, las líneas guía de las celdas no se
pueden imprimir desde un dispositivo Android (pendiente comprobar iPhone). Para imprimirlas, usar un ordenador y asegurarse de que
la opción de imprimir "imágenes de fondo" está activada.

Imprimir a un archivo PDF es otra forma de compartir las plantillas con más gente.

## Sintáxis de la plantilla

Se soportan dos sintaxis diferentes:
- Sintaxis por pares pinyin+hanzi
- Sintaxis de tabla CSV

### Sintáxis por pares pinyin+hanzi

- Cada línea de texto es una fila de la plantilla
- Una línea en blanco produce una fila vacía
- Cada fila se compone de un número par de palabras separadas por espacios. La primera palabra de cada pareja es la transcripción en pinyin,
  y la segunda el carácter hanzi.

### Sintáxis de tabla CSV

- Cada línea se corresponde con una fila de la plantilla, alternando entre filas de pinyin y filas de hanzis
- Las celdas de cada fila se separan mediante uno de los siguientes caracteres: |,./
- Se pueden usar tabuladores y espacios para alinear las celdas y mejorar la legibilidad de la plantilla
- Para que el generador detecte correctamente que se está usando esta sintaxis, es necesario al menos uno de los caracteres de separación en el texto

### Escritura de pinyin

Para escribir en pinyin se pueden escribir las vocales con los acentos diacríticos adecuados directamente, o usar la sintaxis de
"tonos numéricos", que consiste en escribir la sílaba sin acentos seguida de un número entre 1 y 4 indicando el tono. Así, por ejemplo,
las palabras "hǎo" y "hao3" son equivalentes.

También se pueden usar el teclado pinyin de la derecha. El carácter se insertará en la posición en la que se encuentre el cursor.

