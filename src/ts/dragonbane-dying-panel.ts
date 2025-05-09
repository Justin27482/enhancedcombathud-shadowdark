import { id as MODULE_NAME } from "../module.json";

const ARGON = CONFIG.ARGON;

class shadowdarkRallySelfButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get icon() {
    return "modules/enhancedcombathud-shadowdark/icons/bugle-call.svg";
  }

  get label() {
    return game.i18n.localize(
      "enhancedcombathud-shadowdark.actions.rally-self",
    );
  }

  async _onLeftClick(event) {
    // Have to go through the character sheet for now
    // game.shadowdark.rollAttribute(this.actor, 'WIL', { manualBanes: 1 });

    // little hacky, but we need to change the behavior based on the version of the system
    // since the newer version of this code won't prompt the user for a bane
    if (foundry.utils.isNewerVersion((game.system as any).version, "1.8.1")) {
      game.shadowdark.rollAttribute(this.actor, "WIL", {
        banes: [
          {
            source: game.i18n.localize(`${MODULE_NAME}.actions.rally-self`),
            value: true,
          },
        ],
      });
    } else {
      this.actor.sheet._onAttributeRoll(event);
    }
  }

  get visible() {
    return this.actor.system.hitPoints?.value === 0;
  }

  override async _renderInner() {
    await super._renderInner();

    // embed the item id in the element for the left click handler to use
    this.element.dataset.attribute = "wil";
  }
}

export default class shadowdarkDyingActionsPanel extends ARGON.MAIN
  .ActionPanel {
  get classes() {
    return ["actions-container", "shadowdark-actions-container"];
  }
  get label() {
    return game.i18n.localize("enhancedcombathud-shadowdark.panels.dying");
  }

  get maxActions() {
    return this.currentActions;
  }

  get currentActions() {
    return this.actor.system.hitPoints?.value === 0 ? 1 : 0;
  }

  async _getButtons() {
    return [new shadowdarkRallySelfButton()];
  }

  // hacky, but it hides/shows it when the death state changes
  override updateActionUse() {
    super.updateActionUse();
    this.updateVisibility();
  }
}
