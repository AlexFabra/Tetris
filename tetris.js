//creamos una constante para guardar el canvas (la herramienta para dibujar gráficos)
const lienzo = document.querySelector("canvas")
//la herramienta context tiene acceso a los métodos de la interfaz de dibujo
//poner 2d es necesario, muestra que la animación será en 2d:
const CONTEXTO = lienzo.getContext("2d")
//variables de medida de la zona de juego del lienzo:
const INICIO_ALTO_LIENZO = 6
const INICIO_ANCHO_LIENZO = 4
const ANCHO_LIENZO = lienzo.width-60//lienzo.style.width
const ALTO_LIENZO = lienzo.height-60 //lienzo.style.height
//variables y métodos para definir la cuadricula donde se dibujarán los tetrominós:
const ANCHO_CUADRICULA=14
const ALTO_CUADRICULA=30
let cuadricula = crearCuadricula(ANCHO_CUADRICULA,ALTO_CUADRICULA)
//medida de los cuadrados que forman los tetrominós:
const ANCHO_ALTO_CUADRADO = 10
//DISTANCIA entre cuadrados:
const DISTANCIA=3
//velocidad del juego (milisegundos):
let velocidad=1000
//indicador de la pausa del juego:
let juegoPausado = false
let tetromino = []

//coordenadas de la pieza del usuario (modificables por el usuario mediante teclado):
var coorUsuario = {
x:5,
y:0
}
function crearTetromino(tipo){
    switch(tipo){
        case 0:
            return [
                [0,0,0],
                [1,1,1],
                [0,1,0]
            ]
        case 1:
            return [
                [1,0,0,0],
                [1,0,0,0],
                [1,0,0,0],
                [1,0,0,0]
            ]
        case 2:
            return [
                [1,1],
                [1,1]
            ]

        case 3:
            return [
                [1,0,0],
                [1,0,0],
                [1,1,0]
            ]

        case 4:
            return [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ]
        }
}
function nuevaPieza(){
    var randomnumber = Math.floor(Math.random() * (4 + 1));
    //se elige al azar un tetromino:
    tetromino=crearTetromino(randomnumber)
    //Reinicio de las coordenadas del tetrominó:
    coorUsuario.x=5
    coorUsuario.y=0
    //si hay una colisión cuando la pieza sale (se pierde la partida):
    return tetromino
}
//crearCuadricula llena el array cuadricula de arrays (para hacerlo bidimensional) y los rellena de valores:
function crearCuadricula(ancho,alto){
    let cuadricula=[]
    //con este for se llena la cuadrícula de arrays
    for(let i=0;i<alto;++i){
        //push pone, en cada posición del vector, un array del largo de posicionX y lo llena de valores (0):
        cuadricula.push(new Array(ancho).fill(0))
    }
    return cuadricula
}
function dibujar(){
    let coorX=INICIO_ALTO_LIENZO
    let coorY=INICIO_ANCHO_LIENZO
    for(let i=0;i<ALTO_CUADRICULA;++i){
        for(let x=0;x<ANCHO_CUADRICULA;x++){
            if(cuadricula[i][x]!==0){
                //la herramienta fillRect permite dibujar un rectángulo:
                CONTEXTO.fillRect(coorX+DISTANCIA,coorY+DISTANCIA,ANCHO_ALTO_CUADRADO,ANCHO_ALTO_CUADRADO)
            }
            if(cuadricula[i][x]===0){
                //la herramienta clearRect permite borrar un rectángulo:
                CONTEXTO.clearRect(coorX+DISTANCIA,coorY+DISTANCIA,ANCHO_ALTO_CUADRADO,ANCHO_ALTO_CUADRADO)
            }
            coorX+=ANCHO_ALTO_CUADRADO+DISTANCIA
        }
        coorX=INICIO_ALTO_LIENZO
        coorY+=ANCHO_ALTO_CUADRADO+DISTANCIA
    }
}
//limpiarMovimiento despeja el movimiento anterior de la pieza despejando los valores '1'
//de la cuadricula
function limpiarMovimiento(){
    cuadricula.forEach((fila)=>{
        fila.forEach((cuadrado,x)=>{
            //si los valores de la cuadricula son iguales a 1:
            if(cuadrado===1){
                fila[x]=0
            }
        })
    })
}
/** Cambia los valores de la cuadricula correspondientes a la representación del tetromino actual.
 * @param tetrominoElegido el tetrominó actual
 * @param coordenadaX la coordenada x del tetrominó en la cuadrícula
 * @param coordenadaY la coordenada y del tetrominó en la cuadrícula
 */
function tetrominoACuadricula(tetrominoElegido,coordenadaX,coordenadaY) {
    let counterY=0
    let counterX=0
    /** este bucle va desde el primer vector del tetromino hasta el último.
     *  para ello, inicializamos i en la coordenada vertical
     *  y su límite será dicha coordenada más el número de sus vectores.
     */
    for (let i = coordenadaY; i < coordenadaY + tetrominoElegido.length; i++) {
        /**este bucle va desde el primer valor del vector hasta el último.
         * para ello, iniciamos el primer valor en la coordenada horizontal
         * y su límite serà dicha coordenada más el numero de sus valores.
         * para saber en que vector se posiciona y por tanto saber el
         * numero de valores, necesitamos contadores:
         */
        for (let j = coordenadaX; j < coordenadaX + tetrominoElegido[counterY].length; j++) {
            /** como queremos ubicar el tetromino en la cuadrícula,
             * si el tetromino[cy][cx]!==0, habra que pintar cambiar el valor de la variable del
             * vector correspondiente en la cuadricula para que se pinte:
             */
            if (tetrominoElegido[counterY][counterX] !== 0) {
                cuadricula[i][j] = 1
            }
        counterX++
        }
        counterX=0
        counterY++
    }
}

//la función tiempo reposiciona el tetromino
function tiempo(){
    //cambioColor()
    let ubicacionY = coorUsuario.y*(ANCHO_ALTO_CUADRADO+DISTANCIA)
    //si el tetromino está por encima del fondo del lienzo y bajo el tetromino no hay otro:
    if(ubicacionY<=ALTO_LIENZO && !colisionFinal(tetromino,coorUsuario.x,coorUsuario.y)){ //&& cuadricula[coorUsuario.y+tetromino.length][coorUsuario.x]!=2
        //borramos el movimiento anterior:
        limpiarMovimiento()
        //el paso del tiempo hace que el tetromino esté más abajo:
        coorUsuario.y+=1
        tetrominoACuadricula(tetromino,coorUsuario.x,coorUsuario.y)
        dibujar()
    } else {
        posicionFinal(tetromino,coorUsuario.x,coorUsuario.y)
        tetromino=nuevaPieza()
        //aumentamos la velocidad del juego:
        velocidad=velocidad*0.9
        //reiniciamos el intervalo y lo volvemos a guardar en 'actualizar'
        clearInterval(actualizar)
        actualizar = setInterval(tiempo,velocidad)
    }
}
//colisionLateral gestiona las colisiones con la pared o con otros tetrominos
function colisionLateral(direccion){
    let ubicacionX = coorUsuario.x*(ANCHO_ALTO_CUADRADO+DISTANCIA)
    let ubicacionY = coorUsuario.y*(ANCHO_ALTO_CUADRADO+DISTANCIA)
    //si las coordenadas del tetromino se ubican en el limite derecho y el usuario quiere ir a la derecha:
    if(ubicacionX>ANCHO_LIENZO && direccion===1 && coorUsuario.x+1!==2){
        return true
    //si las coordenadas se ubican en el límite izquierdo y el usuario quiere ir a la izquierda:
    } else if (ubicacionX<INICIO_ALTO_LIENZO && direccion===-1){
        return true
    //si las coordenadas se ubican en el fondo y el usuario quiere moverse hacia abajo:
    } else if (ubicacionY>ALTO_LIENZO){
        console.log("choque")
        return true
    } else {
        return false
    }
}
function colisionFinal(tetrominoElegido,coordenadaX,coordenadaY){
    let tElegido = tetrominoElegido
    let coorX=coordenadaX
    let coorY=coordenadaY
    let coorXtetro = 0
    let coorYtetro = 0
    let colision = false
    for(let i=0;i<ALTO_CUADRICULA;++i){
        for(let x=0;x<ANCHO_CUADRICULA;x++){
            //si la ubicacion en la cuadricula (indicada por 'x' e 'i') es mayor o igual a la ubicacion de las coordenadas y si
            //dicha ubicación es menor a las posiciones finales del tetromino (tetromino.length) y tetromino[coorYtetro].length)...
            if(i>=coorY && x>=coorX && i<coorY+tElegido.length && x<coorX+tElegido[coorYtetro].length){
                //dado que los tetrominos anteriores, en la cuadricula tienen el valor '2', si se topa con uno,
                //se entiende como colision. Para analizar si un cuadrado del tetromino ha topado con otro, las condiciones
                //son que el valor de la coordenada del vector del tetromino analizada sea 1, y que el proximo valor Y
                //de la coordenada del vector de la cuadricula sea 2.
                //cuadricula[i+1][x]==undefined porque si es el ultimo vector no existe. Hay que restringir esta condición.
                if(tElegido[coorYtetro][coorXtetro]===1 && cuadricula[i+1][x]===2){
                    colision = true
                }
                coorXtetro++
            }
        }
        //reinicializamos la coordenada horizontal, ya que una vez analizado un vector, deberá analizar el siguiente, si lo hay, desde el principio:
        coorXtetro=0
        //si la coordenada 'i' es mayor o igual a la coordenada vertical inicial del tetromino, y menor a la suma entre esa coordenada inicial
        //y el numero de vectores del tetromino, que es su alto, ya que cada vector es una fila:
        if(i>=coorY && i<coorY + tElegido.length){
            coorYtetro++
        }
    }
    return colision;
}
//posicionFinal fija el tetrominó en la cuadrícula
function posicionFinal(tetrominoElegido,coordenadaX,coordenadaY){
    let tElegido = tetrominoElegido
    let coorX=coordenadaX
    let coorY=coordenadaY
    let coorXtetro = 0
    let coorYtetro = 0
    //se revisa toda la cuadricula hasta encontrar el lugar del terominó:
    for(let i=0;i<ALTO_CUADRICULA;++i){
        for(let x=0;x<ANCHO_CUADRICULA;x++){
            //si la ubicacion en la cuadricula (indicada por 'x' e 'i') es mayor o igual a la ubicacion de las coordenadas y si
            //dicha ubicación es menor a las posiciones finales del tetromino (tetromino.length) y tetromino[coorYtetro].length)...
            if(i>=coorY && x>=coorX && i<coorY+tElegido.length && x<coorX+tElegido[coorYtetro].length){
                //si la coordenada de dentro del tetromino no tiene el valor '0':
                if(tElegido[coorYtetro][coorXtetro]!==0){
                    cuadricula[i][x]=2
                }
                coorXtetro++
            }
        }
        //reinicializamos la coordenada horizontal, ya que una vez analizado un vector, deberá analizar el siguiente, si lo hay, desde el principio:
        coorXtetro=0
        //si la coordenada 'i' es mayor o igual a la coordenada vertical inicial del tetromino, y menor a la suma entre esa coordenada inicial
        //y el numero de vectores del tetromino, que es su alto, ya que cada vector es una fila:
        if(i>=coorY && i<coorY + tElegido.length){
            coorYtetro++
        }
    }
}
function accionJugador(direccion){
    if(direccion===1){ //se mueve a la derecha:
        coorUsuario.x += 1
        //es necesario llamar estas funciones para que,
        //si el usuario pulsa varias veces hacia un lado dentro de un mismo lapso del
        //setInterval, igualmente se actualice el dibujo:
        limpiarMovimiento()
        tetrominoACuadricula(tetromino,coorUsuario.x,coorUsuario.y)
        dibujar()
    }else if(direccion===-1){ //se mueve a la izquierda:
        coorUsuario.x+=-1
        limpiarMovimiento()
        tetrominoACuadricula(tetromino,coorUsuario.x,coorUsuario.y)
        dibujar()
        //dibujarTetromino()
    }else if(direccion===0){ //baja más rápido:
        tiempo()
    }
}
//controles
document.addEventListener("keydown",event => {
    let direccion=0
    if(!juegoPausado){
        //si se pulsa la flecha abajo:
        if(event.keyCode===40){
            if(!colisionLateral(direccion)){
                accionJugador(direccion)
            }
        }
        //si se pulsa la izquierda:
        else if(event.keyCode===37){
            direccion=-1
            //colisiónLateral analiza, antes de permitir el movimiento lateral del jugador, que sea posible
            //sin salirse del canvas (si no hay colisión lateral, se permitirá el movimiento):
            if(!colisionLateral(direccion)){
                accionJugador(direccion)
            }
        }
        //si se pulsa la derecha:
        else if(event.keyCode===39){
            direccion=1
            if(!colisionLateral(direccion)){
                accionJugador(direccion)
            }
        }
        else if(event.keyCode===32){
            rotarTetromino()
        }
    }
})
function rotarTetromino(){
    //substituimos las posiciones entre x e y:
    for(let y=0;y<tetromino.length;++y){
        for(let x=0;x<y;++x){
            [tetromino[x][y],tetromino[y][x]] = [tetromino[y][x],tetromino[x][y]]
        }
    }
    //y las invertimos:
    tetromino.forEach(row => row.reverse())
}

crearCuadricula()
tetromino=nuevaPieza()
tetrominoACuadricula(tetromino,coorUsuario.x,coorUsuario.y)
dibujar()

function reinicio(){
    //ponemos los valores de la cuadricula a '0'
    limpiarCuadricula()
    //reiniciamos la velocidad:
    velocidad=1000
    //llamamos a una nueva pieza:
    tetromino=nuevaPieza()
    //pasamos los valores de la pieza a la cuadrícula:
    tetrominoACuadricula(tetromino,coorUsuario.x,coorUsuario.y)
    //pintamos la cuadricula según sus valores:
    dibujar()
    // falta reiniciar la puntuación
}
//limpiarCuadricula reinicia los valores de los vectores de la Cuadricula
//dándoles el valor por defecto ('0')
function limpiarCuadricula(){
    cuadricula.forEach((fila,)=>{
        fila.forEach((valor,x)=>{
            fila[x]=0
        })
    })
}
function pausa(){
    clearInterval(actualizar)
    juegoPausado=true
}
function seguir(){
    if(juegoPausado){
        juegoPausado=false
        actualizar=setInterval(tiempo,velocidad)
}
}
//tetrominoACuadricula(tetromino,coorUsuario.x,coorUsuario.ytetromino,coorUsuario.x,coorUsuario.y)
var actualizar = setInterval(tiempo,velocidad)

function cambioColor(){
    var p1 = Math.floor(Math.random() * (255 + 1));
    var p2 = Math.floor(Math.random() * (255 + 1));
    var p3 = Math.floor(Math.random() * (255 + 1));
    var p4 = Math.floor(Math.random() * (255 + 1));
    var grd = CONTEXTO.createLinearGradient(p1, p2, p3, p4);
    var color = ['yellow', 'purple', 'green', 'blue', 'pink', 'white']
    numeroRandom = Math.floor(Math.random() * 6);
    grd.addColorStop(0, color[numeroRandom]);
    numeroRandom = Math.floor(Math.random() * 6);
    grd.addColorStop(0.5,color[numeroRandom]);
    numeroRandom = Math.floor(Math.random() * 6);
    grd.addColorStop(1, color[numeroRandom]);
    CONTEXTO.fillStyle = grd;
}

//los tetrominos pueden convertirse en partes de una imagen que se va llenando como
//un puzzle (incompatibilidad con la función cambioColor():
//var img = document.getElementById("imagenTetromino");
//var pat = contexto.createPattern(img,'repeat')
//contexto.fillStyle=pat
//contexto.fill()








