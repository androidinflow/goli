<script>
  import BoxReveal from "./BoxReveal.svelte";
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/user.store';
</script>

<div class="relative w-full h-full">
  <div class="relative z-10">
    <!-- Content goes here -->
  </div>
  <div class="absolute inset-0 flex items-center justify-center z-0">
    <div class="animate-shine transition-colors glass border-neutral-800 bg-[linear-gradient(110deg,#f5f5f5 45%,#e0e0e0 55%,#f5f5f5)] bg-[length:200%_100%] h-64 w-64 md:h-80 md:w-80 rotate-45 mt-96"></div>
  </div>
</div>

<div class="h-full w-full max-w-[32rem] md:max-w-[40rem] flex flex-col items-center justify-center overflow-hidden pt-8 text-center">
  <BoxReveal duration={0.5}>
    <p class="text-[3.7rem] md:text-[5rem] font-semibold">
      🔫💥🎯
    </p>
  </BoxReveal>

  <BoxReveal duration={0.5}>
    <h2 class="mt-[.5rem] text-[1.5rem] md:text-[2rem] font-bold">
      Your ultimate <span class="text-[#5046e6]">intel source</span>
    </h2>
  </BoxReveal>

  <BoxReveal duration={0.5}>
    <div class="mt-[1.5rem]">
      <p class="text-lg md:text-2xl">
        Latest news & updates<br />
        Pro tips & strategies<br />
        Exclusive events
      </p>
    </div>
  </BoxReveal>

  <BoxReveal duration={0.5}>
    <div class="z-10 text-center p-8 max-w-4xl">
      {#if $user}
        <p class="text-xl mb-6">Welcome back, {$user.username}!</p>
        <button class="btn btn-primary mb-8" on:click={() => goto('/account/profile')}>
          View Your Profile
        </button>
      {:else}
        <div class="space-x-4 mb-8">
          <button class="btn btn-primary" on:click={() => goto('/account/login')}> Join the Community </button>
        </div>
      {/if}
    </div>
  </BoxReveal>
</div>
