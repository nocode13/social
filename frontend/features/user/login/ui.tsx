import React, { useReducer } from 'react';
import { StyleSheet } from 'react-native';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from 'lucide-react-native';
import { Link as RouterLink } from 'expo-router';

import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Link, LinkText } from '@/components/ui/link';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { validateEmail, validatePassword } from '@/shared/lib/validate';

import * as model from './model';
import { useUnit } from 'effector-react';

type FormState = {
  email: string;
  password: string;
  showPassword: boolean;
  errors: {
    email?: string;
    password?: string;
  };
  touched: {
    email: boolean;
    password: boolean;
  };
};

type FormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY' }
  | { type: 'SET_FIELD_TOUCHED'; field: 'email' | 'password' }
  | { type: 'VALIDATE_FIELD'; field: 'email' | 'password' }
  | { type: 'VALIDATE_ALL' }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  email: '',
  password: '',
  showPassword: false,
  errors: {},
  touched: {
    email: false,
    password: false,
  },
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload,
        errors: {
          ...state.errors,
          email: state.touched.email
            ? validateEmail(action.payload)
            : undefined,
        },
      };

    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload,
        errors: {
          ...state.errors,
          password: state.touched.password
            ? validatePassword(action.payload)
            : undefined,
        },
      };

    case 'TOGGLE_PASSWORD_VISIBILITY':
      return {
        ...state,
        showPassword: !state.showPassword,
      };

    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case 'VALIDATE_FIELD': {
      const error =
        action.field === 'email'
          ? validateEmail(state.email)
          : validatePassword(state.password);
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: error,
        },
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };
    }

    case 'VALIDATE_ALL': {
      const emailError = validateEmail(state.email);
      const passwordError = validatePassword(state.password);
      return {
        ...state,
        errors: {
          email: emailError,
          password: passwordError,
        },
        touched: {
          email: true,
          password: true,
        },
      };
    }

    case 'RESET_FORM':
      return initialState;

    default:
      return state;
  }
};

export const LoginForm: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [pending] = useUnit([model.$pending]);

  const handleEmailChange = (value: string) => {
    dispatch({ type: 'SET_EMAIL', payload: value });
  };

  const handlePasswordChange = (value: string) => {
    dispatch({ type: 'SET_PASSWORD', payload: value });
  };

  const handleEmailBlur = () => {
    dispatch({ type: 'VALIDATE_FIELD', field: 'email' });
  };

  const handlePasswordBlur = () => {
    dispatch({ type: 'VALIDATE_FIELD', field: 'password' });
  };

  const togglePasswordVisibility = () => {
    dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY' });
  };

  const handleLogin = () => {
    dispatch({ type: 'VALIDATE_ALL' });

    const emailError = validateEmail(state.email);
    const passwordError = validatePassword(state.password);

    if (emailError || passwordError) {
      return;
    }

    model.loginFx({ email: state.email, password: state.password });
  };

  return (
    <VStack space="xl" style={styles.form}>
      <Heading size="2xl" style={{ textAlign: 'center' }}>
        Login
      </Heading>

      <VStack space="lg">
        <VStack space="xs">
          <Input
            variant="outline"
            size="md"
            isInvalid={state.touched.email && !!state.errors.email}
          >
            <InputSlot style={styles.iconSlot}>
              <InputIcon as={MailIcon} width={16} height={16} />
            </InputSlot>
            <InputField
              placeholder="Email"
              value={state.email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Input>
          {state.touched.email && state.errors.email && (
            <Text size="sm" style={styles.errorText}>
              {state.errors.email}
            </Text>
          )}
        </VStack>

        <VStack space="xs">
          <Input
            variant="outline"
            size="md"
            isInvalid={state.touched.password && !!state.errors.password}
          >
            <InputSlot style={styles.iconSlot}>
              <InputIcon as={LockIcon} width={16} height={16} />
            </InputSlot>
            <InputField
              placeholder="Password"
              value={state.password}
              onChangeText={handlePasswordChange}
              onBlur={handlePasswordBlur}
              secureTextEntry={!state.showPassword}
              autoCapitalize="none"
            />
            <InputSlot
              style={styles.eyeSlot}
              onPress={togglePasswordVisibility}
            >
              <InputIcon
                as={state.showPassword ? EyeIcon : EyeOffIcon}
                width={16}
                height={16}
              />
            </InputSlot>
          </Input>
          {state.touched.password && state.errors.password && (
            <Text size="sm" style={styles.errorText}>
              {state.errors.password}
            </Text>
          )}
        </VStack>
      </VStack>

      <Button size="lg" onPress={handleLogin} isDisabled={pending}>
        {pending && <ButtonSpinner color="grey" />}
        <ButtonText>Log in</ButtonText>
      </Button>

      <HStack reversed>
        <RouterLink asChild href="/signup">
          <Link>
            <LinkText>Sign up</LinkText>
          </Link>
        </RouterLink>
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconSlot: {
    paddingLeft: 12,
  },
  eyeSlot: {
    paddingRight: 12,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4,
  },
});
