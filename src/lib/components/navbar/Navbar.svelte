<script>
  // Components
  import LoggedIn from "./LoggedIn.svelte";
  import LoggedOut from "./LoggedOut.svelte";
  import ToggleLightDarkMode from "./ToggleLightDarkMode.svelte";

  const base = "https://pb.redruby.one/api/files/_pb_users_auth_";

  import { user } from "$lib/stores/user.store";
</script>

<div class="navbar">
  <div class="flex-1">
    <a
      href="/"
      class="text-3xl font-bold btn btn-ghost hover:text-primary transition-colors duration-300 flex items-center group"
    >
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-8 h-8 text-primary transform group-hover:rotate-12 transition-transform duration-300"
        >
          <path
            d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.7L20 9v6l-8 4-8-4V9l8-4.3zm0 2.3L9 9l3 1.5L15 9l-3-2zm-5 4.5v2L10 15v-2l-3-1.5zm10 0L14 13v2l3-1.5v-2z"
          />
        </svg>
      </div>
      <div class="flex flex-col items-start">
        <span class="text-primary text-xl leading-none">Counter</span>
        <span class="text-base-content text-lg leading-none">Strike</span>
      </div>
    </a>
    <div class="flex-none ml-4">
      <ToggleLightDarkMode></ToggleLightDarkMode>
    </div>
  </div>

  {#if $user}
    {#if $user.avatar}
      <LoggedIn
        avatar={$user.avatar
          ? `${base}/${$user.id}/${$user.avatar}`
          : $user.avatarUrl}
      ></LoggedIn>
    {:else if $user.avatarUrl}
      <LoggedIn avatar={$user.avatarUrl}></LoggedIn>
    {:else}
      <LoggedIn avatar={undefined}></LoggedIn>
    {/if}
  {:else}
    <LoggedOut></LoggedOut>
  {/if}
</div>
