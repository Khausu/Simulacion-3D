/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var escena, renderer, control;

renderer = new THREE.WebGLRenderer({anatialias: true});
var ancho = window.innerWidth;
var alto = window.innerHeight;

renderer.setSize(ancho, alto);


// se llama al html y el el body se e agrega un niño que sera el renderer
document.body.appendChild(renderer.domElement);

//crear escena 
escena = new THREE.Scene();
var eje = new THREE.AxesHelper(2000);
escena.add(eje);

//Camara -->                     angulo de vision | relacion de aspecto | alacance min | alcance max
var camara = new THREE.PerspectiveCamera(30, window.innerWidth/ window.innerHeight, 0.1, 10000000000);
camara.position.y = 16;
camara.position.z = 100;


//objeto - tierra                    radio | segmentos en x | segmentos en y
var geometria = new THREE.SphereGeometry(0.63,32,24);


//tierra
var bgText1 = new THREE.TextureLoader().load('tex_planetas/texturaTierra1.jpg');
var texturaTierra = new THREE.MeshBasicMaterial({map: bgText1});
var Tierra =  new THREE.Mesh(geometria, texturaTierra);

//luna
var geometriaLuna = new THREE.SphereGeometry(0.1, 32, 24);
var bgText3 = new THREE.TextureLoader().load('tex_planetas/texturaLuna1.jpg');
var texturaLuna = new THREE.MeshPhongMaterial({map: bgText3});
var luna = new THREE.Mesh(geometriaLuna,texturaLuna);
luna.position.set(8, 0, 0);
Tierra.add(luna);

//sol
var geometriaSol = new THREE.SphereGeometry(69.5,32,24);
var bgText2 = new THREE.TextureLoader().load('tex_planetas/texturaSol1.jpg');
var texturaSol = new THREE.MeshBasicMaterial({map: bgText2});
var sol =  new THREE.Mesh(geometriaSol, texturaSol);
Tierra.position.set(-30,0,0);
sol.position.set(0, 0, 0);

//mercurio
var geometriaMercurio = new THREE.SphereGeometry(0.244,32,24);
var bgText4 = new THREE.TextureLoader().load('tex_planetas/texturaMercurio1.jpg');
var texturaMercurio = new THREE.MeshBasicMaterial({map: bgText4});
var Mercurio =  new THREE.Mesh(geometriaMercurio, texturaMercurio);


//venus 
var geometriaVenus = new THREE.SphereGeometry(0.605,32,24);
var bgText5 = new THREE.TextureLoader().load('tex_planetas/texturaVenus1.jpg');
var texturaVenus = new THREE.MeshBasicMaterial({map: bgText5});
var Venus =  new THREE.Mesh(geometriaVenus, texturaVenus);

//marte
var geometriaMarte = new THREE.SphereGeometry(0.338,32,24);
var bgText6 = new THREE.TextureLoader().load('tex_planetas/texturaMarte1.jpg');
var texturaMarte = new THREE.MeshBasicMaterial({map: bgText6});
var marte =  new THREE.Mesh(geometriaMarte, texturaMarte);


//Urano
var geometriaUrano = new THREE.SphereGeometry(0.025,32,24);
var bgText8 = new THREE.TextureLoader().load('tex_planetas/texturaUrano1.jpg');
var texturaUrano = new THREE.MeshPhongMaterial({map: bgText8});
var Urano =  new THREE.Mesh(geometriaUrano, texturaUrano);

//Jupiter
var geometriaJupiter = new THREE.SphereGeometry(7.42,32,24);
var bgText7 = new THREE.TextureLoader().load('tex_planetas/texturaJupiter1.jpg');
var texturaJupiter = new THREE.MeshBasicMaterial({map: bgText7});
var Jupiter =  new THREE.Mesh(geometriaJupiter, texturaJupiter);

//saturno 
var geometriaSaturno = new THREE.SphereGeometry(6.02, 32, 24);
var bgTextSaturno = new THREE.TextureLoader().load('tex_planetas/texturasaturno1.jpg');
var texturaSaturno = new THREE.MeshBasicMaterial({map: bgTextSaturno});
var Saturno = new THREE.Mesh(geometriaSaturno,texturaSaturno);

var geometriaAnillo = new THREE.TorusGeometry(9,1.2, 3264);
var bgTextAnillo = new THREE.TextureLoader().load('tex_planetas/texturaAnilloSaturno.jpg');
var texturaAnillo = new THREE.MeshBasicMaterial({map: bgTextAnillo,side: THREE.DoubleSide});
var anilloSaturno = new THREE.Mesh( geometriaAnillo,texturaAnillo);

var grupoSaturno = new THREE.Group();

grupoSaturno.add(Saturno);
grupoSaturno.add(anilloSaturno);

//Asteroide
var geometriaAst = new THREE.DodecahedronGeometry(10);
var bgTextAst = new THREE.TextureLoader().load('tex_planetas/texturaAst.png');
var texturaAst = new THREE.MeshBasicMaterial({map: bgTextAst});
var Asteroide =  new THREE.Mesh(geometriaAst, texturaAst);
Asteroide.position.set(100,20,10);

Asteroide.translateX(5);
Asteroide.translateY(5);
Asteroide.translateZ(5);

var posicion = new THREE.Vector3(-10,4,8);

var pA = new THREE.Vector3();
var pB = new THREE.Vector3();

pA.copy(Asteroide.position);
pB.copy(Tierra.position);
var dis = pA.distanceTo(pB);

var vectorDireccion = new THREE.Vector3();

vectorDireccion.subVectors(Asteroide.position,sol.position);
vectorDireccion.normalize();

Asteroide.position.add(posicion);


//NAVEEE
var limite= 1000;
var loader1 = new THREE.GLTFLoader();
var navecruzero;
var num = 5;
loader1.load(
        'nave.glb',
         function(objeto){
             navecruzero= objeto.scene;
             navecruzero.position.set(-50,10,10);
             navecruzero.scale.set(1,1,1);
             escena.add(navecruzero);
         },
         undefined,
         function(error){
             console.log(error);
         }

        
        
        );

//FORMAS GEOMETRICAS (three.js) - objetos estaticos, sin animacion
var cargador = new THREE.TextureLoader();
function material(ruta){
    return new THREE.MeshBasicMaterial({map: cargador.load(ruta), side: THREE.DoubleSide});
}
var texCono = material('tex_planetas/texturaCono.jpg');
var texCilindro = material('tex_planetas/texturaCilindro.jpg');
var texRing = material('tex_planetas/texturaRing.jpg');
var texTorus = material('tex_planetas/texturaTorus.jpg');
var texNudo = material('tex_planetas/texturaNudo.jpg');

//CONO -> cohete: cuerpo (cilindro) + ojiva (cono) + base (cono invertido)
var grupoCono = new THREE.Group();
var ojiva = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.5, 32), texCono);
ojiva.position.y = 2.5;
var cuerpoCohete = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 32), texCilindro);
cuerpoCohete.position.y = 0.75;
var tobera = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 32), texCono);
tobera.rotation.x = Math.PI;
tobera.position.y = -1.35;
grupoCono.add(ojiva);
grupoCono.add(cuerpoCohete);
grupoCono.add(tobera);

//CILINDRO -> estacion espacial: tubo central + dos tanques + disco
var grupoCilindro = new THREE.Group();
var tubo = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 5, 32), texCilindro);
var tanqueA = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 24), texCilindro);
tanqueA.rotation.z = Math.PI/2;
tanqueA.position.set(0, 1, 0);
var tanqueB = tanqueA.clone();
tanqueB.position.set(0, -1, 0);
var disco = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.2, 48), texRing);
grupoCilindro.add(tubo);
grupoCilindro.add(tanqueA);
grupoCilindro.add(tanqueB);
grupoCilindro.add(disco);

//RING -> portal estelar: anillo exterior + anillo interior
var grupoRing = new THREE.Group();
var portalExt = new THREE.Mesh(new THREE.RingGeometry(1.8, 3, 48), texRing);
var portalInt = new THREE.Mesh(new THREE.RingGeometry(0.6, 1.4, 48), texNudo);
portalInt.position.z = 0.05;
grupoRing.add(portalExt);
grupoRing.add(portalInt);

//TORUS GEOMETRY -> planeta gaseoso con anillo
var grupoTorus = new THREE.Group();
var planetaGas = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 24), texTorus);
var anilloGas = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.35, 16, 64), texTorus);
anilloGas.rotation.x = Math.PI/2.5;
grupoTorus.add(planetaGas);
grupoTorus.add(anilloGas);

//TORUS KNOT -> nudo cosmico con nucleo
var grupoNudo = new THREE.Group();
var nudo = new THREE.Mesh(new THREE.TorusKnotGeometry(1.6, 0.45, 128, 16), texNudo);
var nucleo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 1), texCono);
grupoNudo.add(nudo);
grupoNudo.add(nucleo);

//posicionar las formas en fila frente a la camara
var formas = [grupoCono, grupoCilindro, grupoRing, grupoTorus, grupoNudo];
for (var i = 0; i < formas.length; i++){
    formas[i].scale.set(0.6, 0.6, 0.6);
    formas[i].position.set(-8 + i * 4, 14, 70);
    escena.add(formas[i]);
}

//añadir a la escena
escena.add(sol);
escena.add(Tierra);
escena.add(Mercurio);
escena.add(Venus);
escena.add(marte);
escena.add(Jupiter);
escena.add(Urano);
escena.add(grupoSaturno);
escena.add(Asteroide);


//fuente de luz
var luz = new THREE.PointLight(0xFFFFFF);
luz.position.set(80, 150, 60);


//agregar luz en la escena 
escena.add(luz);
controls = new THREE.OrbitControls(camara,renderer.domElement);
let angulo = 0;
let radio = 149;//149km
let vm =0;
let vv =0;
let vmarte = 0;
let vjupiter = 0;
let vurano = 0;
let vsaturno = 0;

var reloj = new THREE.Clock();

function proyectar(){
    
    var vectorDireccion = new THREE.Vector3();

    vectorDireccion.subVectors(Tierra.position,sol.position);
    vectorDireccion.normalize();
    
    sol.position.add(vectorDireccion.multiplyScalar(0.1));
    
    
    
    
    pA.copy(Asteroide.position);
    pB.copy(Tierra.position);
    dis = pA.distanceTo(pB);
    console.log(dis);
    
    //sol
    sol.rotation.y -=0.0153*reloj.getDelta();//0.000153
    
     
    //rotacion lunar
    luna.position.x = Math.cos(angulo * 5) * 2;
    luna.position.z = Math.sin(angulo * 5) * 2;
    //control
    angulo += 0.0029;
    Tierra.position.x = Math.cos(angulo)*radio;
    Tierra.position.z =Math.sin(angulo)*radio;
    
    Tierra.rotation.x+=0.0108;
    
    //mercurio
    vm += 0.004787;
    Mercurio.position.x = Math.cos(vm)*57.9;
    Mercurio.position.z =Math.sin(vm)*57.9;
    
    //venus
    vv += 0.003236;
    Venus.position.x = Math.cos(vv) * 108.2;
    Venus.position.z = Math.sin(vv) * 108.2;
    
    //marte   
    vmarte += 0.001057;
    marte.position.x = Math.cos(vmarte) * 227.9;
    marte.position.z = Math.sin(vmarte) * 227.9;
    
    
    // JÚPITER
    vjupiter += 0.000168;
    Jupiter.position.x = Math.cos(vjupiter) * 778.5;
    Jupiter.position.z = Math.sin(vjupiter) * 778.5;
    
    
    
    // URANO
    vurano += 0.0000237;
    Urano.position.x = Math.cos(vurano) * 2871;
    Urano.position.z = Math.sin(vurano) * 2871;
    
    // URANO
    vurano += 0.0000237;
    Urano.position.x = Math.cos(vurano) * 2871;
    Urano.position.z = Math.sin(vurano) * 2871;


    //saturno 
    
    // SATURNO
    vsaturno += 0.000068;
    grupoSaturno.position.x = Math.cos(vsaturno) * 1434;

    grupoSaturno.position.z = Math.sin(vsaturno) * 1434;
    
    requestAnimationFrame(proyectar);
    renderer.render(escena,camara);
    
    }
    requestAnimationFrame(proyectar);
