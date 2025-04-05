import { id as MODULE_NAME } from "../module.json";

const ARGON = CONFIG.ARGON;

class shadowdarkMonsterDefendButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "shadowdark-action-element"];
  }

  get label() {
    return game.i18n.localize(
      "enhancedcombathud-shadowdark.actions.monster-defend",
    );
  }

  get icon() {
    return "systems/shadowdark/art/ui/shield.webp";
  }

  async _onLeftClick(event) {
    this.actor.sheet._onMonsterDefend({
      type: "click",
      preventDefault: () => event.preventDefault(),
    });
  }
}

class shadowdarkEvadeButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "shadowdark-action-element"];
  }
  get label() {
    return game.i18n.localize("enhancedcombathud-shadowdark.actions.dodge");
  }

  get icon() {
    return "modules/enhancedcombathud/icons/svg/dodging.svg";
  }

  async _onLeftClick() {
    return game.shadowdark.rollItem(
      (game.settings.get(MODULE_NAME, "skillNameEvade") as string) || "Evade",
      "skill",
    );
  }
}

function parrySortValue(item: shadowdarkItem): number {
  return (
    item.system.skill.value +
    item.system.durability +
    (game.settings.get(MODULE_NAME, "preferShieldParry") &&
    item.hasWeaponFeature("shield")
      ? 25
      : 0)
  );
}

class shadowdarkParryButton extends ARGON.MAIN.BUTTONS.ActionButton {
  _parryWeapon: shadowdarkItem;

  constructor() {
    super();

    // select for highest skill+durability
    this._parryWeapon = this.actor
      .getEquippedWeapons()
      .filter((w) => !w.hasWeaponFeature("noparry"))
      .sort((a, b) => parrySortValue(b) - parrySortValue(a))[0];
  }

  get classes() {
    return ["action-element", "shadowdark-action-element"];
  }
  get label() {
    return `${game.i18n.localize("enhancedcombathud-shadowdark.actions.parry")} (${this._parryWeapon?.name})`;
  }

  get icon() {
    return "modules/enhancedcombathud/icons/svg/crossed-swords.svg";
  }

  override async _renderInner() {
    await super._renderInner();
    if (!this._parryWeapon) {
      this.element.style.display = "none";
      return;
    }
  }

  async _onLeftClick() {
    // not sure if there is a way to default it to a parry
    // (doesn't seem to be one... yet)
    game.shadowdark.rollItem(this._parryWeapon.name, this._parryWeapon.type);
  }
}

export default class shadowdarkDefensePanel extends ARGON.MAIN.ActionPanel {
  get classes() {
    return ["actions-container", "shadowdark-actions-container"];
  }

  get label() {
    return game.i18n.localize("enhancedcombathud-shadowdark.panels.defense");
  }

  get maxActions() {
    return 1;
  }

  async _getButtons() {
    if (this.actor.type === "monster") {
      return [new shadowdarkMonsterDefendButton()];
    }
    return [new shadowdarkEvadeButton(), new shadowdarkParryButton()];
  }

  get colorScheme() {
    return 3;
  }
}
