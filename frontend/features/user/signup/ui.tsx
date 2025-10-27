import React, { useReducer } from 'react';
import { StyleSheet } from 'react-native';
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
  UserIcon,
} from 'lucide-react-native';
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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  touched: {
    name: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  };
};

type FormAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY' }
  | { type: 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY' }
  | { type: 'SET_FIELD_TOUCHED'; field: keyof FormState['touched'] }
  | { type: 'VALIDATE_FIELD'; field: keyof FormState['touched'] }
  | { type: 'VALIDATE_ALL' }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false,
  errors: {},
  touched: {
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload,
        errors: {
          ...state.errors,
          name:
            state.touched.name && !action.payload.trim()
              ? 'name is required'
              : undefined,
        },
      };

    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload,
        errors: {
          ...state.errors,
          email:
            state.touched.email && action.payload
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
          password:
            state.touched.password && action.payload
              ? validatePassword(action.payload)
              : undefined,
          confirmPassword:
            state.confirmPassword && state.confirmPassword !== action.payload
              ? 'Passwords do not match'
              : undefined,
        },
      };

    case 'SET_CONFIRM_PASSWORD':
      return {
        ...state,
        confirmPassword: action.payload,
        errors: {
          ...state.errors,
          confirmPassword:
            state.touched.confirmPassword && action.payload !== state.password
              ? 'Passwords do not match'
              : undefined,
        },
      };

    case 'TOGGLE_PASSWORD_VISIBILITY':
      return { ...state, showPassword: !state.showPassword };

    case 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY':
      return { ...state, showConfirmPassword: !state.showConfirmPassword };

    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };

    case 'VALIDATE_FIELD': {
      let error: string | undefined;
      switch (action.field) {
        case 'name':
          error = !state.name.trim() ? 'name is required' : undefined;
          break;
        case 'email':
          error = validateEmail(state.email);
          break;
        case 'password':
          error = validatePassword(state.password);
          break;
        case 'confirmPassword':
          error =
            state.confirmPassword !== state.password
              ? 'Passwords do not match'
              : undefined;
          break;
      }
      return {
        ...state,
        errors: { ...state.errors, [action.field]: error },
        touched: { ...state.touched, [action.field]: true },
      };
    }

    case 'VALIDATE_ALL': {
      const nameError = !state.name.trim() ? 'name is required' : undefined;
      const emailError = validateEmail(state.email);
      const passwordError = validatePassword(state.password);
      const confirmPasswordError =
        state.confirmPassword !== state.password
          ? 'Passwords do not match'
          : undefined;

      return {
        ...state,
        errors: {
          name: nameError,
          email: emailError,
          password: passwordError,
          confirmPassword: confirmPasswordError,
        },
        touched: {
          name: true,
          email: true,
          password: true,
          confirmPassword: true,
        },
      };
    }

    case 'RESET_FORM':
      return initialState;

    default:
      return state;
  }
};

export const SignupForm: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [pending] = useUnit([model.$pending]);

  const handleSignup = () => {
    dispatch({ type: 'VALIDATE_ALL' });

    const hasErrors = Object.values(state.errors).some(Boolean);
    if (hasErrors) return;

    model.signupFx({
      name: state.name,
      email: state.email,
      password: state.password,
    });
  };

  return (
    <VStack space="xl" style={styles.form}>
      <Heading size="2xl" style={{ textAlign: 'center' }}>
        Sign Up
      </Heading>

      <VStack space="lg">
        <VStack space="xs">
          <Input
            variant="outline"
            size="md"
            isInvalid={state.touched.name && !!state.errors.name}
          >
            <InputSlot style={styles.iconSlot}>
              <InputIcon as={UserIcon} width={16} height={16} />
            </InputSlot>
            <InputField
              placeholder="Name"
              value={state.name}
              onChangeText={(v) => dispatch({ type: 'SET_NAME', payload: v })}
              onBlur={() => dispatch({ type: 'VALIDATE_FIELD', field: 'name' })}
              autoCapitalize="none"
            />
          </Input>
          {state.touched.name && state.errors.name && (
            <Text size="sm" style={styles.errorText}>
              {state.errors.name}
            </Text>
          )}
        </VStack>

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
              onChangeText={(v) => dispatch({ type: 'SET_EMAIL', payload: v })}
              onBlur={() =>
                dispatch({ type: 'VALIDATE_FIELD', field: 'email' })
              }
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
              onChangeText={(v) =>
                dispatch({ type: 'SET_PASSWORD', payload: v })
              }
              onBlur={() =>
                dispatch({ type: 'VALIDATE_FIELD', field: 'password' })
              }
              secureTextEntry={!state.showPassword}
              autoCapitalize="none"
            />
            <InputSlot
              style={styles.eyeSlot}
              onPress={() => dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY' })}
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

        <VStack space="xs">
          <Input
            variant="outline"
            size="md"
            isInvalid={
              state.touched.confirmPassword && !!state.errors.confirmPassword
            }
          >
            <InputSlot style={styles.iconSlot}>
              <InputIcon as={LockIcon} width={16} height={16} />
            </InputSlot>
            <InputField
              placeholder="Confirm Password"
              value={state.confirmPassword}
              onChangeText={(v) =>
                dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: v })
              }
              onBlur={() =>
                dispatch({ type: 'VALIDATE_FIELD', field: 'confirmPassword' })
              }
              secureTextEntry={!state.showConfirmPassword}
              autoCapitalize="none"
            />
            <InputSlot
              style={styles.eyeSlot}
              onPress={() =>
                dispatch({ type: 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY' })
              }
            >
              <InputIcon
                as={state.showConfirmPassword ? EyeIcon : EyeOffIcon}
                width={16}
                height={16}
              />
            </InputSlot>
          </Input>
          {state.touched.confirmPassword && state.errors.confirmPassword && (
            <Text size="sm" style={styles.errorText}>
              {state.errors.confirmPassword}
            </Text>
          )}
        </VStack>
      </VStack>

      <Button size="lg" onPress={handleSignup} isDisabled={pending}>
        {pending && <ButtonSpinner color="grey" />}
        <ButtonText>Sign up</ButtonText>
      </Button>

      <HStack reversed>
        <RouterLink asChild href="/login">
          <Link>
            <LinkText>Log in</LinkText>
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
  iconSlot: { paddingLeft: 12 },
  eyeSlot: { paddingRight: 12 },
  errorText: { color: '#ef4444', marginTop: 4 },
});
