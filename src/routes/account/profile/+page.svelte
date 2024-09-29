<script>
  import { fade, fly } from "svelte/transition";
  import ProfileImage from "$lib/components/shared/ProfileImage.svelte";
  import { user } from "$lib/stores/user.store";
  import { onMount } from "svelte";

  const base = "https://pb.redruby.one/api/files/_pb_users_auth_";

  let imageBase64 = "";

  onMount(() => {
    console.log($user);
  });

  const updateAvatar = async (image) => {
    const formData = new FormData();
    formData.append("avatar", image);

    try {
      const result = await fetch("?/updateAvatar", {
        method: "POST",
        body: formData,
      });

      if (result.ok && $user) {
        $user.avatar = image;
      } else {
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const processImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 128;
        let { width, height } = imgElement;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(imgElement, 0, 0, width, height);
        imageBase64 = canvas.toDataURL("image/png");
        updateAvatar(imageBase64);
      };
      imgElement.src = e.target?.result?.toString() || "";
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const target = e.target;
      if (target.files && target.files.length > 0) {
        processImage(target.files[0]);
      }
    };
    fileInput.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /*   console.log("avatar ", $user.avatar);
  console.log($user.id); */
</script>

<div
  class="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-3xl mx-auto">
    <div class="bg-base-100 shadow-xl rounded-lg overflow-hidden">
      {#if $user}
        <div class="p-8">
          <div class="flex flex-col sm:flex-row items-center">
            <div class="relative mb-4 sm:mb-0 sm:mr-8">
              <button
                on:click={triggerFileInput}
                class="rounded-full overflow-hidden hover:opacity-80 transition-opacity duration-300"
                in:fade={{ duration: 300 }}
              >
                <ProfileImage
                  avatar={$user.avatar
                    ? `${base}/${$user.id}/${$user.avatar}`
                    : $user.avatarUrl}
                  class="w-32 h-32 object-cover"
                />
                <span
                  class="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg"
                  in:fade={{ duration: 300, delay: 300 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div class="text-center sm:text-left">
              <h1
                class="text-3xl font-bold text-base-content"
                in:fly={{ y: 20, duration: 300 }}
              >
                {$user.username}
              </h1>
              <p
                class="text-sm text-base-content/70 mt-1"
                in:fly={{ y: 20, duration: 300, delay: 100 }}
              >
                Member since {formatDate($user.created)}
              </p>
            </div>
          </div>

          <div class="mt-8 border-t border-base-300 pt-8">
            <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-base-content/70">Email</p>
                <p class="mt-1">{$user.email}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-base-content/70">Telegram</p>
                {#if $user.tel}
                  <p class="mt-1">Connected (@{$user.tel.username})</p>
                {:else}
                  <button
                    class="btn btn-sm btn-primary mt-1"
                    onclick="my_modal_2.showModal()"
                  >
                    Connect Telegram
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="p-8 text-center">
          <p class="text-lg">Please log in to view your profile.</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<dialog id="my_modal_2" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg mb-4">Connect to Telegram</h3>
    <p class="py-4">
      Link your profile to our Telegram bot for instant updates and personalized
      content. Stay connected on-the-go!
    </p>
    <div class="flex flex-col items-center space-y-4">
      <a
        href="https://t.me/redrubyone_bot"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary w-full"
      >
        Open Telegram Bot
      </a>
      <form action="?/updateTelegram" method="POST" class="w-full">
        <div class="form-control">
          <label for="chatId" class="label">
            <span class="label-text">Telegram Code</span>
          </label>
          <input
            type="text"
            id="chatId"
            name="chatId"
            placeholder="Enter your Telegram Code"
            class="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" class="btn btn-secondary mt-4 w-full">
          Connect Telegram
        </button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>Close</button>
  </form>
</dialog>
