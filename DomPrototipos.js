/**
 * A DomElement is the main constructor for objects that represent
 * the Dom hierarchy.
 */
function DomElement(type, childrenDefinition) {
    this.type = type;
    this.styles = {};
    this.children = [];

    for (let index = 0; index < (childrenDefinition || []).length; index++) {
        var definition = childrenDefinition[index];
        var newElement = new DomElement(definition.type, definition.children);
        newElement.__proto__ = this;
        this.children.push(newElement);
    }
}

/**
 * All Dom elements know how to print themselves
 */
DomElement.prototype.toString = function(indent) {
    if (!indent) {
        indent = 0;
    }
    var result = ' '.repeat(indent);
    result = result + 'Node ' + this.type + ' {';
    var styleKeys = Object.keys(this.styles);
    for (let index = 0; index < styleKeys.length - 1; index++) {
        var styleKey = styleKeys[index];
        result = result + styleKey + ':' + this.styles[styleKey] + ', '
    }
    if (styleKeys.length > 0) {
        result = result + styleKeys[styleKeys.length - 1] + ':' + this.styles[styleKeys[styleKeys.length - 1]];
    }
    result = result + '}'
    for (let index = 0; index < this.children.length; index++) {
        var element = this.children[index];
        result = result + "\n" + element.toString(indent+2);
    }
    return result;
}


var definition = {
    type: 'html',
    children: [{
        type: 'head'
    }, {
        type: 'body',
        children: [{
            type: 'div',
            children: [{
                type: 'div',
                children: [{
                    type: 'h1'
                }, {
                    type: 'p'
                }, {
                    type: 'p'
                }]
            }, {
                type: 'section',
                children: [{
                    type: 'h1'
                }, {
                    type: 'p'
                }, {
                    type: 'p'
                }]
            }]
        }, {
            type: 'aside',
            children: [{
                type: 'h1'
            }, {
                type: 'p'
            }, {
                type: 'p'
            }]
        }]
    }]
}

/*
 * La raiz del dom será el primer elemento de nuestras definiciones.
 */
var dom = new DomElement(definition.type, definition.children);

/*
Podemos probar añadir unos estilos y ver que sucede
*/

dom.children[1].styles = {
    background: 'red',
    color: 'blue'
};

dom.children[1].children[0].children[0].styles = {
    size: 17,
    color: 'green'
};

console.log(' ')
console.log(dom.toString());

/**************** PUNTO 1 ******************************/

/*
Queremos poder contar con una definición de estilos como a la siguiente.
*/
var styles = {
    'body section': {
        color: 'green',
        size: 25
    },
    'body': {
        background: 'black'
    },
    'h1': {
        size: 50,
        color: 'red'
    },
    'aside h1': {
        size: 30
    }
};

/*
El objetivo, es poder aplicar esos estilos a cada elemento del dom
según indique la regla asociada.
Ej. si la regla es "h1", entonces el estilo se aplica a todos los elementos
de tipo h1, pero si es "body h1" entonces se aplica a los h1 que están
dentro de body.

Más aún, los estilos se heredan según jerarquía. Si por ejemplo, si
"body" tiene color "red", entonces todos los hijos de body también
tendrán color "red", salvo que haya una regla que indique lo contrario.

Se pide entonces que implemente el comportamiento de getStyle
para que se le pueda preguntar a cualquier elemento del dom por sus
estilos completos, que incluyen tanto los declarados como los heredados.

Luego cree un metodo "viewStyleHierarchy" que imprima todos los nodos
con sus estilos completos (los propios y heredados), de forma similar a
toString (pero con tooooooodos los estilos).
*/

/**************** PUNTO 2 ******************************/

/*
Queremos agregar la idea de eventos, para que distintos elementos
del DOM puedan reaccionar ante diversos eventos.
Cada elemento del dom debe entender tres metodos más:

* on(nombreDeEvento, handler)
* off(nombreDeEvento)
* handle(nombreDeEvento)

Por ejemplo, podemos decir

dom.children[1].children[0].children[0].on('click', function() {
    console.log('Se apretó click en html body div div');
    return true;
})

El código de la función queda asociado al evento 'click' para ese
elemento del dom, y se activará cuando se haga el handle del evento.

dom.children[1].children[0].children[0].handle('click');


El tema es que queremos poder usar 'this' en la función para referirnos
al objeto que acaba de hacer el "handle" de la función. Ej.

dom.children[1].children[0].children[0].on('click', function() {
    console.log('Se apretó click en un ' + this.type);
    return true;
})

Por otro lado, cuando se hace el handling de un evento, este realiza
el proceso de bubbling-up, es decir, todo padre que también sepa manejar
el evento del mismo nombre debe activar el evento.

Por ejemplo, si activamos 'click' en dom.children[1].children[0].children[0]
y dom.children[1] también sabe manejar 'click', entonces, luego de ejecutar
el 'click' para dom.children[1].children[0].children[0], se deberá hacer el
bubbling-up para que dom.children[1] maneje 'click'. Hay una excepción, sin
embargo. Cuando el handler de un hijo describe falso luego de ejecutar,
el bubbling-up se detiene.

off por su parte, desactiva el handler asociado a un evento.

Se pide entonces que realice los cambios pertinentes para que los elementos
del dom puedan tener este comportamiento.
*/


/**************** PUNTO 3 ******************************/

/*
Queremos poder mostrar los nodos del dom de forma bonita
en la terminal, mediante el metodo display.

dom.display()

No todo nodo es visible sin embargo. Solo los elementos del body
deben mostrarse en este caso, ya que el head y html son solo
contenedores. Lo mismo ocurre con div, section y aside, que son
elementos invisibles.

Así, en este caso, solo vamos a mostrar los elementos h1 y p.
Pero ¿Qué mostramos de ellos? Para hacer la cosa más divertida, vamos
a agregar un atributo "contents" que nos permita agregar un texto
a esos elementos como contenido. Ese texto será el que se muestre
cuando llamemos a display.

Más aún, cada elemento se muestra de forma distinta según su tipo.
p muestra contents tal cual, pero h1 lo muestra todo en mayúscula, siempre.
Además el color del texto y del fondo depende del estilo del elemento,
(Ver https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color)
*/
