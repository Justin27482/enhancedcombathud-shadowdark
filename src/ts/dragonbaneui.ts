import shadowdarkPortraitPanel from "./shadowdark-portrait-panel";
import shadowdarkDrawerPanel from "./shadowdark-drawer-panel";
import shadowdarkMovementHud from "./shadowdark-movement-hud";
import shadowdarkWeaponSets from "./shadowdark-weapon-sets";
import shadowdarkActionsPanel from "./shadowdark-actions-panel";
import shadowdarkDefensePanel from "./shadowdark-defense-panel";
import shadowdarkRestHud from "./shadowdark-rest-hud";
import shadowdarkDyingPanel from "./shadowdark-dying-panel";

export function setupshadowdarkHud(CoreHUD): void {
  const ARGON = CoreHUD.ARGON;

  CoreHUD.definePortraitPanel(shadowdarkPortraitPanel);
  CoreHUD.defineDrawerPanel(shadowdarkDrawerPanel);
  CoreHUD.defineMainPanels([
    shadowdarkActionsPanel,
    shadowdarkDyingPanel,
    shadowdarkDefensePanel,
    ARGON.PREFAB.PassTurnPanel,
  ]);
  CoreHUD.defineMovementHud(shadowdarkMovementHud);
  CoreHUD.defineWeaponSets(shadowdarkWeaponSets);
  CoreHUD.defineButtonHud(shadowdarkRestHud);
  CoreHUD.defineSupportedActorTypes(["character", "npc", "monster"]);
}
