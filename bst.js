class Node {
  data;
  left = null;
  right = null;
  constructor(data) {
    this.data = data;
  }
}

class Tree {
  root;

  // just a normal merge sort algorithm, uses the merge function below
  sortShitMan(arr) {
    if (arr.length === 1) return arr;
    let left = arr.slice(0, Math.floor(arr.length / 2));
    let right = arr.slice(Math.floor(arr.length / 2));
    return this.merge(this.sortShitMan(left), this.sortShitMan(right));
  }

  merge(left, right) {
    let i = 0;
    let j = 0;
    let k = 0;
    let mergedArr = [];

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        mergedArr[k] = left[i];
        i++;
      } else {
        mergedArr[k] = right[j];
        j++;
      }
      k++;
    }
    if (left[i]) {
      left.slice(i).forEach((e) => {
        mergedArr[k] = e;
        k++;
      });
    } else if (right[j]) {
      right.slice(j).forEach((e) => {
        mergedArr[k] = e;
        k++;
      });
    }
    return mergedArr;
  }

  buildTree(sortedArr) {
    console.log("32");
    console.log(sortedArr, sortedArr[0]);
    if (!sortedArr.length) return null;
    console.log("332");
    let midPoint = Math.floor(sortedArr.length / 2),
      tempRoot = new Node(sortedArr[midPoint]),
      leftArr = sortedArr.slice(0, midPoint),
      rightArr = sortedArr.slice(midPoint + 1);
    console.log(sortedArr);
    tempRoot.left = this.buildTree(leftArr);
    tempRoot.right = this.buildTree(rightArr);

    return tempRoot;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  constructor(arr) {
    let sortedArr = this.sortShitMan(arr);
    this.root = this.buildTree(sortedArr);
  }

  find(value) {
    value = +value;
    let pointer = this.root;
    do {
      if (pointer.data === value) {
        return pointer;
      }
      if (pointer === null) return null;
      if (pointer.data > value) {
        if (pointer.left === null) return null;
        pointer = pointer.left;
      } else if (pointer.data < value) {
        if (pointer.right === null) return null;
        pointer = pointer.right;
      }
    } while (pointer);
  }

  insert(value) {
    value = +value;
    let pointer = this.root;
    do {
      if (pointer.data === value) return null;
      if (pointer.data > value) {
        if (pointer.left === null) {
          pointer.left = new Node(value);
          return true;
        } else {
          pointer = pointer.left;
        }
      } else if (pointer.data < value) {
        if (pointer.right === null) {
          pointer.right = new Node(value);
          return true;
        } else {
          pointer = pointer.right;
        }
      }
    } while (pointer);
  }

  // deletes the given value, preserves all its children.
  deleteItem(value) {
    value = +value;
    let pointer = this.root;
    if (pointer.data === value) {
      this.root = deleteRootOfNodes(pointer);
      return true;
    }

    // this is just the main bit of the deleteItem function, separated cus idk
    function deleteRootOfNodes(targetNode) {
      let tempRoot = JSON.parse(JSON.stringify(targetNode));
      pointer = JSON.parse(JSON.stringify(targetNode.left));
      if (pointer === null) return targetNode.right;
      let leftLargestNode = pointer;
      while (leftLargestNode.right) {
        leftLargestNode = leftLargestNode.right;
      }
      leftLargestNode.right = tempRoot.right ? tempRoot.right : null;
      return pointer;
    }

    while (pointer) {
      if (pointer.left.data === value) {
        pointer.left = deleteRootOfNodes(pointer.left);
        return true;
      } else if (pointer.right.data === value) {
        pointer.right = deleteRootOfNodes(pointer.right);
        return true;
      } else if (pointer.data > value) {
        pointer = pointer.left;
      } else if (pointer.data < value) {
        pointer = pointer.right;
      }
    }

    console.log(`Error: node (${value}) not found!`);
    return null;

    // do {
    //   if (pointer.data > value) {
    //     if (pointer.left === null) {
    //       console.log("Error: item not found");
    //       return;
    //     } else {
    //       pointer = pointer.left;
    //     }
    //   } else if (pointer.data < value) {
    //     if (pointer.right === null) {
    //       console.log("Error: item not found");
    //       return;
    //     } else {
    //       pointer = pointer.right;
    //     }
    //   }
    // } while (pointer);
  }

  // function that traverses the tree breadth-first, calling the function passed to it on each node.
  levelOrder(fn, root = this.root) {
    if (fn === undefined) throw Error("Function argument missing!");
    let queue = [];
    queue.push(root);
    while (queue.length !== 0) {
      let node = queue.shift();
      fn(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  // these ones are like the last but variations of depth-first traversal :p
  // plus they use recursion instead of a queue
  preOrder(fn, root = this.root) {
    if (fn === undefined) throw Error("Function argument missing!");
    fn(root);

    if (root.left) this.preOrder(fn, root.left);
    if (root.right) this.preOrder(fn, root.right);
  }

  inOrder(fn, root = this.root) {
    if (fn === undefined) throw Error("Function argument missing!");
    if (root.left) this.preOrder(fn, root.left);
    fn(root);
    if (root.right) this.preOrder(fn, root.right);
  }

  postOrder(fn, root = this.root) {
    if (fn === undefined) throw Error("Function argument missing!");
    if (root.left) this.preOrder(fn, root.left);
    if (root.right) this.preOrder(fn, root.right);
    fn(root);
  }

  // returns height (longest path from passed node (node with data that was passed, to be exact) to any leaf node)
  // recursive !
  height(value) {
    let pointer;
    if (!isNaN(+value)) pointer = this.find(value);
    if (isNaN(+value)) pointer = value;
    if (pointer === null) throw Error("Target node not included in tree!");
    return (
      1 +
      Math.max(
        pointer.left !== null ? this.height(pointer.left) : -1,
        pointer.right !== null ? this.height(pointer.right) : -1
      )
    );
  }

  // this one returns the depth (distance from root to passed node)
  // meat and bones same as this.find
  depth(value) {
    value = +value;
    let pointer = this.root;
    let height = 0;
    do {
      if (pointer.data === value) {
        return height;
      }
      if (pointer === null) return null;
      if (pointer.data > value) {
        if (pointer.left === null) return null;
        pointer = pointer.left;
        height++;
      } else if (pointer.data < value) {
        if (pointer.right === null) return null;
        pointer = pointer.right;
        height++;
      }
    } while (pointer);
  }

  // this checks if the tree is balanced
  // IT WORKS!!! IT WORRRRRKKSSS !!!!! PRAISE THE DEVIL
  isBalanced(pointer = this.root) {
    if (pointer.left === null && pointer.right === null) {
      return true;
    } else if (pointer.left !== null && pointer.right === null) {
      if (pointer.left.left === null && pointer.left.right === null) return true;
    } else if (pointer.left === null && pointer.right !== null) {
      if (pointer.right.left === null && pointer.right.right === null) return true;
    } else if (
      this.isBalanced(pointer.left) &&
      this.isBalanced(pointer.right)
    ) {
      if (
        this.height(pointer.left) - this.height(pointer.right) <= 1 &&
        this.height(pointer.left) - this.height(pointer.right) >= -1
      ) {
        return true;
      }
    } else {
      return false;
    }
  }
}

// const tree = new Tree([3, 2, 1, 89]);
const tree = new Tree([3, 2, 89, 0, 23, 9, 100, 41, 6312, 93, 50234, 5, 7, 14]);

function printData(node) {
  console.log(node.data);
}
