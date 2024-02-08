import { _decorator, Component } from "cc";
const { ccclass } = _decorator;

@ccclass("star")
export class star extends Component {
  public destroyStar() {
    setTimeout(() => this.node.destroy(), 1);
  }
}
