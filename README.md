# OpenAI 用量

简体中文 | [English](README.en.md)

在 DeepSeek Harness 中查看 OpenAI API 用量与费用，支持中英文界面。

- 查看输入、输出、缓存 Token 和请求次数。
- 按模型、项目查看用量，查看每日费用。
- 支持本月、近 7 天、近 30 天筛选。

## 安装

1. 在 DSH 中打开**插件 → 添加插件**。
2. 输入以下地址，点击**安装**：

   ```text
   https://github.com/liuweiqiang2016/dsh-openai-usage
   ```

3. 安装完成后，打开**设置 → OpenAI 用量**。

## 配置密钥

需要 **OpenAI Admin API Key**，普通模型 API Key 不适用。

1. 前往 [OpenAI 管理员密钥页](https://platform.openai.com/settings/organization/admin-keys)，选择对应组织并创建密钥；没有权限时请联系组织管理员。
2. 在插件中点击**配置密钥**，粘贴后选择**保存并查询**。

密钥由 Harness 凭据服务保存，请勿发送到聊天或 GitHub Issue。

## 说明

- 数据来自 OpenAI 官方接口，按 UTC 日期统计，费用可能延迟更新。
- 余额及赠送额度请通过插件内的链接前往官方账单页查看。

[MIT License](LICENSE)
