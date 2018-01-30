var canvas = document.getElementById("number");

var container;
var particleMaterial;
var raycaster;
var mouse;
var objects =[];

// three.js
var camera, scene, renderer;
var controls = void 0;
var sprite = void 0;
var mesh = void 0;
var objLoader = void 0;
var spriteBehindObject = void 0;
// 例子，annotation写法
var annotation = document.querySelector(".annotation"); //第一个annotation
var annos = null;
var clientX;
var clientY;
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
        color: 0x000000
    });
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
    // 创建一个永远朝向屏幕方向的sprite
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
        object.position.x = -100;//载入模型的时候的位置
        object.position.y = 0; 
        object.position.z = -500;
        
        object.scale.x = 0.001;
        object.scale.y = 0.001;
        object.scale.z = 0.001;
        //写入场景内
        scene.add(object);
        objects.push( object );//仿照ThreeJS写法

    
    });
    // Controls
    initControl();

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'dblclick',ondblClick, false);
    window.addEventListener("resize", onWindowResize, false);
}
/**
 * light光照初始化
 */
function initLight() {
    // Lights
    var lights = [];

    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(1000, 2000, 1000);
    lights[1].position.set(-1000, -2000, -1000);
    return lights;
}
/**
 * 初始化控制器
 * 控制器相关参数的调整
 */
function initControl(){
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
    //动态阻尼系数 就是灵敏度
    controls.dampingFactor = 0.09;
}

/**
 * 鼠标双击事件，添加热点
 * 实现应该是双击某点后添加热点，并提示添加注释
 * 步骤：1、双击某处；记录camera位置
 *      2、 声明一个annotation
 *      3、 在页面创建标签并绑定
 *      4、 添加样式和事件
 * @param {*} event 
 */
function ondblClick(event){
    event.preventDefault();
    console.log('双击');
    clientX = event.clientX;
    clientY = event.clientY;
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1; //获取鼠标点击的位置的坐标
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);//从相机发射一条射线，经过鼠标点击位置
    var intersects = raycaster.intersectObjects(objects[0].children);

    /* 如果射线与模型之间有交点，才执行如下操作 */
    if (intersects.length > 0) {
        /**
         *  向模型上标记点
         */
        // 选中mesh
        //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
        initAnnotation();
        annos = document.querySelector('.annos');
        var particle = new THREE.Sprite(particleMaterial);
        particle.position.copy(intersects[0].point);
        particle.scale.x = particle.scale.y = 5;
        scene.add(particle);
    }   
}
/**
 * 创建热点相关节点，添加样式并add到document.body中
 */
function initAnnotation(){
    var div = document.createElement('div'); 
    var sp = document.createElement('p');
    var strong = document.createElement('strong');
    var p = document.createElement('p');
    strong.innerHTML = '转向架';
    p.innerHTML = 'caseone';
    sp.appendChild(strong);
    sp.append(p);
    div.appendChild(sp);
    div.className = 'annos';
    div.style.background = 'rgba(0, 0, 0, 0.8)';
    document.body.appendChild(div);
    $('.annos').attr('data-attr', '2');//操作伪dom中的内容
    // var v = window.getComputedStyle(div,'::before').getPropertyValue('content');
    // console.log(v);
}
/**
 * 更新Annos屏幕中所处的位置
 * Annos不是编号1的annotation
 */
function updateAnnosPosition(){
    var canvas = renderer.domElement;
    var vector = new THREE.Vector3(clientX,clientY,-1);
    vector.project(camera);
    //这个位置的写法有问题
    annos.style.left = clientX + "px";
    annos.style.top = clientY + "px";

    annos.style.opacity = spriteBehindObject ? 0.25 : 1;
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

    var vector = new THREE.Vector3(50, 0, 250); // 控制annotation的位置
    vector.project(camera);
    vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio)); // 控制annotation跟随物体一起旋转
    vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

    annotation.style.top = vector.y + "px";
    annotation.style.left = vector.x + "px";
    annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
}
function render() {
    renderer.render(scene, camera);
    updateAnnotationOpacity(); // 修改注解的透明度
    updateScreenPosition(); // 修改注解的屏幕位置
    if (annos != null){
        updateAnnosPosition();
    }
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
/**
 * 鼠标单击事件
 * @param {} event 
 */
function onDocumentMouseDown(event) {

    event.preventDefault();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
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