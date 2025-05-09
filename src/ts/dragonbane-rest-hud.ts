const ARGON = CONFIG.ARGON;

export default class shadowdarkRestHud extends ARGON.ButtonHud {
  get classes() {
    return ["movement-hud", "shadowdark-movement-hud"];
  }

  get visible() {
    return !game.combat?.started;
  }

  async _getButtons() {
    return [
      {
        label: game.i18n.localize(
          "enhancedcombathud-shadowdark.buttons.stretch-rest",
        ),
        // have to account for _not_ being able to rest for a stretch
        onClick: (event) =>
          this.actor.system.canRestStretch &&
          this.actor.sheet._onRestStretch(event),
        icon: "fas fa-chair",
      },
      {
        label: game.i18n.localize(
          "enhancedcombathud-shadowdark.buttons.shift-rest",
        ),
        onClick: (event) => this.actor.sheet._onRestShift(event),
        icon: "fas fa-bed",
      },
    ];
  }
}
