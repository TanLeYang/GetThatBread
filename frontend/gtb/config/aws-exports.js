const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  oauth: {
    domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN,
    scope: ["aws.cognito.signin.user.admin", "email", "openid", "profile"],
    redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN,
    redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
    responseType: "code"
  },
  aws_cognito_username_attributes: ["EMAIL"],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: [],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      "REQUIRES_LOWERCASE",
      "REQUIRES_UPPERCASE",
      "REQUIRES_NUMBERS",
      "REQUIRES_SYMBOLS"
    ]
  },
  aws_cognito_verification_mechanisms: ["EMAIL"]
}

export { amplifyConfig }
