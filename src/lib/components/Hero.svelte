<script>
  import BoxReveal from "./BoxReveal.svelte";
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/user.store';
  import { fly, fade } from 'svelte/transition';
</script>

<div class="relative w-full h-full">
  <div class="relative z-10">
    <!-- Content goes here -->
  </div>
  <div class="absolute inset-0 flex items-center justify-center z-0">
    <div class="animate-shine transition-colors glass border-neutral-800 bg-[linear-gradient(110deg,#f5f5f5 45%,#e0e0e0 55%,#f5f5f5)] bg-[length:200%_100%] h-64 w-64 md:h-80 md:w-80 rotate-45 mt-96"
         in:fly="{{ y: 200, duration: 1000 }}"></div>
  </div>
</div>

<div class="h-full w-full max-w-[32rem] md:max-w-[40rem] flex flex-col items-center justify-center overflow-hidden pt-8 text-center">
  <BoxReveal duration={0.5}>
    <p class="text-[3.7rem] md:text-[5rem] font-semibold"
       in:fly="{{ y: 50, duration: 800, delay: 200 }}">
      🔫💣🛡️
    </p>
  </BoxReveal>

  <BoxReveal duration={0.5}>
    <h2 class="mt-[.5rem] text-[1.5rem] md:text-[2.5rem] font-extrabold tracking-tight leading-tight"
        in:fly="{{ y: 50, duration: 800, delay: 400 }}">
      Your ultimate <span class="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CS2 hub</span>
    </h2>
  </BoxReveal>

  <BoxReveal duration={0.5}>
    <div class="mt-[1rem] grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4"
         in:fly="{{ y: 50, duration: 800, delay: 600 }}">
      <div class="bg-gradient-to-r from-primary to-secondary p-3 md:p-4 rounded-lg shadow-md transform hover:scale-102 transition-all duration-300">
        <span class="text-3xl md:text-4xl mb-1 md:mb-2 block">🎮</span>
        <h3 class="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Latest CS2 Updates</h3>
        <p class="text-xs md:text-sm text-gray-800">Stay informed with the newest game changes and features.</p>
      </div>
      <div class="bg-gradient-to-r from-secondary to-accent p-3 md:p-4 rounded-lg shadow-md transform hover:scale-102 transition-all duration-300">
        <span class="text-3xl md:text-4xl mb-1 md:mb-2 block">🏆</span>
        <h3 class="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Pro Strats & Callouts</h3>
        <p class="text-xs md:text-sm text-gray-800">Learn from the best to improve your gameplay.</p>
      </div>
      <div class="bg-gradient-to-r from-accent to-primary p-3 md:p-4 rounded-lg shadow-md transform hover:scale-102 transition-all duration-300">
        <span class="text-3xl md:text-4xl mb-1 md:mb-2 block">🎉</span>
        <h3 class="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Community Tournaments</h3>
        <p class="text-xs md:text-sm text-gray-800">Join exciting competitions and win awesome prizes.</p>
      </div>
    </div>
  </BoxReveal>

  <BoxReveal duration={0.5}>
    <div class="z-10 text-center p-8 max-w-4xl"
         in:fade="{{ duration: 800, delay: 800 }}">
      {#if $user}
        <button class="btn btn-primary btn-glow mb-8 transform hover:scale-105 transition-all duration-300" 
                on:click={() => goto('/account/profile')}
                in:fly="{{ y: 20, duration: 500, delay: 1000 }}"
                out:fade="{{ duration: 300 }}">
          <span class="mr-2">🚀</span>
          Rush to Your Profile
        </button>
      {:else}
        <div class="space-y-4 mb-8">
          <button class="btn btn-primary btn-pulse w-full sm:w-auto" 
                  on:click={() => goto('/account/login')}
                  in:fly="{{ y: 20, duration: 500, delay: 1000 }}"
                  out:fade="{{ duration: 300 }}">
            <span class="mr-2">🎉</span>
            Join the CS2 Squad
          </button>
          <p class="text-sm text-gray-400 animate-bounce">
            Sign up now and get a free weapon skin!
          </p>
        </div>
      {/if}
    </div>
  </BoxReveal>
</div>
