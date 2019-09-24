const request = require('request-promise-native');

const Statuses = require('../constants/statuses');
const Socials = require('../constants/socials');
const { social: { facebook } } = require('../config');

class Social {
  static async getData({ code }) {
    const {
      socialId, type, url, ...rest
    } = await Social.getFacebookData(code);

    return {
      ...rest,
      socials: { socialId, type, url },
      status: Statuses.ACTIVE
    };
  }

  static async getFacebookData(code) {
    const {
      clientId, clientSecret, redirectUrl, accessTokenUrl, profileUrl
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
      type: Socials.FACEBOOK,
      url: profile.link
    };
  }
}

module.exports = Social;
