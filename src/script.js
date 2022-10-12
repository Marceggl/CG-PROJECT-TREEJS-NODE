import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'


//Carregar
const loader = new THREE.TextureLoader()
const sunImg = loader.load('/img/earth/earth.png');
//const earthImg = loader.load('/img/earth/earth.png')


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Ilumincação
**/
    const light = new THREE.PointLight( 0xffffff, 2, 1000 );
    const abLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light, abLight);
    //scene.background = bgImg;

// Objects
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);

// Materials

const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunImg,
})


// Mesh
const sphere = new THREE.Mesh(sunGeometry,sunMaterial)
scene.add(sphere)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()