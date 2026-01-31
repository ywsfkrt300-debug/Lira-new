/**
 * Animated Currency Background
 * Called via CURRENCY_BG({ el: "#currency-background" })
 */

const CURRENCY_BG = (function() {
  return function(options = {}) {
    // Ensure THREE is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Make sure to include it before this script.');
        return;
    }

    const el = document.querySelector(options.el || '#currency-background');
    if (!el) {
      console.error('Element not found:', options.el);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Make canvas transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Currency symbols
    const symbols = ['$', '€', '£', '¥', '₽', '₺', '₹', '₩', '₴', '₦'];
    const nodes = [];

    // Create currency nodes
    for (let i = 0; i < 50; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Random color (Red or Gold)
      const colors = ['#DC143C', '#FFD700'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Transparent background for the text texture
      ctx.clearRect(0, 0, 256, 256);

      ctx.fillStyle = color;
      ctx.font = 'bold 120px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbols[i % symbols.length], 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(14, 14);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 380,
        (Math.random() - 0.5) * 380,
        (Math.random() - 0.5) * 180
      );

      mesh.position.copy(position);
      group.add(mesh);

      nodes.push({
        mesh: mesh,
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.25,
          (Math.random() - 0.5) * 0.25,
          (Math.random() - 0.5) * 0.15
        ),
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.003,
      });
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Update position
        node.position.add(node.velocity);

        // Bounce off boundaries
        const boundary = 190;
        if (Math.abs(node.position.x) > boundary) {
          node.velocity.x *= -0.92;
          node.position.x = Math.sign(node.position.x) * boundary;
        }
        if (Math.abs(node.position.y) > boundary) {
          node.velocity.y *= -0.92;
          node.position.y = Math.sign(node.position.y) * boundary;
        }
        if (Math.abs(node.position.z) > 90) {
          node.velocity.z *= -0.92;
          node.position.z = Math.sign(node.position.z) * 90;
        }

        // Smooth damping
        node.velocity.multiplyScalar(0.9985);

        // Update rotation
        node.angle += node.angularVelocity;

        // Update mesh
        node.mesh.position.copy(node.position);
        node.mesh.rotation.z = node.angle;
        node.mesh.rotation.x = Math.sin(Date.now() * 0.0003 + i) * 0.25;
        node.mesh.rotation.y = Math.cos(Date.now() * 0.0002 + i) * 0.15;

        // Bobbing motion
        node.mesh.position.y += Math.sin(Date.now() * 0.0006 + i * 0.3) * 0.2;
      }

      // Rotate group
      group.rotation.x += 0.00003;
      group.rotation.y += 0.00008;

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  };
})();
