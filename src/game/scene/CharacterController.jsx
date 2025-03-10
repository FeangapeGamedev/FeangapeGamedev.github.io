import { useThree } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useGame } from "../state/GameContext";

export const CharacterController = ({ isPaused }) => {
  const { scene, camera, gl } = useThree();
  const { setTargetPosition, targetPosition } = useGame();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const [currentInteractive, setCurrentInteractive] = useState(null);
  const [collidingObject, setCollidingObject] = useState(null); // Track collision
  const [lastClickedObject, setLastClickedObject] = useState(null); // Track last clicked object

  useEffect(() => {
    const onMouseDown = (event) => {
      if (isPaused) return;

      // Convert mouse position to normalized device coordinates
      mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

      // Raycasting from camera to click position
      raycaster.setFromCamera(mouse, camera);
      const intersections = raycaster.intersectObjects(scene.children, true);

      let firstInteractive = null;
      let firstFloorHit = null;

      for (let i = 0; i < intersections.length; i++) {
        let object = intersections[i].object;

        // 🔹 Traverse up the parent hierarchy to find the root interactive object
        while (object && !object.userData?.raycastable && object.parent) {
          object = object.parent;
        }

        if (object.userData?.raycastable) {
          const point = intersections[i].point;

          // ✅ If it's an interactive object, prioritize it
          if (object.userData?.isInteractive) {
            console.log(`🖱️ Clicked Object Data:`, object.userData);

            if (object.userData.id && object.userData.type) {
              console.log(`🖱️ Clicked on Interactive Object: ID=${object.userData.id}, Type=${object.userData.type}`);
              firstInteractive = { object, point };

              // ✅ If already colliding with this object, just interact and skip movement
              if (collidingObject === object.userData.id) {
                console.log(`✅ Already near ${object.userData.id}, skipping movement.`);
                return;
              }

              break; // Stop at the first interactive object
            } else {
              console.warn("⚠️ Clicked object has no valid ID or type!", object.userData);
            }
          }

          // ✅ If it's the floor, keep track of it but don't stop
          if (object.userData?.type === "floor" && !firstFloorHit) {
            console.log("📍 Clicked on floor at:", point);
            firstFloorHit = { object, point };
          }
        }
      }

      // ✅ If clicking the same object twice, ignore movement
      if (lastClickedObject && firstInteractive?.object.userData.id === lastClickedObject) {
        console.log(`🚫 Clicked ${lastClickedObject} again - Ignoring movement.`);
        return;
      }

      // ✅ Prioritize interaction, fallback to movement
      if (firstInteractive) {
        setLastClickedObject(firstInteractive.object.userData.id); // Store last clicked object

        // Only move if it's NOT the same object the player is already colliding with
        if (collidingObject !== firstInteractive.object.userData.id) {
          setTargetPosition(new THREE.Vector3(firstInteractive.point.x, firstInteractive.point.y, firstInteractive.point.z));
        }
        setCurrentInteractive(firstInteractive.object.userData);
      } else if (firstFloorHit) {
        setLastClickedObject(null); // Reset last clicked object when moving
        setTargetPosition(new THREE.Vector3(firstFloorHit.point.x, firstFloorHit.point.y, firstFloorHit.point.z));
        setCurrentInteractive(null); // Reset tracking when moving freely
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [camera, gl, scene, setTargetPosition, isPaused, currentInteractive, collidingObject, lastClickedObject]);

  // ✅ Handle collision events to track when the player is near an object
  useEffect(() => {
    const handleCollisionEnter = (event) => {
      if (event.other.rigidBodyObject?.userData?.isInteractive) {
        console.log(`🛑 Colliding with Interactive Object: ${event.other.rigidBodyObject.userData.id}`);
        setCollidingObject(event.other.rigidBodyObject.userData.id);
      }
    };

    const handleCollisionExit = (event) => {
      if (event.other.rigidBodyObject?.userData?.isInteractive) {
        console.log(`✅ No longer colliding with: ${event.other.rigidBodyObject.userData.id}`);
        setCollidingObject(null);
      }
    };

    window.addEventListener("collisionEnter", handleCollisionEnter);
    window.addEventListener("collisionExit", handleCollisionExit);

    return () => {
      window.removeEventListener("collisionEnter", handleCollisionEnter);
      window.removeEventListener("collisionExit", handleCollisionExit);
    };
  }, []);

  return null;
};
