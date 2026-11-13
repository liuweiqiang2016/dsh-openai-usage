# OpenAI Usage

[简体中文](README.md) | English

View OpenAI API usage and costs in DeepSeek Harness, with Chinese and English interfaces.

- View input, output and cached tokens, plus request counts.
- Explore usage by model or project and view daily costs.
- Filter by this month, the last 7 days or the last 30 days.

## Install

1. In DSH, open **Plugins → Add plugin**.
2. Enter this URL and select **Install**:

   ```text
   https://github.com/liuweiqiang2016/dsh-openai-usage
   ```

3. Once installed, open **Settings → OpenAI Usage**.

## Configure your key

An **OpenAI Admin API Key** is required. A regular model API key will not work.

1. Open [OpenAI Admin keys](https://platform.openai.com/settings/organization/admin-keys), select your organization and create a key. Contact your organization administrator if you do not have permission.
2. Select **Configure key** in the plugin, paste the key, then select **Save and query**.

Harness's credential service stores the key. Do not share it in chats or GitHub issues.

## Notes

- Data comes from OpenAI's official APIs and uses UTC dates. Cost updates may be delayed.
- For balances and credit grants, use the plugin's link to the official billing page.

[MIT License](LICENSE)
