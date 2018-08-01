// Number

var canvas = document.getElementById("number");
var ctx = canvas.getContext("2d");
var x = 32;
var y = 32;

var container, stats;
var particleMaterial;
var raycaster;
var mouse;
var objects =[];
// three.js
var camera = void 0;
var controls = void 0;
var scene = void 0;
var renderer = void 0;
var sprite = void 0;
var mesh = void 0;
var objLoader = void 0;
var spriteBehindObject = void 0;
var annotation = document.querySelector(".annotation");
//
var texture = new THREE.Texture();
texture.needsUpdate = true;
init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    // Camera

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 5000); 
    camera.position.set( 750, 500, 1200 );
    

    var PI2 = Math.PI * 2;
    particleMaterial = new THREE.SpriteCanvasMaterial( {

        color: 0x000000,
        program: function ( context ) {

            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }

    } );
    // Scene

    scene = new THREE.Scene();

    // Lights
    var lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 20000, 0);
    lights[1].position.set(1000, 2000, 1000);
    lights[2].position.set(-1000, -2000, -1000);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);


    raycaster = new THREE.Raycaster(); // 射线投射器
    mouse = new THREE.Vector2(); // 二维鼠标向量


    // Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.5);
    container.appendChild( renderer.domElement );
    stats = new Stats();
    container.appendChild( stats.dom );


    //  objLoader

    objLoader = new THREE.OBJLoader();
    objLoader.setPath('./obj/');
    objLoader.load('zxj.obj', function (object) {
        
        object.traverse( function (child){
            if (child instanceof THREE.Mesh) {
                child.material.side = THREE.DoubleSide;
                child.material.shininess = 100;
            }
           
        });
        object.name = "zxj";  
        object.position.y = 0; 
        object.position.x = -100;
        object.position.z = -500;
        
        object.scale.x = 0.001;
        object.scale.y = 0.001;
        object.scale.z = 0.001;
        // add to scene
        scene.add(object);
        
        objects.push( object );

    });

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.rotateSpeed = 0.25;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.dampingFactor = 50;  
    controls.enablePan = true;

    controls.dampingFactor = 0.09;
    window.addEventListener("resize", onWindowResize, false);
}

function onDocumentTouchStart(event) {

    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

        var particle = new THREE.Sprite(particleMaterial);
        particle.position.copy(intersects[0].point);
        particle.scale.x = particle.scale.y = 16;
        scene.add(particle);

    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}


