var escena, renderer, controls;

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//crear escena
escena = new THREE.Scene();
escena.add(new THREE.AxesHelper(5000));

//Camara -->                     angulo de vision | relacion de aspecto | alcance min | alcance max
var camara = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100000);
camara.position.set(4300, 1600, 2200);

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
 * ESCALA: la Tierra mide 16 unidades de radio y los demas planetas conservan el orden real
 * de tamaños (suavizado para que los pequeños se vean). Jupiter es el mas grande y Mercurio el mas pequeño.
 * El Sol se reduce a 200 y las distancias se comprimen para que todo quepa en pantalla.
 */

//sol (quieto en el centro; en proyectar() rota y pulsa de tamaño)
var sol = new THREE.Mesh(new THREE.SphereGeometry(200, 64, 48), new THREE.MeshBasicMaterial({map: textura('texturaSol1.jpg')}));
sol.position.set(0, 0, 0);

//mercurio
var Mercurio = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaMercurio1.jpg')}));

//venus
var Venus = new THREE.Mesh(new THREE.SphereGeometry(15.4, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaVenus1.jpg')}));

//tierra + luna (la luna orbita a la Tierra, por eso van en un grupo)
var Tierra = new THREE.Mesh(new THREE.SphereGeometry(16, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaTierra1.jpg')}));
var luna = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaLuna1.jpg')}));
var grupoTierra = new THREE.Group();
grupoTierra.add(Tierra);
grupoTierra.add(luna);

//marte
var marte = new THREE.Mesh(new THREE.SphereGeometry(10.3, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaMarte1.jpg')}));

//jupiter
var Jupiter = new THREE.Mesh(new THREE.SphereGeometry(86, 48, 32), new THREE.MeshBasicMaterial({map: textura('texturaJupiter1.jpg')}));

//saturno + anillo
var Saturno = new THREE.Mesh(new THREE.SphereGeometry(77, 48, 32), new THREE.MeshBasicMaterial({map: textura('texturasaturno1.jpg')}));
var anilloSaturno = new THREE.Mesh(
        new THREE.TorusGeometry(115, 17, 2, 96),
        new THREE.MeshBasicMaterial({map: textura('texturaAnilloSaturno.jpg'), side: THREE.DoubleSide}));
anilloSaturno.rotation.x = Math.PI / 2 - 0.45;
anilloSaturno.scale.z = 0.15;
var grupoSaturno = new THREE.Group();
grupoSaturno.add(Saturno);
grupoSaturno.add(anilloSaturno);

//urano
var Urano = new THREE.Mesh(new THREE.SphereGeometry(42, 32, 24), new THREE.MeshBasicMaterial({map: textura('texturaUrano1.jpg')}));

//asteroide (entre Marte y Jupiter)
var Asteroide = new THREE.Mesh(new THREE.DodecahedronGeometry(14), new THREE.MeshBasicMaterial({map: textura('texturaAst.png')}));
Asteroide.position.set(760, 15, -160);

//NAVE
var loader1 = new THREE.GLTFLoader();
var navecruzero;
loader1.load(
        'nave.glb',
        function(objeto){
            navecruzero = objeto.scene;
            navecruzero.position.set(-900, 100, 1100);
            navecruzero.scale.set(5, 5, 5);
            escena.add(navecruzero);
        },
        undefined,
        function(error){
            console.log(error);
        }
);

//FORMAS GEOMETRICAS (three.js): el cohete y el ovni dan vueltas al Sol, el satelite a la Tierra, solo la puerta esta quieta
function material(ruta){
    return new THREE.MeshBasicMaterial({map: textura(ruta), side: THREE.DoubleSide});
}
var texCohete = material('texturaCohete.jpg');
var texCoheteRojo = material('texturaCoheteRojo.jpg');
var texCristal = material('texturaCristal.jpg');
var texOvni = material('texturaOvni.jpg');
var texLuces = material('texturaLuces.jpg');
var texCilindro = material('texturaCilindro.jpg');
var texPanel = material('texturaPanel.jpg');

//CONO -> COHETE: cuerpo, punta, aletas, tobera, ventana
var grupoCono = new THREE.Group();
var cuerpoCohete = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 3.2, 32), texCohete);
var franjaCohete = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 0.93, 0.35, 32), texCoheteRojo);
franjaCohete.position.y = -0.9;
var puntaCohete = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 32), texCoheteRojo);
puntaCohete.position.y = 2.4;
var toberaCohete = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 24), texOvni);
toberaCohete.rotation.x = Math.PI;
toberaCohete.position.y = -2;
var ventanaCohete = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.47, 32), texOvni);
ventanaCohete.position.set(0, 0.7, 0.92);
var vidrioCohete = new THREE.Mesh(new THREE.CircleGeometry(0.35, 32), texCristal);
vidrioCohete.position.set(0, 0.7, 0.91);
grupoCono.add(cuerpoCohete, franjaCohete, puntaCohete, toberaCohete, ventanaCohete, vidrioCohete);
for (var k = 0; k < 4; k++){
    var ang = k * Math.PI / 2;
    var aleta = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.8, 3), texCoheteRojo);
    aleta.scale.z = 0.12;
    aleta.position.set(Math.cos(ang) * 1.15, -1.3, Math.sin(ang) * 1.15);
    aleta.rotation.y = -ang;
    grupoCono.add(aleta);
}

//CILINDRO -> OVNI: platillo, cupula de cristal, aro de luces y patas
var grupoCilindro = new THREE.Group();
var platillo = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.2, 0.6, 48), texOvni);
var cupula = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), texCristal);
cupula.position.y = 0.3;
var aroLuces = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.25, 64), texLuces);
aroLuces.position.y = -0.05;
grupoCilindro.add(platillo, cupula, aroLuces);
for (var p = 0; p < 3; p++){
    var angP = p * Math.PI * 2 / 3;
    var pata = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.9, 12), texOvni);
    pata.rotation.x = Math.PI;
    pata.position.set(Math.cos(angP) * 1.6, -0.75, Math.sin(angP) * 1.6);
    grupoCilindro.add(pata);
}

//RING -> PUERTA ESTELAR: marco metalico, anillo de luces y remolino de galaxia en el centro
var grupoRing = new THREE.Group();
var marcoPuerta = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.3, 64), texOvni);
var lucesPuerta = new THREE.Mesh(new THREE.RingGeometry(2.3, 2.6, 64), texLuces);
var remolino = new THREE.Mesh(new THREE.CircleGeometry(2.3, 64), material('texturaPortal.jpg'));
var marcoTrasero = marcoPuerta.clone();
marcoTrasero.position.z = -0.35;
lucesPuerta.position.z = 0.02;
remolino.position.z = -0.1;
grupoRing.add(marcoPuerta, marcoTrasero, lucesPuerta, remolino);
for (var q = 0; q < 8; q++){
    var angQ = q * Math.PI / 4;
    var puntal = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 8), texOvni);
    puntal.rotation.x = Math.PI / 2;
    puntal.position.set(Math.cos(angQ) * 2.95, Math.sin(angQ) * 2.95, -0.175);
    grupoRing.add(puntal);
}
grupoRing.rotation.y = Math.PI / 2;   //de frente en X: la puerta mira hacia el Sol a lo largo del eje X

//TORUS GEOMETRY -> SATELITE: cuerpo, anillo (el unico Torus) y dos paneles solares
var grupoTorus = new THREE.Group();
var cuerpoSat = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 24), texOvni);
var anilloSat = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.15, 12, 48), texLuces);
anilloSat.rotation.x = Math.PI / 2;
var panelSatA = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.4), texPanel);
panelSatA.position.x = 2.4;
var panelSatB = panelSatA.clone();
panelSatB.position.x = -2.4;
grupoTorus.add(cuerpoSat, anilloSat, panelSatA, panelSatB);
grupoTierra.add(grupoTorus);

//posicionar las formas alineadas sobre el eje X (misma altura Y y misma Z)
grupoCono.position.set(-680, 150, 900);      //cohete: vuela
grupoCilindro.position.set(-340, 450, 900);  //ovni: vuela, mas arriba
grupoRing.position.set(2000, 0, 0);          //puerta estelar: quieta, al final del eje X

grupoCono.scale.set(24, 24, 24);
grupoCilindro.scale.set(24, 24, 24);
grupoRing.scale.set(70, 70, 70);
grupoTorus.scale.set(1.5, 1.5, 1.5);   //satelite pequeño, acorde al tamaño de la Tierra

escena.add(grupoCono);
escena.add(grupoCilindro);
escena.add(grupoRing);

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
    return 0.005 * Math.pow(510 / radio, 1.5);
}
var orbitas = [
    {cuerpo: Mercurio,     radio: 300,  angulo: 0.5},
    {cuerpo: Venus,        radio: 400,  angulo: 2.0},
    {cuerpo: grupoTierra,  radio: 510,  angulo: 4.0},
    {cuerpo: marte,        radio: 620,  angulo: 1.0},
    {cuerpo: Jupiter,      radio: 900,  angulo: 3.0},
    {cuerpo: grupoSaturno, radio: 1250, angulo: 5.5},
    {cuerpo: Urano,        radio: 1600, angulo: 0.0},
    {cuerpo: grupoCono,     radio: Math.hypot(-680, 900), angulo: Math.atan2(900, -680)},
    {cuerpo: grupoCilindro, radio: Math.hypot(-340, 900), angulo: Math.atan2(900, -340)}
];
orbitas.forEach(function(o){
    o.cuerpo.position.x = Math.cos(o.angulo) * o.radio;
    o.cuerpo.position.z = Math.sin(o.angulo) * o.radio;
});

var anguloLuna = 0;

//animacion del tamaño del Sol
var velocidadSol = 1.0005;      //cuanto crece en cada cuadro (0.05 %)
var factorSol = velocidadSol;   //por cuanto se multiplica ahora (crece o se encoge)
var escalaMaxSol = 1.3;         //tamaño maximo (1.3 = 30 % mas grande)
var anguloSat = 0;

//el cohete se inclina para volar de lado: primero gira en X y luego en Y
grupoCono.rotation.order = 'YXZ';
grupoCono.rotation.x = Math.PI / 2;

function proyectar(){
    //SOL: no se mueve de lugar, pero rota lentamente en horizontal (eje Y)
    sol.rotation.y += 0.002;

    //SOL: crece y se encoge con la misma velocidad usando multiplyScalar
    sol.scale.multiplyScalar(factorSol);
    if (sol.scale.x >= escalaMaxSol){
        factorSol = 1 / velocidadSol;   //llego al maximo: ahora se encoge (divide por el mismo valor)
    } else if (sol.scale.x <= 1){
        factorSol = velocidadSol;       //volvio al tamaño original: vuelve a crecer
    }

    orbitas.forEach(function(o){
        o.angulo += velocidad(o.radio);
        o.cuerpo.position.x = Math.cos(o.angulo) * o.radio;
        o.cuerpo.position.z = Math.sin(o.angulo) * o.radio;
    });

    //rotacion propia de la Tierra y orbita lunar
    Tierra.rotation.y += 0.02;
    anguloLuna += 0.03;
    luna.position.set(Math.cos(anguloLuna) * 40, 0, Math.sin(anguloLuna) * 40);

    //satelite: da vueltas a la Tierra en sentido contrario a la Luna (el angulo RESTA)
    //y en un plano vertical, pasando por encima de los polos. Como es hijo de grupoTierra,
    //su position es relativa a la Tierra (no hace falta copiar Tierra.position).
    anguloSat -= 0.05;
    grupoTorus.position.set(Math.cos(anguloSat) * 28, Math.sin(anguloSat) * 28, 0);

    //la punta del cohete apunta hacia donde avanza
    grupoCono.rotation.y = -orbitas[7].angulo;

    requestAnimationFrame(proyectar);
    renderer.render(escena, camara);
}
requestAnimationFrame(proyectar);
