





```python
(jaxEnv) ken@lynxi:~/workspace/jax-jax-v0.3.17/jax/experimental/sparse$ tree
.
├── ad.py
├── api.py
├── _base.py
├── bcoo.py       BCOO稀疏矩阵
├── coo.py        COO稀疏矩阵
├── csr.py        稀疏矩阵存储
├── __init__.py
├── linalg.py
├── random.py
├── transform.py
└── util.py

```



```python
class BCOO(JAXSparse):
  """Experimental batched COO matrix implemented in JAX

  Args:
    (data, indices) : data and indices in batched COO format.
    shape : shape of sparse array.

  Attributes:
    data : ndarray of shape ``[*batch_dims, nse, *dense_dims]`` containing the
      explicitly stored data within the sparse matrix.
    indices : ndarray of shape ``[*batch_dims, nse, n_sparse]`` containing the
      indices of the explicitly stored data. Duplicate entries will be summed.

  # Note: additional BCOO methods are defined in transform.py
  """
  data: jnp.ndarray   # 非0数据
  indices: jnp.ndarray  # 非0数据所在位置坐标
  shape: Shape
  nse = property(lambda self: self.indices.shape[-2])   # shape的到数第2个idx, 非0元素数目
  dtype = property(lambda self: self.data.dtype)        # 数据type
  n_batch = property(lambda self: self.indices.ndim - 2)  
  n_sparse = property(lambda self: self.indices.shape[-1]) # 坐标的维度
  n_dense = property(lambda self: self.data.ndim - 1 - self.n_batch)
  indices_sorted: bool
  unique_indices: bool
  _info = property(lambda self: BCOOInfo(self.shape, self.indices_sorted,
                                         self.unique_indices))
  _bufs = property(lambda self: (self.data, self.indices))
```

使用`indices`来表示坐标

### example

```python
from jax.experimental import sparse
import jax.numpy as jnp
import numpy as np

M = jnp.array([[0., 1., 0., 2.], \
               [3., 0., 0., 0.], \
               [0., 0., 4., 0.]])

M_sp = sparse.BCOO.fromdense(M)

print(M_sp)
# BCOO(float32[3, 4], nse=4)

print(M_sp.data)      # Explicitly stored data:q
# [1. 2. 3. 4.]

print(M_sp.indices)   # Indices of the stored data
# [[0 1]
#  [0 3]
#  [1 0]
#  [2 2]]

print(M_sp.indices.shape)
# (4, 2)

M_dense = M_sp.todense()
print(M_dense)
# BCOO(float32[3, 4], nse=4)
# [[0. 1. 0. 2.]
#  [3. 0. 0. 0.]
#  [0. 0. 4. 0.]]

```









`COO`是`JAX transforms`的最小兼容版本，通常推荐使用`BCOO`。二者具体的表示方式有所不同。

```python
class COO(JAXSparse):
  """Experimental COO matrix implemented in JAX.

  Note: this class has minimal compatibility with JAX transforms such as
  grad and autodiff, and offers very little functionality. In general you
  should prefer :class:`jax.experimental.sparse.BCOO`.
  """
  data: jnp.ndarray
  row: jnp.ndarray
  col: jnp.ndarray
  shape: Tuple[int, int]
  nse = property(lambda self: self.data.size)
  dtype = property(lambda self: self.data.dtype)
  _info = property(lambda self: COOInfo(
      shape=self.shape, rows_sorted=self._rows_sorted,
      cols_sorted=self._cols_sorted))
  _bufs = property(lambda self: (self.data, self.row, self.col))
  _rows_sorted: bool
  _cols_sorted: bool

def todense(self):
    return coo_todense(self)

  def transpose(self, axes=None):
    if axes is not None:
      raise NotImplementedError("axes argument to transpose()")
    return COO((self.data, self.col, self.row), shape=self.shape[::-1],
               rows_sorted=self._cols_sorted, cols_sorted=self._rows_sorted)

  def tree_flatten(self):
    return (self.data, self.row, self.col), self._info._asdict()

  
  # coo_todense

coo_todense_p = core.Primitive('coo_todense')

def coo_todense(mat):
  """Convert a COO-format sparse matrix to a dense matrix.

  Args:
    mat : COO matrix
  Returns:
    mat_dense: dense version of ``mat``
  """
  return _coo_todense(mat.data, mat.row, mat.col, spinfo=mat._info)

```

使用`row`,`col`结合起来表示坐标。









