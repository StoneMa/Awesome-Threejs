var canvas = document.getElementById("number");

var container;


// three.js
var camera, scene, renderer;
var controls = void 0;
var objLoader = void 0;

var stats;
var oneObj;
var box;
init();
animate();

// 对于已经存在于数据库中的点，初始化的过程中要把点重新加入到模型当中
function init() {

    //初始化统计对象
    stats = initStats();
    function initStats() {
        var stats = new Stats();
        //设置统计模式
        stats.setMode(0); // 0: fps, 1: ms
        //统计信息显示在左上角
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        //将统计对象添加到对应的<div>元素中
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }
    container = document.createElement('div');
    document.body.appendChild(container);

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
    camera.position.set(750, 500, 1200);
    camera.lookAt(new THREE.Vector3(0,0,0));
    // Scene
    scene = new THREE.Scene();
    //坐标轴辅助
    var axes = new THREE.AxisHelper(400);
    scene.add(axes);
    // Lights
    var lights = [];

    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(1000, 2000, 1000);
    lights[1].position.set(-1000, -2000, -1000);

    scene.add(lights[0]);
    scene.add(lights[1]);

    // Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.5);
    container.appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);

    //  objLoader

    objLoader = new THREE.OBJLoader();
    objLoader.setPath('./obj/');
    objLoader.load('depot.obj', function (object) {
        oneObj = object;
        object.traverse(function (child) {
            if (child.type === "Mesh") {
                child.geometry.computeBoundingBox();
                child.geometry.verticesNeedUpdate = true;
                child.material.side = THREE.DoubleSide;
                //child.geometry.center(); //设置模型中心点为几何体的中心
            }
        });
        object.name = "zxj";  //设置模型的名称
        //对模型的大小进行调整

        // object.scale.x =0.001;
        // object.scale.y =0.001;
        // object.scale.z =0.001;
        //object.lookAt(new THREE.Vector3(0,0,0));
        // 加入模型的aabb包围盒
        // 获取三维模型表面点的最大距离
        var box3 = new THREE.Box3();
        box3.setFromObject(object);
        var maxLength = box3.getSize(new THREE.Vector3()).length();
        var consult = (camera.far - camera.near) / (40*maxLength);
        //写入场景内
        var currentScale = consult;
        object.scale.set(currentScale,currentScale,currentScale);
        box = new THREE.BoxHelper(object);
        // box.material.transparents = true;
        // box.material.depthTest = false;
        // box.visible = true;
        var points = box.geometry.attributes.position.array;
        obj_x = (points[0]+points[18])/2;
        obj_y = (points[1]+points[19])/2;
        obj_z = (points[2]+points[20])/2;
        oneObj.position.set(-obj_x,-obj_y,-obj_z);
        //scene.add(box);
        scene.add(object);
    });
    // Controls
    initControl();
}


/**
 * 渲染器
 */
function render() {
    stats.update();
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    //TWEEN.update(); // 点击后触发更新视角
    render();
}
/**
 * 初始化控制器
 * 控制器相关参数的调整
 */
function initControl() {
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