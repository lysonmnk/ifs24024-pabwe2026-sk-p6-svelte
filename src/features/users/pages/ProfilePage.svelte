<script>
  import { onMount } from "svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import {
    profile,
    loadProfile,
    updateProfile,
    updatePhoto,
    changePassword,
  } from "../states/usersStore.js";
  import { handleResult, showWarningDialog } from "../../../helpers/toolsHelper.js";

  const name = useInput();
  const email = useInput();
  const oldPassword = useInput();
  const newPassword = useInput();
  const nameValue = name.value;
  const emailValue = email.value;
  const oldValue = oldPassword.value;
  const newValue = newPassword.value;
  let photo = $state(null);

  // Isi formulir setiap kali profil tersedia / berubah.
  $effect(() => {
    if ($profile) {
      nameValue.set($profile.name);
      emailValue.set($profile.email);
    }
  });

  onMount(() => {
    loadProfile();
  });

  const onPhoto = (event) => {
    photo = event.target.files[0];
  };

  async function saveProfile(event) {
    event.preventDefault();
    const res = await updateProfile({ name: $nameValue, email: $emailValue });
    await handleResult(res, () => {});
  }

  async function savePhoto(event) {
    event.preventDefault();
    if (!photo) {
      await showWarningDialog("Pilih foto terlebih dahulu");
      return;
    }
    const res = await updatePhoto(photo);
    await handleResult(res, () => {
      photo = null;
    });
  }

  async function savePassword(event) {
    event.preventDefault();
    const res = await changePassword({ password: $oldValue, new_password: $newValue });
    await handleResult(res, () => {
      oldPassword.reset();
      newPassword.reset();
    });
  }
</script>

<section class="max-w-2xl space-y-6">
  <h1 class="text-xl font-bold">Profil</h1>

  <form onsubmit={saveProfile} class="bg-white border border-slate-200 rounded-xl p-4 space-y-3" data-testid="profile-form">
    <h2 class="font-semibold">Data diri</h2>
    {#if $profile && $profile.photo}
      <img src={$profile.photo} alt="Foto profil" class="w-16 h-16 rounded-full object-cover" />
    {/if}
    <div>
      <label for="profile-name" class="block text-sm font-medium mb-1">Nama</label>
      <input id="profile-name" required value={$nameValue} oninput={name.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <div>
      <label for="profile-email" class="block text-sm font-medium mb-1">Email</label>
      <input id="profile-email" type="email" required value={$emailValue} oninput={email.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <button type="submit" class="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">Simpan</button>
  </form>

  <form onsubmit={savePhoto} class="bg-white border border-slate-200 rounded-xl p-4 space-y-3" data-testid="photo-form">
    <h2 class="font-semibold">Foto profil</h2>
    <input type="file" accept="image/*" aria-label="Pilih foto profil" onchange={onPhoto} data-testid="photo-input" class="text-sm" />
    <button type="submit" class="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">Unggah foto</button>
  </form>

  <form onsubmit={savePassword} class="bg-white border border-slate-200 rounded-xl p-4 space-y-3" data-testid="password-form">
    <h2 class="font-semibold">Ubah kata sandi</h2>
    <div>
      <label for="old-password" class="block text-sm font-medium mb-1">Kata sandi lama</label>
      <input id="old-password" type="password" required value={$oldValue} oninput={oldPassword.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <div>
      <label for="new-password" class="block text-sm font-medium mb-1">Kata sandi baru</label>
      <input id="new-password" type="password" required value={$newValue} oninput={newPassword.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <button type="submit" class="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">Ubah kata sandi</button>
  </form>
</section>
