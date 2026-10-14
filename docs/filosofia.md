# Filosofía

Vizui nace de una convicción: **el framework no debe interponerse entre tú y el DOM.** Cuanto más directo es el control, más fácil es razonar sobre lo que ocurre cuando algo no funciona.

## El DOM es un ciudadano de primera clase

No hay virtual DOM, no hay un árbol en memoria que espera a reconciliarse. El `Element` que construyes es el nodo que se monta, y lo que ves en el inspector es lo que escribiste. Eso hace que el mental model se reduzca a dos cosas: *qué declaraste* y *qué cambió*.

## Cero magia

Vizui no decora, no registra por arte de magia, no muta estados globales para ti. Cada consecuencia se puede trazar: de un Store a un atributo, de un evento a un manejador, de una ruta a una vista.

> No normalices tu código hacia las convenciones del framework, o los patrones populares, o las guías de estilo genéricas, salvo que resuelvan un problema real en el proyecto.

Eso es una postura de mantenimiento: el código cuyas consecuencias se pueden seguir se puede mantener. El código que "funciona por arte de magia" solo se puede temer.

## Responsabilidades separadas

Vizui no impone una forma de organizar el proyecto, pero la arquitectura recomendada es la misma que usa esta página:

- `app.ts` — la composición raíz: qué existe y qué se conecta.
- `renderer` — qué ruta monta qué vista.
- `pages/` — las vistas.
- `components.smart/` — componentes con estado y dominio.
- `components/` — funciones JSX sin estado.
- `state/` y `services/` — estado global y servicios conectados.

Cada capa sabe qué hace y no se mete en la tarea de la otra. Si una responsabilidad pertenece a otra capa, se mueve, no se duplica.

## Composición antes que estado global

Los servicios con estado se instancian en la composición raíz y se inyectan donde hacen falta. Nada de singletons ocultos, nada de service locators, nada de constructores que construyen medio universo en silencio.

La excepción es cuando el proyecto define deliberadamente una infraestructura global — un router, un bus de eventos, un logger — y entonces esa decisión es explícita.

## TypeScript es parte del diseño

TypeScript no es un adorno: expresa los límites de la arquitectura. Stores tipados e invariantes, uniones discriminadas, props estrictas. Los errores del compilador son un primer test que corre en el momento en que escribes.

## Lo que buscamos

Vizui no pretende competir por tener la mayor lista de features del ecosistema. Busca algo más difícil de medir:

- Que el **origen de cada cambio** sea legible en el código.
- Que el framework se **retire** una vez que tu arquitectura está andando.
- Que las abstracciones representen **conceptos reales**, no nombres bonitos creados para ahorrar tres líneas.
- Que el proyecto **evolucione** por capas bien definidas y no acumule banderas y casos especiales.
- Que quien herede el código entienda la consecuencia de un cambio **solo con seguirlo**.

## En una frase

> El objetivo no es que el código parezca "buen código" según un estándar genérico. El objetivo es que el código sea **internamente coherente con la arquitectura del proyecto**.

Eso es vizui. Prueba la página de *documentación* y mira los *componentes* en vivo.