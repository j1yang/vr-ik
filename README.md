<a name="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/j1yang/vr-ik/">
    <img src="https://github.com/j1yang/vr-ik/blob/main/virk.gif" alt="Logo" width="700" height="400">
  </a>

  <h3 align="center">VR Avatar Arm Inverse Kinematic</h3>

  <p align="center">
    An avatar arm inverse kinematic for ReadyPlayerMe Avatar. 
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

The project's key features include:

- **Loads GLB**: The project seamlessly loads GLB files, ensuring smooth integration of 3D models.

- **Auto-detects rigs, height, orientation**: The system intelligently detects rigs, adjusts height, and orients the avatar for a natural and realistic representation.

- **Bones orientation output**: The project provides detailed bone orientation output, enabling precise control over avatar movements.

- **Arms inverse kinematics**: Leveraging Inverse Kinematics, the project accurately calculates arm movements, enhancing the realism of the avatars.

- **Face animation (visemes) with microphone**: The project incorporates facial animation (visemes) synchronized with microphone input, adding a layer of interactivity and immersion.

### Built With

* [Three.js](https://threejs.org/)
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Vite](https://vitejs.dev/)
* [React.js](https://reactjs.org/)


<!-- GETTING STARTED -->

## Getting Started

### Installation

  ```sh
  clone project
  npm install
  npm vite build
  ```

<!-- USAGE EXAMPLES -->




## How it works

```

const avatar = new Avatar(model, { // model is the gltf object that includes the scene
  // animate fingers
  fingers: true,

  // animate hair
  hair: true,

  // remove head for first person
  decapitate: false,

  // animate visemes (blink, mouth, etc.)
  visemes: true,
  // navigator.mediaDevices.getUserMedia({audio: true}); // microphone input for visemes
  microphoneMediaStream,
  // false to passthrough microphone audio
  muted: true,

  // add debug bone geometry
  debug: true,
});

avatar.setMicrophoneMediaStream(microphoneMediaStream); // set microphoneMediaStream separately

function animate() {
  const now = Date.now();
  avatar.inputs.hmd.position.set(0, 1.5 + Math.sin((now%2000)/2000*Math.PI*2)*0.5, 0); // or, get pose from WebXR
  avatar.inputs.leftGamepad.position.copy(avatar.inputs.hmd.position).add(new THREE.Vector3(0.2, -0.3, -0.3));
  avatar.inputs.leftGamepad.pointer = 0.5; // for finger animation
  avatar.inputs.leftGamepad.grip = 1;
  avatar.inputs.rightGamepad.position.copy(avatar.inputs.hmd.position).add(new THREE.Vector3(-0.2, -0.3, -0.3));

  avatar.setFloorHeight(0) // sets the floor height that exokit uses to determine the pose

  avatar.update();

  requestAnimationFrame(animate);
}
animate();
```
