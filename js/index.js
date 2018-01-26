

// Number

var canvas = document.getElementById("number");
var ctx = canvas.getContext("2d");

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

var annotation = document.querySelector(".annotation"); //第一个annotation
var annotation2 = document.querySelector(".annotation2");//第二个annotation

var addObject = new Object();
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
    particleMaterial = new THREE.SpriteMaterial( {
        alphaTest: 0.5,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        color: 0x000000,
        // program: function ( context ) {
        //     context.beginPath();
        //     context.arc( 0, 0, 0.5, 0, PI2, true );
        //     context.fill();
        // }

    } );
    // Scene
    scene = new THREE.Scene();

    // Lights
    var lights = [];

    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(1000, 2000, 1000);
    lights[1].position.set(-1000, -2000, -1000);
    scene.add(lights[0]);
    scene.add(lights[1]);

    // Mesh

    var cubeGeometry = new THREE.BoxGeometry(500, 500, 500);

    mesh = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
    }));

    // Sprite
     
    var numberTexture = new THREE.CanvasTexture(document.querySelector("#number"));

    sprite = new THREE.Sprite();
    sprite.position.set(0, 0, 100);
    sprite.scale.set(60, 60, 10);

    scene.add(sprite);

    // 射线投影器
    raycaster = new THREE.Raycaster(); // 射线投射器
    mouse = new THREE.Vector2(); // 二维鼠标向量

    // Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.5);
    container.appendChild( renderer.domElement );
    document.body.appendChild(renderer.domElement);
    stats = new Stats();
    container.appendChild( stats.dom );


    //  objLoader

    objLoader = new THREE.OBJLoader();
    objLoader.setPath('./obj/');
    objLoader.load('zxj.obj', function (object) {
        
        object.traverse( function (child){
            if (child.type === "Mesh") {
                child.geometry.computeBoundingBox();
                child.geometry.verticesNeedUpdate = true;
                child.material.side = THREE.DoubleSide;
            }
           
        });
        object.name = "zxj";  //设置模型的名称
        object.position.y = 0; //载入模型的时候的位置
        object.position.x = -100;
        object.position.z = -500;
        
        object.scale.x = 0.001;
        object.scale.y = 0.001;
        object.scale.z = 0.001;
        //写入场景内
        scene.add(object);
        objects.push( object );//仿照ThreeJS写法
        addObject = object; 

    
    });
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //旋转速度
    controls.rotateSpeed = 0.25;
    //是否允许变焦
    controls.enableZoom = true;
    //变焦速度
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.dampingFactor = 50;  
    //是否允许相机平移 默认是false
    controls.enablePan = true;
    //惯性 true没有惯性
    //controls.staticMoving = false;
    //动态阻尼系数 就是灵敏度
    //controls.dynamicDampingFactor = 0.12;

    controls.dampingFactor = 0.09;

    window.addEventListener("resize", onWindowResize, false);
}
/**
 * 触摸屏
 */ 
function onDocumentTouchStart(event) {

    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);

}
/**
 * 鼠标点击生成热点
 */ 
function ondblclick(event){
    
}
function onDocumentMouseDown(event) {

    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);//从相机发射一条射线，经过鼠标点击位置

    var intersects = raycaster.intersectObjects(objects[0].children);
    // if (intersects.length > 0) {
    //     console.log('gg');

    //     //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    // }
    /**
     *  向模型上标记点
     */
    if (intersects.length > 0) {

        //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

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
    updateAnnotationOpacity(); // 修改注解的透明度
    updateScreenPosition(); // 修改注解的屏幕位置
}

/* 修改注解透明度函数体 */
function updateAnnotationOpacity() {
    var objDistance = camera.position.distanceTo(mesh.position);
    var spriteDistance = camera.position.distanceTo(sprite.position);
    spriteBehindObject = spriteDistance > objDistance; //判断是否在模型的正面
    sprite.material.opacity = spriteBehindObject ? 0.25 : 1;

    // Do you want a number that changes size according to its position?
    // Comment out the following line and the `::before` pseudo-element.
    sprite.material.opacity = 0;
}
/* 修改注解屏幕位置函数体 实时更新，实际是三维坐标向屏幕坐标的映射*/
function updateScreenPosition() {
    var canvas = renderer.domElement;

    var vector = new THREE.Vector3(250, 0, 250); // 控制annotation的位置
    vector.project(camera);
    vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
    vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

    annotation.style.top = vector.y + "px";
    annotation.style.left = vector.x + "px";
    annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
    //===================================================

    var vector2 = new THREE.Vector3(-150, 10, 150); // 控制annotation2的位置
    vector2.project(camera);
    vector2.x = Math.round((0.5 + vector2.x / 2) * (canvas.width / window.devicePixelRatio));
    vector2.y = Math.round((0.5 - vector2.y / 2) * (canvas.height / window.devicePixelRatio));

    annotation2.style.top = vector2.y + "px";
    annotation2.style.left = vector2.x + "px";
    annotation2.style.opacity = spriteBehindObject ? 0.25 : 1;
}

/**
 * 每个function对应一个热点
 */ 
function num1Btn(){

    $('.annotation').find("*").toggle('slow');

    if(annotation.style.background !=''){

        annotation.style.background = '';
        
    }else{

        annotation.style.background = 'rgba(0, 0, 0, 0.8)';

    }
}

function num2Btn(){

    $('.annotation2').find("*").toggle("slow");

    if(annotation2.style.background !=''){
        
        annotation2.style.background = '';
        
    }else{

        annotation2.style.background = 'rgba(0, 0, 0, 0.8)';

    }
}
