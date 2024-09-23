<script>
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/user.store';
  import { fly, fade } from 'svelte/transition';
</script>

<div class="relative w-full h-full">
  <div class="relative z-10">
    <!-- Content goes here -->
  </div>
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="animate-shine transition-colors glass border-neutral-800 bg-[linear-gradient(110deg,#f5f5f5 45%,#e0e0e0 55%,#f5f5f5)] bg-[length:200%_100%] h-64 w-64 md:h-80 md:w-80 rotate-45 mt-96"
         in:fly="{{ y: 200, duration: 1000 }}"></div>
  </div>
</div>

<div class="h-full w-full max-w-[32rem] md:max-w-[40rem] flex flex-col items-center justify-center overflow-hidden pt-8 text-center z-10">
  <p class="text-[3.7rem] md:text-[5rem] font-semibold"
     in:fly="{{ y: 50, duration: 800, delay: 200 }}">
    🔫💣🛡️
  </p>

  <h2 class="mt-[.5rem] text-[1.5rem] md:text-[2.5rem] font-extrabold tracking-tight leading-tight"
      in:fly="{{ y: 50, duration: 800, delay: 400 }}">
    Your ultimate <span class="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CS2 hub</span>
  </h2>

  <div class="mt-[1rem] flex justify-center space-x-4"
       in:fly="{{ y: 50, duration: 800, delay: 600 }}">
    {#each [
      { icon: '🎮', title: 'CS2 Updates', gradient: 'from-primary to-secondary' },
      { icon: '🏆', title: 'Pro Strats', gradient: 'from-secondary to-accent' },
      { icon: '🎉', title: 'Tournaments', gradient: 'from-accent to-primary' }
    ] as { icon, title, gradient }}
      <div class="bg-gradient-to-r {gradient} p-3 rounded-lg shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer">
        <span class="text-3xl block mb-1">{icon}</span>
        <h3 class="text-sm font-bold text-white">{title}</h3>
      </div>
    {/each}
  </div>

  <div class="z-10 text-center p-8 max-w-4xl"
       in:fade="{{ duration: 800, delay: 800 }}">
    {#if $user}
      <button class="btn btn-primary bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" 
              on:click={() => goto('/account/profile')}
              in:fly="{{ y: 20, duration: 500, delay: 1000 }}"
              out:fade="{{ duration: 300 }}">
        <span class="mr-2">🚀</span>
        Explore Your Profile
      </button>
    {:else}
      <div class="space-y-4 mb-8">
        <button class="btn btn-primary bg-gradient-to-r from-secondary to-accent text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary w-full sm:w-auto" 
                on:click={() => goto('/account/login')}
                in:fly="{{ y: 20, duration: 500, delay: 1000 }}"
                out:fade="{{ duration: 300 }}">
          <span class="mr-2">🎉</span>
          Join the CS2 Community
        </button>
        <p class="text-sm text-gray-400 animate-pulse">
          Sign up now for exclusive in-game rewards!
        </p>
      </div>
    {/if}
  </div>
</div>
