"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { useAuth } from "@/hooks/use-auth";
import { STORAGE_KEYS } from "@/config/constants";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, loginError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username:
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.REMEMBER_USERNAME) || ""
          : "",
      password: "",
      rememberMe:
        typeof window !== "undefined"
          ? !!localStorage.getItem(STORAGE_KEYS.REMEMBER_USERNAME)
          : false,
    },
  });

  // Load remembered username on mount
  useEffect(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_USERNAME);
    if (rememberMe) {
      form.setValue("rememberMe", true);
      form.setValue("username", rememberMe);
      form.setFocus("password");
    }
  }, [form]);

  const onSubmit = (data: LoginFormData) => {
    if (data.rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_USERNAME, data.username);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_USERNAME);
    }

    login({
      username: data.username,
      password: data.password,
      expiresInMins: 1,
    });
  };

  const errorMessage =
    loginError instanceof Error
      ? loginError?.response?.data?.message
      : "Login failed. Please try again.";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!!loginError && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  {...field}
                  disabled={isLoggingIn}
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    disabled={isLoggingIn}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoggingIn}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoggingIn}
                />
              </FormControl>
              <FormLabel className="font-normal">Remember me</FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoggingIn}
          size="lg"
        >
          {isLoggingIn && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
