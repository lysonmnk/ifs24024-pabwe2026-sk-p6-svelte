<script>
  import { authProfile } from "../../auth/states/authStore.js";
  import {
    updateProfile,
    changePhoto,
    changePassword,
    isProfileUpdating,
    isPhotoUpdating,
    isPasswordUpdating,
  } from "../states/userStore.js";
  import { useInput } from "../../../hooks/useInput.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import Avatar from "../../common/components/Avatar.svelte";

  const name = useInput($authProfile.name);
  const email = useInput($authProfile.email);
  const password = useInput("");
  const newPassword = useInput("");
  const confirmation = useInput("");

  let photoFile = $state(null);

  function pickPhoto(event) {
    photoFile = event.target.files[0];
  }

  async function submitProfile(event) {
    event.preventDefault();
    await updateProfile({ name: $name, email: $email });
  }

  async function submitPhoto(event) {
    event.preventDefault();
    if (!photoFile) {
      await showWarningDialog("Pilih foto terlebih dahulu");
      return;
    }
    await changePhoto(photoFile);
  }

  async function submitPassword(event) {
    event.preventDefault();
    if ($newPassword !== $confirmation) {
      await showWarningDialog("Konfirmasi kata sandi tidak sama");
      return;
    }
    const ok = await changePassword({
      password: $password,
      newPassword: $newPassword,
      confirmation: $confirmation,
    });
    if (ok) {
      password.reset();
      newPassword.reset();
      confirmation.reset();
    }
  }
</script>

<div class="space-y-6">
  <h1 class="text-3xl font-extrabold text-ink sm:text-4xl">Profil</h1>

  <div class="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
    <section class="card overflow-hidden">
      <div class="h-20 bg-pine-800"></div>
      <div class="px-5 pb-6">
        <div class="-mt-10 w-fit rounded-full ring-4 ring-white">
          <Avatar name={$authProfile.name} photo={$authProfile.photo} size="h-20 w-20" />
        </div>
        <p class="mt-3 break-words font-display text-xl font-extrabold text-ink">{$authProfile.name}</p>
        <p class="break-words text-sm text-muted">{$authProfile.email}</p>

        <h2 class="mb-3 mt-6 text-lg font-extrabold text-ink">Foto Profil</h2>
        <form onsubmit={submitPhoto} class="space-y-3">
          <input
            id="photo-file"
            type="file"
            accept="image/*"
            aria-label="Foto profil"
            onchange={pickPhoto}
            class="field cursor-pointer py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-pine-100 file:px-3 file:py-1.5 file:font-bold file:text-pine-800"
          />
          <button type="submit" disabled={$isPhotoUpdating} class="btn-secondary w-full">
            {$isPhotoUpdating ? "Mengunggah..." : "Ubah Foto"}
          </button>
        </form>
      </div>
    </section>

    <div class="space-y-6">
      <section class="card p-5 sm:p-6">
        <h2 class="mb-4 text-xl font-extrabold text-ink">Data Diri</h2>
        <form onsubmit={submitProfile} class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="profile-name" class="field-label">Nama</label>
              <input id="profile-name" type="text" value={$name} oninput={name.onChange} class="field" />
            </div>
            <div>
              <label for="profile-email" class="field-label">Email</label>
              <input id="profile-email" type="email" value={$email} oninput={email.onChange} class="field" />
            </div>
          </div>
          <button type="submit" disabled={$isProfileUpdating} class="btn-primary">
            {$isProfileUpdating ? "Menyimpan..." : "Simpan Data"}
          </button>
        </form>
      </section>

      <section class="card p-5 sm:p-6">
        <h2 class="mb-4 text-xl font-extrabold text-ink">Ubah Kata Sandi</h2>
        <form onsubmit={submitPassword} class="space-y-5">
          <div>
            <label for="current-password" class="field-label">Kata Sandi Saat Ini</label>
            <input id="current-password" type="password" value={$password} oninput={password.onChange} class="field" />
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="new-password" class="field-label">Kata Sandi Baru</label>
              <input id="new-password" type="password" value={$newPassword} oninput={newPassword.onChange} class="field" />
            </div>
            <div>
              <label for="confirm-password" class="field-label">Konfirmasi Kata Sandi Baru</label>
              <input id="confirm-password" type="password" value={$confirmation} oninput={confirmation.onChange} class="field" />
            </div>
          </div>
          <button type="submit" disabled={$isPasswordUpdating} class="btn-primary">
            {$isPasswordUpdating ? "Menyimpan..." : "Ubah Kata Sandi"}
          </button>
        </form>
      </section>
    </div>
  </div>
</div>
