import { OAuthProviderConfig, OAuthTokens, OAuthProfile } from '../types';

export class OAuthHelper {
  /**
   * Generates authorization URL for initiating OAuth 2.0 flow
   */
  static buildAuthorizationUrl(
    config: OAuthProviderConfig,
    params: {
      redirectUri: string;
      state: string;
      codeChallenge?: string;
    }
  ): string {
    const url = new URL(config.authorizationUrl);
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('redirect_uri', params.redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', params.state);

    const scopes = config.scope || ['openid', 'email', 'profile'];
    url.searchParams.set('scope', scopes.join(' '));

    if (params.codeChallenge) {
      url.searchParams.set('code_challenge', params.codeChallenge);
      url.searchParams.set('code_challenge_method', 'S256');
    }

    if (config.id === 'google') {
      url.searchParams.set('access_type', 'offline');
      url.searchParams.set('prompt', 'consent');
    }

    return url.toString();
  }

  /**
   * Exchanges authorization code for access and ID tokens using standard fetch
   */
  static async exchangeCodeForTokens(
    config: OAuthProviderConfig,
    params: {
      code: string;
      redirectUri: string;
      codeVerifier?: string;
    }
  ): Promise<OAuthTokens> {
    const bodyParams = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: params.code,
      redirect_uri: params.redirectUri,
      grant_type: 'authorization_code',
    });

    if (params.codeVerifier) {
      bodyParams.set('code_verifier', params.codeVerifier);
    }

    const res = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: bodyParams.toString(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`[OAuth Error] Failed to exchange code for tokens with ${config.name}: ${errorText}`);
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      tokenType: data.token_type || 'Bearer',
      expiresIn: data.expires_in,
      scope: data.scope,
    };
  }

  /**
   * Fetches user profile from userinfo endpoint
   */
  static async fetchUserProfile(
    config: OAuthProviderConfig,
    tokens: OAuthTokens
  ): Promise<OAuthProfile> {
    if (!config.userInfoUrl) {
      throw new Error(`[OAuth Error] Provider ${config.name} does not have a userInfoUrl defined.`);
    }

    const res = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'User-Agent': 'BoostEngine-Auth',
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`[OAuth Error] Failed to fetch user profile from ${config.name}: ${errorText}`);
    }

    const rawProfile = await res.json();

    if (config.profile) {
      return await config.profile(rawProfile, tokens);
    }

    return {
      id: rawProfile.id || rawProfile.sub,
      name: rawProfile.name,
      email: rawProfile.email,
      image: rawProfile.picture || rawProfile.avatar_url,
    };
  }
}
