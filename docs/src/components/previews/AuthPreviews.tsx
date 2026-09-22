import React from 'react';
import {
  LoginForm,
  RegisterForm,
  ForgotPassword,
  ResetPassword,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const LoginFormPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '400px' }}>
    <LoginForm
      onSubmit={(data) => onShowToast(`Signed in: ${data.identifier}`)}
      onForgotPassword={() => onShowToast('Navigating to password reset')}
      onRegisterClick={() => onShowToast('Navigating to registration')}
    />
  </div>
);

export const RegisterFormPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '420px' }}>
    <RegisterForm
      onSubmit={(data) => onShowToast(`Account created for ${data.fullName}`)}
      onLoginClick={() => onShowToast('Navigating to sign in')}
    />
  </div>
);

export const ForgotPasswordPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '400px' }}>
    <ForgotPassword
      onSubmit={(email) => onShowToast(`Reset instructions dispatched to ${email}`)}
      onBackToLogin={() => onShowToast('Returned to sign in')}
    />
  </div>
);

export const ResetPasswordPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '400px' }}>
    <ResetPassword
      onSubmit={() => onShowToast('Password updated successfully')}
    />
  </div>
);

export const AuthPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'LoginForm': return <LoginFormPreview onShowToast={onShowToast} />;
    case 'RegisterForm': return <RegisterFormPreview onShowToast={onShowToast} />;
    case 'ForgotPassword': return <ForgotPasswordPreview onShowToast={onShowToast} />;
    case 'ResetPassword': return <ResetPasswordPreview onShowToast={onShowToast} />;
    default: return null;
  }
};
