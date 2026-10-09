var escena, renderer, controls;

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//crear escena
escena = new THREE.Scene();
escena.add(new THREE.AxesHelper(2000));

//Camara -->                     angulo de vision | relacion de aspecto | alcance min | alcance max
var camara = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100000);
camara.position.set(0, 350, 800);

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
 * El Sol se reduce a 40 y las distancias se comprimen para que todo quepa en pantalla.
 */
var R = 1.5;

//sol (quieto en el centro, solo gira sobre su eje)
var sol = new THREE.Mesh(new THREE.SphereGeometry(40, 48, 32), new THREE.MeshBasicMaterial({map: textura('texturaSol1.jpg')}));
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
        new THREE.TorusGeometry(R * 14, R * 1.8, 2, 96),
        new THREE.MeshBasicMaterial({map: textura('texturaAnilloSaturno.jpg'), side: THREE.DoubleSide}));
anilloSaturno.rotation.x = Math.PI / 2.2;
anilloSaturno.scale.z = 0.15;
var grupoSaturno = new THREE.Group();
grupoSaturno.add(Saturno);
grupoSaturno.add(anilloSaturno);

//urano
var Urano = new THREE.Mesh(new THREE.SphereGeometry(R * 4, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaUrano1.jpg')}));

//asteroide (entre Marte y Jupiter)
var Asteroide = new THREE.Mesh(new THREE.DodecahedronGeometry(3), new THREE.MeshBasicMaterial({map: textura('texturaAst.png')}));
Asteroide.position.set(215, 5, -40);

//NAVE
var loader1 = new THREE.GLTFLoader();
var navecruzero;
loader1.load(
        'nave.glb',
        function(objeto){
            navecruzero = objeto.scene;
            navecruzero.position.set(-150, 20, 250);
            navecruzero.scale.set(1, 1, 1);
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
var texCono = material('texturaCono.jpg');
var texCilindro = material('texturaCilindro.jpg');
var texRing = material('texturaRing.jpg');
var texTorus = material('texturaTorus.jpg');
var texNudo = material('texturaNudo.jpg');

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

//posicionar las formas alineadas sobre el eje X (mismo Y y Z)
var formas = [grupoCono, grupoCilindro, grupoRing, grupoTorus, grupoNudo];
for (var i = 0; i < formas.length; i++){
    formas[i].scale.set(8, 8, 8);
    formas[i].position.set(-200 + i * 100, 0, 250);
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
    return 0.005 * Math.pow(135 / radio, 1.5);
}
var orbitas = [
    {cuerpo: Mercurio,     radio: 70,  angulo: 0.5},
    {cuerpo: Venus,        radio: 100, angulo: 2.0},
    {cuerpo: grupoTierra,  radio: 135, angulo: 4.0},
    {cuerpo: marte,        radio: 175, angulo: 1.0},
    {cuerpo: Jupiter,      radio: 270, angulo: 3.0},
    {cuerpo: grupoSaturno, radio: 370, angulo: 5.5},
    {cuerpo: Urano,        radio: 460, angulo: 0.0}
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
    luna.position.set(Math.cos(anguloLuna) * 5, 0, Math.sin(anguloLuna) * 5);

    requestAnimationFrame(proyectar);
    renderer.render(escena, camara);
}
requestAnimationFrame(proyectar);
