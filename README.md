The only web-based avatar system you need.

- Loads GLB, FBX, VRChat, VRoid, .unitypackage humanoid
- Auto-detects rigs, height, orientation
- World scale matching
- HMD + gamepads input
- Bones orientation output
- Arms, legs inverse kinematics
- Walking kinematics
- Face animation (visemes) with microphone
- Hair/clothing animation

#npm install

#npm run build

#npm start

## How it works

```
import './three.js';
import Avatar from 'https://avatars.exokit.org/avatars.js';

const avatar = new Avatar(model, { // model is the gltf object that includes the scene, can use https://github.com/exokitxr/model-loader
  // all options are optional

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

## [License](https://github.com/exokitxr/license)
