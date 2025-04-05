const ARGON = CONFIG.ARGON;

export default class shadowdarkMovementHud extends ARGON.MovementHud {
  get classes() {
    return [
      "movement-hud",
      "shadowdark-movement-hud",
      `shadowdark-${this.actor.type}`,
    ];
  }

  get visible() {
    return game.combat?.started;
  }

  get movementMax() {
    return this.actor.system.movement.value / canvas?.scene?.dimensions["distance"];
  }

  get movementColor() {
    return ["shadowdark-movement"];
  }
}
