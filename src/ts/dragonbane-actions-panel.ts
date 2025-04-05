import { id as MODULE_NAME } from "../module.json";
import { shadowdarkWeaponButton } from "./shadowdark-weapon-button";
import { shadowdarkSpellsButton } from "./shadowdark-spells-button";

const ARGON = CONFIG.ARGON;

class shadowdarkMonsterAttackButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "shadowdark-action-element"];
  }

  get label() {
    return game.i18n.localize(
      "enhancedcombathud-shadowdark.actions.monster-attack",
    );
  }

  get icon() {
    return "systems/shadowdark/art/ui/sword.webp";
  }

  async _onLeftClick(event) {
    this.actor.sheet._onMonsterAttack({
      type: "click",
      preventDefault: () => event.preventDefault(),
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
    });
  }
}
class shadowdarkHeroicAbilitiesButton extends ARGON.MAIN.BUTTONS
  .ButtonPanelButton {
  get label() {
    return game.i18n.localize(
      "enhancedcombathud-shadowdark.buttons.heroic-abilities",
    );
  }
  get icon() {
    return `modules/${MODULE_NAME}/icons/skills.svg`;
  }

  async _getPanel() {
    const abilities = this.actor.items
      .filter((item) => item.type === "ability")
      .filter((item) => item.system.wp);

    return new shadowdarkAbilityButtonPanel({
      buttons: abilities.map((item) => new shadowdarkAbilityButton({ item })),
    });
  }
}

class shadowdarkAbilityButtonPanel extends ARGON.MAIN.BUTTON_PANELS
  .ButtonPanel {
  get classes() {
    return ["features-container", "shadowdark-features-container"];
  }
}

class shadowdarkAbilityButton extends ARGON.MAIN.BUTTONS.ItemButton {
  get classes() {
    return ["feature-element", "sheet-table-data"]; // need the latter to trick the DB code
  }

  get label() {
    return this.item?.name;
  }
  get icon() {
    return this.item?.img;
  }

  async _onLeftClick() {
    this.actor.useAbility(this.item);
  }

  get hasTooltip() {
    return true;
  }
  async getTooltipData() {
    return {
      title: this.item.name,
      subtitle: game.i18n.localize(
        "enhancedcombathud-shadowdark.tooltips.heroic-ability",
      ),
      description: this.item.system.description,
      details: [
        {
          label: game.i18n.localize(
            "enhancedcombathud-shadowdark.tooltips.wp-cost",
          ),
          value: this.item.system.wp,
        },
      ],
      properties: [{ label: this.item.system.abilityType, primary: true }],
      footerText: this.item.system.requirement,
    };
  }

  override async _renderInner() {
    await super._renderInner();

    // embed the item id in the element for the left click handler to use
    this.element.dataset.itemId = this.item.id;
  }
}

class shadowdarkRoundRestButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "shadowdark-action-element"];
  }

  get icon() {
    return `modules/${MODULE_NAME}/icons/meditation.svg`;
  }
  get label() {
    return game.i18n.localize(
      "enhancedcombathud-shadowdark.buttons.round-rest",
    );
  }

  async _onLeftClick(event) {
    this.actor.system.canRestRound && this.actor.sheet._onRestRound(event);
  }
}

// class shadowdarkDashButton extends ARGON.MAIN.BUTTONS.ActionButton {
//   get icon() {
//     return "modules/enhancedcombathud/icons/svg/run.svg";
//   }
//   get label() {
//     return "Dash";
//   }
// }

class shadowdarkSkillButton extends ARGON.MAIN.BUTTONS.ActionButton {
  _icon: string;
  _label: string;
  skillName: string;

  constructor({ skillName, iconName, label }) {
    super();
    this.skillName = skillName;
    this._icon = iconName ? `modules/${MODULE_NAME}/icons/${iconName}` : "";
    this._label = label || skillName;
  }

  get classes() {
    return ["action-element", "shadowdark-action-element"];
  }

  get icon() {
    return this._icon;
  }
  get label() {
    return this._label;
  }

  async _onLeftClick() {
    // use the configured skill name
    // or fallback if somehow it's not set to anything
    game.shadowdark.rollItem(
      (game.settings.get(MODULE_NAME, `skillName${this.skillName}`) as
        | string
        | null
        | undefined) || this.skillName,
      "skill",
    );
  }
}

export default class shadowdarkActionsPanel extends ARGON.MAIN.ActionPanel {
  get classes() {
    return ["actions-container", "shadowdark-actions-container"];
  }

  get label() {
    return game.i18n.localize("enhancedcombathud-shadowdark.panels.actions");
  }

  get currentActions() {
    // they have to be up/alive, or rallied...
    // How do we determine rallied?
    return this.actor.system.hitPoints?.value > 0;
  }

  get maxActions() {
    return 1;
  }

  async _getButtons() {
    const Buttons: Array<ArgonComponent> = [];

    if (!this.actor.isMonster) {
      this.actor
        .getEquippedWeapons()
        .forEach((item) =>
          Buttons.push(
            new shadowdarkWeaponButton({ item, inActionPanel: true }),
          ),
        );
      if (this.actor.hasSpells) {
        const includeUnpreparedSpells = game.settings.get(
          MODULE_NAME,
          "includeUnpreparedSpells",
        );
        const spells = this.actor.items
          .filter((i) => i.type == "spell")
          .filter((s) => s.system.memorized || includeUnpreparedSpells);

        Buttons.push(new shadowdarkSpellsButton(spells));
      }
      Buttons.push(
        // new shadowdarkDashButton(), // not really implemented yet. Just double movement for a round?
        new ARGON.MAIN.BUTTONS.SplitButton(
          new shadowdarkSkillButton({
            skillName: "Healing",
            label: game.i18n.localize(
              "enhancedcombathud-shadowdark.actions.first-aid",
            ),
            iconName: "bandage-roll.svg",
          }),
          new shadowdarkSkillButton({
            skillName: "Persuasion",
            label: game.i18n.localize(
              "enhancedcombathud-shadowdark.actions.rally",
            ),
            iconName: "bugle-call.svg",
          }),
        ),
      );
    } else {
      Buttons.push(new shadowdarkMonsterAttackButton());
    }

    // Do they have willpower points to spend/gain?
    if (this.actor.system.willPoints?.max) {
      Buttons.push(
        new shadowdarkHeroicAbilitiesButton(),
        new shadowdarkRoundRestButton(),
      );
    }

    return Buttons;
  }

  // hacky, but it hides/shows it when the death state changes
  override updateActionUse() {
    super.updateActionUse();
    this.updateVisibility();
  }
}
