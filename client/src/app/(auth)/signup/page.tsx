"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, MailCheckIcon } from "lucide-react";
import Logo from "@/components/logo";
import { emailVerify, signup } from "@/lib/api";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [isSubmited, setIsSubmited] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    email: z.string().trim().email().min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await signup(values);

      toast({
        variant: "default",
        title: data.message,
      });
      setIsSubmited(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: error.response?.data.message,
        });
      }
    }
  };

  return (
    <>
      <main className="w-full min-h-[590px] h-auto max-w-full pt-10">
        {!isSubmited ? (
          <div className="w-full p-5 rounded-md">
            <Logo />

            <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
              Create a Squeezy account
            </h1>
            <p className="mb-6 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal">
              Already have an account?{" "}
              <Link className="text-primary" href="/">
                Sign in
              </Link>
              .
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Techwithemma"
                            {...field}
                            disabled={form.formState.isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="subscribeto@channel.com"
                            {...field}
                            disabled={form.formState.isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••••••"
                            {...field}
                            disabled={form.formState.isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  className="w-full text-[15px] h-[40px] !bg-blue-500 text-white font-semibold"
                  type="submit"
                >
                  Create account
                  <ArrowRight />
                </Button>

                <div className="mb-4 mt-4 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                    data-orientation="horizontal"
                    role="separator"
                  ></div>
                  <span className="mx-4 text-xs dark:text-[#f1f7feb5] font-normal">
                    OR
                  </span>
                  <div
                    aria-hidden="true"
                    className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                    data-orientation="horizontal"
                    role="separator"
                  ></div>
                </div>
              </form>
            </Form>
            <Button variant="outline" className="w-full h-[40px]">
              Email magic link
            </Button>
            <p className="text-xs font-normal mt-4">
              By signing up, you agree to our{" "}
              <a className="text-primary hover:underline" href="#">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-primary hover:underline" href="#">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        ) : (
          <VerifyEmail email={form.getValues().email} />
        )}
      </main>
    </>
  );
}

const VerifyEmail = ({ email }: { email: string }) => {
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState("");

  const { toast } = useToast();

  return !verified ? (
    <div className="w-full p-5 rounded-md">
      <Logo />

      <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
        Create a Squeezy account
      </h1>
      <p className="mb-6 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal">
        Already have an account?{" "}
        <Link className="text-primary" href="/">
          Sign in
        </Link>
        .
      </p>

      <div className="flex flex-col gap-5">
        <Input
          placeholder="subscribeto@channel.com"
          defaultValue={email}
          readOnly
          disabled
        />
        <Input
          placeholder="Enter code"
          onChange={(e) => setCode(e.target.value)}
          value={code}
        />
        <Button
          className="w-full text-[15px] h-[40px] !bg-blue-500 text-white font-semibold"
          onClick={async () => {
            try {
              await emailVerify({ email, code });
              setVerified(true);
            } catch (error) {
              if (error instanceof AxiosError) {
                toast({
                  variant: "destructive",
                  title: error.response?.data.message,
                });
              }
            }
          }}
        >
          Verify Email
          <ArrowRight />
        </Button>
      </div>
    </div>
  ) : (
    <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
      <div className="size-[48px]">
        <MailCheckIcon size="48px" className="animate-bounce" />
      </div>
      <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
        Your email verified successfull
      </h2>
      <Link href="/">
        <Button className="h-[40px]">
          Go to login
          <ArrowRight />
        </Button>
      </Link>
    </div>
  );
};
