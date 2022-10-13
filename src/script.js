import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'


//Carregar
const loader = new THREE.TextureLoader()
const solarPanelImg = loader.load("/img/Satelite/solarpanel1.png");
const earthCloudImg = loader.load("/img/earth/cloud-tranparent.png");
const sunCloudImg = loader.load("/img/Sol/cloud-tranparent.png");
const sateliteImg = loader.load("/img/Satelite/satelite.png");
const moonBump = loader.load('/img/lua/normal-map-lua.jpg');
const earthNormal = loader.load("/img/earth/normal.jpg");
const starImg = loader.load("/img/Galaxy/galaxy1.png");
const earthImg = loader.load("/img/earth/earth.jpg");
//bgImg = loader.load("/img/fundos/ceu.jpg");
const moonImg = loader.load("/img/lua/lua.jpg");
const sunImg = loader.load("/img/Sol/sun.jpg");

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Ilumincação
**/
const sunLight = new THREE.PointLight( 0xffffff, 1, 100 );
const deathstarLight = new THREE.SpotLight( 0x90EE90 );
deathstarLight.position.set(-40, 10, -50)
const abLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(abLight, sunLight, deathstarLight);


//Ajudar a ver a luz
//SpotLight
// const spotLightHelper = new THREE.SpotLightHelper( deathstarLight );
// scene.add( spotLightHelper );

//PointLight
// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( sunLight, sphereSize );
// scene.add( pointLightHelper );

//scene.background = bgImg;

//importar modelos
const gltfLoader = new GLTFLoader();

//X-Wing
var xWingModel;
gltfLoader.load('/assets/xwing/scene.gltf', (modeloXWing) => {
    xWingModel = modeloXWing
    //Transformações do GLTF
    modeloXWing.scene.scale.set(1.5, 1.5, 1.5)
    modeloXWing.scene.position.z = -30
    modeloXWing.scene.position.x = -40
    modeloXWing.scene.rotateY(-1.5);
    modeloXWing.scene.rotateX(-.05);
    modeloXWing.scene.rotateZ(.5);
    const root = modeloXWing.scene;
    scene.add(root)
});

//Estrela da morte
gltfLoader.load('/assets/deathstar/scene.gltf', (modeloDeathStar) => {
    //Transformações do GLTF
    modeloDeathStar.scene.scale.set(0.5, 0.5, 0.5)
    modeloDeathStar.scene.position.z = -60
    modeloDeathStar.scene.position.x = -50
    modeloDeathStar.scene.rotateY(-5.5)
    modeloDeathStar.scene.rotateX(0.1)
    const root = modeloDeathStar.scene;
    scene.add(root)
});

// Objects
const sateliteGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.5, 36)
const earthCloudGeometry = new THREE.SphereGeometry(2.1, 128, 128);
const solarPanelGeometry = new THREE.BoxGeometry(0.01, 0.3, 0.9);
const earthGeometry = new THREE.SphereGeometry(2, 128, 128);
const moonGeometry = new THREE.SphereGeometry(0.5, 64, 64);
const starGeometry = new THREE.SphereGeometry(150, 64, 64);
const sunCloudGeometry = new THREE.SphereGeometry(5.1, 64, 64);
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);

// Materials

const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunImg,
});
const sunCloudMaterial = new THREE.MeshBasicMaterial({
    map: sunCloudImg,
    transparent: true,
});
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthImg,
    normalMap: earthNormal,
    specular: 0x333333,
    shininess: 15,
});
const earthCloudMaterial = new THREE.MeshBasicMaterial({
    map: earthCloudImg,
    transparent: true,
});
const starMaterial = new THREE.MeshBasicMaterial({
    map: starImg,
    side: THREE.BackSide,
    transparent: true,
});
const moonMaterial = new THREE.MeshPhongMaterial({
    map: moonImg,
    normalMap: moonBump,
});
const sateliteMaterial = new THREE.MeshPhongMaterial({
    map: sateliteImg,
    refractionRatio: 0,
})
const solarPanelMaterial = new THREE.MeshPhongMaterial({
    map: solarPanelImg,
})

// Mesh
const earthCloud = new THREE.Mesh(earthCloudGeometry, earthCloudMaterial);
const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
const satelite = new THREE.Mesh(sateliteGeometry, sateliteMaterial);
const sunCloud = new THREE.Mesh(sunCloudGeometry, sunCloudMaterial);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const star = new THREE.Mesh(starGeometry, starMaterial);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

//Criar objeto
const moonObj = new THREE.Object3D();
moonObj.add(moon);
earth.add(earthCloud, moonObj);

//Criar grupo de objetos
const group = new THREE.Group();

const gSatelite = new THREE.Group();
gSatelite.add(satelite);
gSatelite.add(solarPanel)

//Agrupar Satelite com a
const groupEarth = new THREE.Group();
groupEarth.add(earth)
groupEarth.add(gSatelite)

const earthObj = new THREE.Object3D();
earthObj.add(groupEarth)

//Adicionar formas na cena
scene.add(sun, star)
sun.add(earthObj, sunCloud)

//posicao dos grupos
gSatelite.position.z = 3

//posicao da lua
moon.position.z = 5

//Rotacao da earth
earth.rotateX(-0.3)

//Rotacao do Sol
sun.rotateX(0.3)

//Rotacao grupo earth
groupEarth.position.z = 20

//Matrix de rotação do satélite
const mx = new THREE.Matrix4();
const my = new THREE.Matrix4();
mx.makeRotationX(0.009);
my.makeRotationY(-0.0050);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 30
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //rotação dos astros
    sun.rotateY(0.001);
    sunCloud.rotateY(0.002)
    sunCloud.rotateX(0.001)
    earth.rotateY(0.004);
    earthObj.rotateY(0.002)
    moon.rotateY(0.0007)
    moonObj.rotateY(0.0004)
    earthCloud.rotateY(-0.0005)
    earthCloud.rotateX(0.005)
    //xWingModel.rotateX(0.1)

    //rotação do satélite
    gSatelite.applyMatrix4(mx);
    gSatelite.applyMatrix4(my);
    

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()