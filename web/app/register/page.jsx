"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "@/components/Spinner";

export default function RegisterPage() {
  const { register, ready, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/chat");
  }, [ready, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.replace("/chat");
    } catch (err) {
      setError(err.message || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <p className="mb-1 font-display text-2xl text-ink">Create an account</p>
        <p className="mb-8 text-sm text-ink-soft">Takes about ten seconds.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" type="text" value={name} onChange={setName} autoComplete="name" required />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="-mt-2 text-xs text-ink-soft">At least 8 characters.</p>

          {error && <p className="text-sm text-rust">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-pen py-2.5 text-sm font-medium text-paper transition-colors hover:bg-pen-soft disabled:opacity-60"
          >
            {submitting && <Spinner />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="text-pen underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-pen/50"
        {...rest}
      />
    </label>
  );
}
