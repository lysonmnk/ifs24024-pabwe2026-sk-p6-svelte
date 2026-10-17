<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { navigate } from "../../../router.js";
  import { register, isAuthRegister } from "../states/authStore.js";
  import NavLink from "../../common/components/NavLink.svelte";

  const name = useInput("");
  const email = useInput("");
  const password = useInput("");

  async function submit(event) {
    event.preventDefault();
    const ok = await register({ name: $name, email: $email, password: $password });
    if (ok) navigate("/auth/login");
  }
</script>

<h2 class="mb-6 text-3xl font-extrabold text-ink">Daftar</h2>
<form onsubmit={submit} class="space-y-5">
  <div>
    <label for="register-name-input" class="field-label">Nama</label>
    <input
      id="register-name-input"
      type="text"
      required
      value={$name}
      oninput={name.onChange}
      class="field"
    />
  </div>
  <div>
    <label for="register-email-input" class="field-label">Email</label>
    <input
      id="register-email-input"
      type="email"
      required
      value={$email}
      oninput={email.onChange}
      class="field"
    />
  </div>
  <div>
    <label for="register-password-input" class="field-label">Kata Sandi</label>
    <input
      id="register-password-input"
      type="password"
      required
      value={$password}
      oninput={password.onChange}
      class="field"
    />
  </div>
  <button
    id="register-submit-button"
    type="submit"
    disabled={$isAuthRegister}
    class="btn-primary w-full"
  >
    {$isAuthRegister ? "Memproses..." : "Daftar"}
  </button>
</form>
<p class="mt-6 text-center text-sm text-muted">
  Sudah punya akun?
  <NavLink href="/auth/login" class="font-bold text-pine-700 underline underline-offset-4 hover:text-pine-900">Masuk</NavLink>
</p>
