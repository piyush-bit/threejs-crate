  import { useState, Suspense, useEffect } from "react";
  import "./App.css";
  import { Canvas } from "@react-three/fiber";
  import { OrbitControls, Plane, Preload, useGLTF } from "@react-three/drei";
  import { Leva, useControls } from "leva";

  // import Crate from '/public/crate/Crate'
  import Crate from "./ThreeModel/Scene";
  import Platform from "./ThreeModel/Robo";
  import Loader3D from "./Loader3D";

  function App2() {
    const [positions, setPositions] = useState();
    const [isHome, setIsHome] = useState(true);

    useEffect(() => {
      // Decode on client side
      let encodedDataFromUrl = new URLSearchParams(window.location.search).get(
        "data"
      );
      try {
        let decodedJson = JSON.parse(atob(encodedDataFromUrl));
        console.log(decodedJson); // Use this data for rendering
        setPositions(decodedJson);
        setIsHome(false);
      } catch (error) {}
    }, []);

    useEffect(() => {
      console.log(positions);
    }, [positions]);

    // Fallback component for Suspense
    

    return (
      <>
        {isHome && <JsonBuilder setPositions={setPositions} />}

        <Canvas
          style={{ width: "100vw", height: "100vh" }}
          camera={{ position: [-2, 1, 4], fov: 45 }}
        >
          {/* <ambientLight intensity={1} /> */}
          <directionalLight intensity={1.5} position={[0, 1, 4]} />
          <directionalLight intensity={1} position={[0, -1, 4]} />
          <directionalLight intensity={1} position={[-3, -1, 4]} />
          <directionalLight intensity={1} position={[3, -2, 4]} />
          <directionalLight intensity={1} position={[3, 2, 4]} />
          <directionalLight intensity={1} position={[-3, 2, 4]} />
          <hemisphereLight intensity={0.5} />
          <OrbitControls />
          <Suspense fallback={<Loader3D/>}>
            <Platform
              position={[0, -0.72, -0.1]}
              scale={1}
              rotation={[0, 0, 0]}
            />

            {positions?.map((position, index) => {
              if (positions.length - 1 == index && !position.placed) {
                return (
                  <Crate
                    key={index}
                    position={[
                      (position.start.x-1) * 0.24 + ((position.end.x - position.start.x-1) * 0.12),
                      (position.start.y-1) * 0.24,
                      (position.start.z-1) * 0.32+ ((position.end.z - position.start.z -1) * 0.16),
                    ]}
                    scale={[
                      (position.end.x - position.start.x) * 0.4,
                      (position.end.y - position.start.y) * 0.4,
                      (position.end.z - position.start.z) * 0.4,
                    ]}
                    rotation={[0, 0, 0]}
                    transparent={true}
                    opacity={0.7}
                    color={"#eb3017"}
                  />
                );
              }

              return (
                <Crate
                  key={index}
                  position={[
                    (position.start.x-1) * 0.24+((position.end.x - position.start.x-1) * 0.12),
                    (position.start.y-1) * 0.24,
                    (position.start.z-1) * 0.32+ ((position.end.z - position.start.z -1) * 0.16),
                  ]}
                  scale={[
                    (position.end.x - position.start.x) * 0.4,
                    (position.end.y - position.start.y) * 0.4,
                    (position.end.z - position.start.z) * 0.4,
                  ]}
                  rotation={[0, 0, 0]}
                  transparent={true}
                  opacity={position.placed ? 1 : 0.3}
                  color={position.color}
                />
              );
            })}
          </Suspense>
        </Canvas>
      </>
    );
  }

  export function JsonBuilder({ setPositions }) {
    const [jsonInput, setJsonInput] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [encodedData, setEncodedData] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    // Function to check if the JSON contains valid start/end with x, y, z fields
    const validateJson = (json) => {
      try {
        const parsed = JSON.parse(json);

        // Ensure it's an array and each element has valid start and end with x, y, z
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (
              item.start &&
              item.end &&
              "x" in item.start &&
              "y" in item.start &&
              "z" in item.start &&
              "x" in item.end &&
              "y" in item.end &&
              "z" in item.end
            ) {
              continue;
            } else {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    };

    // Handler when JSON input changes
    const handleJsonChange = (e) => {
      const input = e.target.value;
      setJsonInput(input);
      setIsValid(validateJson(input));
    };

    // Function to handle inserting tab character in textarea
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent the default tab behavior

        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert a tab character at the cursor position
        const newValue =
          jsonInput.substring(0, start) + "\t" + jsonInput.substring(end);
        setJsonInput(newValue);

        // Move the cursor to the right place after inserting the tab
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    };

    // Function to encode the valid JSON as Base64
    const handleEncode = () => {
      if (isValid) {
        const encoded = btoa(jsonInput);
        setEncodedData(encoded);
        setPositions(JSON.parse(jsonInput));
      }
    };

    return (
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial",
          position: "absolute",
          zIndex: "100",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3>JSON Input</h3>

          <button
            onClick={() => setIsCollapsed((prev)=>!prev)}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>
        {!isCollapsed && (
          <>
            <textarea
              rows="10"
              cols="50"
              value={jsonInput}
              onChange={handleJsonChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter JSON here..."
              style={{
                borderColor: isValid ? "black" : "red",
                padding: "10px",
                width: "100%",
              }}
            />
            {!isValid && (
              <p style={{ color: "red" }}>
                Invalid JSON or missing start/end with x, y, z fields!
              </p>
            )}

            <button
              onClick={handleEncode}
              disabled={!isValid}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              Encode to Base64
            </button>

            {encodedData && (
              <div style={{ marginTop: "20px" }}>
                <h3>Encoded Base64 Output:</h3>
                <textarea
                  rows="5"
                  cols="50"
                  readOnly
                  value={`${window.location.origin}?data=${encodedData}`}
                  style={{ padding: "10px", width: "100%" }}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  export default App2;
