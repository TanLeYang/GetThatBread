const amplifyConfig = {
  "aws_project_region": "ap-southeast-1",
  "aws_cognito_region": "ap-southeast-1",
  "aws_user_pools_id": "ap-southeast-1_FolXNfn8S",
  "aws_user_pools_web_client_id": "77pkqdd7hailelqtfihmf9gteo",
  "oauth": {
      "domain": "getthatbread.auth.ap-southeast-1.amazoncognito.com",
      "scope": [
          "aws.cognito.signin.user.admin",
          "email",
          "openid",
          "phone",
          "profile"
      ],
      "redirectSignIn": "http://localhost:3000",
      "redirectSignOut": "http://localhost:3000",
      "responseType": "code"
  },
  "federationTarget": "COGNITO_USER_POOLS",
  "aws_cognito_username_attributes": [
      "EMAIL"
  ],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": [
          "REQUIRES_LOWERCASE",
          "REQUIRES_UPPERCASE",
          "REQUIRES_NUMBERS",
          "REQUIRES_SYMBOLS"
      ]
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ]
}

export {
    amplifyConfig
}