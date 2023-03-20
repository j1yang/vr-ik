import * as THREE from 'three';
import {Helpers} from './Unity.js';

const zeroVector = new THREE.Vector3();
const forwardVector = new THREE.Vector3(0, 0, 1);

const leftRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/2);
const rightRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/2);

const bankLeftRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2);
const bankRightRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/2);
const z180Quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

const testLocalVector = new THREE.Vector3();

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localVector4 = new THREE.Vector3();
const localVector5 = new THREE.Vector3();
const localVector6 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localQuaternion2 = new THREE.Quaternion();
const localQuaternion3 = new THREE.Quaternion();
const localEuler = new THREE.Euler();

const handUpRestriction = false;

const localMatrix = new THREE.Matrix4();


let afkOnTimer, afkOffTimer; // Timer variable
let isAfk =false;
let prevAfkY = 0;
let prevVrAfkY = 0;

function startAFKONTimer() {
  afkOnTimer = setTimeout(() => {
		isAfk = true;
  }, 4000); // 4 second timeout
}
function stopAFKONTimer() {
  clearTimeout(afkOnTimer);
}

function startAFKOFFTimer() {
  afkOffTimer = setTimeout(() => {
		isAfk = false;
  }, 2000); // 2 second timeout
}
function stopAFKOFFTimer() {
  clearTimeout(afkOffTimer);
}

let inAfkTime = 0, outAfkTime= 0, deltaTime = 0;

	class VRArmIK
	{
		constructor(arm, shoulder, shoulderPoser, target, left) {
			this.arm = arm;	//left arm or right arm
			this.shoulder = shoulder;
			this.shoulderPoser = shoulderPoser;
			this.target = target;	//shoulderPoser.vrTransforms.leftHand or.rightHand
			this.left = left;	//is left? true/false

			this.upperArmLength = 0;
			this.lowerArmLength = 0;
			this.armLength = 0;
    }

		Start()
		{
			this.upperArmLength = Helpers.getWorldPosition(this.arm.lowerArm, localVector).distanceTo(Helpers.getWorldPosition(this.arm.upperArm, localVector2));
			this.lowerArmLength = Helpers.getWorldPosition(this.arm.hand, localVector).distanceTo(Helpers.getWorldPosition(this.arm.lowerArm, localVector2));
			this.armLength = this.upperArmLength + this.lowerArmLength;
		}

		Update()
		{
			Helpers.updateMatrixWorld(this.arm.transform);
			Helpers.updateMatrixWorld(this.arm.upperArm);

			const upperArmPosition = Helpers.getWorldPosition(this.arm.upperArm, localVector);
      let handRotation = this.target.quaternion;

			let handPosition = localVector2.copy(this.target.position);
			let leaveAfkHandPos = localVector2.copy(this.target.position);

			// const afkQ = this.left? 0.05: -0.25;
			
			// this.target.quaternion.w = afkQ;
			// handRotation = localQuaternion.copy(this.arm.lowerArm.quaternion);
			
			const afkX = this.left? 0.2 : -0.2;
			const afkY = -0.45;
			const afkZ = -0.15;
			
			// // 0.8738477944590622,0.47845723383741373,0.06995392297964698,0.05074599656564401
			// // 0.8081548774831672,0.5361485314660845,-0.0336177158304333,-0.24145454104090108
			



			// console.log(isAfk)
			let previousY = this.target.position.y.toFixed(5);
			//let prevAfkY = (this.shoulder.shoulderPoser.vrTransforms.head.position.y + afkY).toFixed(5)


			if(!this.left){
				// console.log('prev Y', previousY)
				// console.log('curr Y', this.target.position.y.toFixed(5))
				// console.log(' ')
			}

			if(inAfkTime === 2){
				isAfk = true;
				inAfkTime = 0;
				prevAfkY = (this.shoulder.shoulderPoser.vrTransforms.head.position.y + afkY).toFixed(5);
			}

			if(outAfkTime === 4){
				isAfk = false;
				inAfkTime = 0;
				outAfkTime = 0;
			}

			deltaTime+=1;

			if(!isAfk){
				if(deltaTime % 300 === 0){
					console.log('Not AFK')
					//console.log('curr Y', this.target.position.y.toFixed(5))
					setTimeout(()=>{
						if (this.target.position.y.toFixed(5) === previousY) {
							
							inAfkTime += 1;
							//console.log('curr Y', this.target.position.y.toFixed(5))
							prevVrAfkY = leaveAfkHandPos.y.toFixed(5);
							//console.log('PrevCurr Same')
						} else{
							inAfkTime = 0;
							isAfk = false;	
							previousY = this.target.position.y.toFixed(5); // Update the previous position.y value
							//console.log('PrevCurr Different')
						} 
						console.log('In AFK Time', inAfkTime)
					},1000)
					
				}
			}else{
				// if(!this.left){
				// 	console.log('avatar afk pos Y', prevAfkY)
				// 	console.log('vr device new hand pos',(leaveAfkHandPos.y).toFixed(5))
				// 	console.log('where vr afked', prevVrAfkY)
				// }
				if(deltaTime % 100 === 0){
					if ((leaveAfkHandPos.y).toFixed(5) != prevVrAfkY) {
						outAfkTime += 1;
						if(!this.left){
							// console.log('vr device new hand pos',(leaveAfkHandPos.y).toFixed(5))
							// console.log('where vr afked', prevVrAfkY)
							// console.log('PrevCurr Diff')
							// console.log('')
							console.log('Out AFK Time', outAfkTime)
						}
					} 
				}

				this.target.position.y = this.shoulder.shoulderPoser.vrTransforms.head.position.y + afkY//down more

				this.target.position.x = this.shoulder.shoulderPoser.vrTransforms.head.position.x + afkX//right more
				this.target.position.z = this.shoulder.shoulderPoser.vrTransforms.head.position.z + afkZ//front more
				handPosition = localVector2.copy(this.target.position);

				// if(!this.left){
				// 	console.log('updated Y', (this.target.position.y).toFixed(5))
				// 	console.log('')
				// }
				
				

			}
				// if(!isAfk){
				// 	inAfkTime+=1
				// 	console.log(afkTime)
				// 	// setInterval(() => {
				// 	// 	if (this.target.position.y.toFixed(5) === previousY) {
							
				// 	// 		// startAFKONTimer(); // Start the timer if position.y has remained the same
				// 	// 		// stopAFKOFFTimer();
				// 	// 	} else{
				// 	// 		// stopAFKONTimer(); // Stop the timer if position.y has changed
				// 	// 		// startAFKOFFTimer();
				// 	// 		previousY = this.target.position.y.toFixed(5); // Update the previous position.y value
				// 	// 	} 
				// 	// }, 1000);
				// 	// console.log(handPosition.y.toFixed(6))
				// }else{
				// 	// startAFKOFFTimer();
				// }


			if(handUpRestriction){
				const tYResValue = 0.03;
				// Hand raising restriction
				if(this.target.position.y > this.shoulder.shoulderPoser.vrTransforms.head.position.y){
					this.target.position.y = this.shoulder.shoulderPoser.vrTransforms.head.position.y + tYResValue;//head position + 0.03
					handPosition = localVector2.copy(this.target.position);
					if(this.target.quaternion.w <= 0.22){
						// this.target.quaternion.w = 0.24;
						console.log('weird!!')
					}
					console.log(this.target.quaternion.w)
				}
			}
			

			const bZResValue = 0.01;
			//Horizontal hand restriction(maximum out).
			if(this.target.position.z > this.shoulder.shoulderPoser.vrTransforms.head.position.z){
				this.target.position.z = this.shoulder.shoulderPoser.vrTransforms.head.position.z + bZResValue;
				handPosition = localVector2.copy(this.target.position)
			}

			//Horozontal hand restriction(minimum in).
			const fZResValue = 0.015;
			if((this.target.position.z < this.shoulder.shoulderPoser.vrTransforms.head.position.z) && (this.target.position.z > (this.shoulder.shoulderPoser.vrTransforms.head.position.z - fZResValue))){
				this.target.position.z = this.shoulder.shoulderPoser.vrTransforms.head.position.z - fZResValue;
				handPosition = localVector2.copy(this.target.position)
			}
			
			// if(this.left){
			// 	// console.log(this.target.position)
			// 	// console.log(handPosition)
			// 	// console.log(this.shoulder.shoulderPoser.vrTransforms.head.position)
			// 	// console.log('')
			// 	// console.log(handRotation)
			// 	// this.arm.Quaternion
			// 	// this.arm.ArmTransforms. hand lowerArm transform upperArm
			// 	this.arm.lowerArm.quaternion.w+=1
			// 	console.log(this.arm.lowerArm.quaternion.w)
			// 	console.log(' ')
			// }
      const shoulderRotation = Helpers.getWorldQuaternion(this.shoulder.transform, localQuaternion);
      const shoulderRotationInverse = localQuaternion2.copy(shoulderRotation).invert();

      const hypotenuseDistance = this.upperArmLength;
	    const directDistance = upperArmPosition.distanceTo(handPosition) / 2;
      const offsetDistance = hypotenuseDistance > directDistance ? Math.sqrt(hypotenuseDistance*hypotenuseDistance - directDistance*directDistance) : 0;
      const offsetDirection = localVector3.copy(handPosition).sub(upperArmPosition)
        .normalize()
        .cross(localVector4.set(-1, 0, 0).applyQuaternion(shoulderRotation));

      const targetEuler = localEuler.setFromQuaternion(
      	localQuaternion3
      	  .multiplyQuaternions(handRotation, shoulderRotationInverse)
      	  .premultiply(z180Quaternion),
      	'XYZ'
      );
      // const targetDirection = new Vector3(0, 0, 1).applyQuaternion(targetLocalRotation);
      if (this.left) {
    		const yFactor = Math.min(Math.max((targetEuler.y+Math.PI*0.1)/(Math.PI/2), 0), 1);
    		// const zFactor = Math.min(Math.max((-targetDirection.x + 0.5)/0.25, 0), 1)
    		// const xFactor = Math.min(Math.max((targetDirection.y-0.8)/0.2, 0), 1);
    		// yFactor *= 1-xFactor;
    		// const factor = Math.min(yFactor, 1-xFactor);//Math.min(yFactor, 1-xFactor);
    		targetEuler.z = Math.min(Math.max(targetEuler.z, -Math.PI/2), 0);
    		targetEuler.z = (targetEuler.z * (1 - yFactor)) + (-Math.PI/2 * yFactor);
				
    		// targetEuler.z *= 1 - xFactor;
    		// targetEuler.z *= 1 - zFactor;
      } else {
      	const yFactor = Math.min(Math.max((-targetEuler.y-Math.PI*0.1)/(Math.PI/2), 0), 1);
    		// const zFactor = Math.min(Math.max((-targetDirection.x + 0.5)/0.25, 0), 1)
    		// const xFactor = Math.min(Math.max((targetDirection.y-0.8)/0.2, 0), 1);
    		// yFactor *= 1-xFactor;
    		// const factor = Math.min(yFactor, 1-xFactor);//Math.min(yFactor, 1-xFactor);
    		targetEuler.z = Math.min(Math.max(targetEuler.z, 0), Math.PI/2);
    		targetEuler.z = (targetEuler.z * (1 - yFactor)) + (Math.PI/2 * yFactor);
    		// targetEuler.z *= 1 - xFactor;
    		// targetEuler.z *= 1 - zFactor;
      }
      offsetDirection
        .applyQuaternion(shoulderRotationInverse)
        .applyAxisAngle(forwardVector, targetEuler.z)
        .applyQuaternion(shoulderRotation);

      const elbowPosition = localVector4.copy(upperArmPosition).add(handPosition).divideScalar(2)
        .add(localVector5.copy(offsetDirection).multiplyScalar(offsetDistance));
      const upVector = localVector5.set(this.left ? -1 : 1, 0, 0).applyQuaternion(shoulderRotation);
      this.arm.upperArm.quaternion.setFromRotationMatrix(
      	localMatrix.lookAt(
	      	zeroVector,
	      	localVector6.copy(elbowPosition).sub(upperArmPosition),
	      	upVector// upVector
	      )
      )
        .multiply(this.left ? rightRotation : leftRotation)
        .premultiply(Helpers.getWorldQuaternion(this.arm.upperArm.parent, localQuaternion3).invert());
      Helpers.updateMatrixMatrixWorld(this.arm.upperArm);


			// applyQuaternion(localQuaternion3.setFromAxisAngle(new THREE.Vector3(handRotation.x, handRotation.y, handRotation.z), handRotation.w + Math.PI/2.8))
			const rotStrength = 0.001;
			const lowerArmX = this.left? rotStrength : -rotStrength;
			const lowerArmY = 0;
			const lowerArmZ = 0;
			let fakeHandRRotW = handRotation.w + Math.PI/2.81
			let fakeHandLRotW = handRotation.w + Math.PI/2.81

			let handRotW =0;

			if(this.left){
				//ubdy

				//tbdy
				handRotW = fakeHandRRotW < 1.2 ? fakeHandRRotW + 2.2 : fakeHandRRotW;
			}else{
				//ubdy

				//tbdy
				handRotW = fakeHandLRotW < 1.2 ?fakeHandLRotW - 4 : fakeHandLRotW;
				//console.log(handRotW)
			}
      // this.arm.lowerArm.position = elbowPosition;
      this.arm.lowerArm.quaternion.setFromRotationMatrix(
        localMatrix.lookAt(
	      	zeroVector,
	      	localVector6.copy(handPosition).sub(elbowPosition),
	      	localVector5.set(lowerArmX, lowerArmY, lowerArmZ)
					.applyQuaternion(localQuaternion3.setFromAxisAngle(
						new THREE.Vector3(
							handRotation.x, 
							handRotation.y, 
							handRotation.z 
							),
					 		handRotW )
						)
	      )
      )
        .multiply(this.left ? rightRotation : leftRotation)
        .premultiply(Helpers.getWorldQuaternion(this.arm.lowerArm.parent, localQuaternion3).invert());
      Helpers.updateMatrixMatrixWorld(this.arm.lowerArm);
			
			
      // this.arm.hand.position = handPosition;
      this.arm.hand.quaternion.copy(this.target.quaternion)
        .multiply(this.left ? bankRightRotation : bankLeftRotation)
        .premultiply(Helpers.getWorldQuaternion(this.arm.hand.parent, localQuaternion3).invert());
      Helpers.updateMatrixMatrixWorld(this.arm.hand);
				
			// if(!this.left){
			// 	// console.log(this.arm.lowerArm.quaternion)
			// 	// console.log(this.arm.hand.quaternion)
			// 	console.log(fakeHandLRotW)	
			// }
		}
	}

export default VRArmIK;
