# 使用OpenCL GPU



### 1. 启用gpu支持

```c++
    // 启用 OpenCL 支持
    cv::ocl::setUseOpenCL(true);   // 设为false则使用cpu

    // 检查 OpenCL 是否成功启用
    if (cv::ocl::haveOpenCL()) {
        std::cout << "OpenCL is supported and enabled." << std::endl;
        // 可选：打印可用的 OpenCL 设备信息
        cv::ocl::Device device = cv::ocl::Device::getDefault();
        std::cout << "Using OpenCL device: " << device.name() << std::endl;
    } else {
        std::cout << "OpenCL is not supported or failed to initialize." << std::endl;
        // 程序可以继续在 CPU 上运行
    }   
```



#### 2. 确保 OpenCV 编译时启用 OpenCL

- 编译 OpenCV 时必须开启`WITH_OPENCL=ON`（默认开启，但需确认），否则所有 OpenCL 接口均无法使用。

- 可通过代码验证编译配置：

  

  ```cpp
  #include <opencv2/core/ocl.hpp>
  cout << "OpenCV OpenCL support: " << (cv::ocl::haveOpenCL() ? "Enabled" : "Disabled") << endl;
  ```

  

#### 3. 强制使用 OpenCL 兼容的数据类型

OpenCV 的 OpenCL 加速接口通常只对`UMat`（统一内存矩阵）有效，需将所有图像和中间数据转为`UMat`：

```cpp
// 1. 图像读取为UMat
UMat uimg1 = imread("query.png", IMREAD_GRAYSCALE).getUMat(ACCESS_READ);
UMat uimg2 = imread("train.png", IMREAD_GRAYSCALE).getUMat(ACCESS_READ);

// 2. 特征点检测与描述子计算（输入为UMat）
vector<KeyPoint> kp1, kp2;
UMat udes1, udes2;  // 描述子也使用UMat
orb->detectAndCompute(uimg1, UMat(), kp1, udes1);  // 优先调用OpenCL实现（如果存在）
orb->detectAndCompute(uimg2, UMat(), kp2, udes2);
```



### 4. example

```shell
#include <opencv2/opencv.hpp>
#include <opencv2/core/ocl.hpp>
#include <iostream>

using namespace cv;
using namespace std;

int main() {
    // 启用 OpenCL 支持
    cv::ocl::setUseOpenCL(true);

    // 检查 OpenCL 是否成功启用
    if (cv::ocl::haveOpenCL()) {
        std::cout << "OpenCL is supported and enabled." << std::endl;
        // 可选：打印可用的 OpenCL 设备信息
        cv::ocl::Device device = cv::ocl::Device::getDefault();
        std::cout << "Using OpenCL device: " << device.name() << std::endl;
    } else {
        std::cout << "OpenCL is not supported or failed to initialize." << std::endl;
        // 程序可以继续在 CPU 上运行
    }

    // ---------------------- 1. 读取图像 ----------------------
    // 请确保这两张图片文件与可执行文件在同一目录下，或者提供完整路径
    Mat img1 = imread("query.png", IMREAD_GRAYSCALE);  // 查询图（灰度图）
    Mat img2 = imread("train.png", IMREAD_GRAYSCALE);  // 训练图（灰度图）

    if (img1.empty() || img2.empty()) {
        cout << "错误：无法读取图像，请检查图像路径和文件名是否正确！" << endl;
        return -1;
    }

    // ---------------------- 2. 初始化 ORB 特征检测器 ----------------------
    // 参数顺序和类型严格遵循 OpenCV 4.2 的 API 文档
    Ptr<ORB> orb = ORB::create(
        500,                    // nfeatures: 最大特征点数量
        1.2f,                   // scaleFactor: 尺度因子
        8,                      // nlevels: 金字塔层数
        31,                     // edgeThreshold: 边缘阈值
        0,                      // firstLevel: 第一个金字塔层
        2,                      // WTA_K: 用于计算描述子的点对数量
        ORB::HARRIS_SCORE,      // scoreType: 评分函数类型
        31,                     // patchSize: 计算描述子的补丁大小
        20                      // fastThreshold: FAST 角点检测阈值
    );

    // ---------------------- 3. 提取特征点和描述子 ----------------------
    vector<KeyPoint> kp1, kp2;  // 存储关键点
    Mat des1, des2;             // 存储描述子 (ORB 生成的是 32 位二进制描述子)

//    orb->detectAndCompute(img1, Mat(), kp1, des1);  // 提取查询图的特征
//    orb->detectAndCompute(img2, Mat(), kp2, des2);  // 提取训练图的特征

    UMat uimg1, uimg2;
    img1.copyTo(uimg1);
    img2.copyTo(uimg2);

    // 提取特征时使用UMat
    orb->detectAndCompute(uimg1, UMat(), kp1, des1);
    orb->detectAndCompute(uimg2, UMat(), kp2, des2);

    cout << "查询图检测到的特征点数量：" << kp1.size() << endl;
    cout << "训练图检测到的特征点数量：" << kp2.size() << endl;

    // ---------------------- 4. 方案1：BF 暴力匹配 ----------------------
    // ORB 描述子是二进制的，因此使用汉明距离 (NORM_HAMMING) 进行匹配
    BFMatcher bf_matcher(NORM_HAMMING, true); // true 表示启用交叉验证，匹配更稳定
    vector<DMatch> bf_matches;
    bf_matcher.match(des1, des2, bf_matches);  // 执行匹配

    // 使用 Ratio Test 筛选出优质匹配
    double min_dist = 1e9;
    for (const auto& m : bf_matches) {
        if (m.distance < min_dist) min_dist = m.distance;
    }
    vector<DMatch> good_bf_matches;
    for (const auto& m : bf_matches) {
        // 设定一个合理的阈值，这里使用 2 * min_dist 或 30.0 中的较大值
        if (m.distance <= max(2.0 * min_dist, 30.0)) {
            good_bf_matches.push_back(m);
        }
    }

    cout << "BF 匹配后筛选出的优质特征点数量：" << good_bf_matches.size() << endl;

    // ---------------------- 5. 方案2：FLANN 快速匹配 ----------------------
    // 对于大规模特征点匹配，FLANN 比 BF 匹配快得多
    // 为二进制描述子配置 FLANN 参数
    Ptr<flann::IndexParams> index_params = makePtr<flann::LshIndexParams>(6, 12, 1);
    Ptr<flann::SearchParams> search_params = makePtr<flann::SearchParams>(50); // checks=50

    FlannBasedMatcher flann_matcher(index_params, search_params);
    vector<vector<DMatch>> flann_matches;
    // 使用 k-NN 匹配，k=2，即每个查询点返回两个最佳匹配
    flann_matcher.knnMatch(des1, des2, flann_matches, 2);

    // 使用 Ratio Test 筛选优质匹配
    vector<DMatch> good_flann_matches;
    for (const auto& m_n : flann_matches) {
        // 如果最佳匹配的距离远小于次佳匹配的距离，则认为是一个好的匹配
        if (m_n[0].distance < 0.75 * m_n[1].distance) {
            good_flann_matches.push_back(m_n[0]);
        }
    }

    cout << "FLANN 匹配后筛选出的优质特征点数量：" << good_flann_matches.size() << endl;
#if 0
    // ---------------------- 6. 可视化匹配结果 ----------------------
    Mat bf_match_img, flann_match_img;

    // --- 方案一：使用最简洁的 drawMatches 调用 ---
    // 只提供必要的参数，颜色和绘制选项使用默认值，避免参数不匹配问题
    drawMatches(img1, kp1, img2, kp2, good_bf_matches, bf_match_img);
    drawMatches(img1, kp1, img2, kp2, good_flann_matches, flann_match_img);

    // 显示结果窗口
    imshow("BF Matcher Results", bf_match_img);
    imshow("FLANN Matcher Results", flann_match_img);

    cout << "\n程序运行完毕。" << endl;
    cout << "请在图像窗口中按任意键退出程序。" << endl;

    // 等待按键，然后关闭所有窗口
    waitKey(0);
    destroyAllWindows();
#endif
    return 0;
}
```

