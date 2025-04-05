/*
 * Creating a custom type for a shadowdark game
 * since it adds some functions to `game.shadowdark`
 * that we're using
 */

interface shadowdark {
  // Not using any of the commented ones... yet
  // migrateWorld(): void;
  // updateSpells(): void;
  rollAttribute(
    actor: shadowdarkActor,
    attributeName: string,
    options?: object,
  ): void;
  rollItem(itemName: string | null, itemType: string, options?: object): void;
  // monsterAttack(): void;
  // monsterDefend(): void;
  // drawTreasureCards(): void;
}

interface shadowdarkGame extends Game {
  shadowdark: shadowdark;
}

declare let game: shadowdarkGame;

// Also the global declarations for ARGON

class shadowdarkActorSheet extends ActorSheet {
  _onMonsterAttack(
    event: Pick<Event, "type" | "preventDefault" | "shiftKey" | "ctrlKey">,
  ): void;
  _onMonsterDefend(event: Pick<Event, "type" | "preventDefault">): void;

  // Rolling
  _onAttributeRoll(event: Event): void;
  _onSkillRoll(
    event: Pick<Event, "type" | "currentTarget" | "preventDefault">,
  ): void;
  _onDeathRoll(event: Event): void;

  // Rests
  _onRestRound(event: Event): void;
  _onRestStretch(event: Event): void;
  _onRestShift(event: Event): void;
}

class shadowdarkActor extends Actor {
  sheet: shadowdarkActorSheet;
  system: any;

  isMonster: boolean;
  isCharacter: boolean;
  isNpc: boolean;
  getEquippedWeapons(): Array<shadowdarkItem>;
  hasSpells: boolean;
  getSkill(skillName: string): any;

  hasCondition(attribute: string): boolean;
  updateCondition(attribute: string, value: boolean): void;

  useAbility(item: shadowdarkItem): void;
}

class ArgonComponent {
  constructor(...args: any[]);
  // Definitely have
  actor: shadowdarkActor;
  name?: string;

  async _renderInner(): void;
  async render(): void;
  element: HTMLElement;
}

class shadowdarkItem extends Item {
  id: string;
  system: any;
  hasWeaponFeature(feature: string): boolean;
}

class ArgonItemComponent extends ArgonComponent {
  item: shadowdarkItem;
  useTargetPicker: boolean;
}

class ArgonActionPanel extends ArgonComponent {
  updateActionUse(): void;
  updateVisibility(): void;
}

type ArgonComponentConstructor = new (...args: any[]) => ArgonComponent;
type ArgonPanelComponentConstructor = new (arg?: {
  buttons: Array<ArgonComponent>;
}) => ArgonActionPanel;

interface ArgonCONFIG extends CONFIG {
  ARGON: {
    ButtonHud: ArgonComponentConstructor;
    MovementHud: ArgonComponentConstructor;
    WeaponSets: ArgonComponentConstructor;
    DRAWER: {
      DrawerPanel: ArgonComponentConstructor;
      DrawerButton: ArgonComponentConstructor;
    };
    MAIN: {
      ActionPanel: ArgonPanelComponentConstructor;
      BUTTONS: {
        ActionButton: ArgonComponentConstructor;
        ButtonPanelButton: ArgonPanelComponentConstructor;
        ItemButton: new (args: {
          item: shadowdarkItem;
          id?: string;
        }) => ArgonItemComponent;
        SplitButton: new (
          button1: ArgonComponent,
          button2: ArgonComponent,
        ) => ArgonComponent;
      };
      BUTTON_PANELS: {
        ACCORDION: {
          AccordionPanelCategory: new (args: {
            label: string;
            buttons: Array<ArgonItemComponent>;
            uses: () => number;
          }) => ArgonComponent;
          AccordionPanel: new (arg: {
            accordionPanelCategories: Array<ArgonComponent>;
          }) => ArgonComponent;
        };
        ButtonPanel: ArgonPanelComponentConstructor;
      };
    };
    PORTRAIT: {
      PortraitPanel: ArgonComponentConstructor;
    };
  };
}

declare let CONFIG: ArgonCONFIG;
