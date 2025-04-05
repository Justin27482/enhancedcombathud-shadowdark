import "../styles/module.scss";

import { registerSettings, registerSkillSettings } from "./settings";
import { setupshadowdarkHud } from "./shadowdarkui";

Hooks.once("init", () => {
  registerSettings();
  console.log("Argon HUD - shadowdark: init complete");
});

Hooks.once("ready", () => {
  registerSkillSettings();
  console.log("Argon HUD - shadowdark: skill settings complete");
});

Hooks.on("argonInit", (CoreHUD) => {
  setupshadowdarkHud(CoreHUD);
  console.log("Argon HUD - shadowdark: UI setup complete");
});
