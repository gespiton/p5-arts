import p5 from 'p5';
export class CollatzConjectureNode {
  value: number;
  left: CollatzConjectureNode | null;
  right: CollatzConjectureNode | null;
  ancestor: CollatzConjectureNode | null;
  position: p5.Vector | null = null;

  constructor(value: number, ancestor: CollatzConjectureNode | null) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.ancestor = ancestor;
  }

  copy(): CollatzConjectureNode {
    const newNode = new CollatzConjectureNode(this.value, null);
    newNode.left = this.left
    newNode.right = this.right
    return newNode
  }
}
export class CollatzConjectureTree {
  static createTree(maxNumber: number): CollatzConjectureNode {
    const memory = new Map<number, CollatzConjectureNode>();
    const root = new CollatzConjectureNode(1, null);
    memory.set(1, root);
    this.generateFromNode(root, maxNumber, memory);
    return root
  }

  private static generateFromNode(node: CollatzConjectureNode, maxNumber: number, memory: Map<number, CollatzConjectureNode>) {
    const leftValue = node.value * 2;
    const rightValue = (node.value * 2 - 1) / 3;
    if (leftValue <= maxNumber) {
      if (memory.has(leftValue)) {
        const newLeft = memory.get(leftValue)!.copy();
        newLeft.ancestor = node
        node.left = newLeft
      } else {
        node.left = new CollatzConjectureNode(leftValue, node);
        memory.set(leftValue, node.left);
        CollatzConjectureTree.generateFromNode(node.left, maxNumber, memory);
      }
    }
    if (rightValue % 1 === 0 && rightValue % 2 !== 0 && rightValue <= maxNumber) {
      if (memory.has(rightValue)) {
        const newRight = memory.get(rightValue)!.copy();
        newRight.ancestor = node
        node.right = newRight
      } else {
        node.right = new CollatzConjectureNode(rightValue, node);
        memory.set(rightValue, node.right);
        CollatzConjectureTree.generateFromNode(node.right, maxNumber, memory);
      }
    }
  }
}