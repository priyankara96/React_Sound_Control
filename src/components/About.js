import React, { useEffect, useState } from "react";
import { useSoundContext } from "./SoundContext"; // Import the sound context

const ScrollSound = () => {
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { isMuted } = useSoundContext(); // Get mute state from context

  useEffect(() => {
    const handleUserInteraction = () => {
      setIsUserInteracted(true);
    };

    const playScrollSound = () => {
      const scrollPosition = window.scrollY;

      // Check if user is back at the top
      if (scrollPosition === 0) {
        setIsAtTop(true);
        setHasPlayedSound(false); // Reset so the sound can play again when scrolling down
      }

      // Play sound when scrolling down from the top after user interaction and if sound isn't muted
      if (
        isUserInteracted &&
        !hasPlayedSound &&
        scrollPosition > 0 &&
        isAtTop &&
        !isMuted // Check if the sound is muted
      ) {
        const sound = new Audio("/sounds/interface-soft-click-131438.mp3");
        sound
          .play()
          .then(() => {
            setHasPlayedSound(true); // Sound should only play once until user returns to the top
          })
          .catch((error) => {
            console.error("Audio playback failed", error);
          });

        setIsAtTop(false); // Indicate user is no longer at the top
      }
    };

    // Listen for user interaction and scroll events
    window.addEventListener("scroll", playScrollSound);
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction); // Capture keyboard events as interaction

    return () => {
      // Cleanup listeners when component unmounts
      window.removeEventListener("scroll", playScrollSound);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, [isUserInteracted, hasPlayedSound, isAtTop, isMuted]); // Re-run effect when isMuted changes

  return null; // This component doesn't render anything
};

const About = () => {
  return (
    <div style={{ height: "120vh" }}>
      <ScrollSound />
      <div style={{ marginLeft: "4%" }}>
        <h2>About</h2>
      </div>
    </div>
  );
};

export default About;
