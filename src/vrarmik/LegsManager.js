import * as THREE from 'three';
import {Helpers} from './Unity.js';

const stepRate = 0.2;
const stepHeight = 0.2;
const stepMinDistance = 0;
const stepMaxDistance = 0.25;
const stepRestitutionDistance = 0.8;
// const minStepDistanceTimeFactor = 0.2;
const minHmdVelocityTimeFactor = 0.015;
// const velocityLearningFactor = 1;
const maxVelocity = 0.015;
const velocityRestitutionFactor = 25;
const crossStepFactor = 0.9;

const zeroVector = new THREE.Vector3();
const oneVector = new THREE.Vector3(1, 1, 1);
const identityRotation = new THREE.Quaternion();
const downHalfRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2);
const upHalfRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2);
const downJumpRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/4);
// const downQuarterRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/4);

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localVector4 = new THREE.Vector3();
const localVector5 = new THREE.Vector3();
const localVector6 = new THREE.Vector3();
const localVector7 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localQuaternion2 = new THREE.Quaternion();
const localQuaternion3 = new THREE.Quaternion();
const localEuler = new THREE.Euler();
const localMatrix = new THREE.Matrix4();
const localMatrix2 = new THREE.Matrix4();
const localMatrix3 = new THREE.Matrix4();

const _mod = (a, n) => (a % n + n) % n;
const _angleDiff = (targetA, sourceA) => {
  let a = targetA - sourceA;
  a = _mod((a + Math.PI), Math.PI*2) - Math.PI;
  return a;
};

class Leg {
  constructor(legsManager, left) {
  	this.transform = new THREE.Object3D();
    this.upperLeg = new THREE.Object3D();
    this.lowerLeg = new THREE.Object3D();
    this.foot = new THREE.Object3D();
    this.foot.stickTransform = new THREE.Object3D();
    this.foot.startTransform = new THREE.Object3D();
    this.foot.endTransform = new THREE.Object3D();
    this.foot.startHmdFloorTransform = new THREE.Object3D();

    this.transform.add(this.upperLeg);
    this.upperLeg.add(this.lowerLeg);
    this.lowerLeg.add(this.foot);

    this.upperLegLength = 0;
    this.lowerLegLength = 0;
    this.legLength = 0;
    this.eyesToUpperLegOffset = new THREE.Vector3();

    this.legsManager = legsManager;
    this.left = left;

    this.standing = true;
    this.standFactor = 1;
    const now = Date.now();
    this.lastStandTimestamp = now;
    this.lastJumpTimestamp = now;

    this.stepping = false;
    this.lastStepTimestamp = now;

    this.balance = 1;
  }

  Start() {
    this.upperLegLength = this.lowerLeg.position.length();
    this.lowerLegLength = this.foot.position.length();
    this.legLength = this.upperLegLength + this.lowerLegLength;

    Helpers.getWorldPosition(this.upperLeg, this.eyesToUpperLegOffset)
  	  .sub(Helpers.getWorldPosition(this.legsManager.rig.shoulderTransforms.eyes, localVector));
  }

  Update() {
	}
}

class LegsManager {
	constructor(rig) {
    this.hips = rig.shoulderTransforms.hips;
    this.leftLeg = new Leg(this, true);
    this.hips.add(this.leftLeg.transform);
    this.rightLeg = new Leg(this, false);
    this.hips.add(this.rightLeg.transform);

    this.rig = rig;
    this.poseManager = rig.poseManager;

    this.legSeparation = 0;
    this.lastHmdPosition = new THREE.Vector3();

    this.hmdVelocity = new THREE.Vector3();
  }

  Start() {
  	this.legSeparation = Helpers.getWorldPosition(this.leftLeg.upperLeg, localVector)
  	  .distanceTo(Helpers.getWorldPosition(this.rightLeg.upperLeg, localVector2));
  	this.lastHmdPosition.copy(this.poseManager.vrTransforms.head.position);
  	this.leftLeg.Start();
  	this.rightLeg.Start();
  }

	Update() {
		Helpers.updateMatrixWorld(this.leftLeg.transform);
		Helpers.updateMatrixWorld(this.leftLeg.upperLeg);
		Helpers.updateMatrixWorld(this.leftLeg.lowerLeg);
		Helpers.updateMatrixWorld(this.leftLeg.foot);

    Helpers.updateMatrixWorld(this.rightLeg.transform);
		Helpers.updateMatrixWorld(this.rightLeg.upperLeg);
		Helpers.updateMatrixWorld(this.rightLeg.lowerLeg);
		Helpers.updateMatrixWorld(this.rightLeg.foot);

		

		this.leftLeg.Update();
		this.rightLeg.Update();
  }
}

export default LegsManager;
