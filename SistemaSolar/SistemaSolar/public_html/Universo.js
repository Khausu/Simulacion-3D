var escena, renderer, controls;

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//crear escena
escena = new THREE.Scene();
escena.add(new THREE.AxesHelper(3000));

//Camara -->                     angulo de vision | relacion de aspecto | alcance min | alcance max
var camara = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100000);
camara.position.set(0, 900, 2100);

window.addEventListener('resize', function(){
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

var cargador = new THREE.TextureLoader();
function textura(ruta){
    return cargador.load('tex_planetas/' + ruta);
}

/*
 * ESCALA: el radio de la Tierra = 1.5 unidades. Los demas planetas conservan
 * su proporcion real respecto a la Tierra (Jupiter ~11 veces, Mercurio ~0.4...).
 * El Sol se reduce a 160 y las distancias se comprimen para que todo quepa en pantalla.
 */
var R = 8;

//sol (quieto en el centro, solo gira sobre su eje)
var sol = new THREE.Mesh(new THREE.SphereGeometry(160, 64, 48), new THREE.MeshBasicMaterial({map: textura('texturaSol1.jpg')}));
sol.position.set(0, 0, 0);

//mercurio
var Mercurio = new THREE.Mesh(new THREE.SphereGeometry(R * 0.38, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaMercurio1.jpg')}));

//venus
var Venus = new THREE.Mesh(new THREE.SphereGeometry(R * 0.95, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaVenus1.jpg')}));

//tierra + luna (la luna orbita a la Tierra, por eso van en un grupo)
var Tierra = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaTierra1.jpg')}));
var luna = new THREE.Mesh(new THREE.SphereGeometry(R * 0.27, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaLuna1.jpg')}));
var grupoTierra = new THREE.Group();
grupoTierra.add(Tierra);
grupoTierra.add(luna);

//marte
var marte = new THREE.Mesh(new THREE.SphereGeometry(R * 0.53, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaMarte1.jpg')}));

//jupiter
var Jupiter = new THREE.Mesh(new THREE.SphereGeometry(R * 11.2, 48, 32), new THREE.MeshBasicMaterial({map: textura('texturaJupiter1.jpg')}));

//saturno + anillo
var Saturno = new THREE.Mesh(new THREE.SphereGeometry(R * 9.45, 48, 32), new THREE.MeshBasicMaterial({map: textura('texturasaturno1.jpg')}));
var anilloSaturno = new THREE.Mesh(
        new THREE.TorusGeometry(R * 14, R * 2.2, 2, 96),
        new THREE.MeshBasicMaterial({map: textura('texturaAnilloSaturno.jpg'), side: THREE.DoubleSide}));
anilloSaturno.rotation.x = Math.PI / 2 - 0.45;
anilloSaturno.scale.z = 0.15;
var grupoSaturno = new THREE.Group();
grupoSaturno.add(Saturno);
grupoSaturno.add(anilloSaturno);

//urano
var Urano = new THREE.Mesh(new THREE.SphereGeometry(R * 4, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaUrano1.jpg')}));

//asteroide (entre Marte y Jupiter)
var Asteroide = new THREE.Mesh(new THREE.DodecahedronGeometry(10), new THREE.MeshBasicMaterial({map: textura('texturaAst.png')}));
Asteroide.position.set(580, 10, -120);

//NAVE
var loader1 = new THREE.GLTFLoader();
var navecruzero;
loader1.load(
        'nave.glb',
        function(objeto){
            navecruzero = objeto.scene;
            navecruzero.position.set(-400, 50, 650);
            navecruzero.scale.set(3, 3, 3);
            escena.add(navecruzero);
        },
        undefined,
        function(error){
            console.log(error);
        }
);

//FORMAS GEOMETRICAS (three.js) - objetos estaticos, sin animacion
function material(ruta){
    return new THREE.MeshBasicMaterial({map: textura(ruta), side: THREE.DoubleSide});
}
function materialTransparente(ruta, opacidad){
    return new THREE.MeshBasicMaterial({map: textura(ruta), side: THREE.DoubleSide,
        transparent: true, opacity: opacidad, depthWrite: false});
}
var texCohete = material('texturaCohete.jpg');
var texCoheteRojo = material('texturaCoheteRojo.jpg');
var texCristal = material('texturaCristal.jpg');
var texOvni = material('texturaOvni.jpg');
var texLuces = material('texturaLuces.jpg');
var texCilindro = material('texturaCilindro.jpg');
var texPanel = material('texturaPanel.jpg');
var texRing = material('texturaRing.jpg');
var texTorus = material('texturaTorus.jpg');
var texNudo = material('texturaNudo.jpg');
var texHielo = material('texturaHielo.jpg');

//CONO -> COHETE: cuerpo, punta, aletas, tobera, ventana y plataforma
var grupoCono = new THREE.Group();
var cuerpoCohete = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 3.2, 32), texCohete);
var franjaCohete = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 0.93, 0.35, 32), texCoheteRojo);
franjaCohete.position.y = -0.9;
var puntaCohete = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 32), texCoheteRojo);
puntaCohete.position.y = 2.4;
var toberaCohete = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 24), texOvni);
toberaCohete.rotation.x = Math.PI;
toberaCohete.position.y = -2;
var ventanaCohete = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 12, 32), texOvni);
ventanaCohete.position.set(0, 0.7, 0.9);
var vidrioCohete = new THREE.Mesh(new THREE.CircleGeometry(0.35, 32), texCristal);
vidrioCohete.position.set(0, 0.7, 0.91);
var plataformaCohete = new THREE.Mesh(new THREE.RingGeometry(1.3, 2.4, 48), texCilindro);
plataformaCohete.rotation.x = -Math.PI / 2;
plataformaCohete.position.y = -2.4;
grupoCono.add(cuerpoCohete, franjaCohete, puntaCohete, toberaCohete, ventanaCohete, vidrioCohete, plataformaCohete);
for (var k = 0; k < 4; k++){
    var ang = k * Math.PI / 2;
    var aleta = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.8, 3), texCoheteRojo);
    aleta.scale.z = 0.12;
    aleta.position.set(Math.cos(ang) * 1.15, -1.3, Math.sin(ang) * 1.15);
    aleta.rotation.y = -ang;
    grupoCono.add(aleta);
}

//CILINDRO -> OVNI: platillo, cupula de cristal, aro de luces, patas y haz tractor
var grupoCilindro = new THREE.Group();
var platillo = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.2, 0.6, 48), texOvni);
var cupula = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), texCristal);
cupula.position.y = 0.3;
var aroLuces = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.2, 12, 64), texLuces);
aroLuces.rotation.x = Math.PI / 2;
aroLuces.position.y = -0.05;
var hazTractor = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.6, 40, 1, true), materialTransparente('texturaCristal.jpg', 0.3));
hazTractor.position.y = -2.4;
var luzSuelo = new THREE.Mesh(new THREE.RingGeometry(0.6, 2.4, 40), materialTransparente('texturaRing.jpg', 0.5));
luzSuelo.rotation.x = -Math.PI / 2;
luzSuelo.position.y = -4.2;
grupoCilindro.add(platillo, cupula, aroLuces, hazTractor, luzSuelo);
for (var p = 0; p < 3; p++){
    var angP = p * Math.PI * 2 / 3;
    var pata = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.9, 12), texOvni);
    pata.rotation.x = Math.PI;
    pata.position.set(Math.cos(angP) * 1.6, -0.75, Math.sin(angP) * 1.6);
    grupoCilindro.add(pata);
}
grupoCilindro.position.y = 0;

//RING -> PORTAL ESTELAR: anillos concentricos
var grupoRing = new THREE.Group();
var portalExt = new THREE.Mesh(new THREE.RingGeometry(2.4, 3.2, 64), texRing);
var portalMed = new THREE.Mesh(new THREE.RingGeometry(1.5, 2.2, 64), texNudo);
var portalInt = new THREE.Mesh(new THREE.RingGeometry(0.6, 1.3, 64), texTorus);
portalMed.position.z = 0.03;
portalInt.position.z = 0.06;
grupoRing.add(portalExt, portalMed, portalInt);

//TORUS GEOMETRY -> ESTACION ESPACIAL: nucleo, rueda habitacional, radios, paneles solares y antena
var grupoTorus = new THREE.Group();
var nucleoEst = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 24), texCilindro);
var ruedaEst = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.35, 16, 64), texOvni);
ruedaEst.rotation.x = Math.PI / 2;
var radioX = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.8, 8), texCilindro);
radioX.rotation.z = Math.PI / 2;
var radioZ = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.8, 8), texCilindro);
radioZ.rotation.x = Math.PI / 2;
var panelA = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 1), texPanel);
panelA.position.set(1.6, 1.7, 0);
var panelB = panelA.clone();
panelB.position.set(-1.6, 1.7, 0);
var antenaEst = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.6, 24), texOvni);
antenaEst.position.y = 2.3;
grupoTorus.add(nucleoEst, ruedaEst, radioX, radioZ, panelA, panelB, antenaEst);

//TORUS KNOT -> COMETA: nucleo en forma de nudo y cola de hielo
var grupoNudo = new THREE.Group();
var nucleoCometa = new THREE.Mesh(new THREE.TorusKnotGeometry(0.9, 0.3, 128, 16), texHielo);
var colaExt = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6, 32, 1, true), materialTransparente('texturaHielo.jpg', 0.35));
colaExt.rotation.z = -Math.PI / 2;
colaExt.position.x = 3.4;
var colaInt = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4, 32, 1, true), materialTransparente('texturaCristal.jpg', 0.5));
colaInt.rotation.z = -Math.PI / 2;
colaInt.position.x = 2.4;
grupoNudo.add(nucleoCometa, colaExt, colaInt);

//posicionar las formas alineadas sobre el eje X (mismo Y y Z)
var formas = [grupoCono, grupoCilindro, grupoRing, grupoTorus, grupoNudo];
for (var i = 0; i < formas.length; i++){
    formas[i].scale.set(20, 20, 20);
    formas[i].position.set(-520 + i * 260, 0, 650);
    escena.add(formas[i]);
}

//añadir a la escena
escena.add(sol);
escena.add(Mercurio);
escena.add(Venus);
escena.add(grupoTierra);
escena.add(marte);
escena.add(Asteroide);
escena.add(Jupiter);
escena.add(grupoSaturno);
escena.add(Urano);

controls = new THREE.OrbitControls(camara, renderer.domElement);

//orbitas alrededor del Sol: radio de la orbita y velocidad angular (mas lenta cuanto mas lejos, ley de Kepler)
function velocidad(radio){
    return 0.005 * Math.pow(390 / radio, 1.5);
}
var orbitas = [
    {cuerpo: Mercurio,     radio: 230,  angulo: 0.5},
    {cuerpo: Venus,        radio: 310, angulo: 2.0},
    {cuerpo: grupoTierra,  radio: 390, angulo: 4.0},
    {cuerpo: marte,        radio: 470, angulo: 1.0},
    {cuerpo: Jupiter,      radio: 700, angulo: 3.0},
    {cuerpo: grupoSaturno, radio: 960, angulo: 5.5},
    {cuerpo: Urano,        radio: 1200, angulo: 0.0}
];
orbitas.forEach(function(o){
    o.cuerpo.position.set(Math.cos(o.angulo) * o.radio, 0, Math.sin(o.angulo) * o.radio);
});

var anguloLuna = 0;

function proyectar(){
    //el Sol permanece quieto, solo rota
    sol.rotation.y += 0.002;

    orbitas.forEach(function(o){
        o.angulo += velocidad(o.radio);
        o.cuerpo.position.x = Math.cos(o.angulo) * o.radio;
        o.cuerpo.position.z = Math.sin(o.angulo) * o.radio;
    });

    //rotacion propia de la Tierra y orbita lunar
    Tierra.rotation.y += 0.02;
    anguloLuna += 0.03;
    luna.position.set(Math.cos(anguloLuna) * 22, 0, Math.sin(anguloLuna) * 22);

    requestAnimationFrame(proyectar);
    renderer.render(escena, camara);
}
requestAnimationFrame(proyectar);
