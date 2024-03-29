
    var EyePoint = {//视点以及默认位置
        x:4.0,
        y:8.0,
        z:12.0
    };
    var PerspParams = {//透视投影参数
        fovy:45.0,
        g_near:1.0,
        g_far:1000.0
    };

    window.onload = function(){
        createWorld();
    }

    function createWorld(){
        var gl = initRender();//创建渲染器
        var shaderProgram = initShaders(gl);//初始化着色器程序
        var cameraMatrix = initCamera();//创建相机
        initLight(gl,shaderProgram);//创建光源
        var num = initObject(gl,shaderProgram);//创建物体
        render(gl,num,shaderProgram,cameraMatrix);//渲染
    }

    var width = window.innerWidth * window.devicePixelRatio;//实际尺寸为显示尺寸乘以设备像素比
    var height = window.innerHeight * window.devicePixelRatio;
    function initRender(){
        var canvas = document.querySelector('#retina');
        canvas.width = width;
        canvas.height = height;
        var gl = canvas.getContext('webgl');//获取webgl上下文
        gl.clearColor(1.0,1.0,1.0,1.0);//设置背景颜色
        gl.enable(gl.DEPTH_TEST);//开启隐藏面消除
        return gl;
    }

    function initCamera(){
        var viewMatrix = new Matrix4();//视图矩阵
        viewMatrix.setLookAt(EyePoint.x,EyePoint.y,EyePoint.z,0, 0, 0, 0, 1, 0);

        var projMatrix = new Matrix4();//透视投影矩阵
        projMatrix.setPerspective(PerspParams.fovy, width/height, PerspParams.g_near, PerspParams.g_far);

        var cameraMatrix = projMatrix.multiply(viewMatrix);
        return cameraMatrix;
    }

    function initLight(gl,shaderProgram){
        //点光源
        var u_LightColor = gl.getUniformLocation(shaderProgram, 'u_LightColor');
        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        var u_LightPosition = gl.getUniformLocation(shaderProgram, 'u_LightPosition');
        gl.uniform3f(u_LightPosition, 2.5, 4.0, 3.5);
        //环境光
        var u_AmbientLight = gl.getUniformLocation(shaderProgram, 'u_AmbientLight');
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    }

    function initObject(gl,shaderProgram){

        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3

        //顶点
        var vertices = new Float32Array([
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
            -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
            -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
        ]);

        //颜色
        var colors = new Float32Array([
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
        ]);

        //法向量
        var normals = new Float32Array([
            0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
            0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
            -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
            0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
            0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
        ]);

        //索引
        var indices = new Uint8Array([
            0, 1, 2,   0, 2, 3,    // front
            4, 5, 6,   4, 6, 7,    // right
            8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,   // left
            16,17,18,  16,18,19,   // down
            20,21,22,  20,22,23    // back
        ]);

        var num = indices.length;
        
        if(!_initElementBuffer(gl,indices)) return -1;//创建索引缓冲区
        if(!_initArrayBuffer(gl,shaderProgram,'a_Normal',normals,3,gl.FLOAT)) return -1;//创建法向量缓冲区
        if(!_initArrayBuffer(gl,shaderProgram,'a_Position',vertices,3,gl.FLOAT)) return -1;//创建顶点缓冲区
        if(!_initArrayBuffer(gl,shaderProgram,'a_Color',colors,3,gl.FLOAT)) return -1;////创建颜色缓冲区

        return num;
    }

    var rotateAngle = 0;
    function render(gl,num,shaderProgram,cameraMatrix){
        //模型矩阵
        rotateAngle += .3;
        var modelMatrix = new Matrix4();
        modelMatrix.rotate(rotateAngle, 1, 0, 0);
        modelMatrix.rotate(rotateAngle, 0, 1, 0);
        var u_ModelMatrix = gl.getUniformLocation(shaderProgram, 'u_ModelMatrix');
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        //投影矩阵
        var mvpMatrix = cameraMatrix;
        var originMatrix = new Matrix4();
        for(var i=0;i<cameraMatrix.elements.length;i++){
            originMatrix.elements[i] = cameraMatrix.elements[i];
        }
        mvpMatrix.multiply(modelMatrix);
        var u_MvpMatrix = gl.getUniformLocation(shaderProgram, 'u_MvpMatrix');
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        //法向量变换矩阵
        var normalMatrix = new Matrix4(); 
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        var u_NormalMatrix = gl.getUniformLocation(shaderProgram, 'u_NormalMatrix');
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, num, gl.UNSIGNED_BYTE, 0);

        requestAnimationFrame(function(){
            render(gl,num,shaderProgram,originMatrix);
        });
    }

    //初始化索引缓冲区
    function _initElementBuffer(gl,data){
        var buffer = gl.createBuffer();
        if(!buffer){
            console.log('Failed to create the buffer object!');
            return false;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);//没有绘制完成之前并不能解绑
        return true;
    }

    //初始化数据缓冲区
    function _initArrayBuffer (gl,shaderProgram,attribute, data, num, type) {
        //创建缓冲区
        var buffer = gl.createBuffer();
        if (!buffer) {
            console.log('Failed to create the buffer object!');
            return false;
        }
        //将缓冲区对象绑定到目标
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        //把缓冲区数据赋予指定变量
        var a_attribute = gl.getAttribLocation(shaderProgram, attribute);
        if (a_attribute < 0) {
            console.log('Failed to get the storage location of ' + attribute);
            return false;
        }
        gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
        gl.enableVertexAttribArray(a_attribute);
        //解绑缓冲区
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return true;
    }