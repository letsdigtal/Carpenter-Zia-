// 3D Showcase using Three.js
let scene, camera, renderer, cube, isDragging = false, previousMousePosition = { x: 0, y: 0 };

function init3DShowcase() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas) return;

    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xc19a6b, 0.5);
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);

    // Create 3D furniture piece (wooden box/cabinet)
    createWoodenFurniture();

    // Mouse events for rotation
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onMouseWheel, false);

    // Touch events for mobile
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createWoodenFurniture() {
    // Create a group to hold all furniture parts
    const furnitureGroup = new THREE.Group();

    // Wood material with wood texture color
    const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.5,
        metalness: 0.1,
    });

    // Main cabinet body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 0.8);
    const body = new THREE.Mesh(bodyGeometry, woodMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    furnitureGroup.add(body);

    // Cabinet doors
    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0xA0522D,
        roughness: 0.4,
        metalness: 0.05,
    });

    const doorGeometry = new THREE.BoxGeometry(0.7, 1.8, 0.05);
    const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    leftDoor.position.set(-0.4, 0, 0.42);
    leftDoor.castShadow = true;
    leftDoor.receiveShadow = true;
    furnitureGroup.add(leftDoor);

    const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rightDoor.position.set(0.4, 0, 0.42);
    rightDoor.castShadow = true;
    rightDoor.receiveShadow = true;
    furnitureGroup.add(rightDoor);

    // Top shelf
    const shelfGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8);
    const shelf = new THREE.Mesh(shelfGeometry, woodMaterial);
    shelf.position.set(0, 0.8, 0);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    furnitureGroup.add(shelf);

    // Decorative handles
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0xC19A6B,
        roughness: 0.3,
        metalness: 0.7,
    });

    const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 32);
    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.rotation.z = Math.PI / 2;
    leftHandle.position.set(-0.4, 0.3, 0.5);
    leftHandle.castShadow = true;
    furnitureGroup.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.position.set(0.4, 0.3, 0.5);
    rightHandle.castShadow = true;
    furnitureGroup.add(rightHandle);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const legPositions = [
        [-0.6, -1.15, 0.3],
        [0.6, -1.15, 0.3],
        [-0.6, -1.15, -0.3],
        [0.6, -1.15, -0.3],
    ];

    legPositions.forEach((pos) => {
        const leg = new THREE.Mesh(legGeometry, woodMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        leg.receiveShadow = true;
        furnitureGroup.add(leg);
    });

    // Add slight rotation for better view
    furnitureGroup.rotation.x = -0.3;
    furnitureGroup.rotation.y = 0.5;

    scene.add(furnitureGroup);
    cube = furnitureGroup;
}

function onMouseDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e) {
    if (isDragging && cube) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        cube.rotation.y += deltaX * 0.005;
        cube.rotation.x += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
}

function onMouseUp() {
    isDragging = false;
}

function onMouseWheel(e) {
    e.preventDefault();

    const zoomSpeed = 0.1;
    if (e.deltaY < 0) {
        camera.position.z -= zoomSpeed;
    } else {
        camera.position.z += zoomSpeed;
    }

    // Clamp zoom
    camera.position.z = Math.max(1.5, Math.min(8, camera.position.z));
}

// Touch events for mobile
let touchStartX = 0,
    touchStartY = 0;

function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function onTouchMove(e) {
    if (e.touches.length === 1 && cube) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;

        cube.rotation.y += deltaX * 0.005;
        cube.rotation.x += deltaY * 0.005;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    // Pinch zoom
    if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
            touch1.clientX - touch2.clientX,
            touch1.clientY - touch2.clientY
        );

        if (window.lastTouchDistance) {
            const zoomSpeed = 0.05;
            if (distance < window.lastTouchDistance) {
                camera.position.z += zoomSpeed;
            } else {
                camera.position.z -= zoomSpeed;
            }
            camera.position.z = Math.max(1.5, Math.min(8, camera.position.z));
        }
        window.lastTouchDistance = distance;
    }
}

function onTouchEnd() {
    window.lastTouchDistance = null;
}

function onWindowResize() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas || !canvas.parentElement) return;

    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);

    // Gentle auto-rotation when not dragging
    if (!isDragging && cube) {
        cube.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init3DShowcase);

// Re-initialize on page load
window.addEventListener('load', () => {
    setTimeout(init3DShowcase, 100);
});
