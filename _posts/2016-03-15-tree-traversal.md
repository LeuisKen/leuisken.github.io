---
title: [转]JS中的二叉树遍历
labels: [算法]
description: 简单介绍js中的递归遍历和非递归遍历
---

原文链接:[JS中的二叉树遍历](http://rizzleci.github.io/2016/03/14/JS%E4%B8%AD%E7%9A%84%E4%BA%8C%E5%8F%89%E6%A0%91/)

二叉树是由根节点，左子树，右子树组成，左子树和友子树分别是一个二叉树。
这篇文章主要在JS中实现二叉树的遍历。

### 一个二叉树的例子

```
var tree = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 4
    }
  },
  right: {
    value: 3,
    left: {
      value: 5,
      left: {
        value: 7
      },
      right: {
        value: 8
      }
    },
    right: {
      value: 6
    }
  }
}
```

### 广度优先遍历

广度优先遍历是从二叉树的第一层（根结点）开始，自上至下逐层遍历；在同一层中，按照从左到右的顺序对结点逐一访问。
实现：
使用数组模拟队列。首先将根节点归入队列。当队列不为空的时候，执行循环：取出队列的一个节点，如果该结点的左子树为非空，则将该结点的左子树入队列；如果该结点的右子树为非空，则将该结点的右子树入队列。
（描述有点不清楚，直接看代码吧。）

```
var levelOrderTraversal = function(root) {
  if(!root) {
    throw new Error('Empty Tree')
  }

  var que = []
  que.push(root)
  while(que.length !== 0) {
    var node = que.shift()
    console.log(node.value)
    if(node.left) que.push(node.left)
    if(node.right) que.push(node.right)
  }
}
```

### 递归遍历

觉得用这几个字母表示递归遍历的三种方法不错：
D：访问根结点，L：遍历根结点的左子树，R：遍历根结点的右子树。
先序遍历：DLR
中序遍历：LDR
后序遍历：LRD
顺着字母表示的意思念下来就是遍历的顺序了 ^ ^

这3种遍历都属于递归遍历，或者说深度优先遍历（Depth-First Search，DFS），因为它总
是优先往深处访问。

先序遍历的递归算法：

```
var preOrder = function (node) {
  if (node) {
    console.log(node.value);
    preOrder(node.left);
    preOrder(node.right);
  }
}
```

中序遍历的递归算法：

```
var inOrder = function (node) {
  if (node) {
    inOrder(node.left);
    console.log(node.value);
    inOrder(node.right);
  }
}
```

后序遍历的递归算法：

```
var postOrder = function (node) {
  if (node) {
    postOrder(node.left);
    postOrder(node.right);
    console.log(node.value);
  }
}
```

### 非递归深度优先遍历

其实对于这些概念谁是属于谁的我也搞不太清楚。有的书里将二叉树的遍历只讲了上面三种递归遍历。有的分广度优先遍历和深度优先遍历两种，把递归遍历都分入深度遍历当中;有的分递归遍历和非递归遍历两种，非递归遍历里包括广度优先遍历和下面这种遍历。个人觉得怎么分其实并不重要，掌握方法和用途就好 ：）

刚刚在广度优先遍历中使用的是队列，相应的，在这种不递归的深度优先遍历中我们使用栈。在JS中还是使用一个数组来模拟它。
这里只说先序的：
额，我尝试了描述这个算法，然而并描述不清楚。按照代码走一边你就懂了。（认真脸）

```
var depthOrderTraversal = function(root) {
  if(!root) {
    throw new Error('Empty Tree')
  }
  var que = []
  que.push(root)
  while(que.length !== 0) {
    var node = que.pop()
    console.log(node.value)    
    if(node.right) que.push(node.right)
    if(node.left) que.push(node.left)
  }
}
```
