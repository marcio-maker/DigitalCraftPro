// Configuração do Three.js para fundo 3D interativo
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o canvas existe
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    // Cena
    const scene = new THREE.Scene();
    scene.background = null; // Fundo transparente

    // Câmera (Perspectiva)
    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = 15;

    // Renderizador (WebGL com transparência)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Luzes (Ambiente + Direcional)
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Geometria 3D Interativa (Esfera com efeito de wireframe)
    const geometry = new THREE.IcosahedronGeometry(5, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x3a86ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
        shininess: 100
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Efeito de Partículas Flutuantes
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.07,
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Interatividade com Mouse
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animação
    function animate() {
        requestAnimationFrame(animate);

        // Rotação suave do objeto 3D
        mesh.rotation.x += 0.002;
        mesh.rotation.y += 0.003;

        // Efeito de interação com o mouse
        mesh.position.x = mouse.x * 2;
        mesh.position.y = mouse.y * 2;
        particlesMesh.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    // Redimensionamento responsivo
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
});