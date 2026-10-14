# Documentación

Vizui es un framework de UI para TypeScript que trabaja directo sobre el **DOM real**. Nuestro objetivo es que el framework se retire una vez que tu arquitectura está andando: estamos del lado de quien mantiene el código a largo plazo.

> Honestidad primero: todo lo que documenta esta página es lo que *esta misma página* usa. Este documento es un `.md` que la página pide por HTTP con su propio `http-client` y renderiza con el pipeline de markdown.

## Qué es vizui

Vizui es un conjunto pequeño de piezas construidas para trabajar juntas:

- Un motor de **JSX** que monta componentes y elementos directamente sobre el DOM.
- **Stores reactivos** tipados para el estado, con selección derivada.
- **Componentes**, **Layouts** y **Views** con ciclos de vida explícitos.
- Un **router** (con modo hash) y un **http-client** fluido sobre `fetch`.
- Una librería de **componentes reutilizables** (`vizui.components`).

Sobre todo, vizui es una **postura**: el framework no adivina tu intención. Cada pieza que montas, cada Store que enlazas, cada evento que escuchas, lo declaras tú.

## El App y el Router

La raíz es un `App` con un `Router`:

```ts
import { App, Router } from 'vizui';

const app = new App({
    root: '#app',
    router: new Router({ mode: 'hash' }),
});

app.router.layout('/', () => new AppLayout());

app.router.show('/', () => new HeroPage());
app.router.show('/docs', () => new DocsPage());
app.router.notFound(() => NotFound);
app.router.use(new Guard.Error((error, entry) => { /* … */ }));

void app.start();
```

- `router.layout(path, factory)` fija el caparazón, que se monta una sola vez.
- `router.show(path, factory)` registra una ruta; el factory devuelve la vista a montar en el outlet.
- `router.navigate(path)` navega; `router.on('change', entry => …)` observa las transiciones.
- `router.notFound(...)` y `Guard.Error` cubren el 404 (el mismo flujo que usa GitHub Pages) y los errores.

## Reactividad con Stores

El estado vive en `Store<T>` tipado:

```ts
import { Store } from 'vizui';

const count = Store.create(0);

count.set(count.state + 1);
count.smartSet((prev) => prev + 1);

const unsub = count.subscribe((value) => console.log(value));
unsub(); // deja de observar

const doubled = count.select((value) => value * 2); // Store derivado
doubled.destroy(); // también el derivado se destruye
```

Los Stores también son *cargables*: si un `Store<Element>` está montado como hijo, al cambiar su valor vizui lo vuelve a pintar por ti. Nada de parchear el DOM a mano.

## Elementos

Se construyen con JSX (el modelo es `react-jsx`, con `jsxImportSource` en `vizui`) o con `Element.new`:

```ts
import { Element } from 'vizui';

const button = Element.new('button', {
    text: 'Añadir',
    attributes: { class: 'primary' },
    events: { click: () => app.router.navigate('/docs') },
});
```

Un atributo puede enlazarse a un `Store<string | null>` y se actualiza solo:

```tsx
<span class={storeDeClase}>{storeDeTexto}</span>
```

Cuando un nodo se desconecta del árbol, te enteras vía `root.observer.on('remove', () => …)`, que es donde se destruyen Stores y se deshacen las suscripciones.

## JSX es azúcar

El mismo componente se escribe de dos formas, y ambas son vizui:

```tsx
// Contador.tsx — con JSX
import { Component, Store } from 'vizui';

export class Contador extends Component<'div'> {
    private readonly vCount = Store.create(0);

    root = (
        <div>
            <span>{this.vCount}</span>
            <button type="button" on:click={() => this.vCount.smartSet(n => n + 1)}>+1</button>
        </div>
    );
}
```

```ts
// Contador.ts — sin JSX
import { Component, Element, Store } from 'vizui';

export class Contador extends Component<'div'> {
    private readonly vCount = Store.create(0);
    private readonly vAttribute = this.vCount.select<string | null>(n => n.toString());
    private readonly eValue = Element.new('span')
        .append(this.vCount)
        .setAttribute('aria-valuenow', this.vAttribute);

    root = Element.new('div')
        .append(this.eValue)
        .append(Element.new('button', { text: '+1' })
            .on('click', () => this.vCount.smartSet(n => n + 1)));
}
```

Sin JSX puedes montar un Store como hijo — `.append(store)` pinta su valor y lo re-renderiza al cambiar — y enlazar atributos reactivos con `.setAttribute(nombre, store)`, que escribe el valor y reacciona al estado. Lo mismo que hace `{store}` y `on:click` en JSX, sin azúcar.

JSX compila a la misma API bajo el capó (`jsx-runtime`), de modo que puedes mezclar ambas formas en un mismo proyecto — incluso en un mismo componente. La portada de esta página muestra los dos contadores uno al lado del otro para que lo compruebes.

**No hace falta JSX para construir algo real.** El contador de la portada (`ImperativeCounter.ts`) es código real de esta página: `Element`, `Component`, stores y un `.append(store)` reactivo — sin una sola etiqueta JSX.

## Componentes

Tres piezas para componer la interfaz:

- `Component` — comportamiento y estado propios, montable en cualquier parte.
- `Layout` — el caparazón: contiene un outlet donde se monta el contenido de la ruta.
- `View` — la página de una ruta.

Y los componentes sin estado son funciones JSX puras. El CSS vive junto a cada componente y se carga por capas:

```tsx
import { CSS } from 'vizui';

CSS.load('Card.css', import.meta);
```

## HTTP

Un cliente fluido sobre `fetch`, listo para JSON:

```ts
import { HttpClient } from 'vizui';

const http = new HttpClient('https://api.github.com', { timeout: 8000 });

const user = await http.getJson('/users/NetFeez');
const text = await http.get('./docs/vizui.md').send().then((r) => r.text());
```

- `get/post/put/patch/delete/head/options` devuelven un `Request` configurable (`json`, `timeout`, `signal`, `header`, `search`) con su `then` promisificado.
- `Response` expone `ok`, `status`, `json()`, `text()` y `toError()`.
- Los fallos se modelan con `NetworkError` (`kind`, `status`, `isTimeout`, `isHttp`).

## Markdown

La sección que estás leyendo es markdown. La página lo carga con `http.get(...).send().then(r => r.text())` y lo compila a un árbol de elementos vizui con un pipeline *de la propia página* (`Parser` → `Renderer`). Ese `Markdown` no forma parte de `vizui` ni de `vizui.components`: es un componente de este repositorio, montado con `Component` y `Store` como cualquier otra pieza.

## Componentes reutilizables

`vizui.components` aporta widgets de interfaz listos para usar: `Button`, `TextInput`, `NumericInput`, `SwitchInput`, `SelectInput`, `Window`, `Loading`, `Logo`, `QRGenerator` y más. Su CSS se resuelve con depflow al lado del JavaScript. La página de **Componentes** los muestra en vivo.

## Cómo se sirve esta página

Esta página es estática: `index.html` define un `importmap` que apunta `vizui` y `vizui.components` a las carpetas ya compiladas, los scripts escriben JSX y TS puro, y `tsc` emite los módulos ES. No hay bundler. Puedes publicarla en GitHub Pages tal cual.

## La página está hecha con lo que vende

| Pieza | Cómo se usa aquí |
| --- | --- |
| Router | rutas, 404 y guard de errores |
| Stores | reloj en vivo, contador, tarjetas reactivas |
| HttpClient | perfil del repositorio, el autor y *este documento* |
| Markdown (de esta página) | esta documentación y la de Filosofía |
| vizui.components | botones, entradas, ventana y carga en la página de Componentes |