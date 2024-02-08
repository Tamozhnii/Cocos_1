import {
  _decorator,
  Component,
  Node,
  Input,
  input,
  EventKeyboard,
  Vec2,
  RigidBody2D,
  Collider2D,
  BoxCollider2D,
  Contact2DType,
  IPhysics2DContact,
  Label,
  KeyCode,
} from "cc";
import { star } from "../star/star";

const { ccclass, property } = _decorator;

@ccclass("player")
export class player extends Component {
  @property({ type: Label })
  private scoreLabel: Partial<Label> = null;
  private score: number = 0;

  private collider: Partial<Collider2D> = null;
  private rigidBody: Partial<RigidBody2D> = null;

  private direction: number = 0;
  private walkForce: number = 1000;
  private jumpForce: number = 35000;

  onLoad() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  start() {
    this.rigidBody = this.node.getComponent(RigidBody2D);
    this.collider = this.node.getComponent(BoxCollider2D);

    if (this.collider) {
      this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  update(deltaTime: number) {
    this.rigidBody.applyForceToCenter(
      new Vec2(this.direction * this.walkForce, 0),
      true
    );
  }

  private onBeginContact(
    selfCollider: BoxCollider2D,
    otherCollider: BoxCollider2D,
    contact: Partial<IPhysics2DContact>
  ) {
    if (
      otherCollider.name === "star<BoxCollider2D>" &&
      otherCollider.node.getComponent("star")
    ) {
      (otherCollider.node.getComponent("star") as star).destroyStar();
      this.score++;

      if (this.scoreLabel) {
        this.scoreLabel.string = "Score: " + this.score;
      }
    }
  }

  private onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.KEY_D:
      case KeyCode.ARROW_RIGHT:
        this.direction = 1;
        break;

      case KeyCode.KEY_A:
      case KeyCode.ARROW_LEFT:
        this.direction = -1;
        break;

      case KeyCode.SPACE:
      case KeyCode.ARROW_UP:
        this.rigidBody.applyForceToCenter(new Vec2(0, this.jumpForce), true);
        break;

      default:
        break;
    }
  }

  private onKeyUp(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.KEY_D:
      case KeyCode.ARROW_RIGHT:
        this.direction = 0;
        break;

      case KeyCode.KEY_A:
      case KeyCode.ARROW_LEFT:
        this.direction = 0;
        break;

      default:
        break;
    }
  }
}
