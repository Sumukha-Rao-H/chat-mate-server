const axios = require("axios");

async function saveSecretToDoppler() {
  const dopplerToken = process.env.DOPPLER_PERSONAL_TOKEN;
  const projectName = process.env.DOPPLER_PROJECT_NAME; // your project slug
  const configName = process.env.DOPPLER_ENVIRONMENT; // like 'dev_personal'

  if (!dopplerToken) {
    throw new Error("Doppler token not found in environment variables.");
  }

  const mockSecrets = {
    MOCK_SECRET_ONE: "hello_world_123",
    MOCK_SECRET_TWO: "super_secret_456",
  };

  try {
    const response = await axios({
      method: "POST",
      url: "https://api.doppler.com/v3/configs/config/secrets",
      headers: {
        Authorization: `Bearer ${dopplerToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        project: projectName,
        config: configName,
        secrets: mockSecrets,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "Error saving secrets to Doppler:",
      error.response?.data || error.message
    );
    return { success: false, error: error.response?.data || error.message };
  }
}

async function getPrivateKeyFromDoppler(secretName) {
  const dopplerToken = process.env.DOPPLER_PERSONAL_TOKEN;
  const projectName = process.env.DOPPLER_PROJECT_NAME;
  const configName = process.env.DOPPLER_ENVIRONMENT;

  if (!dopplerToken) {
    throw new Error("Doppler token not found in environment variables.");
  }

  try {
    const response = await axios.get(
      `https://api.doppler.com/v3/configs/config/secrets/download`,
      {
        headers: {
          Authorization: `Bearer ${dopplerToken}`,
          Accept: "application/json",
        },
        params: {
          project: projectName,
          config: configName,
          format: "json",
        },
      }
    );

    const secrets = response.data;
    const privateKey = secrets[secretName];

    if (!privateKey) {
      throw new Error(`Secret "${secretName}" not found.`);
    }

    return privateKey;
  } catch (error) {
    console.error(
      "Error retrieving private key from Doppler:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = {saveSecretToDoppler, getPrivateKeyFromDoppler};
