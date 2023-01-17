//页面加载完成

window.onload = function () {
  createWorld();
};

function createWorld() {
  initRender(); // 创建渲染器
  initCamera(); // 创建相机
  initLight(); // 创建光源
  initObject(); // 创建几何体

  initScene();//创建场景
    render();//渲染
}
var renderer;
var width;
var height;
function initRender() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.setClearColor("#000000", 1.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById("retina").appendChild(renderer.domElement);
}
var camera;
var originPoint = new THREE.Vector3(0, 0, 0);
function initCamera() {
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000); // 视角、裁切面宽高比、近平面距离、远平面距离
  camera.position.set(200, 400, 600); //相机位置
  //相机的up属性表示相机的正方向，设置三维向量(0, 1, 0)也就是Y轴正方向为相机正方向，类似于人在直立观察；如果把相机正方向设置为Y轴负方向则类似于人在倒立观察
  camera.up.set(0, 1, 0); //相机正方向

  camera.lookAt(originPoint); //相机视点
}
var pointLight;
var ambientLight;
function initLight() {
  //点光源

  // color表示光照的颜色；
  // intensity表示光照强度；
  // distance表示最远的照射距离，超过该距离后不再有任何光线；
  // decay表示光照的衰减程度，设置的越大则光照随着距离的增加衰减的越厉害；
  pointLight = new THREE.PointLight(0xffffff, 1, 2000);
  pointLight.position.set(70, 112, 98);
  //环境光  只有一个颜色性质
  ambientLight = new THREE.AmbientLight(0x333333);
}
var cube;
function initObject(){
    var geometry = new THREE.BoxGeometry( 100, 100, 100);
    var material = new THREE.MeshLambertMaterial( {color: 0xff0000} );
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,0,0);
}

var scene;
function initScene(){
    scene = new THREE.Scene();
    scene.add(pointLight);
    scene.add(ambientLight);
    scene.add(cube);
}

function render(){
    renderer.clear();
    renderer.render(scene, camera);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    requestAnimationFrame(render);
}
