const templateNonProdBase = '{{cookiecutter.idpBaseUrlNonProd}}';
const templateProdBase = '{{cookiecutter.idpBaseUrlProd}}';
const templateNonProdLogout = '{{cookiecutter.idpLogoutUrlNonProd}}';
const templateProdLogout = '{{cookiecutter.idpLogoutUrlProd}}';


const getIdpBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return templateProdBase ? templateProdBase : 'https://idp.aa.com';
  }
  return templateNonProdBase ? templateNonProdBase : 'https://idptest.aa.com';
};

export const getLogoutEndpoint = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return templateProdLogout ? templateProdLogout : 'https://smlogin.aa.com/login/SMLogout.jsp';
  }
  return templateNonProdLogout ? templateNonProdLogout :'https://smlogin.qtcorpaa.aa.com/login/SMLogout.jsp';
};

export const getClientId = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'statusboard';
  }
  return 'statusboard-dev';
};

export const getUserInfoEndpoint = (): string => `${getIdpBaseUrl()}/idp/userinfo.openid`;

export const getAuthEndpoint = (): string => `${getIdpBaseUrl()}/as/authorization.oauth2`;

export const getTokenEndpoint = (): string => `${getIdpBaseUrl()}/as/token.oauth2`;