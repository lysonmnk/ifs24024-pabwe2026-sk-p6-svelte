<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { navigate } from "../../../router.js";
  import { login, isAuthLogin } from "../states/authStore.js";
  import NavLink from "../../common/components/NavLink.svelte";

  const email = useInput("");
  const password = useInput("");

  async function submit(event) {
    event.preventDefault();
    const ok = await login({ email: $email, password: $password });
    if (ok) navigate("/");
  }
</script>

<h2 class="mb-6 text-3xl font-extrabold text-ink">Masuk</h2>
<form onsubmit={submit} class="space-y-5">
  <div>
    <label for="login-email-input" class="field-label">Email</label>
    <input
      id="login-email-input"
      type="email"
      required
      value={$email}
      oninput={email.onChange}
      class="field"
    />
  </div>
  <div>
    <label for="login-password-input" class="field-label">Kata Sandi</label>
    <input
      id="login-password-input"
      type="password"
      required
      value={$password}
      oninput={password.onChange}
      class="field"
    />
  </div>
  <button
    id="login-submit-button"
    type="submit"
    disabled={$isAuthLogin}
    class="btn-primary w-full"
  >
    {$isAuthLogin ? "Memproses..." : "Masuk"}
  </button>
</form>
<p class="mt-6 text-center text-sm text-muted">
  Belum punya akun?
  <NavLink href="/auth/register" class="font-bold text-pine-700 underline underline-offset-4 hover:text-pine-900">Daftar</NavLink>
</p>
