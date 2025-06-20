<h1 align="center">dummy</h1>


### dummy 结点控制宽度等

在 Graphviz 的 DOT 语言中，可以使用辅助节点（dummy nodes）来影响连接线的走向和长度。辅助节点是一种虚拟节点，用于调整连接线的布局和路径。

通过在 DOT 中添加辅助节点，您可以手动控制连接线的路径和长度，以达到所需的效果。以下是一个示例，展示了如何使用辅助节点来调整连接线的长度：

dot

复制

```asm
digraph G {
    A -> B;
    A -> C;
    C -> D;
    
    // 添加辅助节点
    {rank=same; A; dummy1 [shape=point]; B;}
    {rank=same; C; dummy2 [shape=point]; D;}
    
    // 设置辅助节点的连接线
    A -> dummy1 [style=invis];
    dummy1 -> B [style=invis];
    C -> dummy2 [style=invis];
    dummy2 -> D [style=invis];
}
```

在上述示例中，我们首先定义了几个节点（A、B、C、D）和它们之间的连接线。然后，我们创建了两个辅助节点（dummy1、dummy2）并使用 `shape=point` 设置它们为无形状节点。

接下来，我们使用 `rank=same` 将辅助节点与相应的节点放在同一水平线上，以确保它们在同一水平层级上。然后，我们通过设置辅助节点与相邻节点之间的连接线为 `style=invis`（即不可见）来实现辅助节点的作用。

通过添加和设置辅助节点，您可以手动控制连接线的路径和长度。您可以根据需要调整辅助节点的位置，以达到所需的连接线长度和布局效果。

请注意，使用辅助节点需要小心，并权衡图形布局的复杂性和可读性。在添加辅助节点时，建议仔细考虑图形的大小和复杂性，以确保最终的图形结果符合预期并易于理解。



graphviz图方向