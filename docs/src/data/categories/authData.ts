import { UIComponentItem } from '../../types';

export const authData: UIComponentItem[] = [
  {
    id: 'LoginForm',
    name: 'LoginForm',
    category: 'auth',
    description: 'Clean user login card with email/phone input, password visibility toggle, remember me checkbox, and forgot password link.',
    badge: 'Security',
    cliCommand: 'npx boost-ui add login-form',
    codeSnippet: `import { LoginForm } from '@boostengine/ui';

export function LoginPage() {
  return (
    <LoginForm
      onSubmit={(data) => console.log('Login credentials:', data)}
      onForgotPassword={() => console.log('Redirect to forgot password')}
      onRegisterClick={() => console.log('Redirect to signup')}
    />
  );
}`,
    props: [
      { name: 'onSubmit', type: '(data: LoginData) => void', default: 'undefined', description: 'Form submission callback' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner in submit button' }
    ]
  },
  {
    id: 'RegisterForm',
    name: 'RegisterForm',
    category: 'auth',
    description: 'Account registration card with name, email, phone, password, terms checkbox, and error handling.',
    badge: 'Security',
    cliCommand: 'npx boost-ui add register-form',
    codeSnippet: `import { RegisterForm } from '@boostengine/ui';

export function SignupPage() {
  return (
    <RegisterForm
      onSubmit={(data) => console.log('Register data:', data)}
      onLoginClick={() => console.log('Redirect to signin')}
    />
  );
}`,
    props: [
      { name: 'onSubmit', type: '(data: RegisterFormData) => void', default: 'undefined', description: 'Registration callback' }
    ]
  },
  {
    id: 'ForgotPassword',
    name: 'ForgotPassword',
    category: 'auth',
    description: 'Password recovery card with email input, instructions dispatch, and back to sign in link.',
    badge: 'Security',
    cliCommand: 'npx boost-ui add forgot-password',
    codeSnippet: `import { ForgotPassword } from '@boostengine/ui';

export function RecoverAccount() {
  return (
    <ForgotPassword
      onSubmit={(email) => console.log('Send reset to:', email)}
      onBackToLogin={() => console.log('Back to login')}
    />
  );
}`,
    props: [
      { name: 'onSubmit', type: '(email: string) => void', default: 'undefined', description: 'Email submit callback' }
    ]
  },
  {
    id: 'ResetPassword',
    name: 'ResetPassword',
    category: 'auth',
    description: 'Set new password card with confirmation password matching validation and length requirements.',
    badge: 'Security',
    cliCommand: 'npx boost-ui add reset-password',
    codeSnippet: `import { ResetPassword } from '@boostengine/ui';

export function SetPassword() {
  return (
    <ResetPassword
      onSubmit={(newPassword) => console.log('New password:', newPassword)}
    />
  );
}`,
    props: [
      { name: 'onSubmit', type: '(password: string) => void', default: 'undefined', description: 'New password callback' }
    ]
  }
];
