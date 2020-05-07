const request = require('request-promise-native');

const Statuses = require('../constants/statuses');
const Socials = require('../constants/socials');
const { social: { facebook, google } } = require('../config');

const capitalize = require('./helpers/capitalize');

class Social {
  static async getData({ type, code }) {
    const {
      socialId, url, ...rest
    } = await Social[`get${capitalize(type)}Data`](code);

    return {
      ...rest,
      socials: { socialId, type: Socials[type.toUpperCase()], url },
      status: Statuses.ACTIVE,
    };
  }

  static async getGoogleData(code) {
    const {
      clientId, clientSecret, redirectUrl, accessTokenUrl, profileUrl,
    } = google;

    const { access_token: accessToken } = await request(accessTokenUrl, {
      method: 'POST',
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
        code,
        grant_type: 'authorization_code',
      },
      json: true,
    });

    const profileApiUrl = `${profileUrl}?access_token=${accessToken}`;
    const profile = await request(profileApiUrl, { json: true });

    return {
      fullName: profile.name,
      email: profile.email,
      picture: profile.picture,
      socialId: profile.id,
    };
  }

  static async getFacebookData(code) {
    const {
      clientId, clientSecret, redirectUrl, accessTokenUrl, profileUrl,
    } = facebook;

    const accessTokenApiUrl = `${accessTokenUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&client_secret=${clientSecret}&code=${code}`;
    const { access_token: accessToken } = await request(accessTokenApiUrl, { json: true });

    const profileApiUrl = `${profileUrl}?access_token=${accessToken}&fields=name,email,link,picture.width(1024).height(1024)`;
    const profile = await request(profileApiUrl, { json: true });

    return {
      fullName: profile.name,
      email: profile.email,
      picture: profile.picture.data.url,
      socialId: profile.id,
      url: profile.link,
    };
  }
}

module.exports = Social;
